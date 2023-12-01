import {
  Details,
  ScreenDisplay,
} from "@/components/Autograph/types/autograph.types";
import { CartItem } from "@/components/Common/types/common.types";
import { useEffect, useState } from "react";
import { AnyAction, Dispatch } from "redux";
import { encryptItems } from "../../../../lib/helpers/encryptItems";
import {
  LitNodeClient,
  checkAndSignAuthMessage,
} from "@lit-protocol/lit-node-client";
import { PublicClient, createWalletClient, custom } from "viem";
import { polygon } from "viem/chains";
import encodeActData from "../../../../lib/helpers/encodeActData";
import actPost from "../../../../lib/helpers/api/actPost";
import { setCartItems } from "../../../../redux/reducers/cartItemsSlice";
import {
  ACCEPTED_TOKENS,
  CHROMADIN_OPEN_ACTION,
  COIN_OP_OPEN_ACTION,
  DIGITALAX_ADDRESS,
  LEGEND_OPEN_ACTION,
  LISTENER_OPEN_ACTION,
} from "../../../../lib/constants";
import { setSuccessCheckout } from "../../../../redux/reducers/successCheckoutSlice";
import { Profile } from "../../../../graphql/generated";
import { OracleData } from "../types/checkout.types";
import {
  removeCypherStorageCart,
  setCypherStorageCart,
} from "../../../../lib/utils";
import { setInsufficientBalance } from "../../../../redux/reducers/insufficientBalanceSlice";
import findBalance from "../../../../lib/helpers/findBalance";
import toHexWithLeadingZero from "../../../../lib/helpers/leadingZero";
import { setScreenDisplay } from "../../../../redux/reducers/screenDisplaySlice";
import { NextRouter } from "next/router";

const useCheckout = (
  publicClient: PublicClient,
  dispatch: Dispatch<AnyAction>,
  address: `0x${string}` | undefined,
  lensConnected: Profile | undefined,
  client: LitNodeClient,
  oracleData: OracleData[],
  cartItems: CartItem[],
  router: NextRouter
) => {
  const [details, setDetails] = useState<Details>({
    name: "",
    contact: "",
    address: "",
    zip: "",
    city: "",
    state: "",
    country: "",
    colors: [],
    sizes: [],
  });
  const [groupedByPubId, setGroupedByPubId] = useState<{
    [key: string]: {
      colors: string[];
      sizes: string[];
      amounts: number[];
      collectionIds: string[];
      types: string[];
      prices: number[];
      fulfillerAddress: string[];
      originalIndices: number[];
    };
  }>({});
  const [encryptedStrings, setEncryptedStrings] = useState<
    { pubId: string; data: string }[]
  >([]);
  const [chooseCartItem, setChooseCartItem] = useState<CartItem>();
  const [isApprovedSpend, setApprovedSpend] = useState<boolean>(false);
  const [checkoutCurrency, setCheckoutCurrency] = useState<string>(
    ACCEPTED_TOKENS[1][2]
  );
  const [encryptionLoading, setEncryptionLoading] = useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [collectPostLoading, setCollectPostLoading] = useState<boolean>(false);
  const [approveLoading, setApproveLoading] = useState<boolean>(false);
  const [chosenVariation, setChosenVariation] = useState<
    {
      size: string;
      color: string;
    }[]
  >([]);

  const encryptFulfillment = async () => {
    if (
      !address ||
      details?.address?.trim() === "" ||
      details?.city?.trim() === "" ||
      details?.name?.trim() === "" ||
      details?.state?.trim() === "" ||
      details?.zip?.trim() === "" ||
      details?.country?.trim() === ""
    )
      return;
    setEncryptionLoading(true);
    try {
      const authSig = await checkAndSignAuthMessage({
        chain: "polygon",
      });

      await client.connect();

      const encryptedItems = await encryptItems(
        client,
        groupedByPubId,
        {
          ...details,
          contact: lensConnected?.handle?.suggestedFormatted?.localName!,
        },
        address,
        authSig
      );

      encryptedItems && setEncryptedStrings(encryptedItems);
    } catch (err: any) {
      console.error(err.message);
    }
    setEncryptionLoading(false);
  };

  const collectItem = async () => {
    if (
      encryptedStrings?.length < 1 &&
      cartItems?.find(
        (item) => item?.item?.pubId === chooseCartItem?.item?.pubId
      )?.item?.origin !== "1"
    )
      return;
    const index = cartItems?.findIndex(
      (item) => item?.item?.pubId === chooseCartItem?.item?.pubId
    );

    setCollectPostLoading(true);
    try {
      const balance = await findBalance(
        publicClient,
        checkoutCurrency,
        address as `0x${string}`
      );

      if (
        Number(balance) <
        (Number(
          groupedByPubId[chooseCartItem?.item?.pubId!]?.prices?.reduce(
            (sum, item, index) =>
              sum +
              Number(item) *
                Number(
                  groupedByPubId[chooseCartItem?.item?.pubId!]?.amounts?.[index]
                ),
            0
          ) *
            10 ** 18
        ) /
          Number(
            oracleData?.find(
              (oracle) =>
                oracle.currency?.toLowerCase() ===
                checkoutCurrency?.toLowerCase()
            )?.rate
          )) *
          10 ** 18
      ) {
        dispatch(
          setInsufficientBalance({
            actionValue: true,
            actionMessage: "Pockets Empty. Need to top up?",
          })
        );
        setCollectPostLoading(false);
        return;
      }

      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      const encrypted = encryptedStrings?.find(
        (item) => item?.pubId == cartItems[index]?.item?.pubId
      )?.data;

      const unknownOpenAction = encodeActData(
        cartItems[index],
        groupedByPubId[cartItems[index]?.item?.pubId],
        encrypted || "",
        checkoutCurrency as `0x${string}`
      );

      const success = await actPost(
        "0x" +
          toHexWithLeadingZero(Number(cartItems[index]?.item?.profileId)) +
          "-" +
          "0x" +
          toHexWithLeadingZero(Number(cartItems[index]?.item?.pubId)),
        {
          unknownOpenAction,
        },
        dispatch,
        address as `0x${string}`,
        clientWallet,
        publicClient
      );

      if (success) {
        const newItems = [...cartItems];
        newItems[index] = {
          ...newItems[index],
          purchased: true,
        };

        const newCart = newItems
          ?.filter((item) => item?.item?.pubId !== newItems[index]?.item?.pubId)
          ?.filter(Boolean);

        if (newCart?.length < 1) {
          setGroupedByPubId({});
          dispatch(setCartItems([]));
          removeCypherStorageCart();
          setEncryptedStrings([]);
          setDetails({
            name: "",
            contact: "",
            address: "",
            zip: "",
            city: "",
            state: "",
            country: "",
            colors: [],
            sizes: [],
          });
          dispatch(setSuccessCheckout(true));
          dispatch(setScreenDisplay(ScreenDisplay.Orders));
          router.push(
            `/autograph/${
              lensConnected?.handle?.suggestedFormatted?.localName?.split(
                "@"
              )?.[1]
            }`
          );
        }

        dispatch(setCartItems(newCart));
        setEncryptedStrings((prev) => {
          const arr = [...prev];
          arr?.filter((item) => item?.pubId !== newItems[index]?.item?.pubId);
          return arr;
        });
        setCypherStorageCart(JSON.stringify(newCart));
        setChooseCartItem(newCart?.[0]);
      }
    } catch (err: any) {
      console.error(err.message);
    }

    setCollectPostLoading(false);
  };

  const approveSpend = async () => {
    setApproveLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      const item = cartItems?.find(
        (item) => item?.item?.pubId === chooseCartItem?.item?.pubId
      );

      const { request } = await publicClient.simulateContract({
        address: checkoutCurrency as `0x${string}`,
        abi: [
          checkoutCurrency === "0xf87b6343c172720ac9cc7d1c9465d63454a8ef30"
            ? {
                inputs: [
                  {
                    internalType: "address",
                    name: "spender",
                    type: "address",
                  },
                  {
                    internalType: "uint256",
                    name: "tokens",
                    type: "uint256",
                  },
                ],
                name: "approve",
                outputs: [
                  { internalType: "bool", name: "success", type: "bool" },
                ],
                stateMutability: "nonpayable",
                type: "function",
              }
            : checkoutCurrency === "0x3cf7283c025d82390e86d2feb96eda32a393036b"
            ? {
                constant: false,
                inputs: [
                  { name: "guy", type: "address" },
                  { name: "wad", type: "uint256" },
                ],
                name: "approve",
                outputs: [{ name: "", type: "bool" }],
                payable: false,
                stateMutability: "nonpayable",
                type: "function",
              }
            : {
                inputs: [
                  {
                    internalType: "address",
                    name: "spender",
                    type: "address",
                  },
                  {
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256",
                  },
                ],
                name: "approve",
                outputs: [
                  {
                    internalType: "bool",
                    name: "",
                    type: "bool",
                  },
                ],
                stateMutability: "nonpayable",
                type: "function",
              },
        ],
        functionName: "approve",
        chain: polygon,
        args: [
          item?.type === "chromadin"
            ? CHROMADIN_OPEN_ACTION
            : item?.type === "listener"
            ? LISTENER_OPEN_ACTION
            : item?.type === "coinop"
            ? COIN_OP_OPEN_ACTION
            : LEGEND_OPEN_ACTION,
          ((Number(
            groupedByPubId[chooseCartItem?.item?.pubId!]?.prices?.reduce(
              (sum, item, index) =>
                sum +
                Number(item) *
                  Number(
                    groupedByPubId[chooseCartItem?.item?.pubId!]?.amounts?.[
                      index
                    ]
                  ),
              0
            ) *
              10 ** 18
          ) /
            Number(
              oracleData?.find(
                (oracle) =>
                  oracle.currency ===
                  ACCEPTED_TOKENS.find(
                    (item) => item[2] === checkoutCurrency
                  )?.[2]
              )?.rate
            )) *
            10 ** 18 *
            1.3) as any,
        ],
        account: address,
      });
      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash: res });
      setApprovedSpend(true);
    } catch (err: any) {
      console.error(err.message);
    }
    setApproveLoading(false);
  };

  const checkApproved = async () => {
    try {
      const item = cartItems?.find(
        (item) => item?.item?.pubId === chooseCartItem?.item?.pubId
      );

      const data = await publicClient.readContract({
        address: checkoutCurrency?.toLowerCase() as `0x${string}`,
        abi: [
          {
            inputs: [
              {
                internalType: "address",
                name: "owner",
                type: "address",
              },
              {
                internalType: "address",
                name: "spender",
                type: "address",
              },
            ],
            name: "allowance",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
        ],
        functionName: "allowance",
        args: [
          address as `0x${string}`,
          item?.type === "chromadin"
            ? CHROMADIN_OPEN_ACTION
            : item?.type === "listener"
            ? LISTENER_OPEN_ACTION
            : item?.type === "coinop"
            ? COIN_OP_OPEN_ACTION
            : LEGEND_OPEN_ACTION,
        ],
      });

      if (address) {
        if (
          Number((data as any)?.toString()) /
            Number(
              oracleData?.find((oracle) => oracle.currency === checkoutCurrency)
                ?.wei
            ) >=
          Number(
            groupedByPubId[chooseCartItem?.item?.pubId!]?.prices?.reduce(
              (sum, item, index) =>
                sum +
                Number(item) *
                  Number(
                    groupedByPubId[chooseCartItem?.item?.pubId!]?.amounts?.[
                      index
                    ]
                  ),
              0
            ) *
              10 ** 18
          ) /
            Number(
              oracleData?.find((oracle) => oracle.currency === checkoutCurrency)
                ?.rate
            )
        ) {
          setApprovedSpend(true);
        } else {
          setApprovedSpend(false);
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleGroupByPubId = () => {
    const grouped: {
      [key: string]: {
        colors: string[];
        sizes: string[];
        amounts: number[];
        collectionIds: string[];
        types: string[];
        prices: number[];
        fulfillerAddress: string[];
        originalIndices: number[];
      };
    } = {};
    if (cartItems?.length < 1) setGroupedByPubId({});
    for (let index = 0; index < cartItems.length; index++) {
      const pubId = cartItems[index]?.item?.pubId;

      if (!grouped[pubId]) {
        grouped[pubId] = {
          colors: [],
          sizes: [],
          amounts: [],
          collectionIds: [],
          types: [],
          prices: [],
          fulfillerAddress: [],
          originalIndices: [],
        };
      }

      grouped[pubId].colors.push(cartItems[index]?.color);
      grouped[pubId].sizes.push(cartItems[index]?.size);
      grouped[pubId].amounts.push(cartItems[index]?.amount);
      grouped[pubId].collectionIds.push(cartItems[index]?.item?.collectionId);
      grouped[pubId].types.push(cartItems[index]?.type);
      grouped[pubId].prices.push(cartItems[index]?.price);
      grouped[pubId].fulfillerAddress.push(
        cartItems[index]?.item?.fulfiller || DIGITALAX_ADDRESS
      );
      grouped[pubId].originalIndices.push(index);
    }

    if (grouped?.length !== groupedByPubId?.length) {
      setChosenVariation(
        Array.from({ length: Object.keys(grouped)?.length }, () => ({
          color: "",
          size: "",
        }))
      );
    }

    setGroupedByPubId(grouped);
  };

  useEffect(() => {
    if (lensConnected?.id) {
      checkApproved();
    }
  }, [checkoutCurrency, chooseCartItem, lensConnected?.id]);

  useEffect(() => {
    handleGroupByPubId();
  }, [cartItems]);

  useEffect(() => {
    if (cartItems?.length > 0 && !chooseCartItem) {
      setChooseCartItem(cartItems?.[0]);
    }
  }, [cartItems?.length]);

  useEffect(() => {
    if (chooseCartItem) {
      setCheckoutCurrency(chooseCartItem?.item?.acceptedTokens?.[0]);
    }
  }, [chooseCartItem]);

  return {
    encryptFulfillment,
    collectPostLoading,
    encryptionLoading,
    collectItem,
    details,
    setDetails,
    checkoutCurrency,
    setCheckoutCurrency,
    openDropdown,
    setOpenDropdown,
    encryptedStrings,
    approveSpend,
    chooseCartItem,
    setChooseCartItem,
    isApprovedSpend,
    groupedByPubId,
    approveLoading,
    chosenVariation,
    setChosenVariation,
  };
};

export default useCheckout;

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
import { polygon, polygonMumbai } from "viem/chains";
import encodeActData from "../../../../lib/helpers/encodeActData";
import actPost from "../../../../lib/helpers/api/actPost";
import { setCartItems } from "../../../../redux/reducers/cartItemsSlice";
import {
  ACCEPTED_TOKENS_MUMBAI,
  CHROMADIN_OPEN_ACTION,
  COIN_OP_OPEN_ACTION,
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
    };
  }>({});
  const [encryptedStrings, setEncryptedStrings] = useState<string[]>([]);
  const [chooseCartItem, setChooseCartItem] = useState<string>("");
  const [isApprovedSpend, setApprovedSpend] = useState<boolean>(false);
  const [completedPurchases, setCompletedPurchases] = useState<
    {
      completed?: CartItem;
      open: boolean;
    }[]
  >(
    Array.from({ length: Object.keys(groupedByPubId).length }, () => ({
      open: true,
    }))
  );
  const [checkoutCurrency, setCheckoutCurrency] = useState<string>(
    ACCEPTED_TOKENS_MUMBAI[1][2]
  );
  const [encryptionLoading, setEncryptionLoading] = useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [collectPostLoading, setCollectPostLoading] = useState<boolean[]>(
    Array.from({ length: cartItems?.length }, () => false)
  );
  const [approveLoading, setApproveLoading] = useState<boolean>(false);

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
        chain: "mumbai",
      });

      setEncryptedStrings;
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
      cartItems?.find((item) => item?.item?.pubId === chooseCartItem)?.item
        ?.origin !== "1"
    )
      return;
    const index = cartItems?.findIndex(
      (item) => item?.item?.pubId === chooseCartItem
    );
    if (index == -1 || !address) return;

    setCollectPostLoading((prev) => {
      const arr = [...prev];
      arr[index] = true;
      return arr;
    });
    try {
      const balance = await findBalance(
        publicClient,
        checkoutCurrency,
        address
      );

      if (
        Number(balance) <
        ((Number(cartItems[index]?.price) * 10 ** 18) /
          Number(
            oracleData?.find(
              (oracle) =>
                oracle.currency?.toLowerCase() ===
                checkoutCurrency?.toLowerCase()
            )?.rate
          )) *
          10 ** 18
      ) {
        dispatch(setInsufficientBalance(true));
        setCollectPostLoading((prev) => {
          const arr = [...prev];
          arr[index] = false;
          return arr;
        });
        return;
      }

      const clientWallet = createWalletClient({
        chain: polygonMumbai,
        transport: custom((window as any).ethereum),
      });

      const unknownOpenAction = encodeActData(
        cartItems[index],
        encryptedStrings[index],
        checkoutCurrency as `0x${string}`
      );

      await actPost(
        "0x" +
          toHexWithLeadingZero(Number(cartItems[index]?.item?.profileId)) +
          "-" +
          "0x" +
          toHexWithLeadingZero(Number(cartItems[index]?.item?.pubId)),
        {
          unknownOpenAction,
        },
        dispatch,
        address,
        clientWallet,
        publicClient
      );

      const newItems = [...cartItems];
      newItems[index] = {
        ...newItems[index],
        purchased: true,
      };

      setCompletedPurchases((prev) => {
        const arr = [...prev];
        arr[index] = {
          ...arr[index],
          completed: newItems[index],
          open: false,
        };
        return arr;
      });

      delete newItems[index];

      dispatch(setCartItems(newItems?.filter(Boolean)));
      setCypherStorageCart(JSON.stringify(newItems?.filter(Boolean)));
      setChooseCartItem(newItems?.filter(Boolean)?.[0]?.item?.pubId);
      if (completedPurchases?.slice(0, -1)?.every((value) => value.completed)) {
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
            lensConnected?.handle?.suggestedFormatted?.localName?.split("@")?.[1]
          }`
        );
      }
    } catch (err: any) {
      console.error(err.message);
    }

    setCollectPostLoading((prev) => {
      const arr = [...prev];
      arr[index] = false;
      return arr;
    });
  };

  const approveSpend = async () => {
    setApproveLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: polygonMumbai,
        transport: custom((window as any).ethereum),
      });

      const item = cartItems?.find(
        (item) => item?.item?.pubId === chooseCartItem
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
        chain: polygonMumbai,
        args: [
          item?.type === "chromadin"
            ? CHROMADIN_OPEN_ACTION
            : item?.type === "listener"
            ? LISTENER_OPEN_ACTION
            : item?.type === "coinop"
            ? COIN_OP_OPEN_ACTION
            : LEGEND_OPEN_ACTION,
          (((Number(item?.price) * Number(item?.amount) * 10 ** 18) /
            Number(
              oracleData?.find(
                (oracle) =>
                  oracle.currency ===
                  ACCEPTED_TOKENS_MUMBAI.find(
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
        (item) => item?.item?.pubId === chooseCartItem
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
          (Number(item?.price) * Number(item?.amount) * 10 ** 18) /
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
      };
    } = {};
    if (cartItems?.length < 1) setGroupedByPubId({});
    for (const item of cartItems) {
      const pubId = item?.item?.pubId;

      if (!grouped[pubId]) {
        grouped[pubId] = {
          colors: [],
          sizes: [],
          amounts: [],
          collectionIds: [],
          types: [],
          prices: [],
          fulfillerAddress: [],
        };
      }

      grouped[pubId] = {
        colors: [...grouped[pubId]?.colors, item?.color],
        sizes: [...grouped[pubId]?.sizes, item?.size],
        amounts: [...grouped[pubId]?.amounts, item?.amount],
        collectionIds: [
          ...grouped[pubId]?.collectionIds,
          item?.item?.collectionId,
        ],
        types: [...grouped[pubId]?.types, item?.type],
        prices: [...grouped[pubId]?.prices, item?.price],
        fulfillerAddress: [
          ...grouped[pubId]?.fulfillerAddress,
          item?.item?.fulfiller,
        ],
      };
    }

    setGroupedByPubId(grouped);
  };

  useEffect(() => {
    if (lensConnected?.id) {
      checkApproved();
    }
  }, [checkoutCurrency, chooseCartItem]);

  useEffect(() => {
    handleGroupByPubId();
  }, [cartItems]);

  useEffect(() => {
    if (cartItems?.length > 0 && chooseCartItem == "") {
      setChooseCartItem(cartItems?.[0]?.item?.pubId);
      setCollectPostLoading(
        Array.from({ length: cartItems?.length }, () => false)
      );
      setCompletedPurchases(
        Array.from({ length: cartItems?.length }, () => ({
          open: true,
        }))
      );
    }
  }, [cartItems?.length]);

  return {
    encryptFulfillment,
    collectPostLoading,
    encryptionLoading,
    collectItem,
    details,
    setDetails,
    checkoutCurrency,
    setCheckoutCurrency,
    completedPurchases,
    openDropdown,
    setOpenDropdown,
    encryptedStrings,
    approveSpend,
    chooseCartItem,
    setChooseCartItem,
    isApprovedSpend,
    groupedByPubId,
    setCompletedPurchases,
    approveLoading,
  };
};

export default useCheckout;

import { Details } from "@/components/Autograph/types/autograph.types";
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
import { ethers } from "ethers";
import { setCypherStorageCart } from "../../../../lib/utils";

const useCheckout = (
  publicClient: PublicClient,
  dispatch: Dispatch<AnyAction>,
  address: `0x${string}` | undefined,
  lensConnected: Profile | undefined,
  client: LitNodeClient,
  oracleData: OracleData[],
  cartItems: CartItem[]
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
  const [chooseCartItem, setChooseCartItem] = useState<string>(
    cartItems?.find(
      (item) => item?.item?.pubId == Object.keys(groupedByPubId)[0]
    )?.item?.pubId!
  );
  const [isApprovedSpend, setApprovedSpend] = useState<boolean>(false);
  const [completedPurchases, setCompletedPurchases] = useState<
    {
      completed: boolean;
      open: boolean;
    }[]
  >(
    Array.from({ length: Object.keys(groupedByPubId).length }, () => ({
      completed: false,
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
    if (encryptedStrings?.length < 1) return;
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
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      const unknownOpenAction = encodeActData(
        cartItems[index],
        encryptedStrings[index],
        address,
        checkoutCurrency as `0x${string}`
      );

      await actPost(
        cartItems[index]?.item?.publication?.id,
        {
          unknownOpenAction,
        },
        dispatch,
        address,
        clientWallet,
        publicClient
      );

      const newItems = [...cartItems];
      cartItems[index] = {
        ...cartItems[index],
        purchased: true,
      };
      dispatch(setCartItems(newItems));
      setCypherStorageCart(JSON.stringify(newItems));

      setCompletedPurchases((prev) => {
        const arr = [...prev];
        arr[index] = {
          ...arr[index],
          completed: true,
          open: false,
        };
        return arr;
      });

      if (
        completedPurchases
          ?.slice(0, -1)
          ?.every((value) => value.completed === true)
      ) {
        setGroupedByPubId({});
        dispatch(setCartItems([]));
        setCypherStorageCart(JSON.stringify([]));
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
    try {
      const clientWallet = createWalletClient({
        chain: polygon,
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
        chain: polygon,
        args: [
          item?.type === "chromadin"
            ? CHROMADIN_OPEN_ACTION
            : item?.type === "listener"
            ? LISTENER_OPEN_ACTION
            : item?.type === "coinop"
            ? COIN_OP_OPEN_ACTION
            : LEGEND_OPEN_ACTION,
          ethers.parseEther(
            oracleData
              ?.find(
                (oracle) =>
                  oracle.currency ===
                  ACCEPTED_TOKENS_MUMBAI.find(
                    (item) => item[2] === checkoutCurrency
                  )?.[2]
              )
              ?.rate?.toString()!
          ),
        ],
        account: address,
      });
      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash: res });
      setApprovedSpend(true);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const checkApproved = async () => {
    try {
      const item = cartItems?.find(
        (item) => item?.item?.pubId === chooseCartItem
      );

      const data = await publicClient.readContract({
        address: ACCEPTED_TOKENS_MUMBAI.filter(
          (token) => token[2].toLowerCase() === checkoutCurrency?.toLowerCase()
        )?.[0]?.[1] as `0x${string}`,
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

      if (data && address) {
        if (
          Number((data as any)?.toString()) /
            (checkoutCurrency === "0x07b722856369f6b923e1f276abca58dd3d15243d"
              ? 10 ** 6
              : 10 ** 18) >=
          Number(
            oracleData?.find(
              (oracle) =>
                oracle.currency ===
                ACCEPTED_TOKENS_MUMBAI.find(
                  (item) => item[2] === checkoutCurrency
                )?.[2]
            )?.rate
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
    for (const item of cartItems) {
      const pubId = item.item.pubId;

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
        colors: [...grouped[pubId].colors, item.color],
        sizes: [...grouped[pubId].sizes, item.size],
        amounts: [...grouped[pubId].amounts, item.amount],
        collectionIds: [
          ...grouped[pubId].collectionIds,
          item.item.collectionId,
        ],
        types: [...grouped[pubId].types, item.type],
        prices: [...grouped[pubId].prices, item.price],
        fulfillerAddress: [
          ...grouped[pubId].fulfillerAddress,
          item.item.fulfiller,
        ],
      };
    }

    setGroupedByPubId(grouped);
  };

  useEffect(() => {
    if (lensConnected?.id) {
      checkApproved();
    }
  }, [checkoutCurrency]);

  useEffect(() => {
    handleGroupByPubId();
  }, [cartItems]);

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
  };
};

export default useCheckout;

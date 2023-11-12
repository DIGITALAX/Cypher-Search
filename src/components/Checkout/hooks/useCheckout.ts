import { Details } from "@/components/Autograph/types/autograph.types";
import { CartItem } from "@/components/Common/types/common.types";
import { useState } from "react";
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
import { ACCEPTED_TOKENS_MUMBAI } from "../../../../lib/constants";
import { setSuccessCheckout } from "../../../../redux/reducers/successCheckoutSlice";

const useCheckout = (
  publicClient: PublicClient,
  dispatch: Dispatch<AnyAction>,
  address: `0x${string}` | undefined,
  client: LitNodeClient,
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
    collectionIds: [],
    collectionAmounts: [],
  });
  const [encryptedStrings, setEncryptedStrings] = useState<string[]>([]);
  const [completedPurchases, setCompletedPurchases] = useState<boolean[]>(
    Array.from({ length: cartItems?.length }, () => false)
  );
  const [checkoutCurrency, setCheckoutCurrency] = useState<string>(
    ACCEPTED_TOKENS_MUMBAI[1][2]
  );
  const [encryptionLoading, setEncryptionLoading] = useState<boolean>(false);
  const [collectPostLoading, setCollectPostLoading] = useState<boolean[]>(
    Array.from({ length: cartItems?.length }, () => false)
  );

  const encryptFulfillment = async () => {
    if (!address) return;
    setEncryptionLoading(true);
    try {
      const authSig = await checkAndSignAuthMessage({
        chain: "polygon",
      });

      const groupedByPubId: {
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

        if (!groupedByPubId[pubId]) {
          groupedByPubId[pubId] = {
            colors: [],
            sizes: [],
            amounts: [],
            collectionIds: [],
            types: [],
            prices: [],
            fulfillerAddress: [],
          };
        }

        groupedByPubId[pubId] = {
          colors: [...groupedByPubId[pubId].colors, item.color],
          sizes: [...groupedByPubId[pubId].sizes, item.size],
          amounts: [...groupedByPubId[pubId].amounts, item.amount],
          collectionIds: [
            ...groupedByPubId[pubId].collectionIds,
            item.item.collectionId,
          ],
          types: [...groupedByPubId[pubId].types, item.type],
          prices: [...groupedByPubId[pubId].prices, item.price],
          fulfillerAddress: [
            ...groupedByPubId[pubId].fulfillerAddress,
            item.item.fulfiller,
          ],
        };
      }
      setEncryptedStrings;
      const encryptedItems = await encryptItems(
        client,
        groupedByPubId,
        details,
        address,
        authSig
      );

      encryptedItems && setEncryptedStrings(encryptedItems);
    } catch (err: any) {
      console.error(err.message);
    }
    setEncryptionLoading(false);
  };

  const collectItem = async (id: string) => {
    if (encryptedStrings?.length < 1) return;
    const index = cartItems?.findIndex((item) => item?.item?.pubId === id);
    if (!index || !address) return;

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
        cartItems[index]?.item?.pubId,
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

      setCompletedPurchases((prev) => {
        const arr = [...prev];
        arr[index] = true;
        return arr;
      });

      if (completedPurchases?.slice(0, -1)?.every((value) => value === true)) {
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
          collectionIds: [],
          collectionAmounts: [],
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
  };
};

export default useCheckout;

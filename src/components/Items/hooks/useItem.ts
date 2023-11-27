import {
  Community,
  Creation,
  Publication,
} from "@/components/Tiles/types/tiles.types";
import { useEffect, useState } from "react";
import { getOneCollectionTitle } from "../../../../graphql/subgraph/queries/getOneCollection";
import {
  ImageMetadataV3,
  Post,
  Quote,
  Comment,
  Mirror,
  Profile,
} from "../../../../graphql/generated";
import getPublication from "../../../../graphql/lens/queries/publication";
import { FilterValues } from "@/components/Search/types/search.types";
import getProfile from "../../../../graphql/lens/queries/profile";
import { getCollectionsPaginated } from "../../../../graphql/subgraph/queries/getCollections";
import { getCommunityName } from "../../../../graphql/subgraph/queries/getCommunities";
import getProfiles from "../../../../graphql/lens/queries/profiles";
import {
  ACCEPTED_TOKENS_MUMBAI,
  CHROMADIN_OPEN_ACTION,
  COIN_OP_OPEN_ACTION,
  LEGEND_OPEN_ACTION,
  LISTENER_OPEN_ACTION,
  itemStringToType,
  numberToItemTypeMap,
  numberToPrintType,
} from "../../../../lib/constants";
import { PurchaseDetails } from "../types/item.types";
import { OracleData } from "@/components/Checkout/types/checkout.types";
import { CartItem } from "@/components/Common/types/common.types";
import { PublicClient, createWalletClient, custom } from "viem";
import { polygon, polygonMumbai } from "viem/chains";
import encodeActData from "../../../../lib/helpers/encodeActData";
import actPost from "../../../../lib/helpers/api/actPost";
import { setSuccessCheckout } from "../../../../redux/reducers/successCheckoutSlice";
import { AnyAction, Dispatch } from "redux";
import { NextRouter } from "next/router";
import { decryptPost } from "../../../../lib/helpers/decryptPost";
import toHexWithLeadingZero from "../../../../lib/helpers/leadingZero";

const useItem = (
  type: string,
  id: string,
  filterConstants: FilterValues | undefined,
  lensConnected: Profile | undefined,
  oracleData: OracleData[],
  address: `0x${string}` | undefined,
  cartItems: CartItem[],
  publicClient: PublicClient,
  dispatch: Dispatch<AnyAction>,
  router: NextRouter
) => {
  const [instantLoading, setInstantLoading] = useState<boolean>(false);
  const [itemLoading, setItemLoading] = useState<boolean>(false);
  const [itemData, setItemData] = useState<Publication>();
  const [decryptLoading, setDecryptLoading] = useState<boolean>(false);
  const [isApprovedSpend, setIsApprovedSpend] = useState<boolean>(false);
  const [relatedData, setRelatedData] = useState<{
    collections: Creation[];
    microbrand: {
      microbrand: string;
      microbrandCover: string;
    };
  }>();
  const [purchaseDetails, setPurchaseDetails] = useState<PurchaseDetails>({
    color: "",
    currency: "",
    size: "",
    price: "",
    imageIndex: 0,
    priceIndex: 0,
  });

  const getItemData = async () => {
    setItemLoading(true);
    try {
      let pub: Post | Mirror | Comment | Quote;
      switch (type?.toLowerCase()) {
        case "chromadin":
        case "listener":
        case "coinop":
          const coll = (await getCollection(
            id?.replaceAll("_", " ")
          )) as Creation;

          pub = (await getPub(
            `${"0x" + toHexWithLeadingZero(Number(coll?.profileId))}-${
              "0x" + toHexWithLeadingZero(Number(coll?.pubId))
            }`
          )) as Post;

          setItemData({
            post: coll
              ? {
                  ...coll,
                  profile: pub?.by,
                  publication: {
                    ...pub,
                    decrypted: undefined,
                  },
                }
              : {
                  ...pub,
                  decrypted: undefined,
                },
            type,
          });
          setPurchaseDetails({
            color: coll?.colors?.[0],
            currency: coll?.acceptedTokens?.[0],
            size: coll?.sizes?.[0],
            price: coll?.prices?.[0],
            imageIndex: 0,
            priceIndex: 0,
          });
          break;

        case "pub":
          pub = (await getPub(id)) as Post;
          const collection = (await getCollection(
            (pub?.metadata as ImageMetadataV3)?.title
          )) as Creation;
          setItemData({
            post: collection
              ? {
                  ...collection,
                  profile: pub?.by,
                  publication: {
                    ...pub,
                    decrypted: undefined,
                  },
                }
              : {
                  ...pub,
                  decrypted: undefined,
                },
            type,
          });
          setPurchaseDetails({
            color: collection?.colors?.[0],
            currency: collection?.acceptedTokens?.[0],
            size: collection?.sizes?.[0],
            price: collection?.prices?.[0],
            imageIndex: 0,
            priceIndex: 0,
          });
          break;

        case "microbrand":
          const profile = await getIdProfile();
          const collections = await getIdCollections(profile?.ownedBy?.address);
          setItemData({
            post: profile,
            type,
          });
          const item =
            profile?.metadata?.attributes?.[
              profile?.metadata?.attributes?.findIndex(
                (item) => item?.key === "microbrandCypher"
              )
            ].value;

          if (item) {
            setRelatedData({
              collections: collections || [],
              microbrand: await JSON.parse(item),
            });
          }

          break;

        case "community":
          const community = await getCommunity();
          setItemData({
            post: community,
            type,
          });
          break;
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setItemLoading(false);
  };

  const getIdProfile = async (): Promise<Profile | undefined> => {
    try {
      if (!filterConstants) return;
      const item = filterConstants?.microbrands?.find(
        (item) => item[1] === id?.replaceAll("_", " ")
      );
      const data = await getProfile(
        {
          forProfileId: item?.[3],
        },
        lensConnected?.id
      );

      return data?.data?.profile as Profile;
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getIdCollections = async (
    creator: string
  ): Promise<Creation[] | undefined> => {
    try {
      const data = await getCollectionsPaginated(creator, 3, 0);
      const collections = data?.data?.collectionCreateds?.map(
        (collection: any) => ({
          ...collection,
          sizes: collection?.sizes
            ?.split(",")
            .map((word: string) => word.trim())
            .filter((word: string) => word.length > 0),
          colors: collection?.colors
            ?.split(",")
            .map((word: string) => word.trim())
            .filter((word: string) => word.length > 0),
          mediaTypes: collection?.mediaTypes
            ?.split(",")
            .map((word: string) => word.trim())
            .filter((word: string) => word.length > 0),
          access: collection?.access
            ?.split(",")
            .map((word: string) => word.trim())
            .filter((word: string) => word.length > 0),
          communities: collection?.communities
            ?.split(",")
            .map((word: string) => word.trim())
            .filter((word: string) => word.length > 0),
          tags: collection?.tags
            ?.split(",")
            .map((word: string) => word.trim())
            .filter((word: string) => word.length > 0),
        })
      );
      return collections;
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getCommunity = async (): Promise<Community | undefined> => {
    try {
      const data = await getCommunityName(id?.replaceAll("_", " "));

      if (data?.data?.communityCreateds) {
        const newCommunities = data?.data?.communityCreateds?.map(
          async (item: any) => {
            const members = await getProfiles(
              {
                where: {
                  profileIds: item.members,
                },
              },
              lensConnected?.id
            );

            const creators = await getProfiles(
              {
                where: {
                  profileIds: item.validCreators,
                },
              },
              lensConnected?.id
            );

            const items = (item.validCreators as string[])
              .sort(() => 0.5 - Math.random())
              .slice(0, Math.min(4, item.validCreators.length));

            const sample = items?.map(async (item: string) => {
              return await getIdCollections(item);
            });

            const steward = await getProfile(
              {
                forProfileId: item.steward,
              },
              lensConnected?.id
            );

            return {
              ...item,
              steward: steward?.data?.profile,
              validPrintTypes: item.validPrintTypes.map(
                (value: string) => numberToPrintType[Number(value)]
              ),
              sample: await Promise.all(sample),
              validCreators: creators?.data?.profiles,
              validOrigins: item.validOrigins.map(
                (value: string) => numberToItemTypeMap[Number(value)]
              ),
              members: members?.data?.profiles,
            };
          }
        );

        return newCommunities?.[0];
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getCollection = async (
    title: string
  ): Promise<Creation | undefined> => {
    try {
      const data = await getOneCollectionTitle(title);

      if (data?.data?.collectionCreateds) {
        const collections = data?.data?.collectionCreateds?.map(
          (collection: any) => ({
            ...collection,
            sizes: collection?.sizes
              ?.split(",")
              .map((word: string) => word.trim())
              .filter((word: string) => word.length > 0),
            colors: collection?.colors
              ?.split(",")
              .map((word: string) => word.trim())
              .filter((word: string) => word.length > 0),
            mediaTypes: collection?.mediaTypes
              ?.split(",")
              .map((word: string) => word.trim())
              .filter((word: string) => word.length > 0),
            access: collection?.access
              ?.split(",")
              .map((word: string) => word.trim())
              .filter((word: string) => word.length > 0),
            communities: collection?.communities
              ?.split(",")
              .map((word: string) => word.trim())
              .filter((word: string) => word.length > 0),
            tags: collection?.tags
              ?.split(",")
              .map((word: string) => word.trim())
              .filter((word: string) => word.length > 0),
            prices: collection?.prices?.map((price: string) =>
              String(Number(price) / 10 ** 18)
            ),
          })
        );

        return collections?.[0];
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getPub = async (
    forId: string
  ): Promise<Post | Mirror | Comment | Quote | undefined | null> => {
    try {
      const { data } = await getPublication(
        {
          forId,
        },
        lensConnected?.id
      );

      return data?.publication as Post | Mirror | Comment | Quote;
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleInstantPurchase = async () => {
    setInstantLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: polygonMumbai,
        transport: custom((window as any).ethereum),
      });

      const unknownOpenAction = encodeActData(
        {
          item: itemData?.post as Creation,
          color: purchaseDetails?.color,
          size: purchaseDetails?.size,
          price: Number(purchaseDetails?.price),
          chosenIndex: 0,
          chosenIndexes: [],
          amount: 1,
          type: itemStringToType[type.toLowerCase().trim()],
          purchased: false,
        },
        "",
        address!,
        purchaseDetails?.currency as `0x${string}`
      );

      await actPost(
        (itemData?.post as Creation)?.publication?.id,
        {
          unknownOpenAction,
        },
        dispatch,
        address!,
        clientWallet,
        publicClient
      );
    } catch (err: any) {
      console.error(err.messgae);
    }
    dispatch(setSuccessCheckout(true));
    setInstantLoading(false);
  };

  const handleDecrypt = async (post: Post | Quote | Comment) => {
    setDecryptLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: polygonMumbai,
        transport: custom((window as any).ethereum),
      });

      await decryptPost(post, clientWallet, dispatch, setItemData, true);
    } catch (err: any) {
      console.error(err.message);
    }
    setDecryptLoading(false);
  };

  const approveSpend = async () => {
    setInstantLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: polygonMumbai,
        transport: custom((window as any).ethereum),
      });

   
      const { request } = await publicClient.simulateContract({
        address: purchaseDetails?.currency as `0x${string}`,
        abi: [
          purchaseDetails?.currency ===
          "0xf87b6343c172720ac9cc7d1c9465d63454a8ef30"
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
            : purchaseDetails?.currency ===
              "0x3cf7283c025d82390e86d2feb96eda32a393036b"
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
          type === "chromadin"
            ? CHROMADIN_OPEN_ACTION
            : type === "listener"
            ? LISTENER_OPEN_ACTION
            : type === "coinop"
            ? COIN_OP_OPEN_ACTION
            : LEGEND_OPEN_ACTION,
          (((Number(
            (itemData?.post as Creation)?.prices?.[purchaseDetails?.priceIndex]
          ) *
            10 ** 18) /
            Number(
              oracleData?.find(
                (oracle) =>
                  oracle.currency ===
                  ACCEPTED_TOKENS_MUMBAI.find(
                    (item) => item[2] === purchaseDetails?.currency
                  )?.[2]
              )?.rate
            )) *
            10 ** 18) as any,
        ],
        account: address,
      });
      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash: res });
      setIsApprovedSpend(true);
    } catch (err: any) {
      console.error(err.message);
    }
    setInstantLoading(false);
  };

  const checkApproved = async () => {
    try {
      if (purchaseDetails?.currency == "") return;
      const data = await publicClient.readContract({
        address: ACCEPTED_TOKENS_MUMBAI.filter(
          (token) =>
            token[2].toLowerCase() === purchaseDetails?.currency?.toLowerCase()
        )?.[0]?.[2] as `0x${string}`,
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
          type === "chromadin"
            ? CHROMADIN_OPEN_ACTION
            : type === "listener"
            ? LISTENER_OPEN_ACTION
            : type === "coinop"
            ? COIN_OP_OPEN_ACTION
            : LEGEND_OPEN_ACTION,
        ],
      });

      if (data && address) {
        if (
          Number((data as any)?.toString()) /
            Number(
              oracleData?.find(
                (oracle) =>
                  oracle.currency ===
                  ACCEPTED_TOKENS_MUMBAI.find(
                    (item) => item[2] === purchaseDetails?.currency
                  )?.[2]
              )?.wei
            ) >=
          (Number(
            (itemData?.post as Creation)?.prices?.[purchaseDetails?.priceIndex]
          ) *
            10 ** 18) /
            Number(
              oracleData?.find(
                (oracle) =>
                  oracle.currency ===
                  ACCEPTED_TOKENS_MUMBAI.find(
                    (item) => item[2] === purchaseDetails?.currency
                  )?.[2]
              )?.rate
            )
        ) {
          setIsApprovedSpend(true);
        } else {
          setIsApprovedSpend(false);
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (
      lensConnected?.id &&
      (router.asPath.includes("chromadin") ||
        router.asPath.includes("listener") ||
        router.asPath.includes("coinop"))
    ) {
      checkApproved();
    }
  }, [purchaseDetails?.currency]);

  useEffect(() => {
    if (type) {
      getItemData();
    }
  }, [type, lensConnected?.id]);

  return {
    itemLoading,
    itemData,
    purchaseDetails,
    setPurchaseDetails,
    handleInstantPurchase,
    instantLoading,
    approveSpend,
    isApprovedSpend,
    relatedData,
    decryptLoading,
    handleDecrypt,
    setItemData,
  };
};

export default useItem;

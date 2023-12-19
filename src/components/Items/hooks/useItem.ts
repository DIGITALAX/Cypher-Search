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
  ACCEPTED_TOKENS,
  CHROMADIN_OPEN_ACTION,
  COIN_OP_OPEN_ACTION,
  F3M_OPEN_ACTION,
  LEGEND_OPEN_ACTION,
  LISTENER_OPEN_ACTION,
  itemStringToType,
  itemTypeToNumber,
  numberToItemTypeMap,
  numberToPrintType,
} from "../../../../lib/constants";
import { PurchaseDetails } from "../types/item.types";
import { OracleData } from "@/components/Checkout/types/checkout.types";
import { PublicClient, createWalletClient, custom } from "viem";
import { polygon } from "viem/chains";
import encodeActData from "../../../../lib/helpers/encodeActData";
import actPost from "../../../../lib/helpers/api/actPost";
import { setSuccessCheckout } from "../../../../redux/reducers/successCheckoutSlice";
import { AnyAction, Dispatch } from "redux";
import { NextRouter } from "next/router";
import { decryptPost } from "../../../../lib/helpers/decryptPost";
import toHexWithLeadingZero from "../../../../lib/helpers/leadingZero";
import handleCollectionProfilesAndPublications from "../../../../lib/helpers/handleCollectionProfilesAndPublications";
import { setInsufficientBalance } from "../../../../redux/reducers/insufficientBalanceSlice";
import findBalance from "../../../../lib/helpers/findBalance";

const useItem = (
  type: string,
  id: string,
  filterConstants: FilterValues | undefined,
  lensConnected: Profile | undefined,
  oracleData: OracleData[],
  address: `0x${string}` | undefined,
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
    microbrand: [
      {
        microbrand: string;
        microbrandCover: string;
      }
    ];
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
        case "f3m":
          const coll = (await getCollection(
            id?.replaceAll("_", " "),
            type
          )) as Creation;

          pub = (await getPub(
            `${toHexWithLeadingZero(
              Number(coll?.profileId)
            )}-${toHexWithLeadingZero(Number(coll?.pubId))}`
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
            color: coll?.collectionMetadata?.colors?.[0],
            currency: coll?.acceptedTokens?.[0],
            size: coll?.collectionMetadata?.sizes?.[0],
            price: coll?.prices?.[0],
            imageIndex: 0,
            priceIndex: 0,
          });
          break;

        case "pub":
          pub = (await getPub(id)) as Post;
          const collection = (await getCollection(
            (pub?.metadata as ImageMetadataV3)?.title,
            type
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
            color: collection?.collectionMetadata?.colors?.[0],
            currency: collection?.acceptedTokens?.[0],
            size: collection?.collectionMetadata?.sizes?.[0],
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
        (item) =>
          item[0]?.toLowerCase() === id?.replaceAll("_", " ")?.toLowerCase()
      );
      const data = await getProfile(
        {
          forProfileId: `${toHexWithLeadingZero(Number(item?.[2]))}`,
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
      const data = await getCollectionsPaginated(creator, 10, 0);

      return await handleCollectionProfilesAndPublications(
        data?.data?.collectionCreateds,
        lensConnected
      );
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
    title: string,
    type: string
  ): Promise<Creation | undefined> => {
    try {
      const data = await getOneCollectionTitle(
        title,
        itemTypeToNumber[itemStringToType[type]]
      );

      if (data?.data?.collectionCreateds) {
        const collections = data?.data?.collectionCreateds?.map(
          (collection: any) => ({
            ...collection,
            collectionMetadata: {
              ...collection?.collectionMetadata,
              sizes: collection?.collectionMetadata?.sizes
                ?.split(",")
                .map((word: string) => word?.trim())
                .filter((word: string) => word.length > 0),
              colors: collection?.collectionMetadata?.colors
                ?.split(",")
                .map((word: string) => word?.trim())
                .filter((word: string) => word.length > 0),
              mediaTypes: collection?.collectionMetadata?.mediaTypes
                ?.split(",")
                .map((word: string) => word?.trim())
                .filter((word: string) => word.length > 0),
              access: collection?.collectionMetadata?.access
                ?.split(",")
                .map((word: string) => word?.trim())
                .filter((word: string) => word.length > 0),
              communities: collection?.collectionMetadata?.communities
                ?.split(",")
                .map((word: string) => word?.trim())
                .filter((word: string) => word.length > 0),
              tags: collection?.collectionMetadata?.tags
                ?.split(",")
                .map((word: string) => word?.trim())
                .filter((word: string) => word.length > 0),
            },
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
      const balance = await findBalance(
        publicClient,
        purchaseDetails?.currency,
        address as `0x${string}`
      );

      if (
        Number(balance) <
        ((Number(
          (itemData?.post as Creation)?.prices?.[purchaseDetails?.priceIndex]
        ) *
          10 ** 18) /
          Number(
            oracleData?.find(
              (oracle) =>
                oracle.currency?.toLowerCase() ===
                purchaseDetails?.currency?.toLowerCase()
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
        setInstantLoading(false);
        return;
      }

      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      const unknownOpenAction = encodeActData(
        {
          item: itemData?.post as Creation,
          color: purchaseDetails?.color,
          size: purchaseDetails?.size,
          price: Number(purchaseDetails?.price),
          chosenIndex: purchaseDetails?.priceIndex,
          chosenIndexes: [],
          buyAmount: 1,
          type: itemStringToType[type?.toLowerCase()?.trim()],
          purchased: false,
        },
        undefined,
        "",
        purchaseDetails?.currency as `0x${string}`
      );

      const complete = await actPost(
        `${toHexWithLeadingZero(
          Number((itemData?.post as Creation)?.profileId)
        )}-${toHexWithLeadingZero(
          Number((itemData?.post as Creation)?.pubId)
        )}`,
        {
          unknownOpenAction,
        },
        dispatch,
        address!,
        clientWallet,
        publicClient
      );
      if (complete) {
        dispatch(setSuccessCheckout(true));
      }
    } catch (err: any) {
      console.error(err.messgae);
    }

    setInstantLoading(false);
  };

  const handleDecrypt = async (post: Post | Quote | Comment) => {
    setDecryptLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: polygon,
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
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      const { request } = await publicClient.simulateContract({
        address: purchaseDetails?.currency as `0x${string}`,
        abi: [
          purchaseDetails?.currency ===
          "0x6968105460f67c3bf751be7c15f92f5286fd0ce5"
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
              "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"
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
          type === "chromadin"
            ? CHROMADIN_OPEN_ACTION
            : type === "listener"
            ? LISTENER_OPEN_ACTION
            : type === "coinop"
            ? COIN_OP_OPEN_ACTION
            : type === "f3m"
            ? F3M_OPEN_ACTION
            : LEGEND_OPEN_ACTION,
          (((Number(
            (itemData?.post as Creation)?.prices?.[purchaseDetails?.priceIndex]
          ) *
            10 ** 18) /
            Number(
              oracleData?.find(
                (oracle) =>
                  oracle.currency?.toLowerCase() ===
                  purchaseDetails?.currency?.toLowerCase()
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
      if (
        purchaseDetails?.currency == "" ||
        !purchaseDetails?.currency ||
        !address
      )
        return;
      const data = await publicClient.readContract({
        address: ACCEPTED_TOKENS.filter(
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
            : type === "f3m"
            ? F3M_OPEN_ACTION
            : LEGEND_OPEN_ACTION,
        ],
      });

      if (address) {
        if (
          Number((data as any)?.toString()) /
            Number(
              oracleData?.find(
                (oracle) =>
                  oracle.currency ===
                  ACCEPTED_TOKENS.find(
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
                  ACCEPTED_TOKENS.find(
                    (item) => item[2] === purchaseDetails?.currency
                  )?.[2]
              )?.rate
            )
        ) {
          setIsApprovedSpend(true);
        } else {
          setIsApprovedSpend(false);
        }
      } else {
        setIsApprovedSpend(false);
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
        router.asPath.includes("coinop") ||
        router.asPath.includes("item/f3m"))
    ) {
      checkApproved();
    }
  }, [purchaseDetails?.currency, address]);

  useEffect(() => {
    if (type && id && filterConstants) {
      if (type === "microbrand" && !filterConstants) return;
      getItemData();
    }
  }, [type, lensConnected?.id, id, filterConstants]);

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
    setRelatedData,
  };
};

export default useItem;

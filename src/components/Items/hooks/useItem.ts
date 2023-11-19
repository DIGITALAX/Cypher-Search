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
  itemStringToType,
  numberToItemTypeMap,
  numberToPrintType,
} from "../../../../lib/constants";
import { PurchaseDetails } from "../types/item.types";
import { OracleData } from "@/components/Checkout/types/checkout.types";
import { CartItem } from "@/components/Common/types/common.types";
import { PublicClient, createWalletClient, custom } from "viem";
import { ethers } from "ethers";
import { polygon } from "viem/chains";
import encodeActData from "../../../../lib/helpers/encodeActData";
import actPost from "../../../../lib/helpers/api/actPost";
import { setSuccessCheckout } from "../../../../redux/reducers/successCheckoutSlice";
import { AnyAction, Dispatch } from "redux";

const useItem = (
  type: string,
  id: string,
  filterConstants: FilterValues | undefined,
  lensConnected: Profile | undefined,
  oracleData: OracleData[],
  address: `0x${string}` | undefined,
  cartItems: CartItem[],
  publicClient: PublicClient,
  dispatch: Dispatch<AnyAction>
) => {
  const [instantLoading, setInstantLoading] = useState<boolean>(false);
  const [itemLoading, setItemLoading] = useState<boolean>(false);
  const [itemData, setItemData] = useState<Publication>();
  const [isApprovedSpend, setIsApprovedSpend] = useState<boolean>(false);
  const [relatedCollections, setRelatedCollections] = useState<Creation[]>([]);
  const [purchaseDetails, setPurchaseDetails] = useState<PurchaseDetails>({
    color: "",
    currency: "",
    size: "",
    price: "",
    imageIndex: 0,
  });

  const getItemData = async () => {
    setItemLoading(true);
    try {
      let pub: Post | Mirror | Comment | Quote;
      switch (type) {
        case "chromadin":
        case "coinop":
        case "pub":
          pub = (await getPub()) as Post;
          const collection = (await getCollection(
            (pub?.metadata as ImageMetadataV3)?.title
          )) as Creation;
          setItemData({
            post: collection
              ? {
                  ...collection,
                  profile: pub?.by,
                  publication: pub,
                }
              : pub,
            type,
          });
          setPurchaseDetails({
            color: collection?.colors?.[0],
            currency: collection?.acceptedTokens?.[0],
            size: collection?.sizes?.[0],
            price: collection?.prices?.[0],
            imageIndex: 0,
          });
          break;

        case "microbrand":
          const profile = await getIdProfile();
          const collections = await getIdCollections(profile?.ownedBy?.address);
          setItemData({
            post: profile,
            type,
          });
          setRelatedCollections(collections || []);
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
      const item = filterConstants?.microbrands?.find((item) => item[1] === id);
      const data = await getProfile({
        forProfileId: item?.[3],
      });

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
      data?.data?.collectionCreateds?.map((collection: any) => ({
        ...collection,
        sizes: collection?.sizes?.split(",").map((word: string) => word.trim()),
        colors: collection?.colors
          ?.split(",")
          .map((word: string) => word.trim()),
        mediaTypes: collection?.mediaTypes
          ?.split(",")
          .map((word: string) => word.trim()),
        access: collection?.access
          ?.split(",")
          .map((word: string) => word.trim()),
        communities: collection?.communities
          ?.split(",")
          .map((word: string) => word.trim()),
        tags: collection?.tags?.split(",").map((word: string) => word.trim()),
      }));
      return data?.data?.collectionCreateds;
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getCommunity = async (): Promise<Community | undefined> => {
    try {
      const data = await getCommunityName(id);

      if (data?.data?.communityCreateds) {
        data?.data?.communityCreateds?.map(async (item: any) => {
          const members = await getProfiles({
            where: {
              profileIds: item.members,
            },
          });

          const creators = await getProfiles({
            where: {
              profileIds: item.validCreators,
            },
          });

          const items = (item.validCreators as string[])
            .sort(() => 0.5 - Math.random())
            .slice(0, Math.min(4, item.validCreators.length));

          const sample = items?.map(async (item: string) => {
            return await getIdCollections(item);
          });

          const steward = await getProfile({
            forProfileId: item.steward,
          });

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
        });

        return data?.data?.communityCreateds?.[0];
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
        data?.data?.collectionCreateds?.map((collection: any) => ({
          ...collection,
          sizes: collection?.sizes
            ?.split(",")
            .map((word: string) => word.trim()),
          colors: collection?.colors
            ?.split(",")
            .map((word: string) => word.trim()),
          mediaTypes: collection?.mediaTypes
            ?.split(",")
            .map((word: string) => word.trim()),
          access: collection?.access
            ?.split(",")
            .map((word: string) => word.trim()),
          communities: collection?.communities
            ?.split(",")
            .map((word: string) => word.trim()),
          tags: collection?.tags?.split(",").map((word: string) => word.trim()),
        }));

        return data?.data?.collectionCreateds?.[0];
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getPub = async (): Promise<
    Post | Mirror | Comment | Quote | undefined | null
  > => {
    try {
      const { data } = await getPublication({
        forId: id,
      });

      return data?.publication as Post | Mirror | Comment | Quote;
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleInstantPurchase = async () => {
    setInstantLoading(true);
    try {
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

      dispatch(setSuccessCheckout(true));
    } catch (err: any) {
      console.error(err.messgae);
    }
    setInstantLoading(false);
  };

  const approveSpend = async () => {
    setInstantLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      const item = cartItems?.find(
        (item) =>
          item?.item?.pubId === (itemData?.post as Creation).publication?.id
      );

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
        chain: polygon,
        args: [
          CHROMADIN_OPEN_ACTION,
          ethers.parseEther(
            oracleData
              ?.find(
                (oracle) =>
                  oracle.currency ===
                  ACCEPTED_TOKENS_MUMBAI.find(
                    (item) => item[2] === purchaseDetails?.currency
                  )?.[2]
              )
              ?.rate?.toString()!
          ),
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
      const item = cartItems?.find(
        (item) =>
          item?.item?.pubId === (itemData?.post as Creation).publication?.id
      );

      const data = await publicClient.readContract({
        address: ACCEPTED_TOKENS_MUMBAI.filter(
          (token) =>
            token[2].toLowerCase() === purchaseDetails?.currency?.toLowerCase()
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
        args: [address as `0x${string}`, CHROMADIN_OPEN_ACTION],
      });

      if (data && address) {
        if (
          Number((data as any)?.toString()) /
            (purchaseDetails?.currency ===
            "0x07b722856369f6b923e1f276abca58dd3d15243d"
              ? 10 ** 6
              : 10 ** 18) >=
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
    if (lensConnected?.id) {
      checkApproved();
    }
  }, [purchaseDetails?.currency]);

  useEffect(() => {
    if (type) {
      getItemData();
    }
  }, []);


  return {
    itemLoading,
    itemData,
    purchaseDetails,
    setPurchaseDetails,
    handleInstantPurchase,
    instantLoading,
    approveSpend,
    isApprovedSpend,
    relatedCollections,
  };
};

export default useItem;

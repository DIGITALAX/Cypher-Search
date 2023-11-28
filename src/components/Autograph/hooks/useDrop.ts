import { useEffect, useState } from "react";
import { Drop } from "../types/autograph.types";
import { Profile } from "../../../../graphql/generated";
import { Dispatch } from "redux";
import { getDrops } from "../../../../graphql/subgraph/queries/getDrops";
import { setPostSuccess } from "../../../../redux/reducers/postSuccessSlice";
import { PublicClient, createWalletClient, custom } from "viem";
import { polygonMumbai } from "viem/chains";
import { COLLECTION_CREATOR } from "../../../../lib/constants";
import CollectionCreatorAbi from "./../../../../abis/CollectionCreatorAbi.json";
import convertToFile from "../../../../lib/helpers/convertToFile";

const useDrop = (
  publicClient: PublicClient,
  dispatch: Dispatch,
  address: `0x${string}` | undefined,
  pageProfile: Profile | undefined
) => {
  const [dropsLoading, setDropsLoading] = useState<boolean>(false);
  const [createDropLoading, setCreateDropLoading] = useState<boolean>(false);
  const [searchCollection, setSearchCollection] = useState<string>("");
  const [allDrops, setAllDrops] = useState<Drop[]>([]);
  const [dropDetails, setDropDetails] = useState<{
    collectionIds: string[];
    title: string;
    cover: string;
    dropId: string;
  }>({
    collectionIds: [],
    title: "",
    cover: "",
    dropId: "",
  });

  const getAllDrops = async () => {
    setDropsLoading(true);
    try {
      const data = await getDrops(address!);
      setAllDrops(data?.data?.dropCreateds);
    } catch (err: any) {
      console.error(err.message);
    }
    setDropsLoading(false);
  };

  const editDrop = async () => {
    setCreateDropLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: polygonMumbai,
        transport: custom((window as any).ethereum),
      });

      let newImage: string = dropDetails?.cover;

      if (dropDetails?.cover?.includes("base64")) {
        const response = await fetch("/api/ipfs", {
          method: "POST",
          body: convertToFile(newImage, "image/png"),
        });
        const responseJSON = await response.json();
        newImage = "ipfs://" + responseJSON.cid;
      }

      const response = await fetch("/api/ipfs", {
        method: "POST",
        body: JSON.stringify({
          title: dropDetails?.title,
          cover: newImage,
        }),
      });
      const dropURI = await response.json();

      const { request } = await publicClient.simulateContract({
        address: COLLECTION_CREATOR,
        abi: CollectionCreatorAbi,
        functionName: "updateDrop",
        chain: polygonMumbai,
        args: [
          dropDetails?.collectionIds?.map((item) => Number(item)),
          "ipfs://" + dropURI?.cid,
          Number(dropDetails?.dropId),
        ],
        account: address,
      });
      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash: res });
      await cleanDrop("updated");
    } catch (err: any) {
      console.error(err.message);
    }

    setCreateDropLoading(false);
  };

  const deleteDrop = async () => {
    setCreateDropLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: polygonMumbai,
        transport: custom((window as any).ethereum),
      });

      const { request } = await publicClient.simulateContract({
        address: COLLECTION_CREATOR,
        abi: CollectionCreatorAbi,
        functionName: "removeDrop",
        chain: polygonMumbai,
        args: [Number(dropDetails?.dropId)],
        account: address,
      });
      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash: res });
      await cleanDrop("deleted");
    } catch (err: any) {
      console.error(err.message);
    }

    setCreateDropLoading(false);
  };

  const createDrop = async () => {
    setCreateDropLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: polygonMumbai,
        transport: custom((window as any).ethereum),
      });

      const imageRes = await fetch("/api/ipfs", {
        method: "POST",
        body: convertToFile(dropDetails?.cover, "image/png"),
      });
      const responseJSON = await imageRes.json();

      const response = await fetch("/api/ipfs", {
        method: "POST",
        body: JSON.stringify({
          title: dropDetails?.title,
          cover: "ipfs://" + responseJSON.cid,
        }),
      });
      const dropURI = await response.json();

      const { request } = await publicClient.simulateContract({
        address: COLLECTION_CREATOR,
        abi: CollectionCreatorAbi,
        functionName: "createDrop",
        chain: polygonMumbai,
        args: ["ipfs://" + dropURI?.cid],
        account: address,
      });
      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash: res });
      await cleanDrop("created");
    } catch (err: any) {
      console.error(err.message);
    }

    setCreateDropLoading(false);
  };

  const cleanDrop = async (actionType: string) => {
    try {
      setDropDetails({
        collectionIds: [],
        title: "",
        cover: "",
        dropId: "",
      });
      dispatch(
        setPostSuccess({
          actionValue: "drop",
          actionPubId: dropDetails?.title,
          actionType,
        })
      );
      await getAllDrops();
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (allDrops?.length < 1 && pageProfile?.ownedBy?.address) {
      getAllDrops();
    }
  }, [address, pageProfile?.ownedBy?.address]);

  return {
    createDrop,
    dropDetails,
    setDropDetails,
    dropsLoading,
    createDropLoading,
    allDrops,
    searchCollection,
    setSearchCollection,
    editDrop,
    deleteDrop,
  };
};

export default useDrop;

import { useEffect, useState } from "react";
import { Drop, ScreenDisplay } from "../types/autograph.types";
import { Profile } from "../../../../graphql/generated";
import { Dispatch } from "redux";
import { getDrops } from "../../../../graphql/subgraph/queries/getDrops";

const useDrop = (
  lensConnected: Profile | undefined,
  screenDisplay: ScreenDisplay,
  dispatch: Dispatch,
  address: `0x${string}` | undefined,
  pageProfile: Profile | undefined
) => {
  const [dropsLoading, setDropsLoading] = useState<boolean>(false);
  const [createDropLoading, setCreateDropLoading] = useState<boolean>(false);
  const [allDrops, setAllDrops] = useState<Drop[]>([]);
  const [dropDetails, setDropDetails] = useState<{
    collectionIds: string[];
    title: string;
    cover: string;
    dropId: string
  }>({
    collectionIds: [],
    title: "",
    cover: "",
    dropId: ""
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

  const createDrop = async () => {
    setCreateDropLoading(true);
    try {
      
    } catch (err: any) {
      console.error(err.message);
    }

    setCreateDropLoading(false);
  };

  const getSelectedDrop = async (id: string) => {
    setDropsLoading(true);
    try {
    } catch (err: any) {
      console.error(err.message);
    }
    setDropsLoading(false);
  };

  useEffect(() => {
    if (
      screenDisplay === ScreenDisplay.Gallery &&
      allDrops?.length < 1 &&
      address &&
      lensConnected?.handle?.fullHandle === pageProfile?.handle?.fullHandle
    ) {
      getAllDrops();
    }
  }, [screenDisplay]);

  return {
    createDrop,
    dropDetails,
    setDropDetails,
    dropsLoading,
    createDropLoading,
    allDrops,
    getSelectedDrop,
  };
};

export default useDrop;

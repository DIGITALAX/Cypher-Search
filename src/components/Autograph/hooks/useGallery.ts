import { useEffect, useState } from "react";
import lensMirror from "../../../../lib/helpers/api/mirrorPost";
import lensLike from "../../../../lib/helpers/api/likePost";
import { setProfileDisplay } from "../../../../redux/reducers/profileDisplaySlice";
import { Creation } from "@/components/Tiles/types/tiles.types";
import { Display } from "../types/autograph.types";
import { MetadataAttributeType, Profile } from "../../../../graphql/generated";
import { createWalletClient, custom, PublicClient } from "viem";
import { polygon } from "viem/chains";
import setMeta from "../../../../lib/helpers/api/setMeta";
import refetchProfile from "../../../../lib/helpers/api/refetchProfile";
import { Dispatch } from "redux";

const useGallery = (
  lensConnected: Profile | undefined,
  profileDisplay: Display | undefined,
  gallery:
    | {
        collected: Creation[];
        created: Creation[];
      }
    | undefined,
  dispatch: Dispatch,
  publicClient: PublicClient,
  address: `0x${string}` | undefined,
  postSuccess: string | undefined
) => {
  const [interactionsGalleryLoading, setInteractionsGalleryLoading] = useState<
    {
      like: boolean;
      mirror: boolean;
      bookmark: boolean;
      hide: boolean;
    }[]
  >([]);
  const [openMirrorGalleryChoice, setOpenMirrorGalleryChoice] = useState<
    boolean[]
  >([]);
  const [activeGallery, setActiveGallery] = useState<Creation[]>([]);
  const [interactionsDisplayLoading, setInteractionsDisplayLoading] = useState<
    {
      like: boolean;
      mirror: boolean;
      simpleCollect: boolean;
      bookmark: boolean;
      interested: boolean;
      hide: boolean;
    }[]
  >(
    Array.from({ length: 4 }, () => ({
      like: false,
      mirror: false,
      simpleCollect: false,
      bookmark: false,
      interested: false,
      hide: false,
    }))
  );
  const [openMirrorDisplayChoice, setOpenMirrorDisplayChoice] = useState<
    boolean[]
  >(Array.from({ length: 4 }, () => false));
  const [displayLoading, setDisplayLoading] = useState<boolean>(false);
  const [optionsOpen, setOptionsOpen] = useState<boolean>(false);
  const [galleryLoading, setGalleryLoading] = useState<boolean>(false);
  const [openInteractions, setOpenInteractions] = useState<boolean[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("NEWEST");

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const getDisplayData = async (collections: Creation[]) => {
    try {
      const displayItems = lensConnected?.metadata?.attributes?.find(
        (item) => item.key === "cypherDisplay"
      );
      let display: Display | undefined;

      if (displayItems?.value) {
        display = await JSON.parse(displayItems.value);
      } else {
        if (collections?.length > 0) {
          display = {
            public: {
              main: collections?.[0],
              side: [collections?.[1], collections?.[2], collections?.[3]],
            },
          };
        }
      }

      dispatch(setProfileDisplay(display));
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getGallery = async () => {
    setGalleryLoading(true);
    try {
      // both those they've created and the orders that they've collected needs to be different from profile because is without owning??

      await getDisplayData();
      setActiveGallery();
    } catch (err: any) {
      console.error(err.message);
    }
    setGalleryLoading(false);
  };

  const getMoreGallery = async () => {
    try {
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleSetDisplay = async () => {
    setDisplayLoading(true);
    try {
      let attributes = [...(lensConnected?.metadata?.attributes || [])];

      const existing = attributes.findIndex(
        (item) => item.key === "cypherDisplay"
      );

      if (existing) {
        attributes[existing].value = JSON.stringify(profileDisplay);
      } else {
        attributes.push({
          key: "cypherDisplay",
          value: JSON.stringify(profileDisplay),
          type: MetadataAttributeType.Json,
        });
      }

      const response = await fetch("/api/ipfs", {
        method: "POST",
        body: JSON.stringify({
          __typename: lensConnected?.metadata?.__typename,
          appId: "cypersearch",
          attributes,
          bio: lensConnected?.metadata?.bio,
          coverPicture: lensConnected?.metadata?.coverPicture,
          displayName: lensConnected?.metadata?.displayName,
          picture: lensConnected?.metadata?.picture,
          rawURI: lensConnected?.metadata?.rawURI,
        }),
      });
      const responseJSON = await response.json();

      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await setMeta(
        "ipfs://" + responseJSON.cid,
        dispatch,
        address as `0x${string}`,
        clientWallet,
        publicClient
      );

      await refetchProfile(dispatch, lensConnected?.id);
    } catch (err: any) {
      console.error(err.message);
    }
    setDisplayLoading(false);
  };

  const galleryLike = async (id: string) => {
    const index = [
      ...(gallery?.collected || []),
      ...(gallery?.created || []),
    ].findIndex((pub) => pub.pubId === id);
    if (index === -1) {
      return;
    }
    setInteractionsGalleryLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], like: true };
      return updatedArray;
    });

    try {
      await lensLike(id, dispatch);
    } catch (err: any) {
      console.error(err.message);
    }

    setInteractionsGalleryLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], like: false };
      return updatedArray;
    });
  };

  const galleryMirror = async (id: string) => {
    const index = [
      ...(gallery?.collected || []),
      ...(gallery?.created || []),
    ].findIndex((pub) => pub.pubId === id);
    if (index === -1) {
      return;
    }
    setInteractionsGalleryLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], mirror: true };
      return updatedArray;
    });

    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });
      await lensMirror(
        id,
        dispatch,
        address as `0x${string}`,
        clientWallet,
        publicClient
      );
    } catch (err: any) {
      console.error(err.message);
    }

    setInteractionsGalleryLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], mirror: false };
      return updatedArray;
    });
  };

  const displayLike = async (index: number, id: string) => {
    setInteractionsDisplayLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], like: true };
      return updatedArray;
    });

    try {
      await lensLike(id, dispatch);
    } catch (err: any) {
      console.error(err.message);
    }

    setInteractionsDisplayLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], like: false };
      return updatedArray;
    });
  };

  const displayMirror = async (index: number, id: string) => {
    setInteractionsDisplayLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], mirror: true };
      return updatedArray;
    });

    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });
      await lensMirror(
        id,
        dispatch,
        address as `0x${string}`,
        clientWallet,
        publicClient
      );
    } catch (err: any) {
      console.error(err.message);
    }

    setInteractionsDisplayLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], mirror: false };
      return updatedArray;
    });
  };

  useEffect(() => {
    if (
      gallery?.collected &&
      gallery?.created &&
      gallery?.collected?.length < 1 &&
      gallery?.created?.length < 1
    ) {
      getGallery();
    }
  }, []);

  useEffect(() => {
    if (postSuccess) {
      getGallery();
    }
  }, [postSuccess]);

  useEffect(() => {
    if (
      (gallery?.collected && gallery?.collected?.length > 0) ||
      (gallery?.created && gallery?.created?.length > 0)
    ) {
      setOpenInteractions(
        Array.from(
          {
            length:
              gallery?.collected?.length || 0 + gallery?.created?.length || 0,
          },
          () => false
        )
      );
      setOpenMirrorGalleryChoice(
        Array.from(
          {
            length:
              gallery?.collected?.length || 0 + gallery?.created?.length || 0,
          },
          () => false
        )
      );
      setInteractionsGalleryLoading(
        Array.from(
          {
            length:
              gallery?.collected?.length || 0 + gallery?.created?.length || 0,
          },
          () => ({
            like: false,
            mirror: false,
            quote: false,
            bookmark: false,
            interested: false,
            hide: false,
          })
        )
      );
    }
  }, [gallery?.collected?.length, gallery?.created?.length]);

  return {
    interactionsGalleryLoading,
    galleryMirror,
    galleryLike,
    openMirrorGalleryChoice,
    setOpenMirrorGalleryChoice,
    interactionsDisplayLoading,
    openMirrorDisplayChoice,
    setOpenMirrorDisplayChoice,
    displayLike,
    displayMirror,
    handleSetDisplay,
    displayLoading,
    optionsOpen,
    setOptionsOpen,
    selectedOption,
    handleOptionSelect,
    galleryLoading,
    getMoreGallery,
    openInteractions,
    setOpenInteractions,
    activeGallery,
  };
};

export default useGallery;

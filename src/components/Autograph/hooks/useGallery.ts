import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { useEffect, useState } from "react";
import lensMirror from "../../../../lib/helpers/api/mirrorPost";
import lensLike from "../../../../lib/helpers/api/likePost";
import lensQuote from "../../../../lib/helpers/api/quotePost";
import lensComment from "../../../../lib/helpers/api/commentPost";
import uploadCommentQuoteContent from "../../../../lib/helpers/uploadCommentQuote";
import { setProfileDisplay } from "../../../../redux/reducers/profileDisplaySlice";
import { Creation } from "@/components/Tiles/types/tiles.types";
import { Display } from "../types/autograph.types";
import { MetadataAttributeType, Profile } from "../../../../graphql/generated";
import profileMetadata from "../../../../graphql/lens/mutations/metadata";
import pollUntilIndexed from "../../../../graphql/lens/queries/indexed";
import { setInteractError } from "../../../../redux/reducers/interactErrorSlice";
import getProfile from "../../../../graphql/lens/queries/profile";
import { setLensConnected } from "../../../../redux/reducers/lensConnectedSlice";

const useGallery = () => {
  const dispatch = useDispatch();
  const lastPostComment = useSelector(
    (state: RootState) => state.app.lastPostCommentReducer
  );
  const lensConnected = useSelector(
    (state: RootState) => state.app.lensConnectedReducer.profile
  );
  const profileDisplay = useSelector(
    (state: RootState) => state.app.profileDisplayReducer.value
  );
  const lastPostQuote = useSelector(
    (state: RootState) => state.app.lastPostCommentReducer
  );
  const gallery = useSelector(
    (state: RootState) => state.app.galleryItemsReducer.items
  );
  const [interactionsGalleryLoading, setInteractionsGalleryLoading] = useState<
    {
      like: boolean;
      mirror: boolean;
      quote: boolean;
      comment: boolean;
      collect: boolean;
    }[]
  >(
    Array.from({ length: 4 }, () => ({
      like: false,
      mirror: false,
      quote: false,
      comment: false,
      collect: false,
    }))
  );
  const [openMirrorGalleryChoice, setOpenMirrorGalleryChoice] = useState<
    boolean[]
  >(Array.from({ length: 4 }, () => false));
  const [interactionsDisplayLoading, setInteractionsDisplayLoading] = useState<
    {
      like: boolean;
      mirror: boolean;
      quote: boolean;
      comment: boolean;
      collect: boolean;
    }[]
  >(
    Array.from({ length: 4 }, () => ({
      like: false,
      mirror: false,
      quote: false,
      comment: false,
      collect: false,
    }))
  );
  const [openMirrorDisplayChoice, setOpenMirrorDisplayChoice] = useState<
    boolean[]
  >(Array.from({ length: 4 }, () => false));
  const [displayLoading, setDisplayLoading] = useState<boolean>(false);

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
    try {
      // both those they've created and the orders that they've collected

      await getDisplayData();
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

      const { data } = await profileMetadata({
        metadataURI: "ipfs://" + responseJSON.cid,
      });

      if (data?.setDefaultProfile.__typename === "RelaySuccess") {
        const result = await pollUntilIndexed({
          forTxId: data?.setDefaultProfile?.txId,
        });

        if (!result) {
          dispatch(setInteractError(true));
          console.error(result);
        } else {
          const { data } = await getProfile({
            forProfileId: lensConnected?.id,
          });

          dispatch(setLensConnected(data?.profile as Profile));
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setDisplayLoading(false);
  };

  const galleryComment = async (id: string) => {
    const index = [
      ...(gallery?.collected || []),
      ...(gallery?.created || []),
    ].findIndex((pub) => pub.pubId === id);
    if (index === -1) {
      return;
    }

    setInteractionsGalleryLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], comment: true };
      return updatedArray;
    });

    try {
      const contentURI = await uploadCommentQuoteContent(
        lastPostComment.content,
        lastPostComment.images,
        lastPostComment.videos,
        lastPostComment.gifs
      );

      await lensComment(id, contentURI!, dispatch, lastPostComment.collectType);
    } catch (err: any) {
      console.error(err.message);
    }

    setInteractionsGalleryLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], comment: false };
      return updatedArray;
    });
  };

  const galleryQuote = async (id: string) => {
    const index = [
      ...(gallery?.collected || []),
      ...(gallery?.created || []),
    ].findIndex((pub) => pub.pubId === id);
    if (index === -1) {
      return;
    }
    setInteractionsGalleryLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], quote: true };
      return updatedArray;
    });

    try {
      const contentURI = await uploadCommentQuoteContent(
        lastPostQuote.content,
        lastPostQuote.images,
        lastPostQuote.videos,
        lastPostQuote.gifs
      );

      await lensQuote(id, contentURI!, dispatch, lastPostQuote.collectType);
    } catch (err: any) {
      console.error(err.message);
    }

    setInteractionsGalleryLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], quote: false };
      return updatedArray;
    });
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
      await lensMirror(id, dispatch);
    } catch (err: any) {
      console.error(err.message);
    }

    setInteractionsGalleryLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], mirror: false };
      return updatedArray;
    });
  };

  const displayComment = async (index: number, id: string) => {
    setInteractionsDisplayLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], comment: true };
      return updatedArray;
    });

    try {
      const contentURI = await uploadCommentQuoteContent(
        lastPostComment.content,
        lastPostComment.images,
        lastPostComment.videos,
        lastPostComment.gifs
      );

      await lensComment(id, contentURI!, dispatch, lastPostComment.collectType);
    } catch (err: any) {
      console.error(err.message);
    }

    setInteractionsDisplayLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], comment: false };
      return updatedArray;
    });
  };

  const displayQuote = async (index: number, id: string) => {
    setInteractionsDisplayLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], quote: true };
      return updatedArray;
    });

    try {
      const contentURI = await uploadCommentQuoteContent(
        lastPostQuote.content,
        lastPostQuote.images,
        lastPostQuote.videos,
        lastPostQuote.gifs
      );

      await lensQuote(id, contentURI!, dispatch, lastPostQuote.collectType);
    } catch (err: any) {
      console.error(err.message);
    }

    setInteractionsDisplayLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index] = { ...updatedArray[index], quote: false };
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
      await lensMirror(id, dispatch);
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

  return {
    interactionsGalleryLoading,
    galleryMirror,
    galleryQuote,
    galleryLike,
    galleryComment,
    openMirrorGalleryChoice,
    setOpenMirrorGalleryChoice,
    interactionsDisplayLoading,
    openMirrorDisplayChoice,
    setOpenMirrorDisplayChoice,
    displayComment,
    displayLike,
    displayMirror,
    displayQuote,
    handleSetDisplay,
    displayLoading,
  };
};

export default useGallery;

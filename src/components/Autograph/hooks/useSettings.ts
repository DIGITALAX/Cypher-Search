import { ChangeEvent, useState } from "react";
import profileMetadata from "../../../../graphql/lens/mutations/metadata";
import { setInteractError } from "../../../../redux/reducers/interactErrorSlice";
import { useDispatch, useSelector } from "react-redux";
import pollUntilIndexed from "../../../../graphql/lens/queries/indexed";
import getProfile from "../../../../graphql/lens/queries/profile";
import { RootState } from "../../../../redux/store";
import { setLensConnected } from "../../../../redux/reducers/lensConnectedSlice";
import { Profile, ProfileMetadata } from "../../../../graphql/generated";

const useSettings = () => {
  const dispatch = useDispatch();
  const lensConnected = useSelector(
    (state: RootState) => state.app.lensConnectedReducer.profile
  );
  const [settingsUpdateLoading, setSettingsUpdateLoading] =
    useState<boolean>(false);
  const [pfpImage, setPFPImage] = useState<string>();
  const [coverImage, setCoverImage] = useState<string>();
  const [settingsData, setSettingsData] = useState<ProfileMetadata>({
    __typename: lensConnected?.metadata?.__typename,
    appId: "cypersearch",
    attributes: lensConnected?.metadata?.attributes,
    bio: lensConnected?.metadata?.bio,
    coverPicture: lensConnected?.metadata?.coverPicture,
    displayName: lensConnected?.metadata?.displayName,
    picture: lensConnected?.metadata?.picture,
    rawURI: lensConnected?.metadata?.rawURI,
  });

  const handleImage = async (e: ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (id == "cover") {
          setCoverImage(e.target?.result as string);
        } else {
          setPFPImage(e.target?.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSettingsUpdate = async () => {
    setSettingsUpdateLoading(true);
    try {
      let newImages: string[] = [];
      let hasNewCoverImage = coverImage !== undefined;
      let hasNewPfpImage = pfpImage !== undefined;

      if (hasNewCoverImage || hasNewPfpImage) {
        let images = [coverImage, pfpImage].filter(
          (image) => image !== undefined
        );
        for (let i = 0; i < images.length; i++) {
          const response = await fetch("/api/ipfs", {
            method: "POST",
            body: images[i],
          });
          const responseJSON = await response.json();
          newImages.push("ipfs://" + responseJSON.cid);
        }
      }

      const metadata: ProfileMetadata = {
        ...settingsData,
        picture: hasNewPfpImage
          ? {
              raw: {
                uri: newImages[hasNewCoverImage ? 1 : 0],
              },
            }
          : settingsData.picture,
        coverPicture: hasNewCoverImage
          ? {
              raw: {
                uri: newImages[0],
              },
            }
          : settingsData.coverPicture,
      };

      const response = await fetch("/api/ipfs", {
        method: "POST",
        body: JSON.stringify(metadata),
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
    setSettingsUpdateLoading(false);
  };

  return {
    handleSettingsUpdate,
    settingsUpdateLoading,
    setSettingsData,
    settingsData,
    coverImage,
    handleImage,
    pfpImage,
  };
};

export default useSettings;

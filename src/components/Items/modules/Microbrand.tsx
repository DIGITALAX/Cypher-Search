import { FunctionComponent } from "react";
import { MicrobrandProps } from "../types/item.types";
import Creation from "@/components/Autograph/modules/Metadata/Creation";
import { Creation as CreationType } from "@/components/Tiles/types/tiles.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import createProfilePicture from "../../../../lib/helpers/createProfilePicture";
import handleImageError from "../../../../lib/helpers/handleImageError";

const Microbrand: FunctionComponent<MicrobrandProps> = ({
  relatedData,
  itemData,
  dispatch,
  router,
  cartItems,
  mirror,
  like,
  openMirrorChoice,
  setOpenMirrorChoice,
  interactionsLoading,
  openInteractions,
  setOpenInteractions,
  followProfile,
  unfollowProfile,
  followLoading,
  profileHovers,
  setProfileHovers,
  lensConnected,
}): JSX.Element => {
  const profilePicture = createProfilePicture(itemData?.metadata?.picture);
  return (
    <div className="relative w-full min-h-[50rem] flex items-center justify-start flex-col pt-32 px-12 gap-7 h-fit">
      <div className="relative w-full h-fit flex gap-2 flex-row items-center justify-center">
        <div className="relative w-20 h-20 ml-auto text-4xl text-white font-aust flex items-center justify-center">
          <div className="relative w-fit h-fit flex items-center justify-center">
            {relatedData?.microbrand?.microbrandCover && (
              <Image
                layout="fill"
                src={`${INFURA_GATEWAY}/ipfs/${
                  relatedData?.microbrand?.microbrandCover?.split(
                    "ipfs://"
                  )?.[1]
                }`}
                draggable={false}
                objectFit="contain"
                onError={(e) => handleImageError(e)}
              />
            )}
          </div>
        </div>
        <div className="relative w-fit h-fit flex flex-col items-start justify-start">
          <div className="relative w-fit h-fit ml-auto text-5xl text-white font-aust flex items-center justify-center">
            {relatedData?.microbrand?.microbrand}
          </div>
          <div
            className="relative w-fit h-fit gap-1 flex items-center justify-center flex-row"
            onClick={() =>
              router.push(
                `/autograph/${itemData?.handle?.suggestedFormatted?.localName?.split(
                  "@"
                )}`
              )
            }
          >
            <div
              className="relative w-5 h-5 ml-auto text-base text-white font-aust flex items-center rounded-full justify-center"
              id="pfp"
            >
              {profilePicture && (
                <Image
                  layout="fill"
                  src={profilePicture}
                  draggable={false}
                  objectFit="cover"
                  className="rounded-full"
                  onError={(e) => handleImageError(e)}
                />
              )}
            </div>
            <div className="relative w-fit h-fit ml-auto text-base text-white font-aust flex items-center justify-center">
              {itemData?.handle?.suggestedFormatted?.localName}
            </div>
          </div>
        </div>
      </div>
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="relative flex gap-2 items-start justify-center w-full h-[40rem] overflow-y-scroll">
          <div className="relative flex items-start justify-center flex-wrap gap-4">
            {relatedData?.collections?.map(
              (item: CreationType, index: number) => {
                return (
                  <Creation
                    lensConnected={lensConnected}
                    dispatch={dispatch}
                    cartItems={cartItems}
                    key={index}
                    followProfile={followProfile}
                    unfollowProfile={unfollowProfile}
                    followLoading={followLoading}
                    profileHovers={profileHovers}
                    setProfileHovers={setProfileHovers}
                    mirror={mirror}
                    like={like}
                    openMirrorChoice={openMirrorChoice}
                    setOpenMirrorChoice={setOpenMirrorChoice}
                    interactionsLoading={interactionsLoading?.[index]}
                    router={router}
                    item={item}
                    index={index}
                    created={true}
                    openInteractions={openInteractions}
                    setOpenInteractions={setOpenInteractions}
                  />
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Microbrand;

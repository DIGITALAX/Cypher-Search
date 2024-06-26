import { FunctionComponent } from "react";
import { CommunityProps, Creation } from "../../types/tiles.types";
import { Profile } from "../../../../../graphql/generated";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import HoverProfile from "@/components/Common/modules/HoverProfile";
import createProfilePicture from "../../../../../lib/helpers/createProfilePicture";
import handleImageError from "../../../../../lib/helpers/handleImageError";

const Community: FunctionComponent<CommunityProps> = ({
  community,
  router,
  index,
  profileHovers,
  setProfileHovers,
  unfollowProfile,
  followProfile,
  followLoading,
  dispatch,
  lensConnected,
}): JSX.Element => {
  return (
    <div
      className="relative w-full h-fit flex items-center justify-center flex flex-col rounded-sm border border-sol bg-black gap-4 p-2"
      id={community?.communityMetadata?.cover}
    >
      <div className="relative w-fit h-fit gap-1 flex items-center justify-center flex-col">
        <div className="relative w-fit h-fit flex items-center justify-center text-white font-bit text-xl">
          {community?.communityMetadata?.name}
        </div>
        <div className="absolute top-1 w-fit h-fit flex items-center justify-center text-sol opacity-50 font-bit text-xl">
          {community?.communityMetadata?.name}
        </div>
        <div className="relative w-fit h-fit flex items-center justify-center text-white font-bit text-xs">
          {community?.communityMetadata?.subTopic}
        </div>
      </div>
      <div className="relative w-4/5 h-20  p-2 text-white text-center font-bit text-sm border border-[#1B4986] bg-fuego">
        <div className="relative w-full h-full flex items-start justify-center overflow-y-scroll break-all">
          {community?.communityMetadata?.description}
        </div>
      </div>
      <div className="relative w-full h-fit flex flex-row gap-4 justify-between items-center">
        <div className="relative w-fit h-fit text-white font-bit  text-xs flex items-center justify-center text-center">
          active <br /> members
        </div>
        <div className="relative w-full h-fit flex items-center justify-start overflow-x-scroll py-3">
          <div className="relative w-fit h-fit flex items-center justify-start flex-row gap-3">
            {community?.members?.map((member: Profile, index: number) => {
              const profilePicture = createProfilePicture(
                member?.metadata?.picture
              );
              return (
                <div
                  key={index}
                  className="relative w-14 h-14 rounded-full border border-white p-1 flex items-center justify-center cursor-pointer"
                  onClick={() =>
                    router.push(
                      `/autograph/${
                        member?.handle?.suggestedFormatted?.localName?.split(
                          "@"
                        )[1]
                      }`
                    )
                  }
                >
                  <div
                    className="relative w-full h-full rounded-full flex items-center justify-center"
                    id="pfp"
                  >
                    {profilePicture && (
                      <Image
                        className="rounded-full"
                        layout="fill"
                        objectFit="cover"
                        src={profilePicture}
                        onError={(e) => handleImageError(e)}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="relative w-full h-fit flex flex-row gap-3 items-center justify-between">
        <div className="relative w-fit h-fit flex items-center justify-center text-white font-bit">
          Most <br /> {`Recent >`}
        </div>
        <div className="relative w-fit h-fit flex items-center justify-center flex-row gap-3">
          {[
            "QmQSwGsGFnea8mq7FYTBGaFScNBwaUUm5dpTe9WfpMsWuW",
            "QmZ4bBiWL3rAovzNPubpX37PtJCFyDZJojmY5FJkqyyfwe",
            "QmdxWUz1C8jv7CP53AeDtjj5UZFi9ojP18UxNGkJSNGKt3",
            "QmQGr3LYUC9wnQye6cHaT9qEkMsH4CJDKiqsEGrKps2gHT",
          ]?.map((image: string, index: number) => {
            return (
              <div
                key={index}
                className="relative w-8 h-8 cursor-pointer active:scale-95"
              >
                <Image
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/${image}`}
                  draggable={false}
                  onError={(e) => handleImageError(e)}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="relative w-full h-fit flex items-center justify-start overflow-x-scroll py-3">
        <div className="relative w-fit h-fit flex items-center justify-start flex-row gap-3">
          {community?.sample?.map((item: Creation, index: number) => {
            const profilePicture = createProfilePicture(
              item?.profile?.metadata?.picture
            );
            return (
              <div
                className="relative w-60 h-60 border border-white rounded-sm"
                key={index}
              >
                <Image
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/${item?.collectionMetadata?.images?.[0]}`}
                  draggable={false}
                  objectFit="cover"
                  onError={(e) => handleImageError(e)}
                />

                <div
                  className="absolute bottom-2 left-2 border border-fuera rounded-full items-center justify-center flex flex-row gap-2"
                  id="mold"
                >
                  <div
                    className="relative flex items-center justify-center rounded-full w-9 h-9 cursor-pointer"
                    id="pfp"
                    onMouseEnter={() =>
                      setProfileHovers((prev) => {
                        const updatedArray = [...prev];
                        updatedArray[index] = true;
                        return updatedArray;
                      })
                    }
                  >
                    {profilePicture && (
                      <Image
                        layout="fill"
                        src={profilePicture}
                        draggable={false}
                        className="rounded-full"
                        objectFit="cover"
                        onError={(e) => handleImageError(e)}
                      />
                    )}
                  </div>
                  {profileHovers?.[index] && (
                    <HoverProfile
                      followLoading={followLoading}
                      followProfile={followProfile}
                      unfollowProfile={unfollowProfile}
                      router={router}
                      publication={item?.profile}
                      index={index}
                      setProfileHovers={setProfileHovers}
                      feed
                      dispatch={dispatch}
                      lensConnected={lensConnected}
                      parentId={community?.communityMetadata?.cover}
                      top={"auto"}
                      bottom={"2px"}
                      left={"auto"}
                      right={"2px"}
                    />
                  )}
                  <div className="relative w-fit h-fit text-white font-bit items-center justify-center flex top-px text-xs px-2 py-1">
                    {item?.profile?.handle?.localName}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative w-full h-fit flex flex-row gap-2 justify-start items-center">
        <div
          className="relative w-10 h-10 cursor-pointer active:scale-95"
          onClick={() =>
            router.push(`/item/community/${community?.communityMetadata?.name}`)
          }
        >
          <Image
            layout="fill"
            src={`${INFURA_GATEWAY}/ipfs/Qmen1nb9RXZBtWTgZ1wRbSuqACqxceU2D7sxx1sSSnQ5Tq`}
            draggable={false}
          />
        </div>
        <div className="relative w-fit text-xs h-fit font-bit text-white flex items-center justify-center top-px">
          find <br /> more
        </div>
      </div>
    </div>
  );
};

export default Community;

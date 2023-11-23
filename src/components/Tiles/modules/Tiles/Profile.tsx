import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import { ProfileProps } from "../../types/tiles.types";
import HoverProfile from "@/components/Common/modules/HoverProfile";
import Stats from "@/components/Common/modules/Stats";
import createProfilePicture from "../../../../../lib/helpers/createProfilePicture";

const Profile: FunctionComponent<ProfileProps> = ({
  layoutAmount,
  router,
  publication,
  followProfile,
  unfollowProfile,
  followLoading,
  index,
  profileHovers,
  setProfileHovers,
  dispatch,
  lensConnected,
}): JSX.Element => {
  const profilePicture = createProfilePicture(publication?.metadata?.picture);
  const cover = createProfilePicture(publication?.metadata?.coverPicture);
  return (
    <div
      className="relative w-full h-fit flex items-center justify-center flex flex-row rounded-sm border border-sol p-4 gap-4"
      id={publication?.ownedBy?.address}
    >
      <div className="relative p-2 rounded-sm border border-pez w-full h-20 flex-row gap-6 items-center justify-start flex">
        <div
          className="absolute w-full h-full opacity-20 flex top-0 left-0"
          id="preroll"
        >
          {cover && (
            <Image
              layout="fill"
              src={cover}
              objectFit="cover"
              className="rounded-sm"
              draggable={false}
            />
          )}
        </div>
        <div
          className="relative flex flex-row gap-4 w-10 h-10 items-center justify-start rounded-full border border-offWhite cursor-pointer"
          id="pfp"
          onClick={() => {
            setProfileHovers((prev) => {
              const updatedArray = [...prev];
              updatedArray[index] = false;
              return updatedArray;
            });
            router.push(
              `/autograph/${
                publication?.handle?.suggestedFormatted?.localName?.split(
                  "@"
                )[1]
              }`
            );
          }}
          onMouseEnter={() => {
            const updatedArray = [...profileHovers];
            updatedArray[index] = true;
            setProfileHovers(updatedArray);
          }}
        >
          {profilePicture && (
            <Image
              layout="fill"
              draggable={false}
              src={profilePicture}
              objectFit="cover"
              className="rounded-full"
            />
          )}
        </div>
        {profileHovers?.[index] && (
          <HoverProfile
            followLoading={followLoading}
            followProfile={followProfile}
            unfollowProfile={unfollowProfile}
            router={router}
            publication={publication}
            index={index}
            setProfileHovers={setProfileHovers}
            dispatch={dispatch}
            lensConnected={lensConnected}
            parentId={publication?.ownedBy?.address}
            top={"10px"}
            bottom={"auto"}
            left={"2px"}
            right={"auto"}
          />
        )}
        <div
          className={`relative text-pez font-bit uppercase relative w-fit h-fit flex ${
            layoutAmount === 4 ? "text-xs" : "text-sm"
          }`}
        >
          {publication?.handle?.suggestedFormatted?.localName}
        </div>
      </div>
      <Stats dispatch={dispatch} profile={publication} />
    </div>
  );
};

export default Profile;

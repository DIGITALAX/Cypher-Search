import handleImageError from "@/app/lib/helpers/handleImageError";
import { ModalContext } from "@/app/providers";
import Image from "next/legacy/image";
import { useRouter } from "next/navigation";
import { FunctionComponent, JSX, useContext, useState } from "react";
import HoverProfile from "./HoverProfile";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";
import { ProfileProps } from "../types/tiles.types";
import Stats from "./Stats";

const Profile: FunctionComponent<ProfileProps> = ({
  dict,
  profile,
  index,
}): JSX.Element => {
  const context = useContext(ModalContext);
  const router = useRouter();
  const [profileHover, setProfileHover] = useState<boolean>(false);

  return (
    <div
      className={`relative w-full h-fit flex items-center justify-center flex rounded-sm border border-sol p-4 gap-4 ${
        context?.layoutSwitch === 4 ? "flex-col" : "flex-col xl:flex-row"
      }`}
      id={`${profile?.address}${index}`}
    >
      <div className="relative p-2 rounded-sm border border-pez w-full h-20 flex-row gap-6 items-center justify-start flex">
        <div
          className="absolute w-full h-full opacity-20 flex top-0 left-0"
          id="preroll"
        >
          <Image
            layout="fill"
            src={handleProfilePicture(profile?.metadata?.coverPicture)}
            objectFit="cover"
            key={profile?.metadata?.picture}
            className="rounded-sm"
            draggable={false}
            onError={(e) => handleImageError(e)}
          />
        </div>
        <div
          className="relative flex flex-row gap-4 w-10 h-10 items-center justify-start rounded-full border border-offWhite cursor-pointer"
          id="pfp"
          onClick={() => {
            context?.setFiltersOpen({ value: false, allow: false });
            setProfileHover(false);
            router.push(`/autograph/${profile?.username?.localName}`);
          }}
          onMouseEnter={() => setProfileHover(true)}
        >
          <Image
            layout="fill"
            draggable={false}
            src={handleProfilePicture(profile?.metadata?.picture)}
            objectFit="cover"
            key={profile?.metadata?.picture}
            className="rounded-full"
            onError={(e) => handleImageError(e)}
          />
        </div>
        {profileHover && (
          <HoverProfile
            dict={dict}
            publication={profile}
            setProfileHover={setProfileHover}
            parentId={`${profile?.address}${index}`}
            top={"10px"}
            bottom={"auto"}
            left={"2px"}
            right={"auto"}
          />
        )}
        <div
          className={`relative text-pez font-bit uppercase relative w-fit h-fit flex ${
            context?.layoutSwitch === 4 ? "text-xs" : "text-xs tablet:text-sm"
          }`}
        >
          {profile?.username?.value}
        </div>
      </div>
      <Stats profile={profile} dict={dict} />
    </div>
  );
};

export default Profile;

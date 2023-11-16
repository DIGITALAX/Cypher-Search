import { useState } from "react";
import getProfile from "../../../../graphql/lens/queries/profile";
import { Profile } from "../../../../graphql/generated";

const useAutograph = () => {
  const [profile, setProfile] = useState<Profile | undefined>();
  const [profileLoading, setProfileLoading] = useState<boolean>(false);

  const getProfileData = async (autograph: string) => {
    setProfileLoading(true);
    try {
      const { data } = await getProfile({
        forHandle: "test/" + autograph,
      });

      if (!data?.profile) {
        setProfileLoading(false);
        return;
      }
      setProfile(data?.profile as Profile);
    } catch (err: any) {
      console.error(err.message);
    }
    setProfileLoading(false);
  };


  return {
    profileLoading,
    getProfileData,
    profile,
  };
};

export default useAutograph;

import { useEffect, useState } from "react";
import getProfile from "../../../../graphql/lens/queries/profile";
import { Profile } from "../../../../graphql/generated";

const useAutograph = (
  autograph: string | undefined,
  lensConnected: Profile | undefined
) => {
  const [profile, setProfile] = useState<Profile | undefined>();
  const [profileLoading, setProfileLoading] = useState<boolean>(false);

  const getProfileData = async (autograph: string) => {
    setProfileLoading(true);
    try {
      const { data } = await getProfile(
        {
          forHandle: "lens/" + autograph,
        },
        lensConnected?.id
      );

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

  useEffect(() => {
    if (autograph && !profile) {
      getProfileData(autograph as string);
    }
  }, [autograph, lensConnected?.id]);

  return {
    profileLoading,
    getProfileData,
    profile,
  };
};

export default useAutograph;

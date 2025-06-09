import { ModalContext } from "@/app/providers";
import { Account } from "@lens-protocol/client";
import { fetchAccount, fetchAccountStats } from "@lens-protocol/client/actions";
import { useContext, useEffect, useState } from "react";

const useAutograph = (autograph: string | undefined) => {
  const context = useContext(ModalContext);
  const [profile, setProfile] = useState<
    | (Account & {
        following: number;
        followers: number;
      })
    | undefined
  >();
  const [profileLoading, setProfileLoading] = useState<boolean>(true);

  const getProfile = async (autograph: string) => {
    try {
      const res = await fetchAccount(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          username: {
            localName: autograph,
          },
        }
      );

      if (res?.isOk()) {
        const stats = await fetchAccountStats(
          context?.lensConectado?.sessionClient ?? context?.clienteLens!,
          {
            account: res?.value?.address,
          }
        );

        if (stats?.isOk()) {
          setProfile({
            ...(res?.value as Account),
            followers: Number(stats?.value?.graphFollowStats?.followers),
            following: Number(stats?.value?.graphFollowStats?.following),
          });
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setProfileLoading(false);
  };

  useEffect(() => {
    if (
      autograph &&
      !profile &&
      (context?.clienteLens || context?.lensConectado?.sessionClient)
    ) {
      getProfile(autograph as string);
    }
  }, [autograph, context?.clienteLens, context?.lensConectado?.sessionClient]);

  return {
    profileLoading,
    profile,
  };
};

export default useAutograph;

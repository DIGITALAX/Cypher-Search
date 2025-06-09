import { ModalContext } from "@/app/providers";
import { Account, AccountStats } from "@lens-protocol/client";
import { fetchAccountStats } from "@lens-protocol/client/actions";
import { useContext, useEffect, useState } from "react";

const useProfile = (profile: Account) => {
  const context = useContext(ModalContext);
  const [stats, setStats] = useState<AccountStats>();

  const fetchStats = async () => {
    try {
      const res = await fetchAccountStats(context?.clienteLens!, {
        account: profile?.address,
      });

      if (res?.isOk()) {
        setStats(res?.value as AccountStats);
      }
    } catch (err: any) {
      console.error(err?.message);
    }
  };

  useEffect(() => {
    if (!stats && profile && context?.clienteLens) {
      fetchStats();
    }
  }, [profile, context?.clienteLens]);

  return { stats };
};

export default useProfile;

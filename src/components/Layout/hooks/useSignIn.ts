import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAccount } from "wagmi";
import { setWalletConnected } from "../../../../redux/reducers/walletConnectedSlice";

const useSignIn = () => {
  const { isConnected, address } = useAccount();
  const dispatch = useDispatch();
  const [openAccount, setOpenAccount] = useState<boolean>(false);
  const [signInLoading, setSignInLoading] = useState<boolean>(false);

  useEffect(() => {
    dispatch(setWalletConnected(isConnected));
  }, [isConnected, address]);

  const handleLensConnect = async () => {
    setSignInLoading(true);
    try {
    } catch (err: any) {
      console.error(err.message);
    }
    setSignInLoading(false);
  };

  return {
    handleLensConnect,
    openAccount,
    setOpenAccount,
    signInLoading,
  };
};

export default useSignIn;

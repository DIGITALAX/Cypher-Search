import { useEffect, useState } from "react";
import { useSignMessage } from "wagmi";
import { setWalletConnected } from "../../../../redux/reducers/walletConnectedSlice";
import { setLensConnected } from "../../../../redux/reducers/lensConnectedSlice";
import generateChallenge from "../../../../graphql/lens/queries/challenge";
import PrintAccessControlAbi from "./../../../../abis/PrintAccessControl.json";
import {
  getAuthenticationToken,
  getCypherStorageCart,
  isAuthExpired,
  refreshAuth,
  removeAuthenticationToken,
  setAuthenticationToken,
} from "../../../../lib/utils";
import { Profile } from "../../../../graphql/generated";
import authenticate from "../../../../graphql/lens/mutations/authenticate";
import getDefaultProfile from "../../../../graphql/lens/queries/default";
import { Dispatch } from "redux";
import { getOracleData } from "../../../../graphql/subgraph/queries/getOracleData";
import { OracleData } from "@/components/Checkout/types/checkout.types";
import { setOracleData } from "../../../../redux/reducers/oracleDataSlice";
import { CartItem } from "@/components/Common/types/common.types";
import { setCartItems } from "../../../../redux/reducers/cartItemsSlice";
import { PublicClient } from "viem";
import { PRINT_ACCESS_CONTROL } from "../../../../lib/constants";
import { setIsDesigner } from "../../../../redux/reducers/isDesignerSlice";
import { setCartAnim } from "../../../../redux/reducers/cartAnimSlice";

const useSignIn = (
  publicClient: PublicClient,
  address: `0x${string}` | undefined,
  isConnected: boolean,
  dispatch: Dispatch,
  oracleData: OracleData[],
  cartItems: CartItem[],
  lensConnected: Profile | undefined,
  cartAnim: boolean,
  openAccountModal: (() => void) | undefined
) => {
  const { signMessageAsync } = useSignMessage();
  const [openAccount, setOpenAccount] = useState<boolean>(false);
  const [signInLoading, setSignInLoading] = useState<boolean>(false);
  const [cartListOpen, setCartListOpen] = useState<boolean>(false);

  const handleLensConnect = async () => {
    setSignInLoading(true);
    try {
      // await createProfile({
      //   handle: "emmaja",
      //   to: address,
      // });

      const profile = await getDefaultProfile(
        {
          for: address,
        },
        lensConnected?.id
      );
      const challengeResponse = await generateChallenge({
        for: profile?.data?.defaultProfile?.id,
        signedBy: address,
      });
      const signature = await signMessageAsync({
        message: challengeResponse.data?.challenge.text!,
      });
      const accessTokens = await authenticate({
        id: challengeResponse.data?.challenge.id,
        signature: signature,
      });
      if (accessTokens) {
        setAuthenticationToken({ token: accessTokens.data?.authenticate! });
        dispatch(setLensConnected(profile?.data?.defaultProfile as Profile));
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setSignInLoading(false);
  };

  const handleRefreshProfile = async (): Promise<void> => {
    try {
      const profile = await getDefaultProfile(
        {
          for: address,
        },
        lensConnected?.id
      );
      if (profile?.data?.defaultProfile) {
        dispatch(setLensConnected(profile?.data?.defaultProfile as Profile));
      } else {
        removeAuthenticationToken();
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    const handleAuthentication = async () => {
      const token = getAuthenticationToken();
      if (isConnected && !token) {
        dispatch(setLensConnected(undefined));
        removeAuthenticationToken();
      } else if (isConnected && token) {
        if (isAuthExpired(token?.exp)) {
          const refreshedAccessToken = await refreshAuth();
          if (!refreshedAccessToken) {
            removeAuthenticationToken();
          }
        }
        await handleRefreshProfile();
      }
    };

    handleAuthentication();
    dispatch(setWalletConnected(isConnected));
  }, [isConnected, address]);

  const handleOracles = async (): Promise<void> => {
    try {
      const data = await getOracleData();

      dispatch(setOracleData(data?.data?.currencyAddeds));
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleIsCreator = async () => {
    if (!address) return;
    try {
      const data = await publicClient.readContract({
        address: PRINT_ACCESS_CONTROL,
        abi: PrintAccessControlAbi,
        functionName: "isDesigner",
        args: [address as `0x${string}`],
      });

      if (data) {
        dispatch(setIsDesigner(data as boolean));
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const refetchCart = () => {
    const data = getCypherStorageCart();
    if (data && data?.length > 0) {
      dispatch(setCartItems(data));
    }
  };

  const handleLogout = () => {
    if (openAccountModal) {
      openAccountModal();
    }
    dispatch(setLensConnected(undefined));
    removeAuthenticationToken();

    setOpenAccount(false);
  };

  useEffect(() => {
    if (!oracleData || oracleData?.length < 1) {
      handleOracles();
    }

    if (cartItems?.length < 1) {
      refetchCart();
    }

    if (!lensConnected?.id) {
      handleIsCreator();
    }
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (cartAnim) {
      timeoutId = setTimeout(() => {
        dispatch(setCartAnim(false));
      }, 1000);
    }

    return () => timeoutId && clearTimeout(timeoutId);
  }, [cartAnim]);

  useEffect(() => {
    if (!isConnected) {
      dispatch(setLensConnected(undefined));
    }
  }, [isConnected]);

  return {
    handleLensConnect,
    openAccount,
    setOpenAccount,
    signInLoading,
    cartListOpen,
    setCartListOpen,
    handleLogout,
  };
};

export default useSignIn;

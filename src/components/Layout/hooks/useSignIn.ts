import { useEffect, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { setWalletConnected } from "../../../../redux/reducers/walletConnectedSlice";
import { setLensConnected } from "../../../../redux/reducers/lensConnectedSlice";
import getProfiles from "../../../../graphql/lens/queries/profiles";
import generateChallenge from "../../../../graphql/lens/queries/challenge";
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

const useSignIn = (
  dispatch: Dispatch,
  oracleData: OracleData[],
  cartItems: CartItem[]
) => {
  const { isConnected, address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [openAccount, setOpenAccount] = useState<boolean>(false);
  const [signInLoading, setSignInLoading] = useState<boolean>(false);
  const [cartListOpen, setCartListOpen] = useState<boolean>(false);

  const handleLensConnect = async () => {
    setSignInLoading(true);
    try {
      const profile = await getDefaultProfile({
        for: address,
      });
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
      const profile = await getProfiles({
        where: {
          ownedBy: [address],
        },
      });
      if (profile?.data?.profiles?.items?.length !== null) {
        dispatch(
          setLensConnected(
            profile?.data?.profiles?.items?.[
              profile?.data?.profiles?.items?.length - 1
            ] as Profile
          )
        );
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

  const refetchCart = () => {
    const data = getCypherStorageCart();
    if (data && data?.length > 0) {
      dispatch(setCartItems(data));
    }
  };

  useEffect(() => {
    if (!oracleData) {
      handleOracles();
    }

    if (cartItems?.length < 1) {
      refetchCart();
    }
  }, []);

  return {
    handleLensConnect,
    openAccount,
    setOpenAccount,
    signInLoading,
    cartListOpen,
    setCartListOpen,
  };
};

export default useSignIn;

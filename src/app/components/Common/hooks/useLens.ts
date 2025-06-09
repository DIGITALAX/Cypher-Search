import { evmAddress } from "@lens-protocol/client";
import {
  fetchAccountsAvailable,
  revokeAuthentication,
} from "@lens-protocol/client/actions";
import { useContext, useEffect, useState } from "react";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { chains } from "@lens-chain/sdk/viem";
import { ModalContext } from "@/app/providers";
import { getOracleData } from "../../../../../graphql/queries/getOracleData";
import { usePathname, useRouter } from "next/navigation";
import { PRINT_ACCESS_CONTROL, TAGS } from "@/app/lib/constants";
import PrintAccessControlAbi from "./../../../../../abis/PrintAccessControlAbi.json";
import fetchIPFSJSON from "@/app/lib/helpers/fetchIpfsJson";
import { FilterValues } from "../types/common.types";
import {
  aggregateMicrobrands,
  aggregateUniqueValues,
} from "@/app/lib/helpers/aggregators";
import { getFilters } from "../../../../../graphql/queries/getFilters";
import { getCypherStorageCart } from "@/app/lib/utils";

const useLens = (
  isConnected: boolean,
  address: `0x${string}` | undefined,
  dict: any
) => {
  const contexto = useContext(ModalContext);
  const router = useRouter();
  const path = usePathname();
  const publicClient = createPublicClient({
    chain: chains.mainnet,
    transport: http("https://rpc.lens.xyz"),
  });

  const [lensCargando, setLensCargando] = useState<boolean>(false);
  const [openAccount, setOpenAccount] = useState<boolean>(false);
  const [cartListOpen, setCartListOpen] = useState<boolean>(false);

  const changeLanguage = () => {
    const segments = path.split("/");
    segments[1] = path.includes("/en/") ? "es" : "en";
    const newPath = segments.join("/");

    document.cookie = `NEXT_LOCALE=${
      path.includes("/en/") ? "es" : "en"
    }; path=/; SameSite=Lax`;

    router.push(newPath);
  };

  const resumeLensSession = async () => {
    try {
      const resumed = await contexto?.clienteLens?.resumeSession();

      if (resumed?.isOk()) {
        const accounts = await fetchAccountsAvailable(contexto?.clienteLens!, {
          managedBy: evmAddress(address!),
          includeOwned: true,
        });

        if (accounts.isErr()) {
          return;
        }

        contexto?.setLensConectado?.({
          profile: accounts.value.items?.[0]?.account,
          sessionClient: resumed?.value,
        });
      }
    } catch (err) {
      console.error("Error al reanudar la sesión:", err);
      return null;
    }
  };

  useEffect(() => {
    if (contexto?.clienteLens && address && !contexto?.lensConectado?.profile) {
      resumeLensSession();
    }
  }, [address, contexto?.clienteLens]);

  const handleConectarse = async () => {
    if (!address || !contexto?.clienteLens) return;
    setLensCargando(true);
    setOpenAccount(false);
    try {
      const signer = createWalletClient({
        chain: chains.mainnet,
        transport: custom(window.ethereum!),
        account: address,
      });
      const accounts = await fetchAccountsAvailable(contexto?.clienteLens, {
        managedBy: evmAddress(signer.account.address),
        includeOwned: true,
      });

      if (accounts.isErr()) {
        setLensCargando(false);
        return;
      }
      if (accounts.value.items?.[0]?.account?.address) {
        const authenticated = await contexto?.clienteLens?.login({
          accountOwner: {
            account: evmAddress(accounts.value.items?.[0]?.account?.address),
            owner: signer.account?.address?.toLowerCase(),
          },
          signMessage: (message) => signer.signMessage({ message }),
        });

        if (authenticated.isErr()) {
          console.error(authenticated.error);
          contexto?.setModalOpen?.(dict.error);
          setLensCargando(false);
          return;
        }

        const sessionClient = authenticated.value;

        contexto?.setLensConectado?.({
          sessionClient,
          profile: accounts.value.items?.[0]?.account,
        });
      } else {
        const authenticatedOnboarding = await contexto?.clienteLens.login({
          onboardingUser: {
            wallet: signer.account.address,
          },
          signMessage: (message) => signer.signMessage({ message }),
        });

        if (authenticatedOnboarding.isErr()) {
          console.error(authenticatedOnboarding.error);
          contexto?.setModalOpen?.(dict.error);

          setLensCargando(false);
          return;
        }

        const sessionClient = authenticatedOnboarding.value;

        contexto?.setLensConectado?.({
          sessionClient,
        });

        contexto?.setCrearCuenta?.(true);
      }
    } catch (err: any) {
      console.error(err.message);
    }

    setLensCargando(false);
  };

  const salir = async () => {
    setLensCargando(true);
    try {
      const auth =
        contexto?.lensConectado?.sessionClient?.getAuthenticatedUser();

      if (auth?.isOk()) {
        await revokeAuthentication(contexto?.lensConectado?.sessionClient!, {
          authenticationId: auth.value?.authenticationId,
        });

        contexto?.setLensConectado?.(undefined);
        window.localStorage.removeItem("lens.mainnet.credentials");
      }

      setOpenAccount(false);
    } catch (err: any) {
      console.error(err.message);
    }
    setLensCargando(false);
  };

  const handleOracles = async (): Promise<void> => {
    try {
      const data = await getOracleData();
      contexto?.setOracleData(data?.data?.currencyAddeds);
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
        contexto?.setIsDesigner(data as boolean);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getFilterValues = async (): Promise<
    | {
        microbrands: string[][];
        dropsSuggested: string[];
        hashtags: string[];
      }
    | undefined
  > => {
    try {
      const data = await getFilters();

      return {
        microbrands: aggregateMicrobrands(data?.data?.collectionCreateds),
        dropsSuggested: aggregateUniqueValues(
          data?.data?.collectionCreateds,
          "title"
        ),
        hashtags: aggregateUniqueValues(
          [...data?.data?.collectionCreateds, ...TAGS],
          "tags"
        ),
      };
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleFilterConstants = async () => {
    try {
      const json: FilterValues = await fetchIPFSJSON(
        "QmVbGLh8YgHV1pPmZiPEZuE52qGWSYR8KaBAy1oReLVqm1"
      );

      const data = await getFilterValues();
      const filters: FilterValues = {
        ...json,
        microbrands: data?.microbrands!,
        hashtags: (data?.hashtags! || [])?.sort(() => Math.random() - 0.5),
        dropsSuggested: data?.dropsSuggested!,
      };

      contexto?.setFilterConstants(filters);
      contexto?.setFilterDropDown((prev) => ({
        ...prev,
        values: filters,
      }));
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const refetchCart = () => {
    const data = getCypherStorageCart();
    if (data && data?.length > 0) {
      contexto?.setCartItems(data);
    }
  };

  useEffect(() => {
    if (!contexto?.filterConstants) {
      handleFilterConstants();
    }
  }, []);

  useEffect(() => {
    if (
      !isConnected &&
      contexto?.lensConectado?.profile &&
      contexto?.clienteLens
    ) {
      salir();
    }
  }, [isConnected]);

  useEffect(() => {
    if (Number(contexto?.oracleData?.length) < 1) {
      handleOracles();
    }

    if (Number(contexto?.cartItems?.length) < 1) {
      refetchCart();
    }
  }, []);

  useEffect(() => {
    if (address) {
      handleIsCreator();
    }
  }, [address]);

  return {
    lensCargando,
    salir,
    handleConectarse,
    cartListOpen,
    setCartListOpen,
    openAccount,
    setOpenAccount,
    changeLanguage,
  };
};

export default useLens;

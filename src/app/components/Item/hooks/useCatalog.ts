import {
  ACCEPTED_TOKENS,
  AUTOGRAPH_MARKET,
  DIGITALAX_ADDRESS,
} from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import { chains } from "@lens-chain/sdk/viem";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { createPublicClient, createWalletClient, custom } from "viem";
import { http, useAccount } from "wagmi";
import {
  AutographCollection,
  AutographType,
  Catalogo,
} from "../../Common/types/common.types";
import { PurchaseDetails } from "../types/items.type";
import findBalance from "@/app/lib/helpers/findBalance";
import { Indexar } from "../../Search/types/search.types";
import { ethers } from "ethers";
import {
  checkAndSignAuthMessage,
  LitNodeClient,
  uint8arrayFromString,
} from "@lit-protocol/lit-node-client";
import { LIT_NETWORK } from "@lit-protocol/constants";
import { AccessControlConditions } from "@lit-protocol/types";
import MarketAbi from "./../../../../../abis/AutographMarketAbi.json";

const useCatalog = (
  item: {
    post: AutographCollection | Catalogo;
    type: string;
  },
  dict: any
) => {
  const context = useContext(ModalContext);
  const publicClient = createPublicClient({
    chain: chains.mainnet,
    transport: http("https://rpc.lens.xyz"),
  });
  const litClientRef = useRef<LitNodeClient | null>(null);
  const { address } = useAccount();
  const path = usePathname();
  const [instantLoading, setInstantLoading] = useState<boolean>(false);
  const [isApprovedSpend, setIsApprovedSpend] = useState<boolean>(false);
  const [purchaseDetails, setPurchaseDetails] = useState<PurchaseDetails>({
    color: "",
    currency: item?.post?.tokenes?.[0] as string,
    size: "",
    imageIndex: 0,
    address: "",
    zip: "",
    city: "",
    state: "",
    country: "",
  });

  const handleInstantPurchase = async () => {
    setInstantLoading(true);
    try {
      const balance = await findBalance(
        publicClient,
        purchaseDetails?.currency,
        address as `0x${string}`
      );

      if (
        Number(balance) <
        ((Number(item?.post?.precio) * 10 ** 18) /
          Number(
            context?.oracleData?.find(
              (oracle) =>
                oracle.currency?.toLowerCase() ===
                purchaseDetails?.currency?.toLowerCase()
            )?.rate
          )) *
          10 ** 18
      ) {
        context?.setModalOpen(dict?.poc);

        setInstantLoading(false);
        return;
      }

      let fulfillment: string | undefined = "";
      if (item?.post?.tipo !== AutographType.NFT) {
        fulfillment = await encryptFulfillment();
        if (!fulfillment) {
          setInstantLoading(false);
          return;
        }
      }

      const clientWallet = createWalletClient({
        chain: chains.mainnet,
        transport: custom((window as any).ethereum),
      });

      const { request } = await publicClient.simulateContract({
        address: AUTOGRAPH_MARKET,
        abi: MarketAbi,
        functionName: "buyTokens",
        chain: chains.mainnet,
        args: [
          [purchaseDetails?.currency],
          [(item?.post as AutographCollection)?.coleccionId],
          1,
          fulfillment,
        ],
        account: address,
      });

      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash: res });

      context?.setIndexar(Indexar.Success);
      context?.setSuccessCheckout(true);
    } catch (err: any) {
      console.error(err.messgae);
    }

    setInstantLoading(false);
  };

  const encryptFulfillment = async () => {
    if (
      !address ||
      purchaseDetails?.address?.trim() === "" ||
      purchaseDetails?.city?.trim() === "" ||
      purchaseDetails?.state?.trim() === "" ||
      purchaseDetails?.zip?.trim() === "" ||
      purchaseDetails?.country?.trim() === ""
    )
      return;
    try {
      let nonce = await litClientRef.current?.getLatestBlockhash();
      await checkAndSignAuthMessage({
        chain: "polygon",
        nonce: nonce!,
      });
      await litClientRef.current?.connect();

      const accessControlConditions = [
        {
          contractAddress: "",
          standardContractType: "",
          chain: "polygon",
          method: "",
          parameters: [":userAddress"],
          returnValueTest: {
            comparator: "=",
            value: address.toLowerCase(),
          },
        },
        {
          operator: "or",
        },
        {
          contractAddress: "",
          standardContractType: "",
          chain: "polygon",
          method: "",
          parameters: [":userAddress"],
          returnValueTest: {
            comparator: "=",
            value: DIGITALAX_ADDRESS?.toLowerCase() as string,
          },
        },
      ] as AccessControlConditions;

      const { ciphertext, dataToEncryptHash } =
        await litClientRef.current!?.encrypt({
          accessControlConditions,
          dataToEncrypt: uint8arrayFromString(
            JSON.stringify({
              nombre: context?.lensConectado?.profile?.username?.localName,
              account: context?.lensConectado?.profile?.address,
              direccion: purchaseDetails?.address,
              zip: purchaseDetails?.zip,
              ciudad: purchaseDetails?.city,
              estado: purchaseDetails?.state,
              pais: purchaseDetails?.country,
              elementos: [
                {
                  id: (item?.post as AutographCollection)?.coleccionId || 0,
                  color: purchaseDetails?.color,
                  tamano: purchaseDetails?.size,
                  cantidad: 1,
                  tipo: item?.post?.tipo,
                },
              ],
            })
          ),
        });

      const ipfsRes = await fetch("/api/ipfs", {
        method: "POST",
        headers: {
          contentType: "application/json",
        },
        body: JSON.stringify({
          ciphertext,
          dataToEncryptHash,
          accessControlConditions,
          chain: "polygon",
        }),
      });
      const json = await ipfsRes.json();

      return "ipfs://" + json?.cid;
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const approveSpend = async () => {
    setInstantLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: chains?.mainnet,
        transport: custom((window as any).ethereum),
      });

      const { request } = await publicClient.simulateContract({
        address: purchaseDetails?.currency as `0x${string}`,
        abi: [
          {
            inputs: [
              {
                internalType: "address",
                name: "spender",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "tokens",
                type: "uint256",
              },
            ],
            name: "approve",
            outputs: [{ internalType: "bool", name: "success", type: "bool" }],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        functionName: "approve",
        chain: chains?.mainnet,
        args: [
          AUTOGRAPH_MARKET,
          (((item?.post?.precio * 10 ** 18) /
            Number(
              context?.oracleData?.find(
                (oracle) =>
                  oracle.currency?.toLowerCase() ===
                  purchaseDetails?.currency?.toLowerCase()
              )?.rate
            )) *
            10 ** 18) as any,
        ],
        account: address,
      });
      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash: res });
      setIsApprovedSpend(true);
    } catch (err: any) {
      console.error(err.message);
    }
    setInstantLoading(false);
  };

  const checkApproved = async () => {
    try {
      if (
        purchaseDetails?.currency == "" ||
        !purchaseDetails?.currency ||
        !address
      )
        return;
      const data = await publicClient.readContract({
        address: ACCEPTED_TOKENS.filter(
          (token) =>
            token[2].toLowerCase() === purchaseDetails?.currency?.toLowerCase()
        )?.[0]?.[2] as `0x${string}`,
        abi: [
          {
            inputs: [
              {
                internalType: "address",
                name: "owner",
                type: "address",
              },
              {
                internalType: "address",
                name: "spender",
                type: "address",
              },
            ],
            name: "allowance",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
        ],
        functionName: "allowance",
        args: [address as `0x${string}`, AUTOGRAPH_MARKET],
      });

      if (address) {
        if (
          Number((data as any)?.toString()) /
            Number(
              context?.oracleData?.find(
                (oracle) =>
                  oracle.currency ===
                  ACCEPTED_TOKENS.find(
                    (item) => item[2] === purchaseDetails?.currency
                  )?.[2]
              )?.wei
            ) >=
          (Number(item?.post?.precio) * 10 ** 18) /
            Number(
              context?.oracleData?.find(
                (oracle) =>
                  oracle.currency ===
                  ACCEPTED_TOKENS.find(
                    (item) => item[2] === purchaseDetails?.currency
                  )?.[2]
              )?.rate
            )
        ) {
          setIsApprovedSpend(true);
        } else {
          setIsApprovedSpend(false);
        }
      } else {
        setIsApprovedSpend(false);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (
      context?.lensConectado?.profile &&
      (path.includes("chromadin") ||
        path.includes("listener") ||
        path.includes("coinop") ||
        path.includes("item/f3m")) &&
      context?.oracleData?.length > 0
    ) {
      checkApproved();
    }
  }, [purchaseDetails?.currency, address, context?.oracleData]);

  useEffect(() => {
    if (item && purchaseDetails?.currency == "") {
      setPurchaseDetails((prev) => ({
        ...prev,
        currency: item?.post?.tokenes?.[0] as string,
      }));
    }
  }, [item]);

  useEffect(() => {
    if (typeof window !== "undefined" && !litClientRef.current) {
      import("@lit-protocol/lit-node-client").then(({ LitNodeClient }) => {
        const client = new LitNodeClient({
          litNetwork: LIT_NETWORK.Datil,
          debug: false,
        });

        litClientRef.current = client;
      });
    }
  }, []);

  return {
    purchaseDetails,
    setPurchaseDetails,
    handleInstantPurchase,
    instantLoading,
    approveSpend,
    isApprovedSpend,
  };
};

export default useCatalog;

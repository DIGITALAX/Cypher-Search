import {
  ACCEPTED_TOKENS,
  CHROMADIN_OPEN_ACTION,
  COIN_OP_OPEN_ACTION,
  DIGITALAX_ADDRESS,
  F3M_OPEN_ACTION,
  LISTENER_OPEN_ACTION,
} from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import { chains } from "@lens-chain/sdk/viem";
import { blockchainData } from "@lens-protocol/client";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { createPublicClient, createWalletClient, custom } from "viem";
import { http, useAccount } from "wagmi";
import { Collection } from "../../Common/types/common.types";
import { PurchaseDetails } from "../types/items.type";
import { executePostAction } from "@lens-protocol/client/actions";
import findBalance from "@/app/lib/helpers/findBalance";
import pollResult from "@/app/lib/helpers/pollResult";
import { Indexar } from "../../Search/types/search.types";
import { ethers } from "ethers";
import {
  checkAndSignAuthMessage,
  LitNodeClient,
  uint8arrayFromString,
} from "@lit-protocol/lit-node-client";
import { LIT_NETWORK } from "@lit-protocol/constants";
import { AccessControlConditions } from "@lit-protocol/types";

const useItem = (
  item: {
    post: Collection;
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
  const coder = new ethers.AbiCoder();
  const { address } = useAccount();
  const path = usePathname();
  const [instantLoading, setInstantLoading] = useState<boolean>(false);
  const [isApprovedSpend, setIsApprovedSpend] = useState<boolean>(false);
  const [purchaseDetails, setPurchaseDetails] = useState<PurchaseDetails>({
    color: item?.post?.metadata?.colors?.[0],
    currency: item?.post?.acceptedTokens?.[0],
    size: item?.post?.metadata?.sizes?.[0],
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
        ((Number(item?.post?.price) * 10 ** 18) /
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
      if (item?.post.origin !== "0") {
        fulfillment = await encryptFulfillment();
        if (!fulfillment) {
          setInstantLoading(false);
          return;
        }
      }

      const res = await executePostAction(
        context?.lensConectado?.sessionClient!,
        {
          post: item?.post?.postId,
          action: {
            unknown: {
              address:
                item?.type === "chromadin"
                  ? CHROMADIN_OPEN_ACTION
                  : item?.type === "listener"
                  ? LISTENER_OPEN_ACTION
                  : item?.type === "coinop"
                  ? COIN_OP_OPEN_ACTION
                  : F3M_OPEN_ACTION,
              params: [
                {
                  key: ethers.keccak256(
                    ethers.toUtf8Bytes("lens.param.buyCoinop")
                  ),
                  data: blockchainData(
                    coder.encode(
                      ["string[]", "address[]", "uint256[]", "uint8[]"],
                      [
                        [fulfillment],
                        [purchaseDetails?.currency],
                        [Number(item?.post?.collectionId)],
                        [1],
                      ]
                    )
                  ),
                },
              ],
            },
          },
        }
      );

      if (res.isOk()) {
        if ((res.value as any)?.reason?.includes("Signless")) {
          context?.setSignless?.(true);
        } else if ((res.value as any)?.hash) {
          context?.setIndexar(Indexar.Indexando);
          if (
            await pollResult(
              (res.value as any)?.hash,
              context?.lensConectado?.sessionClient!
            )
          ) {
            context?.setIndexar(Indexar.Success);
            context?.setSuccessCheckout(true);
          } else {
            context?.setModalOpen(dict?.error);
          }

          setTimeout(() => {
            context?.setIndexar(Indexar.Inactive);
          }, 3000);
        }
      }
    } catch (err: any) {
      console.error(err.messgae);
    }

    setInstantLoading(false);
  };

  const encryptFulfillment = async () => {
    if (
      !address ||
      (item?.post?.origin !== "0" &&
        (purchaseDetails?.address?.trim() === "" ||
          purchaseDetails?.city?.trim() === "" ||
          purchaseDetails?.state?.trim() === "" ||
          purchaseDetails?.zip?.trim() === "" ||
          purchaseDetails?.country?.trim() === ""))
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
              address: purchaseDetails?.address,
              state: purchaseDetails?.state,
              country: purchaseDetails?.country,
              city: purchaseDetails?.city,
              zip: purchaseDetails?.zip,
              size: purchaseDetails?.size,
              color: purchaseDetails?.color,
              origin: item?.post?.origin,
              fulfillerAddress: [DIGITALAX_ADDRESS],
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
          item?.type === "chromadin"
            ? CHROMADIN_OPEN_ACTION
            : item?.type === "listener"
            ? LISTENER_OPEN_ACTION
            : item?.type === "coinop"
            ? COIN_OP_OPEN_ACTION
            : F3M_OPEN_ACTION,
          (((Number(item?.post?.price) * 10 ** 18) /
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
        args: [
          address as `0x${string}`,
          item?.type === "chromadin"
            ? CHROMADIN_OPEN_ACTION
            : item?.type === "listener"
            ? LISTENER_OPEN_ACTION
            : item?.type === "coinop"
            ? COIN_OP_OPEN_ACTION
            : F3M_OPEN_ACTION,
        ],
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
          (Number(item?.post?.price) * 10 ** 18) /
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
        currency: item?.post?.acceptedTokens?.[0],
        color: item?.post?.metadata?.colors?.[0]!,
        size: item?.post?.metadata?.sizes?.[0]!,
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

export default useItem;

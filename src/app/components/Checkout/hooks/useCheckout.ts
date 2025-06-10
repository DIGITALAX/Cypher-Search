import { useContext, useEffect, useState } from "react";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { COIN_OP_OPEN_ACTION, DIGITALAX_ADDRESS } from "@/app/lib/constants";
import { useAccount } from "wagmi";
import { PurchaseDetailsCheckout } from "../types/checkout.types";
import findBalance from "@/app/lib/helpers/findBalance";
import { ModalContext } from "@/app/providers";
import { AccessControlConditions } from "@lit-protocol/types";
import {
  LitNodeClient,
  uint8arrayFromString,
} from "@lit-protocol/lit-node-client";
import { ethers } from "ethers";
import { LIT_NETWORK } from "@lit-protocol/constants";
import { chains } from "@lens-chain/sdk/viem";
import { executePostAction } from "@lens-protocol/client/actions";
import { blockchainData } from "@lens-protocol/client";
import { removeCypherStorageCart } from "@/app/lib/utils";
import { useRouter } from "next/navigation";
import { ScreenDisplay } from "../../Autograph/types/autograph.types";
import pollResult from "@/app/lib/helpers/pollResult";
import { Indexar } from "../../Search/types/search.types";

const useCheckout = (dict: any) => {
  const { address } = useAccount();
  const client = new LitNodeClient({
    litNetwork: LIT_NETWORK.Datil,
    debug: false,
    
  });
  const router = useRouter();
  const publicClient = createPublicClient({
    chain: chains.mainnet,
    transport: http("https://rpc.lens.xyz"),
  });
  const coder = new ethers.AbiCoder();
  const context = useContext(ModalContext);
  const [encrypted, setEncrypted] = useState<string[]>([]);
  const [details, setDetails] = useState<PurchaseDetailsCheckout>({
    address: "",
    zip: "",
    city: "",
    state: "",
    country: "",
  });
  const [chooseCartItem, setChooseCartItem] = useState<number>(0);
  const [isApprovedSpend, setIsApprovedSpend] = useState<
    { currency: string; approved: boolean }[]
  >([]);
  const [encryptionLoading, setEncryptionLoading] = useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [collectPostLoading, setCollectPostLoading] = useState<boolean>(false);
  const [approveLoading, setApproveLoading] = useState<
    { currency: string; loading: boolean }[]
  >([]);

  const encryptFulfillment = async () => {
    if (
      !address ||
      details?.address?.trim() === "" ||
      details?.city?.trim() === "" ||
      details?.state?.trim() === "" ||
      details?.zip?.trim() === "" ||
      details?.country?.trim() === ""
    )
      return;
    setEncryptionLoading(true);
    try {
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

      let uploaded: string[] = [];

      for (let i = 0; i < Number(context?.cartItems?.length); i++) {
        if (context?.cartItems?.[i]?.item?.origin == "0") {
          uploaded.push("");
        } else {
          const { ciphertext, dataToEncryptHash } = await client.encrypt({
            accessControlConditions,
            dataToEncrypt: uint8arrayFromString(
              JSON.stringify({
                address: details?.address,
                state: details?.state,
                country: details?.country,
                city: details?.city,
                zip: details?.zip,
                size: context?.cartItems?.[i]?.size,
                color: context?.cartItems?.[i]?.color,
                origin: context?.cartItems?.[i]?.item?.origin,
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
          uploaded.push("ipfs://" + json);
        }
      }
      setEncrypted(uploaded);
    } catch (err: any) {
      console.error(err.message);
    }
    setEncryptionLoading(false);
  };

  const collectItems = async () => {
    if (
      context?.cartItems?.length !== encrypted?.length ||
      !context?.lensConectado?.sessionClient ||
      approveSpend?.length !==
        Array.from(new Set(context?.cartItems?.map((item) => item?.currency)))
          ?.length ||
      context?.oracleData?.length < 1
    )
      return;

    const uniqueCurrencies = Array.from(
      new Set(context?.cartItems?.map((item) => item?.currency))
    );
    setCollectPostLoading(true);
    try {
      await Promise.all(
        uniqueCurrencies?.map(async (moneda) => {
          const balance = await findBalance(
            publicClient,
            moneda,
            address as `0x${string}`
          );

          if (
            Number(balance) <
            (Number(
              context?.cartItems
                ?.flatMap((c) => ({ price: c?.price, amount: c?.buyAmount }))
                ?.reduce(
                  (sum, item) =>
                    sum + Number(item?.price) * Number(item?.amount),
                  0
                )! *
                10 ** 18
            ) /
              Number(
                context?.oracleData?.find(
                  (oracle) =>
                    oracle.currency?.toLowerCase() === moneda?.toLowerCase()
                )?.rate
              )) *
              Number(
                context?.oracleData?.find(
                  (oracle) =>
                    oracle.currency?.toLowerCase() === moneda?.toLowerCase()
                )?.wei
              )
          ) {
            context?.setModalOpen(dict?.poc);

            setCollectPostLoading(false);
            return;
          }
        })
      );

      const res = await executePostAction(
        context?.lensConectado?.sessionClient!,
        {
          post: context?.cartItems?.[0]?.item?.postId,
          action: {
            unknown: {
              address: COIN_OP_OPEN_ACTION,
              params: [
                {
                  key: ethers.keccak256(
                    ethers.toUtf8Bytes("lens.param.buyCoinop")
                  ),
                  data: blockchainData(
                    coder.encode(
                      ["string[]", "address[]", "uint256[]", "uint8[]"],
                      [
                        context?.cartItems?.flatMap(
                          (item) => item?.item?.origin == "0"
                        )?.length == context?.cartItems?.length
                          ? []
                          : encrypted,
                        context?.cartItems?.flatMap((item) => item?.currency),
                        context?.cartItems?.flatMap((item) =>
                          Number(item?.item?.collectionId)
                        ),
                        context?.cartItems?.flatMap((item) =>
                          Number(item?.buyAmount)
                        ),
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

            context?.setCartItems([]);
            removeCypherStorageCart();
            setEncrypted([]);
            setDetails({
              address: "",
              zip: "",
              city: "",
              state: "",
              country: "",
            });
            context?.setScreenDisplay(ScreenDisplay.Orders);
            context?.setFiltersOpen({ value: false, allow: false });
            router.push(
              `/autograph/${context?.lensConectado?.profile?.username?.localName}`
            );
            setEncrypted([]);
          } else {
            context?.setModalOpen(dict?.error);
          }

          setTimeout(() => {
            context?.setIndexar(Indexar.Inactive);
          }, 3000);
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }

    setCollectPostLoading(false);
  };

  const approveSpend = async (currency: `0x${string}`) => {
    setApproveLoading((prev) => {
      let arr = [...prev];
      let index = arr?.findIndex(
        (item) => item?.currency?.toLowerCase() == currency?.toLowerCase()
      );
      arr[index] = {
        ...arr[index],
        loading: true,
      };

      return arr;
    });
    try {
      const clientWallet = createWalletClient({
        chain: chains.mainnet,
        transport: custom((window as any).ethereum),
      });

      const { request } = await publicClient.simulateContract({
        address: currency,
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
        chain: chains.mainnet,
        args: [
          COIN_OP_OPEN_ACTION,
          BigInt(
            (Number(
              context?.cartItems
                ?.filter(
                  (item) =>
                    item?.currency?.toLowerCase() == currency?.toLowerCase()
                )
                ?.reduce(
                  (sum, item) =>
                    sum + Number(item?.price) * Number(item?.buyAmount),
                  0
                )! *
                10 ** 18
            ) /
              Number(
                context?.oracleData?.find(
                  (oracle) =>
                    oracle.currency?.toLowerCase() === currency?.toLowerCase()
                )?.rate
              )) *
              10 ** 18 *
              1.3
          ),
        ],
        account: address,
      });
      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash: res });
      setIsApprovedSpend((prev) => {
        let arr = [...prev];
        let index = arr?.findIndex(
          (item) => item?.currency?.toLowerCase() == currency?.toLowerCase()
        );
        arr[index] = {
          ...arr[index],
          approved: true,
        };

        return arr;
      });
    } catch (err: any) {
      console.error(err.message);
    }
    setApproveLoading((prev) => {
      let arr = [...prev];
      let index = arr?.findIndex(
        (item) => item?.currency?.toLowerCase() == currency?.toLowerCase()
      );
      arr[index] = {
        ...arr[index],
        loading: false,
      };

      return arr;
    });
  };

  const checkApproved = async () => {
    try {
      const unique = Array.from(
        new Set(context?.cartItems?.map((item) => item?.currency))
      );

      let approved: { approved: boolean; currency: string }[] = [];
      await Promise.all(
        unique?.map(async (item, indice) => {
          const data = await publicClient.readContract({
            address: item?.toLowerCase() as `0x${string}`,
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
            args: [address as `0x${string}`, COIN_OP_OPEN_ACTION],
            account: address,
          });

          if (address) {
            if (
              Number((data as any)?.toString()) /
                Number(
                  context?.oracleData?.find(
                    (oracle) =>
                      oracle.currency?.toLowerCase() === item?.toLowerCase()
                  )?.wei
                ) >=
              Number(
                context?.cartItems
                  ?.filter(
                    (value) =>
                      value?.currency?.toLowerCase() == item?.toLowerCase()
                  )
                  ?.reduce(
                    (sum, item) =>
                      sum + Number(item?.price) * Number(item?.buyAmount),
                    0
                  )! *
                  10 ** 18
              ) /
                Number(
                  context?.oracleData?.find(
                    (oracle) =>
                      oracle.currency?.toLowerCase() === item?.toLowerCase()
                  )?.rate
                )
            ) {
              approved[indice] = {
                approved: true,
                currency: item,
              };
            } else {
              approved[indice] = {
                approved: false,
                currency: item,
              };
            }
          }
        })
      );

      setIsApprovedSpend(approved);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (address && Number(context?.oracleData?.length) > 0) {
      checkApproved();
    }
  }, [
    context?.cartItems?.length,
    chooseCartItem,
    address,
    context?.oracleData,
  ]);

  useEffect(() => {
    if (
      Number(context?.cartItems?.length) > 0 &&
      !chooseCartItem &&
      approveLoading?.length < 1 &&
      isApprovedSpend?.length < 1
    ) {
      const uniqueCurrencies = Array.from(
        new Set(context?.cartItems?.map((item) => item?.currency))
      );
      setApproveLoading(
        Array.from({ length: uniqueCurrencies?.length }, (_, i) => ({
          currency: uniqueCurrencies[i],
          loading: false,
        }))
      );
      setIsApprovedSpend(
        Array.from({ length: uniqueCurrencies?.length }, (_, i) => ({
          currency: uniqueCurrencies[i],
          approved: false,
        }))
      );
    }
  }, [context?.cartItems?.length]);

  return {
    encryptFulfillment,
    collectPostLoading,
    encryptionLoading,
    collectItems,
    details,
    setDetails,
    openDropdown,
    setOpenDropdown,
    encrypted,
    approveSpend,
    chooseCartItem,
    setChooseCartItem,
    isApprovedSpend,
    approveLoading,
  };
};

export default useCheckout;

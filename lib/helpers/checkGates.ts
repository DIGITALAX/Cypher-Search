import { Gate } from "@/components/Search/types/search.types";
import { Creation } from "@/components/Tiles/types/tiles.types";
import { PublicClient } from "viem";
import { getOrdersQuick } from "../../graphql/subgraph/queries/getOrders";
import {
  getCollectionId,
  getCollectionByUri,
} from "../../graphql/subgraph/queries/getCollections";

const checkGates = async (
  gates: Gate,
  publicClient: PublicClient,
  address: `0x${string}`
): Promise<
  | {
      erc721?: Creation[];
      erc20?: {
        address: string;
        amount: string;
      }[];
    }
  | undefined
> => {
  try {
    let erc20s: {
      address: string;
      amount: string;
    }[] = [];
    let erc721s: Creation[] = [];

    if (gates?.erc20Logic?.length > 0) {
      const promises = gates?.erc20Logic?.map(async (item) => {
        const data = await publicClient.readContract({
          address: item.address as `0x${string}`,
          abi: [
            {
              inputs: [
                { internalType: "address", name: "account", type: "address" },
              ],
              name: "balanceOf",
              outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
              stateMutability: "view",
              type: "function",
            },
          ],
          functionName: "balanceOf",
          args: [address],
          account: address,
        });

        if (Number(item?.amount) > Number(data)) {
          erc20s.push(item);
        }
      });

      await Promise.all(promises);

      if (
        (!gates?.oneOf && erc20s?.length > 0) ||
        (gates?.oneOf && gates?.erc721Logic?.length < 1 && erc20s?.length > 0)
      ) {
        return {
          erc20: erc20s,
        };
      }
    }

    if (gates?.erc721Logic?.length > 0) {
      const orders = await getOrdersQuick(address);

      if (
        orders?.data?.orderCreateds?.length > 0 ||
        orders?.data?.nftonlyOrderCreateds?.length > 0
      ) {
        let collectionURIs: Creation[] = [];
        const promises = [
          ...(orders?.data?.orderCreateds || []),
          ...(orders?.data?.nftonlyOrderCreateds?.length || []),
        ]?.map((item: { subOrderCollectionIds: string[] }) =>
          item?.subOrderCollectionIds?.map(async (item: string) => {
            const data = await getCollectionId(item);
            if (data?.data?.collectionCreateds?.[0]) {
              collectionURIs?.push(data?.data?.collectionCreateds?.[0]);
            }
          })
        );

        await Promise.all(promises);

        if (collectionURIs?.length < 1) {
          return {
            erc20: erc20s,
            erc721: gates?.erc721Logic,
          };
        } else {
          gates?.erc721Logic?.map((logic) => {
            const found = collectionURIs?.find(
              (col) => col?.uri?.toLowerCase() == logic?.uri?.toLowerCase()
            );
            if (!found) {
              erc721s.push(logic);
            }
          });

          if (erc721s?.length < 1) {
            return undefined;
          } else {
            return {
              erc20: erc20s,
              erc721: erc721s,
            };
          }
        }
      } else {
        const promises = await Promise.all(
          (gates?.erc721Logic as any)?.[0]?.uris?.map(async (item: string) => {
            const data = await getCollectionByUri(item);
            return data?.data?.collectionCreateds?.[0];
          })
        );

        return {
          erc20: erc20s,
          erc721: promises as Creation[],
        };
      }
    }
  } catch (err: any) {
    console.error(err.message);
  }
};

export default checkGates;

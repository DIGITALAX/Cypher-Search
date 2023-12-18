import { AuthSig, Details } from "@/components/Autograph/types/autograph.types";
import { LitNodeClient, encryptString } from "@lit-protocol/lit-node-client";

export const encryptItems = async (
  client: LitNodeClient,
  groupedByPubId: {
    [key: string]: {
      colors: string[];
      sizes: string[];
      amounts: number[];
      collectionIds: string[];
      types: string[];
      prices: number[];
      fulfillerAddress: string[];
      originalIndices: number[];
      origin: string;
    };
  },
  fulfillmentDetails: Details,
  address: `0x${string}`,
  authSig: AuthSig
): Promise<
  | {
      pubId: string;
      data: string;
    }[]
  | undefined
> => {
  try {
    const uniqueFulfillerAddressesByGroup: { [key: string]: string[] } = {};

    for (const [pubId, item] of Object.entries(groupedByPubId)) {
      const uniqueAddresses = new Set<string>();
      item.fulfillerAddress?.forEach((address) => {
        if (address) {
          uniqueAddresses.add(address);
        }
      });
      uniqueFulfillerAddressesByGroup[pubId] = Array.from(uniqueAddresses);
    }

    let encryptedItems: {
      pubId: string;
      data: string;
    }[] = [];
    for (const [pubId, item] of Object.entries(groupedByPubId)) {
      if (
        (item?.colors?.filter(Boolean)?.length &&
          item?.sizes?.filter(Boolean)?.length) ||
        item?.origin == "4"
      ) {
        let fulfillerEditions: any[] = [];
        uniqueFulfillerAddressesByGroup[pubId]?.forEach((address: string) => {
          fulfillerEditions.push({
            contractAddress: "",
            standardContractType: "",
            chain: "polygon",
            method: "",
            parameters: [":userAddress"],
            returnValueTest: {
              comparator: "=",
              value: address.toLowerCase(),
            },
          });

          fulfillerEditions.push({
            operator: "or",
          });
        });

        const accessControlConditions = [
          ...fulfillerEditions,
          {
            contractAddress: "",
            standardContractType: "",
            chain: "polygon",
            method: "",
            parameters: [":userAddress"],
            returnValueTest: {
              comparator: "=",
              value: address?.toLowerCase() as string,
            },
          },
        ];

        const { originalIndices, ...rest } = item;

        const { ciphertext, dataToEncryptHash } = await encryptString(
          {
            accessControlConditions,
            authSig,
            chain: "polygon",
            dataToEncrypt: JSON.stringify({
              ...fulfillmentDetails,
              ...rest,
            }),
          },
          client!
        );

        encryptedItems.push({
          pubId,
          data: JSON.stringify({
            ciphertext,
            dataToEncryptHash,
            accessControlConditions,
          }),
        });
      }
    }

    return encryptedItems;
  } catch (err: any) {
    console.error(err.message);
  }
};

import { Details } from "@/components/Autograph/types/autograph.types";
import { LitNodeClient, encryptString } from "@lit-protocol/lit-node-client";
import { AuthSig } from "@lit-protocol/types";

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
    };
  },
  fulfillmentDetails: Details,
  address: `0x${string}`,
  authSig: AuthSig
): Promise<string[] | undefined> => {
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

    let encryptedItems: string[] = [];
    for (const [pubId, item] of Object.entries(groupedByPubId)) {
      let fulfillerEditions: any[] = [];
      uniqueFulfillerAddressesByGroup[pubId].forEach((address: string) => {
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

      await client.connect();

      const { ciphertext, dataToEncryptHash } = await encryptString(
        {
          accessControlConditions,
          authSig,
          chain: "polygon",
          dataToEncrypt: JSON.stringify({
            ...fulfillmentDetails,
            ...item,
          }),
        },
        client!
      );

      encryptedItems.push(
        JSON.stringify({
          ciphertext,
          dataToEncryptHash,
          accessControlConditions,
        })
      );
    }

    return encryptedItems;
  } catch (err: any) {
    console.error(err.message);
  }
};

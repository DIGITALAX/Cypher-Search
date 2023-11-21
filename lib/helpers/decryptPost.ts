import { Quote, Comment, Post } from "../../graphql/generated";
import {
  AnyEncryptablePublicationMetadataFragment,
  LensClient,
  production,
} from "@lens-protocol/client/gated";
import { Address, WalletClient } from "viem";
import { SetStateAction } from "react";
import { setInteractError } from "../../redux/reducers/interactErrorSlice";
import { AnyAction, Dispatch } from "redux";

export const decryptPost = async (
  post: Post | Comment | Quote,
  clientWallet: WalletClient,
  dispatch: Dispatch<AnyAction>,
  setDecryptedFeed: (e: SetStateAction<any>) => void,
  individual: boolean
): Promise<void> => {
  try {
    const client = new LensClient({
      environment: production,
      authentication: {
        domain: "cyphersearch",
        uri: "https://cypher.digitalax.xyz",
      },
      signer: {
        ...clientWallet,
        getAddress: async (): Promise<Address> => {
          const addresses = await clientWallet.getAddresses();
          return addresses?.[0] ?? "default-address-or-null";
        },

        signMessage: async (message: string): Promise<string> => {
          const account = (await clientWallet.getAddresses())?.[0];
          if (!account) {
            throw new Error("No account found for signing");
          }
          return clientWallet.signMessage({ account, message });
        },
      },
    });

    const result = await client.gated.decryptPublicationMetadataFragment(
      (post as Post).metadata as AnyEncryptablePublicationMetadataFragment
    );

    if (!result.isFailure()) {
      if (individual) {
        setDecryptedFeed({
          ...post,
          decrypted: result.value,
        });
      } else {
        setDecryptedFeed((prev: any) => {
          const arr = [...prev];
          let index = arr.findIndex((item) => (item.id = post?.id));
          if (index != -1) {
            arr[index] = {
              ...post,
              decrypted: result.value,
            };
          }
          return arr;
        });
      }
    } else {
      dispatch(setInteractError(true));
    }
  } catch (err: any) {
    console.error(err.message);
  }
};

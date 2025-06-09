import { ModalContext } from "@/app/providers";
import { useContext, useState } from "react";
import { Account } from "@lens-protocol/client";
import {
  account,
  MetadataAttribute,
  MetadataAttributeType,
} from "@lens-protocol/metadata";
import { immutable } from "@lens-chain/storage-client";
import { chains } from "@lens-chain/sdk/viem";
import {
  fetchAccount,
  setAccountMetadata,
} from "@lens-protocol/client/actions";
import { typeMapping } from "@/app/lib/constants";

const useDisplay = (dict: any) => {
  const context = useContext(ModalContext);
  const [displayLoading, setDisplayLoading] = useState<boolean>(false);

  const handleSetDisplay = async () => {
    if (!context?.lensConectado?.sessionClient) return;
    setDisplayLoading(true);
    try {
      let attributes = (
        context?.lensConectado?.profile?.metadata?.attributes || []
      )?.map((item) => ({
        value: item?.value,
        type: typeMapping[item?.type],
        key: item?.key,
      })) as MetadataAttribute[];

      const existing = attributes.findIndex(
        (item) => item?.key === "cypherDisplay"
      );

      const reducedDiplay = {
        private: {
          main: context?.profileDisplay?.private?.main?.collectionId || "0",
          side: Array.from({ length: 3 })?.map(
            (_, index: number) =>
              context?.profileDisplay?.private?.side?.[index]?.collectionId ||
              "0"
          ),
        },
        community: {
          main: context?.profileDisplay?.community?.main?.collectionId || "0",
          side: Array.from({ length: 3 })?.map(
            (_, index: number) =>
              context?.profileDisplay?.community?.side?.[index]?.collectionId ||
              "0"
          ),
        },
        public: {
          main: context?.profileDisplay?.public?.main?.collectionId || "0",
          side: Array.from({ length: 3 })?.map(
            (_, index: number) =>
              context?.profileDisplay?.public?.side?.[index]?.collectionId ||
              "0"
          ),
        },
      };

      if (existing != -1) {
        attributes[existing] = {
          key: "cypherDisplay",
          value: JSON.stringify(reducedDiplay),
          type: MetadataAttributeType.STRING,
        };
      } else {
        attributes.push({
          key: "cypherDisplay",
          value: JSON.stringify(reducedDiplay),
          type: MetadataAttributeType.STRING,
        });
      }

      const schema = account({
        bio: context?.lensConectado?.profile?.metadata?.bio!,
        picture: context?.lensConectado?.profile?.metadata?.picture,
        coverPicture: context?.lensConectado?.profile?.metadata?.coverPicture,
        name: context?.lensConectado?.profile?.metadata?.name!,
        attributes,
      });

      const acl = immutable(chains.mainnet.id);
      const { uri } = await context?.clienteAlmacenamiento?.uploadAsJson(
        schema,
        {
          acl,
        }
      )!;

      const res = await setAccountMetadata(
        context?.lensConectado?.sessionClient!,
        {
          metadataUri: uri,
        }
      );

      if (res?.isOk()) {
        const res = await fetchAccount(context?.lensConectado?.sessionClient!, {
          address: context?.lensConectado?.profile?.address,
        });

        if (res?.isOk()) {
          context?.setLensConectado((prev) => ({
            ...prev,
            profile: res?.value as Account,
          }));
        }
      } else {
        context?.setModalOpen(dict?.error);
      }
    } catch (err: any) {
      console.error(err?.message);
    }
    setDisplayLoading(false);
  };

  return {
    displayLoading,
    handleSetDisplay,
  };
};

export default useDisplay;

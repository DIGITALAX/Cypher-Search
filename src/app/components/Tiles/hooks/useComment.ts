import { ModalContext } from "@/app/providers";
import { evmAddress, Post, Account, PageSize } from "@lens-protocol/client";
import { fetchAccounts, post } from "@lens-protocol/client/actions";
import { useContext, useEffect, useRef, useState } from "react";
import { Indexar } from "../../Search/types/search.types";
import { useAccount } from "wagmi";
import {
  image,
  MediaImageMimeType,
  MediaVideoMimeType,
  textOnly,
  video,
} from "@lens-protocol/metadata";
import { immutable } from "@lens-chain/storage-client";
import { chains } from "@lens-chain/sdk/viem";
import convertToFile from "@/app/lib/helpers/convertToFile";
import getCaretPos from "@/app/lib/helpers/getCaretPos";

const useComment = (publication?: Post) => {
  const context = useContext(ModalContext);
  const { address } = useAccount();
  const textElement = useRef<HTMLTextAreaElement | null>(null);
  const [commentLoading, setCommentLoading] = useState<boolean>(false);
  const [profilesFound, setProfilesFound] = useState<Account[]>([]);
  const [profilesOpen, setProfilesOpen] = useState<boolean>(false);
  const [caretCoord, setCaretCoord] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });
  const [commentDetails, setCommentDetails] = useState<string>("");
  const [openMoreOptions, setOpenMoreOptions] = useState<boolean>(false);
  const [commentOpen, setCommentOpen] = useState<boolean>(false);
  const [commentInteraction, setCommentInteraction] = useState<{
    hasCommented: boolean;
    comments: number;
  }>({
    hasCommented: false,
    comments: 0,
  });

  const makePost = async () => {
    if (!context?.lensConectado?.sessionClient) return;

    if (
      commentDetails?.trim() === "" &&
      Number(context?.postInfo?.media?.["post"]?.length) < 1
    ) {
      return;
    }

    setCommentLoading(true);

    try {
      let schema;

      if (Number(context?.postInfo?.media?.["post"]?.length) > 0) {
        let newVideos: {
          item: string;
          type: MediaVideoMimeType;
        }[] = [];
        let newImages: {
          item: string;
          type: MediaImageMimeType;
        }[] = [];

        let videos =
          context?.postInfo?.media?.["post"]?.filter(
            (item) => item.type == "video/mp4"
          ) || [];
        if (videos?.length > 0) {
          await Promise.all(
            videos?.map(async (vid) => {
              const response = await fetch("/api/ipfs", {
                method: "POST",
                body: convertToFile(vid.item, vid.type),
              });
              const responseJSON = await response.json();

              newVideos.push({
                item: "ipfs://" + responseJSON?.cid,
                type: vid.type as MediaVideoMimeType,
              });
            })
          );
        }

        let images =
          context?.postInfo?.media?.["post"]?.filter(
            (item) => item.type !== "video/mp4"
          ) || [];
        if (images?.length > 0) {
          await Promise.all(
            images?.map(async (img) => {
              if (img.type !== MediaImageMimeType.GIF) {
                const response = await fetch("/api/ipfs", {
                  method: "POST",
                  body: convertToFile(img.item, img.type),
                });
                const responseJSON = await response.json();

                newImages.push({
                  item: "ipfs://" + responseJSON?.cid,
                  type: img.type as MediaImageMimeType,
                });
              } else {
                newImages.push({
                  item: img.item,
                  type: img.type as MediaImageMimeType,
                });
              }
            })
          );
        }

        if (newVideos?.length > 0) {
          const attachments = [...newVideos.slice(1), ...newImages]?.filter(
            Boolean
          );
          schema = video({
            content: commentDetails,
            video: newVideos[0],
            attachments: attachments?.length > 0 ? attachments : undefined,

            tags: ["chromadin"],
          });
        } else {
          const attachments = [...newImages?.slice(1)]?.filter(Boolean);
          schema = image({
            content: commentDetails,
            image: newImages[0],
            attachments: attachments?.length > 0 ? attachments : undefined,
            tags: ["chromadin"],
          });
        }
      } else {
        schema = textOnly({
          content: commentDetails,
          tags: ["chromadin"],
        });
      }

      const acl = immutable(chains.mainnet.id);
      const { uri } = await context?.clienteAlmacenamiento?.uploadAsJson(
        schema,
        {
          acl,
        }
      )!;

      let actions = null;

      if (context?.postInfo?.collectTypes?.["post"]) {
        let payToCollect =
          context?.postInfo?.collectTypes?.["post"]?.payToCollect;

        if (payToCollect) {
          payToCollect = {
            ...payToCollect,
            recipients: [
              {
                percent: 100,
                address: evmAddress(address as string),
              },
            ],
          };
        }
        actions = [
          {
            simpleCollect: {
              ...context?.postInfo?.collectTypes?.["post"]!,
              payToCollect,
            },
          },
        ];
      }

      const res = await post(context?.lensConectado?.sessionClient, {
        contentUri: uri,
        actions,
      });

      if (!res?.isOk()) {
        context?.setModalOpen((res as any).error);
      } else if ((res.value as any)?.reason?.includes("Signless")) {
        context?.setSignless?.(true);
      } else {
        context?.setIndexar(Indexar.Success);
        setCommentDetails("");
        setCommentOpen(false);
        const newMedia = { ...context?.postInfo?.media };
        delete newMedia?.["post"];
        const newTypes = { ...context?.postInfo?.collectTypes };
        delete newTypes?.["post"];
        context?.setPostInfo({
          collectTypes: newTypes,
          media: newMedia,
        });
      }
    } catch (err: any) {
      console.error(err?.message);
    }
    setTimeout(() => {
      context?.setIndexar(Indexar.Inactive);
    }, 3000);
    setCommentLoading(false);
  };

  const comment = async () => {
    if (!context?.lensConectado?.sessionClient) return;

    if (
      commentDetails?.trim() === "" &&
      Number(context?.postInfo?.media?.[publication!?.id]?.length) < 1
    ) {
      return;
    }

    setCommentLoading(true);

    try {
      let schema;

      if (Number(context?.postInfo?.media?.[publication!?.id]?.length) > 0) {
        let newVideos: {
          item: string;
          type: MediaVideoMimeType;
        }[] = [];
        let newImages: {
          item: string;
          type: MediaImageMimeType;
        }[] = [];

        let videos =
          context?.postInfo?.media?.[publication!?.id]?.filter(
            (item) => item.type == "video/mp4"
          ) || [];
        if (videos?.length > 0) {
          await Promise.all(
            videos?.map(async (vid) => {
              const response = await fetch("/api/ipfs", {
                method: "POST",
                body: convertToFile(vid.item, vid.type),
              });
              const responseJSON = await response.json();

              newVideos.push({
                item: "ipfs://" + responseJSON?.cid,
                type: vid.type as MediaVideoMimeType,
              });
            })
          );
        }

        let images =
          context?.postInfo?.media?.[publication!?.id]?.filter(
            (item) => item.type !== "video/mp4"
          ) || [];
        if (images?.length > 0) {
          await Promise.all(
            images?.map(async (img) => {
              if (img.type !== MediaImageMimeType.GIF) {
                const response = await fetch("/api/ipfs", {
                  method: "POST",
                  body: convertToFile(img.item, img.type),
                });
                const responseJSON = await response.json();

                newImages.push({
                  item: "ipfs://" + responseJSON?.cid,
                  type: img.type as MediaImageMimeType,
                });
              } else {
                newImages.push({
                  item: img.item,
                  type: img.type as MediaImageMimeType,
                });
              }
            })
          );
        }

        if (newVideos?.length > 0) {
          const attachments = [...newVideos.slice(1), ...newImages]?.filter(
            Boolean
          );
          schema = video({
            content: commentDetails,
            video: newVideos[0],
            attachments: attachments?.length > 0 ? attachments : undefined,

            tags: ["chromadin"],
          });
        } else {
          const attachments = [...newImages?.slice(1)]?.filter(Boolean);
          schema = image({
            content: commentDetails,
            image: newImages[0],
            attachments: attachments?.length > 0 ? attachments : undefined,
            tags: ["chromadin"],
          });
        }
      } else {
        schema = textOnly({
          content: commentDetails,
          tags: ["chromadin"],
        });
      }

      const acl = immutable(chains.mainnet.id);
      const { uri } = await context?.clienteAlmacenamiento?.uploadAsJson(
        schema,
        {
          acl,
        }
      )!;

      let actions = null;

      if (context?.postInfo?.collectTypes?.[publication!?.id]) {
        let payToCollect =
          context?.postInfo?.collectTypes?.[publication!?.id]?.payToCollect;

        if (payToCollect) {
          payToCollect = {
            ...payToCollect,
            recipients: [
              {
                percent: 100,
                address: evmAddress(address as string),
              },
            ],
          };
        }
        actions = [
          {
            simpleCollect: {
              ...context?.postInfo?.collectTypes?.[publication!?.id]!,
              payToCollect,
            },
          },
        ];
      }

      const res = await post(context?.lensConectado?.sessionClient, {
        contentUri: uri,
        actions,
        commentOn: {
          post: publication!?.id,
        },
      });

      if (!res?.isOk()) {
        context?.setModalOpen((res as any).error);
      } else if ((res.value as any)?.reason?.includes("Signless")) {
        context?.setSignless?.(true);
      } else {
        context?.setIndexar(Indexar.Success);
        setCommentInteraction((prev) => ({
          comments: prev?.comments + 1,
          hasCommented: true,
        }));
        setCommentDetails("");
        setCommentOpen(false);
        const newMedia = { ...context?.postInfo?.media };
        delete newMedia?.[publication!?.id];
        const newTypes = { ...context?.postInfo?.collectTypes };
        delete newTypes?.[publication!?.id];
        context?.setPostInfo({
          collectTypes: newTypes,
          media: newMedia,
        });
      }
    } catch (err: any) {
      console.error(err?.message);
    }
    setTimeout(() => {
      context?.setIndexar(Indexar.Inactive);
    }, 3000);
    setCommentLoading(false);
  };

  const searchProfiles = async (e: any) => {
    if (
      e.target.value.split(" ")[e.target.value.split(" ")?.length - 1][0] !==
        "@" ||
      e.target.value.split(" ")[e.target.value.split(" ")?.length - 1]
        ?.length == 1
    ) {
      setProfilesOpen(false);
      return;
    }

    let target =
      e.target.value.split(" ")[e.target.value.split(" ")?.length - 1];
    if (target?.trim() == "") return;
    try {
      const allProfiles = await fetchAccounts(context?.clienteLens!, {
        pageSize: PageSize.Ten,
        filter: {
          searchBy: {
            localNameQuery: target,
          },
        },
      });

      if (allProfiles.isOk()) {
        setProfilesOpen(true);
        setCaretCoord(getCaretPos(e, textElement));
        setProfilesFound((allProfiles?.value?.items || []) as Account[]);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (publication) {
      setCommentInteraction({
        hasCommented:
          publication!?.operations?.hasCommented?.optimistic || false,
        comments: publication!?.stats?.comments || 0,
      });
    }
  }, [publication]);

  return {
    comment,
    searchProfiles,
    setCommentOpen,
    commentOpen,
    setOpenMoreOptions,
    openMoreOptions,
    setProfilesOpen,
    profilesFound,
    profilesOpen,
    commentLoading,
    commentInteraction,
    setCommentDetails,
    commentDetails,
    textElement,
    caretCoord,
    makePost,
  };
};

export default useComment;

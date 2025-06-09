import { follow, unfollow } from "@lens-protocol/client/actions";
import { useContext, useRef, useState } from "react";
import { usePopper } from "react-popper";
import { Indexar } from "../../Search/types/search.types";
import { ModalContext } from "@/app/providers";
import { Account } from "@lens-protocol/client";

const useHover = (dict: any, profile: Account) => {
  const context = useContext(ModalContext);
  const [popperElement, setPopperElement] = useState<HTMLElement | null>();
  const [followLoading, setFollowLoading] = useState<boolean>(false);

  const popperRef = useRef<HTMLDivElement>(null);
  const popper = usePopper(popperRef?.current, popperElement, {
    placement: "right-end",
    strategy: "absolute",
    modifiers: [
      {
        name: "flip",
        enabled: true,
        options: {
          fallbackPlacements: ["top-start"],
          boundary: "clippingParents",
          rootBoundary: "viewport",
          padding: 8,
        },
      },
      {
        name: "preventOverflow",
        options: {
          boundary: "clippingParents",
          rootBoundary: "viewport",
          tether: true,
          padding: 8,
        },
      },
    ],
  });

  const handleUnfollow = async () => {
    if (!context?.lensConectado?.sessionClient) return;
    setFollowLoading(true);
    try {
      context?.setIndexar(Indexar.Indexando);
      const res = await unfollow(context?.lensConectado?.sessionClient, {
        account: profile?.address,
      });

      if (!res?.isOk()) {
        context?.setModalOpen(dict.error);
        setFollowLoading(false);
      } else if ((res.value as any)?.reason?.includes("Signless")) {
        context?.setSignless?.(true);
      } else {
        context?.setIndexar(Indexar.Success);
        context?.setLensConectado((prev) => ({
          ...prev,
          profile: {
            ...prev?.profile!,
            operations: {
              ...prev?.profile!?.operations!,
              isFollowedByMe: false,
            },
          },
        }));
      }
    } catch (err: any) {
      console.error(err.message);
    }

    setTimeout(() => {
      context?.setIndexar(Indexar.Inactive);
    }, 3000);
    setFollowLoading(false);
  };

  const handleFollow = async () => {
    if (!context?.lensConectado?.sessionClient) return;
    setFollowLoading(true);
    try {
      context?.setIndexar(Indexar.Indexando);
      const res = await follow(context?.lensConectado?.sessionClient, {
        account: profile?.address,
      });

      if (!res?.isOk()) {
        context?.setModalOpen(dict.error);
        setFollowLoading(false);
      } else if ((res.value as any)?.reason?.includes("Signless")) {
        context?.setSignless?.(true);
      } else {
        context?.setIndexar(Indexar.Success);
        context?.setLensConectado((prev) => ({
          ...prev,
          profile: {
            ...prev?.profile!,
            operations: {
              ...prev?.profile!?.operations!,
              isFollowedByMe: true,
            },
          },
        }));
      }
    } catch (err: any) {
      console.error(err.message);
    }

    setTimeout(() => {
      context?.setIndexar(Indexar.Inactive);
    }, 3000);
    setFollowLoading(false);
  };

  return {
    popper,
    setPopperElement,
    followLoading,
    handleFollow,
    handleUnfollow,
  };
};

export default useHover;

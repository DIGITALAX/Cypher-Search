import { INFURA_GATEWAY, itemTypeToString } from "@/app/lib/constants";
import { setCypherStorageCart } from "@/app/lib/utils";
import { ModalContext } from "@/app/providers";
import Image from "next/legacy/image";
import { useRouter } from "next/navigation";
import { FunctionComponent, JSX, useContext } from "react";
import { NFTData, PopUpProps } from "../types/tiles.types";
import { Collection } from "../../Common/types/common.types";

const PopUp: FunctionComponent<PopUpProps> = ({
  top,
  cartItem,
  level,
  type,
  left,
  bottom,
  right,
  dict,
}): JSX.Element => {
  const router = useRouter();
  const context = useContext(ModalContext);
  return (
    <div
      className="absolute z-30 flex w-fit h-fit rounded-sm p-2 bg-offBlack flex-row gap-3 items-center justify-center border border-white"
      style={{
        top,
        left,
        bottom,
        right,
      }}
    >
      <div
        className={`relative flex w-8 h-8 items-center justify-center rounded-full ${
          Number(cartItem?.amount) == Number(cartItem?.tokenIdsMinted?.length)
            ? "opacity-70"
            : "cursor-pointer active:scale-95"
        } hover:opacity-70`}
        title={
          cartItem?.amount !== undefined &&
          Number(cartItem?.tokenIdsMinted?.length) !== undefined &&
          Number(cartItem?.amount) == Number(cartItem?.tokenIdsMinted?.length)
            ? dict?.sod
            : dict?.cart
        }
        onClick={() => {
          if (
            Number(cartItem?.amount) == Number(cartItem?.tokenIdsMinted?.length)
          )
            return;

          if (
            Number(cartItem?.tokenIdsMinted?.length || 0) +
              Number(
                context?.cartItems
                  ?.filter((value) => cartItem?.postId == value?.item?.postId)
                  ?.map((item) => item?.buyAmount)
                  ?.reduce((sum, item) => sum + Number(item), 0)
              ) +
              1 >
            Number(cartItem?.amount)
          ) {
            context?.setModalOpen(dict?.lim);

            return;
          }

          const newItem = {
            item: cartItem,
            buyAmount: 1,
            price: Number(cartItem?.price),
            level,
            type,
            color: cartItem?.metadata?.colors?.[0]!,
            size: cartItem?.metadata?.sizes?.[0]!,
            currency: cartItem?.acceptedTokens?.[0]
          };

          const existingItem = context?.cartItems?.find(
            (item) => item?.item?.postId === cartItem?.postId
          );

          if (existingItem) {
            const newCartItems = [...(context?.cartItems || [])];
            const itemIndex = newCartItems?.indexOf(existingItem);

            if (
              existingItem?.color === newItem?.color &&
              existingItem?.size === newItem?.size
            ) {
              newCartItems[itemIndex] = {
                ...(existingItem || {}),
                buyAmount: existingItem?.buyAmount + 1,
              };
            } else {
              newCartItems?.splice(itemIndex, 1);
              newCartItems?.push(newItem);
            }

            context?.setCartItems(newCartItems);
            setCypherStorageCart(JSON.stringify(newCartItems));
          } else {
            context?.setCartItems([...(context?.cartItems || []), newItem]);
            setCypherStorageCart(
              JSON.stringify([...(context?.cartItems || []), newItem])
            );
          }
          // dispatch(
          //   setFiltersOpen({
          //     actionValue: false,
          //     actionAllow: false,
          //   })
          // );
          context?.setCartAnim(true);
        }}
      >
        <Image
          layout="fill"
          src={`${INFURA_GATEWAY}/ipfs/QmW5M5PE9yLeMiCEoTms7jntreLrpgRvxDFS8TQvzLbrWP`}
          draggable={false}
          className="rounded-full"
        />
      </div>
      <div
        className="relative flex w-8 h-8 items-center justify-center rounded-full cursor-pointer active:scale-95 hover:opacity-70"
        onClick={() => {
          context?.setFiltersOpen({
            value: false,
            allow: false,
          });

          router.push(
            `/item/${
              itemTypeToString[type as any as "chromadin"]
            }/${cartItem?.metadata?.title?.replaceAll(" ", "_")}`
          );
        }}
        title={dict?.view}
      >
        <Image
          layout="fill"
          src={`${INFURA_GATEWAY}/ipfs/QmW3Gw1CXVruzvrWFSQprhtqHZRRpwy9dTQciNReQk3dcX`}
          draggable={false}
          className="rounded-full"
        />
      </div>
    </div>
  );
};

export default PopUp;

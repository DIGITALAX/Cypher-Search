import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY, itemTypeToString } from "../../../../lib/constants";
import { PopUpProps } from "../types/common.types";
import { setCartAnim } from "../../../../redux/reducers/cartAnimSlice";
import { setCartItems } from "../../../../redux/reducers/cartItemsSlice";
import { setCypherStorageCart } from "../../../../lib/utils";

const PopUp: FunctionComponent<PopUpProps> = ({
  router,
  dispatch,
  top,
  cartItems,
  index,
  cartItem,
  level,
  type,
  left,
  bottom,
  right,
}): JSX.Element => {
  return (
    <div
      className="absolute z-10 flex w-fit h-fit rounded-sm p-2 bg-offBlack flex-row gap-3 items-center justify-center border border-white"
      style={{
        top,
        left,
        bottom,
        right,
      }}
    >
      <div
        className="relative flex w-8 h-8 items-center justify-center rounded-full cursor-pointer active:scale-95 hover:opacity-70"
        title="Add to Cart"
        onClick={() => {
          const newItem = {
            item: cartItem,
            amount: 1,
            price: Number(cartItem?.prices?.[0]),
            level,
            type,
            color: cartItem?.collectionMetadata?.colors?.[0],
            size: cartItem?.collectionMetadata?.sizes?.[0],
            purchased: false,
            chosenIndex: 0,
          };

          const existingItem = cartItems?.find(
            (item) => item?.item?.pubId === cartItem?.pubId
          );

          if (existingItem) {
            const newCartItems = [...(cartItems || [])];
            const itemIndex = newCartItems?.indexOf(existingItem);

            if (
              existingItem?.color === newItem?.color &&
              existingItem?.size === newItem?.size
            ) {
              newCartItems[itemIndex] = {
                ...(existingItem || {}),
                amount: existingItem?.amount + 1,
              };
            } else {
              newCartItems?.splice(itemIndex, 1);
              newCartItems?.push(newItem);
            }

            dispatch(setCartItems(newCartItems));
            setCypherStorageCart(JSON.stringify(newCartItems));
          } else {
            dispatch(setCartItems([...cartItems, newItem]));
            setCypherStorageCart(JSON.stringify([...cartItems, newItem]));
          }

          dispatch(setCartAnim(true));
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
        onClick={() =>
          router.push(`/item/${itemTypeToString[type]}/${cartItem?.pubId}`)
        }
        title="View Item"
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

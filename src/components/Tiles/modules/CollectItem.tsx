import { FunctionComponent } from "react";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { CollectItemProps } from "../types/tiles.types";
import Bar from "../../Common/modules/Bar";
import { setCartItems } from "../../../../redux/reducers/cartItemsSlice";
import { setCartAnim } from "../../../../redux/reducers/cartAnimSlice";
import { ItemType } from "@/components/Common/types/common.types";
import { setCypherStorageCart } from "../../../../lib/utils";

const CollectItem: FunctionComponent<CollectItemProps> = ({
  index,
  collectChoice,
  setCollectChoice,
  cartItems,
  dispatch,
  item,
  router,
}): JSX.Element => {
  return (
    <div className="relative w-60 h-full flex flex-col">
      <Bar title={`Collect Lvl.${index}`} />
      <div className="relative w-full h-110 flex flex-col bg-virg gap-6 justify-between items-center p-2 border-b border-x rounded-b-sm border-black">
        <div className="relative w-52 h-52 rounded-sm border border-black flex items-center justify-center">
          <Image
            layout="fill"
            src={`${INFURA_GATEWAY}/ipfs/`}
            draggable={false}
            className="rounded-sm"
          />
        </div>
        <div className="relative w-fit h-fit flex flex-col gap-3 items-center justify-center text-center break-words">
          <div className="relative flex items-center items-center justify-center w-fit text-sm font-net">
            {item?.title}
          </div>
        </div>
        <div className="relative flex flex-col gap-1.5 justify-start items-center text-black font-dog text-xxs">
          <div className="relative flex justify-start items-center">
            Choose Size
          </div>
          <div className="relative flex flex-row gap-1 items-center justify-center">
            {["xs", "s", "m", "l", "xl"].map(
              (item: string, indexTwo: number) => {
                return (
                  <div
                    key={indexTwo}
                    className={`relative w-7 h-7 p-1 flex items-center justify-center text-white text-center text-tee rounded-full uppercase bg-fondo cursor-pointer ${
                      collectChoice?.[index - 1]?.size === item
                        ? "border-viol border-2"
                        : "border-black border"
                    }`}
                    onClick={() =>
                      setCollectChoice((prev) => {
                        const choices = [...prev];
                        choices[index - 1].size =
                          choices[index - 1].size === item ? "" : item;
                        return choices;
                      })
                    }
                  >
                    {item}
                  </div>
                );
              }
            )}
          </div>
        </div>
        <div className="relative flex flex-col gap-1.5 justify-start items-center text-black font-dog text-xxs">
          <div className="relative flex justify-start items-center">
            Choose Base Color
          </div>
          <div className="relative flex flex-row gap-1 items-center justify-center">
            {["#000000", "#FFFFFF", "#97D1FD", "#F66054"].map(
              (item: string, indexTwo: number) => {
                return (
                  <div
                    key={indexTwo}
                    className={`relative w-5 h-5 cursor-pointer rounded-full ${
                      collectChoice?.[index - 1]?.color === item
                        ? "border-viol border-2"
                        : "border-black border"
                    }`}
                    style={{
                      backgroundColor: item,
                    }}
                    onClick={() =>
                      setCollectChoice((prev) => {
                        const choices = [...prev];
                        choices[index - 1].color =
                          choices[index - 1].color === item ? "" : item;
                        return choices;
                      })
                    }
                  ></div>
                );
              }
            )}
          </div>
        </div>
        <div className="relative flex flex-col gap-1.5 justify-start items-center font-dog text-black text-xs">
          <div className="relative flex justify-start items-center">Amount</div>
          <div className="relative flex justify-start items-center">
            $ {item?.prices[index]}
          </div>
        </div>
        <div
          className={`w-40 h-8 cursor-pointer rounded-sm cursor-pointer active:scale-95 border border-black flex items-center justify-center text-center font-gam text-xl ${
            !cartItems?.some(
              (value) =>
                value?.item?.collectionId === item?.collectionId &&
                value?.level === index
            )
              ? "bg-lima"
              : "bg-viol"
          }`}
          onClick={() => {
            const newItem = {
              ...collectChoice[index - 1],
              item,
              amount: Number(item?.amount),
              level: index,
              // chosenIndexes: item,
              type: ItemType.Legend,
              price: Number(item?.prices[index]),
              purchased: false,
            };

            if (
              cartItems?.some(
                (value) =>
                  value?.item?.pubId === item?.pubId && value.level === index
              )
            ) {
              router.push("/checkout");
            } else {
              const itemIndex = cartItems.findIndex(
                (cartItem) => cartItem.item.collectionId === item?.collectionId
              );
              if (
                cartItems?.some(
                  (value) => value.item.collectionId === item?.collectionId
                )
              ) {
                const newCartItems = [...cartItems];
                newCartItems.splice(itemIndex, 1);
                dispatch(setCartItems([...newCartItems, newItem]));
                setCypherStorageCart(
                  JSON.stringify([...newCartItems, newItem])
                );
              } else {
                dispatch(setCartItems([...cartItems, newItem]));
                setCypherStorageCart(JSON.stringify([...cartItems, newItem]));
              }
            }
            dispatch(setCartAnim(true));
          }}
        >
          {cartItems?.some(
            (value) =>
              value.item.collectionId === item?.collectionId &&
              value.level === index
          )
            ? "Go to Cart"
            : "Choose Level"}
        </div>
      </div>
    </div>
  );
};

export default CollectItem;

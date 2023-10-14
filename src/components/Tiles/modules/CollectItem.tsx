import { FunctionComponent } from "react";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { CollectItemProps } from "../types/tiles.types";
import Bar from "../../Common/modules/Bar";
import {
  ItemType,
  setCartItems,
} from "../../../../redux/reducers/cartItemsSlice";
import { setCartAnim } from "../../../../redux/reducers/cartAnimSlice";

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
    <div className="relative w-60 h-fit flex flex-col">
      <Bar title={`Collect Lvl.${index}`} />
      <div className="relative w-full h-fit flex flex-col bg-virg gap-6 justify-start items-center p-2 border-b border-x rounded-b-sm border-black">
        <div className="relative w-full h-44 rounded-sm border border-black flex">
          <Image layout="fill" src={`${INFURA_GATEWAY}/ipfs/`} />
        </div>
        <div className="relative w-fit h-fit flex flex-col gap-3 items-center justify-center text-center break-words">
          <div className="relative flex items-center items-center justify-center w-fit text-3xl font-net">
            {item?.rawURI?.title}
          </div>
          <div className="relative flex items-start justify-center w-full h-24 overflow-y-scroll text-xs font-vcr">
            {item?.rawURI?.description}
          </div>
        </div>
        <div className="relative flex flex-col gap-1.5 justify-start items-center text-black font-dog text-xxs">
          <div className="relative flex justify-start items-center">
            Choose Size
          </div>
          <div className="relative flex flex-row gap-1 items-center justify-center">
            {["xs", "s", "m", "lg", "xl"].map(
              (item: string, indexTwo: number) => {
                return (
                  <div
                    key={indexTwo}
                    className={`relative w-7 h-7 p-1 flex items-center justify-center text-white text-center text-xxs rounded-sm bg-fondo cursor-pointer ${
                      collectChoice?.[index - 1]?.size === item
                        ? "border-viol border-2"
                        : "border-black border"
                    }`}
                    onClick={() => {
                      const choices = [...collectChoice];
                      choices[index - 1].size =
                        choices[index - 1].size === item ? "" : item;
                      setCollectChoice(choices);
                    }}
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
                    onClick={() => {
                      const choices = [...collectChoice];
                      choices[index - 1].color =
                        choices[index - 1].color === item ? "" : item;
                      setCollectChoice(choices);
                    }}
                  ></div>
                );
              }
            )}
          </div>
        </div>
        <div className="relative flex flex-col gap-1.5 justify-start items-center font-dog text-black text-xs">
          <div className="relative flex justify-start items-center">Amount</div>
          <div className="relative flex justify-start items-center">
            $ {item?.rawURI?.amount}
          </div>
        </div>
        <div
          className={`w-40 h-8 cursor-pointer rounded-sm cursor-pointer active:scale-95 border border-black flex items-center justify-center text-center font-gam text-xl ${
            !cartItems?.some(
              (item) => item?.id === item?.id && item?.level === index
            )
              ? "bg-lima"
              : "bg-viol"
          }`}
          onClick={() => {
            const newItem = {
              ...collectChoice[index - 1],
              id: item?.id,
              amount: item?.rawURI?.amount,
              level: index,
              type: ItemType.Legend,
            };

            if (
              cartItems?.some(
                (item) => item.id === item?.id && item.level === index
              )
            ) {
              router.push("/checkout");
            } else {
              const itemIndex = cartItems.findIndex(
                (cartItem) => cartItem.id === item?.id
              );
              if (cartItems?.some((item) => item.id === item?.id)) {
                const newCartItems = [...cartItems];
                newCartItems.splice(itemIndex, 1);
                dispatch(setCartItems([...newCartItems, newItem]));
              } else {
                dispatch(setCartItems([...cartItems, newItem]));
              }
            }
            dispatch(setCartAnim(true));
          }}
        >
          {cartItems?.some(
            (item) => item.id === item?.id && item.level === index
          )
            ? "Go to Cart"
            : "Choose Level"}
        </div>
      </div>
    </div>
  );
};

export default CollectItem;

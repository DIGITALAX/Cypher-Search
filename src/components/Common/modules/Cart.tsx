import Image from "next/legacy/image";
import { FunctionComponent, useState } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import CartList from "./CartList";
import { NextRouter } from "next/router";

const Cart: FunctionComponent<{ router: NextRouter }> = ({
  router,
}): JSX.Element => {
  const dispatch = useDispatch();
  const cartItems = useSelector(
    (state: RootState) => state.app.cartItemsReducer.items
  );
  const cartAnim = useSelector(
    (state: RootState) => state.app.cartAnimReducer.value
  );

  const [cartListOpen, setCartListOpen] = useState<boolean>(false);

  return (
    <div className="fixed bottom-5 right-5 w-fit h-fit z-30">
      <div
        className="relative bg-offBlack rounded-full p-2 h-14 w-14 border border-white flex items-center justify-center hover:opacity-70"
        onClick={() => setCartListOpen(!cartListOpen)}
      >
        <div
          className="relative w-8 h-8 flex items-center justify-center cursor-pointer active:scale-95"
          id={cartAnim ? "cartAnim" : ""}
          title="Cart"
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmT5ewiqFhfo8EHxSYiFwFR67pBpg7xesdtwAu9oWBoqqu`}
            layout="fill"
            draggable={false}
          />
        </div>
      </div>
      {cartItems?.length > 0 && (
        <div className="absolute rounded-full border border-mar bg-black w-5 flex items-center justify-center right-0 -bottom-1 h-5 p-1 font-vcr text-mar text-xxs z-1">
          {cartItems?.length}
        </div>
      )}
      {cartListOpen && (
        <CartList
          dispatch={dispatch}
          router={router}
          cartItems={cartItems}
          setCartListOpen={setCartListOpen}
          page
          searchActive={false}
        />
      )}
    </div>
  );
};

export default Cart;

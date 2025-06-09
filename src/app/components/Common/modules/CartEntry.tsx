"use client";

import Image from "next/legacy/image";
import { FunctionComponent, JSX, useContext, useState } from "react";
import CartList from "./CartList";
import { ModalContext } from "@/app/providers";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { usePathname } from "next/navigation";

const CartEntry: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const context = useContext(ModalContext);
  const path = usePathname();
  const [cartListOpen, setCartListOpen] = useState<boolean>(false);

  return path?.includes("/autograph/") && !path?.includes("/drop/") ? (
    <div className="fixed bottom-5 right-5 w-fit h-fit z-30">
      <div
        className="relative bg-offBlack rounded-full p-2 h-14 w-14 border border-white flex items-center justify-center hover:opacity-70"
        onClick={() => setCartListOpen(!cartListOpen)}
      >
        <div
          className="relative w-8 h-8 flex items-center justify-center cursor-pointer active:scale-95"
          id={context?.cartAnim ? "cartAnim" : ""}
          title={dict?.car}
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmT5ewiqFhfo8EHxSYiFwFR67pBpg7xesdtwAu9oWBoqqu`}
            layout="fill"
            draggable={false}
          />
        </div>
      </div>
      {Number(context?.cartItems?.length) > 0 && (
        <div className="absolute rounded-full border border-mar bg-black w-5 flex items-center justify-center right-0 -bottom-1 h-5 p-1 font-vcr text-mar text-xxs z-1">
          {context?.cartItems?.length}
        </div>
      )}
      {cartListOpen && (
        <CartList dict={dict} page setCartListOpen={setCartListOpen} />
      )}
    </div>
  ) : (
    <></>
  );
};

export default CartEntry;

"use client";

import Header from "../../Common/modules/Header";
import Fulfillment from "./Fulfillment";
import Cart from "./Cart";
import useCheckout from "../hooks/useCheckout";

export default function CheckoutEntry({ dict }: { dict: any }) {
  const {
    encryptFulfillment,
    collectPostLoading,
    encryptionLoading,
    collectItems,
    details,
    setDetails,
    openDropdown,
    setOpenDropdown,
    encrypted,
    approveSpend,
    chooseCartItem,
    setChooseCartItem,
    isApprovedSpend,
    approveLoading,
  } = useCheckout(dict);
  return (
    <div
      className={`relative w-full flex flex-col items-start justify-center h-fit overflow-y-scroll grow`}
    >
      <Header dict={dict} includeSearch={false} />
      <div className="relative w-full h-fit flex items-start justify-start flex-col md:flex-row gap-4 md:flex-nowrap flex-wrap px-4 md:pt-auto pt-32">
        <Fulfillment
          setDetails={setDetails}
          details={details}
          dict={dict}
          chooseCartItem={chooseCartItem}
          encryptFulfillment={encryptFulfillment}
          encrypted={encrypted}
          encryptionLoading={encryptionLoading}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
          approveLoading={approveLoading}
          collectPostLoading={collectPostLoading}
          isApprovedSpend={isApprovedSpend}
          approveSpend={approveSpend}
          collectItems={collectItems}
        />
        <Cart
          details={details}
          setDetails={setDetails}
          encrypted={encrypted}
          chooseCartItem={chooseCartItem}
          collectPostLoading={collectPostLoading}
          setChooseCartItem={setChooseCartItem}
          dict={dict}
        />
      </div>
    </div>
  );
}

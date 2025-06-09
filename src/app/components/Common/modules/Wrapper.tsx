import { JSX } from "react";
import ModalsEntry from "../../Modals/modules/ModalsEntry";
import FooterEntry from "./FooterEntry";
import CartEntry from "./CartEntry";

export default function Wrapper({
  dict,
  page,
}: {
  dict: any;
  page: JSX.Element;
}) {
  return (
    <>
      {page}
      <ModalsEntry dict={dict} />
      <CartEntry dict={dict} />
      <FooterEntry dict={dict} />
    </>
  );
}

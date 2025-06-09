import { Suspense } from "react";
import { tParams } from "../layout";
import RouterChange from "@/app/components/Common/modules/RouterChange";
import CheckoutEntry from "@/app/components/Checkout/modules/CheckoutEntry";
import { getDictionary } from "../dictionaries";

export default async function Checkout({ params }: { params: tParams }) {
  const { lang } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return (
    <Suspense fallback={<RouterChange />}>
      <CheckoutEntry dict={dict} />
    </Suspense>
  );
}

import { Suspense } from "react";
import { tParams } from "../layout";
import RouterChange from "@/app/components/Common/modules/RouterChange";
import CheckoutEntry from "@/app/components/Checkout/modules/CheckoutEntry";
import { getDictionary } from "../dictionaries";
import { Metadata } from "next";
import { LOCALES } from "@/app/lib/constants";

export const metadata: Metadata = {
  title: "Checkout",
  alternates: {
    canonical: `https://cypher.digitalax.xyz/autograph/checkout/`,
    languages: LOCALES.reduce((acc, item) => {
      acc[item] = `https://cypher.digitalax.xyz/${item}/checkout/`;
      return acc;
    }, {} as { [key: string]: string }),
  },
};

export default async function Checkout({ params }: { params: tParams }) {
  const { lang } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return (
    <Suspense fallback={<RouterChange />}>
      <CheckoutEntry dict={dict} />
    </Suspense>
  );
}

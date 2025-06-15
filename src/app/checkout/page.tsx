import { Metadata } from "next";
import { getDictionary } from "../[lang]/dictionaries";
import CheckoutEntry from "../components/Checkout/modules/CheckoutEntry";
import Wrapper from "../components/Common/modules/Wrapper";
import { LOCALES } from "../lib/constants";

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

export default async function Checkout() {
  const dict = await (getDictionary as (locale: any) => Promise<any>)("en");
  return <Wrapper dict={dict} page={<CheckoutEntry dict={dict} />}></Wrapper>;
}

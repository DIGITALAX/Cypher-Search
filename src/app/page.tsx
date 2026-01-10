import { Metadata } from "next";
import { getDictionary } from "./[lang]/dictionaries";
import Entry from "./components/Common/modules/Entry";
import Wrapper from "./components/Common/modules/Wrapper";
import { LOCALES } from "./lib/constants";

export const metadata: Metadata = {
  title: "Cypher Search",
  description: "Decentralised ecosystem search, mint, collect and fulfill.",
  alternates: {
    canonical: "https://cypher.digitalax.xyz/",
    languages: LOCALES.reduce((acc, item) => {
      acc[item] = `https://cypher.digitalax.xyz/${item}/`;
      return acc;
    }, {} as { [key: string]: string }),
  },
};

export default async function Home() {
  const dict = await (getDictionary as (locale: any) => Promise<any>)("en");
  return <Wrapper dict={dict} page={<Entry dict={dict} />}></Wrapper>;
}

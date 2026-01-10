import { Suspense } from "react";
import Entry from "../components/Common/modules/Entry";
import { getDictionary } from "./dictionaries";
import RouterChange from "../components/Common/modules/RouterChange";
import { tParams } from "../layout";
import { Metadata } from "next";
import { LOCALES } from "../lib/constants";

export const generateMetadata = async ({
  params,
}: {
  params: tParams;
}): Promise<Metadata> => {
  const { lang } = await params;

  return {
    title: "Cypher Search",
    description: "Decentralised ecosystem search, mint, collect and fulfill.",
    alternates: {
      canonical: `https://cypher.digitalax.xyz/${lang}/`,
      languages: LOCALES.reduce((acc, item) => {
        acc[item] = `https://cypher.digitalax.xyz/${item}/`;
        return acc;
      }, {} as { [key: string]: string }),
    },
  };
};

export default async function IndexPage({ params }: { params: tParams }) {
  const { lang } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return (
    <Suspense fallback={<RouterChange />}>
      <Entry dict={dict} />
    </Suspense>
  );
}

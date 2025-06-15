import { getDictionary } from "@/app/[lang]/dictionaries";
import Wrapper from "@/app/components/Common/modules/Wrapper";
import ItemEntry from "@/app/components/Item/modules/ItemEntry";
import { LOCALES } from "@/app/lib/constants";
import { Metadata } from "next";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{
    type: string;
    id: string;
  }>;
}): Promise<Metadata> => {
  const { type, id } = await params;

  return {
    title: `${type?.toUpperCase()} | ${decodeURIComponent(
      id?.replaceAll("_", " ")
    )}`,
    openGraph: {
      title: `${type?.toUpperCase()} | ${decodeURIComponent(
        id?.replaceAll("_", " ")
      )}`,
    },
    alternates: {
      canonical: `https://cypher.digitalax.xyz/item/${type}/${id}/`,
      languages: LOCALES.reduce((acc, item) => {
        acc[item] = `https://cypher.digitalax.xyz/${item}/${type}/${id}/`;
        return acc;
      }, {} as { [key: string]: string }),
    },
  };
};

export default async function Item({
  params,
}: {
  params: Promise<{
    type: string;
    id: string;
  }>;
}) {
  const { type, id } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)("en");
  return (
    <Wrapper
      dict={dict}
      page={<ItemEntry dict={dict} type={type} id={id} />}
    ></Wrapper>
  );
}

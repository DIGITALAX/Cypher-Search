import { getDictionary } from "@/app/[lang]/dictionaries";
import RouterChange from "@/app/components/Common/modules/RouterChange";
import ItemEntry from "@/app/components/Item/modules/ItemEntry";
import { Metadata } from "next";
import { Suspense } from "react";

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
  };
};

export default async function Item({
  params,
}: {
  params: Promise<{
    type: string;
    id: string;
    lang: string;
  }>;
}) {
  const { type, id, lang } = await params;

  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return (
    <Suspense fallback={<RouterChange />}>
      <ItemEntry dict={dict} type={type} id={id} />
    </Suspense>
  );
}

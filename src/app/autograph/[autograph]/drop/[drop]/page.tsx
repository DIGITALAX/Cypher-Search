import { getDictionary } from "@/app/[lang]/dictionaries";
import DropEntry from "@/app/components/Autograph/modules/DropEntry";
import { Drop as DropType } from "@/app/components/Autograph/types/autograph.types";
import Wrapper from "@/app/components/Common/modules/Wrapper";
import { INFURA_GATEWAY, LOCALES } from "@/app/lib/constants";
import findDrop from "@/app/lib/helpers/findDrop";
import { Metadata } from "next";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{
    autograph: string;
    drop: string;
  }>;
}): Promise<Metadata> => {
  const { autograph, drop } = await params;
  let res: DropType | undefined | void = undefined;

  if (drop && autograph) {
    res = await findDrop(drop);
  }

  const title = res?.metadata?.title || drop;
  const image = res?.metadata?.cover?.split("ipfs://")?.[1];
  const description = `Web3 Fashion Drop: ${title} by ${autograph} | DIGITALAX Cypher Search`;

  return {
    title: `Drop | ${title}`,
    description,
    keywords: `web3 fashion drop, digitalax, ${autograph}, ${title}, nft drop, crypto fashion, cc0 fashion`,
    openGraph: {
      title: `Drop | ${title}`,
      description,
      images: image ? [`${INFURA_GATEWAY}/ipfs/${image}`] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Drop | ${title}`,
      description,
      images: image ? [`${INFURA_GATEWAY}/ipfs/${image}`] : undefined,
    },
    alternates: {
      canonical: `https://cypher.digitalax.xyz/autograph/${autograph}/drop/${drop}/`,
      languages: LOCALES.reduce((acc, item) => {
        acc[
          item
        ] = `https://cypher.digitalax.xyz/${item}/autograph/${autograph}/drop/${drop}/`;
        return acc;
      }, {} as { [key: string]: string }),
    },
  };
};

export default async function Drop({
  params,
}: {
  params: Promise<{
    autograph: string;
    drop: string;
  }>;
}) {
  const { autograph, drop } = await params;
  let res: DropType | undefined | void = undefined;

  if (drop && autograph) {
    res = await findDrop(decodeURIComponent(drop?.replaceAll("_", " ")));
  }

  const dict = await (getDictionary as (locale: any) => Promise<any>)("en");
  return (
    <Wrapper dict={dict} page={<DropEntry dict={dict} drop={res} />}></Wrapper>
  );
}

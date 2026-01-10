import { getDictionary } from "@/app/[lang]/dictionaries";
import AutographEntry from "@/app/components/Autograph/modules/AutographEntry";
import RouterChange from "@/app/components/Common/modules/RouterChange";
import { LOCALES } from "@/app/lib/constants";
import { Metadata } from "next";
import { Suspense } from "react";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{
    autograph: string;
    lang: string;
  }>;
}): Promise<Metadata> => {
  const { autograph, lang } = await params;

  const autographImages: { [key: string]: string } = {
    f3manifesto: "QmcEnNAaFA8FKP5jr1SjTjwhM67G6sXqdR8ebdAoGwYVZc",
    digitalax: "QmcHiWMck4pKEZVT3HLfbMsG4MGmsRugmt2Nrmz9QTD3n2",
    emmajane1313: "QmU1gs9k41K3ECFeEFvav8jEqmTy3b97mUjEkYkSsnfnhu",
  };

  const image = autographImages[autograph?.toLowerCase()];
  const description = `Web3 Fashion Creator: ${autograph} | DIGITALAX Cypher Search | Explore NFT collections, drops, and decentralized fashion`;

  return {
    title: `Autograph | ${autograph}`,
    description,
    keywords: `web3 fashion, digitalax, ${autograph}, nft fashion creator, crypto fashion, cc0 fashion, decentralized fashion`,
    openGraph: {
      title: `Autograph | ${autograph}`,
      description,
      images: image ? [`https://digitalax.xyz/api/infura/${image}`] : undefined,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `Autograph | ${autograph}`,
      description,
      images: image ? [`https://digitalax.xyz/api/infura/${image}`] : undefined,
    },
    alternates: {
      canonical: `https://cypher.digitalax.xyz/${lang}/autograph/${autograph}/`,
      languages: LOCALES.reduce((acc, item) => {
        acc[
          item
        ] = `https://cypher.digitalax.xyz/${item}/autograph/${autograph}/`;
        return acc;
      }, {} as { [key: string]: string }),
    },
  };
};

export default async function Autograph({
  params,
}: {
  params: Promise<{
    autograph: string;
    lang: string;
  }>;
}) {
  const { autograph, lang } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return (
    <Suspense fallback={<RouterChange />}>
      <AutographEntry autograph={autograph} dict={dict} />
    </Suspense>
  );
}

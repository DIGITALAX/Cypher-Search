import { getDictionary } from "@/app/[lang]/dictionaries";
import RouterChange from "@/app/components/Common/modules/RouterChange";
import ItemEntry from "@/app/components/Item/modules/ItemEntry";
import { LOCALES } from "@/app/lib/constants";
import { Metadata } from "next";
import { Suspense } from "react";
import { getCollectionMetadata } from "@/app/lib/helpers/getCollectionMetadata";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{
    type: string;
    id: string;
    lang: string;
  }>;
}): Promise<Metadata> => {
  const { type, id, lang } = await params;

  const collectionData = await getCollectionMetadata(type, id);
  const title = collectionData?.title || decodeURIComponent(id?.replaceAll("_", " "));
  const description = collectionData?.description || `Web3 Fashion NFT: ${title} | DIGITALAX Cypher Search`;
  const image = collectionData?.image;

  return {
    title: `${type?.toUpperCase()} | ${title}`,
    description,
    keywords: `web3 fashion, nft fashion, digitalax, ${type}, ${title}, crypto fashion, cc0 fashion, decentralized fashion, blockchain fashion`,
    openGraph: {
      title: `${type?.toUpperCase()} | ${title}`,
      description,
      images: image ? [image] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${type?.toUpperCase()} | ${title}`,
      description,
      images: image ? [image] : undefined,
    },
    alternates: {
      canonical: `https://cypher.digitalax.xyz/${lang}/item/${type}/${id}/`,
      languages: LOCALES.reduce((acc, item) => {
        acc[item] = `https://cypher.digitalax.xyz/${item}/item/${type}/${id}/`;
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
    lang: string;
  }>;
}) {
  const { type, id, lang } = await params;

  const collectionData = await getCollectionMetadata(type, id);
  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);

  const productSchema = collectionData
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: collectionData.title,
        description: collectionData.description,
        image: collectionData.image,
        brand: {
          "@type": "Brand",
          name: "DIGITALAX",
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "MATIC",
          price: collectionData.price,
          availability: collectionData.unlimited
            ? "https://schema.org/InStock"
            : Number(collectionData.amount) > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          url: `https://cypher.digitalax.xyz/${lang}/item/${type}/${id}/`,
        },
        category: "Web3 Fashion",
        keywords: `web3 fashion, nft fashion, digitalax, ${type}, crypto fashion`,
      }
    : null;

  return (
    <>
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productSchema),
          }}
        />
      )}
      <Suspense fallback={<RouterChange />}>
        <ItemEntry dict={dict} type={type} id={id} />
      </Suspense>
    </>
  );
}

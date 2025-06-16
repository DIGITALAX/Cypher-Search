import { NextResponse } from "next/server";
import { INFURA_GATEWAY_INTERNAL, numberToItemTypeMap } from "../lib/constants";
import { getCollectionsSitemap } from "../../../graphql/queries/getAllCollections";

const locales = ["en", "es"];

function escapeXml(unsafe: string) {
  if (!unsafe) return "";
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

export async function GET() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://cypher.digitalax.xyz";
  const gallery = await getCollectionsSitemap(1000, 0);

  const collections = gallery?.data?.collectionCreateds || [];
  const autographs = [
    {
      title: "f3manifesto",
      image: "QmcEnNAaFA8FKP5jr1SjTjwhM67G6sXqdR8ebdAoGwYVZc",
    },
    {
      title: "digitalax",
      image: "QmcHiWMck4pKEZVT3HLfbMsG4MGmsRugmt2Nrmz9QTD3n2",
    },
    {
      title: "emmajane1313",
      image: "QmU1gs9k41K3ECFeEFvav8jEqmTy3b97mUjEkYkSsnfnhu",
    },
  ];

  const autographXml = autographs
    .map((auto) => {
      return `
      <url>
        <loc>${baseUrl}/autograph/${auto.title}/</loc>
        ${locales
          .map(
            (altLocale) => `
          <xhtml:link rel="alternate" hreflang="${altLocale}" href="${baseUrl}/${altLocale}/autograph/${auto.title}/" />
          `
          )
          .join("")}
        <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/autograph/${
        auto.title
      }/" />
        <image:image>
          <image:loc>${INFURA_GATEWAY_INTERNAL}${auto.image}</image:loc>
          <image:title><![CDATA[${
            auto.title
          } | Autograph Cypher Search | DIGITALAX]]></image:title>
          <image:caption><![CDATA[${
            auto.title
          } | Autograph Cypher Search | DIGITALAX]]></image:caption>
        </image:image>
      </url>
    `;
    })
    .join("");

  const collectionsXml = collections
    .map((coll: any) => {
      const rawTitle = coll?.metadata?.title ?? "";
      const safeSlug = encodeURIComponent(rawTitle.replace(/\s+/g, "_"));
      const title = escapeXml(rawTitle.replace(/-/g, " "));
      const image =
        coll?.metadata?.images?.[0]?.split("ipfs://")?.[1] ??
        coll?.metadata?.mediaCover?.split("ipfs://")?.[1];

      return `
      <url>
        <loc>${baseUrl}/item/${
        numberToItemTypeMap[Number(coll?.origin)]
      }/${safeSlug}/</loc>
        ${locales
          .map(
            (altLocale) => `
          <xhtml:link rel="alternate" hreflang="${altLocale}" href="${baseUrl}/${altLocale}/item/${
              numberToItemTypeMap[Number(coll?.origin)]
            }/${safeSlug}/" />
          `
          )
          .join("")}
        <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/item/${
        numberToItemTypeMap[Number(coll?.origin)]
      }/${safeSlug}/" />
        <image:image>
          <image:loc>${INFURA_GATEWAY_INTERNAL}${image}</image:loc>
          <image:title><![CDATA[${title} | Autograph Cypher Search | DIGITALAX]]></image:title>
          <image:caption><![CDATA[${title} | Autograph Cypher Search | DIGITALAX]]></image:caption>
        </image:image>
      </url>
    `;
    })
    .join("");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset 
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
      xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
      xmlns:xhtml="http://www.w3.org/1999/xhtml"
    >
      <url>
        <loc>${baseUrl}/</loc>
        ${locales
          .map(
            (locale) => `
          <xhtml:link rel="alternate" hreflang="${locale}" href="${baseUrl}/${locale}/" />
          `
          )
          .join("")}
        <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/" />
      </url>

      ${collectionsXml}
      ${autographXml}
    </urlset>`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}

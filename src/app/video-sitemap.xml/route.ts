import { NextResponse } from "next/server";
import { graphClient, graphPrintServer } from "../lib/subgraph/client";
import { gql } from "@apollo/client";
import { INFURA_GATEWAY_INTERNAL, numberToItemTypeMap } from "../lib/constants";

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

const VIDEO_COLLECTIONS_QUERY = `
query($first: Int, $skip: Int) {
  collectionCreateds(first: $first, skip: $skip) {
      metadata {
        title
        video
        audio
        description
        mediaCover
        images
      }
      uri
      origin
      }
    }`;

export async function GET() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://cypher.digitalax.xyz";

  const client = typeof window === "undefined" ? graphPrintServer : graphClient;
  const result = await client.query({
    query: gql(VIDEO_COLLECTIONS_QUERY),
    variables: { first: 1000, skip: 0 },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const collections = result?.data?.collectionCreateds || [];

  const videoCollections = collections.filter((coll: any) => {
    return coll?.metadata?.video || coll?.metadata?.audio;
  });

  const videosXml = videoCollections
    .map((coll: any) => {
      const rawTitle = coll?.metadata?.title ?? "";
      const safeSlug = encodeURIComponent(rawTitle.replace(/\s+/g, "_"));
      const title = escapeXml(rawTitle.replace(/-/g, " "));
      const description = escapeXml(coll?.metadata?.description ?? "");
      const thumbnail =
        coll?.metadata?.mediaCover?.split("ipfs://")?.[1] ??
        coll?.metadata?.images?.[0]?.split("ipfs://")?.[1];
      const videoUri =
        coll?.metadata?.video?.split("ipfs://")?.[1] ??
        coll?.metadata?.audio?.split("ipfs://")?.[1];

      if (!videoUri) return "";

      const pageUrl = `${baseUrl}/item/${
        coll?.origin == "4"
          ? "coinop"
          : numberToItemTypeMap[Number(coll?.origin)]
      }/${safeSlug}/`;

      return `
    <url>
      <loc>${pageUrl}</loc>
      ${locales
        .map(
          (altLocale) => `
      <xhtml:link rel="alternate" hreflang="${altLocale}" href="${baseUrl}/${altLocale}/item/${
            coll?.origin == "4"
              ? "coinop"
              : numberToItemTypeMap[Number(coll?.origin)]
          }/${safeSlug}/" />
      `
        )
        .join("")}
      <xhtml:link rel="alternate" hreflang="x-default" href="${pageUrl}" />
      <video:video>
        <video:thumbnail_loc>${INFURA_GATEWAY_INTERNAL}${thumbnail}</video:thumbnail_loc>
        <video:title><![CDATA[${title} | Web3 Fashion | DIGITALAX]]></video:title>
        <video:description><![CDATA[${description}]]></video:description>
        <video:content_loc>${INFURA_GATEWAY_INTERNAL}${videoUri}</video:content_loc>
        <video:family_friendly>yes</video:family_friendly>
        <video:requires_subscription>no</video:requires_subscription>
        <video:uploader info="https://cypher.digitalax.xyz/">Cypher Search</video:uploader>
        <video:live>no</video:live>
      </video:video>
    </url>
  `;
    })
    .filter((xml: string) => xml !== "")
    .join("");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  ${videosXml}
</urlset>`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}

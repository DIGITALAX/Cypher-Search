import { NextResponse } from "next/server";
import { gql } from "@apollo/client";
import {
  GRAPHQL_RATE_LIMIT_MAX_REQUESTS,
  MAX_GRAPHQL_QUERY_LENGTH,
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW_MS,
} from "../constants";

const rateBuckets = new Map<string, { count: number; reset: number }>();

export const getClientIp = (req: Request): string =>
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

export const isSameOrigin = (req: Request): boolean => {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    const originHost = new URL(origin).host.toLowerCase();
    const baseHost = process.env.NEXT_PUBLIC_BASE_URL
      ? new URL(process.env.NEXT_PUBLIC_BASE_URL).host
      : undefined;
    return [
      req.headers.get("host"),
      req.headers.get("x-forwarded-host"),
      baseHost,
    ].some((host) => host?.split(",")[0]?.trim().toLowerCase() === originHost);
  } catch (err: any) {
    return false;
  }
};

export const isRateLimited = (
  req: Request,
  bucket: string,
  limit: number = RATE_LIMIT_MAX_REQUESTS
): boolean => {
  const now = Date.now();
  if (rateBuckets.size > 5000) {
    rateBuckets.forEach((entry, key) => {
      if (entry.reset <= now) rateBuckets.delete(key);
    });
  }
  const key = `${bucket}:${getClientIp(req)}`;
  const entry = rateBuckets.get(key);
  if (!entry || entry.reset <= now) {
    rateBuckets.set(key, { count: 1, reset: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > limit;
};

export const guardApiRequest = (
  req: Request,
  bucket: string,
  limit: number = RATE_LIMIT_MAX_REQUESTS
): NextResponse | null => {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (isRateLimited(req, bucket, limit)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }
  return null;
};

export const guardGraphqlRequest = (
  req: Request,
  bucket: string
): NextResponse | null =>
  guardApiRequest(req, bucket, GRAPHQL_RATE_LIMIT_MAX_REQUESTS);

const hasIntrospection = (node: any): boolean => {
  if (!node || typeof node !== "object") return false;
  if (
    node.kind === "Field" &&
    (node.name?.value === "__schema" || node.name?.value === "__type")
  ) {
    return true;
  }
  return (node.selectionSet?.selections || []).some(hasIntrospection);
};

export const parseReadOnlyQuery = (query: unknown) => {
  if (typeof query !== "string" || query.length > MAX_GRAPHQL_QUERY_LENGTH) {
    return null;
  }
  const document = gql(query);
  const forbidden = document.definitions.some(
    (definition: any) =>
      (definition.kind === "OperationDefinition" &&
        definition.operation !== "query") ||
      hasIntrospection(definition)
  );
  return forbidden ? null : document;
};

export const readBodyWithLimit = async (req: Request, maxBytes: number) => {
  const reader = req.body?.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (reader) {
    const { done, value } = await reader.read();
    if (done || !value) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const merged = new Uint8Array(total);
  let offset = 0;
  chunks.forEach((chunk) => {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  });
  return merged;
};

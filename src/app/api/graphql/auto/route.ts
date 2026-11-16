import { NextRequest, NextResponse } from "next/server";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import {
  guardGraphqlRequest,
  parseReadOnlyQuery,
} from "@/app/lib/helpers/apiGuards";

const serverAutoClient = new ApolloClient({
  link: new HttpLink({
    uri: process.env.GRAPH_NODE_URL_AUTO
  }),
  cache: new InMemoryCache(),
});

export async function POST(request: NextRequest) {
  try {
    const blocked = guardGraphqlRequest(request, "graphql-auto");
    if (blocked) return blocked;

    const { query, variables } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    const document = parseReadOnlyQuery(query);

    if (!document) {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 });
    }

    const result = await serverAutoClient.query({
      query: document,
      variables: variables || {},
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "GraphQL query failed" },
      { status: 500 }
    );
  }
}

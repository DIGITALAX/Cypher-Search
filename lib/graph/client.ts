import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const httpLinkPrint = new HttpLink({
  uri: "https://api.studio.thegraph.com/query/37770/print_library_draft/version/latest",
});

export const graphPrintClient = new ApolloClient({
  link: httpLinkPrint,
  cache: new InMemoryCache(),
});

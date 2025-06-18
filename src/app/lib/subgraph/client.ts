import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const printLink = new HttpLink({
  uri: `https://gateway.thegraph.com/api/${process.env.NEXT_PUBLIC_GRAPH_KEY}/subgraphs/id/5BRsShsfv6tEucvDwGtrstRhg1fpvx2pMRWh5GDovE9K`,
});

export const graphClient = new ApolloClient({
  link: printLink,
  cache: new InMemoryCache(),
});

const aaaLink = new HttpLink({
  uri: `https://gateway.thegraph.com/api/${process.env.NEXT_PUBLIC_GRAPH_KEY}/subgraphs/id/5XK1Z5BL6TGMmpJV4irttCu4RgAePp7sPLKnPZfXVCcK`,
});

export const tripleAClient = new ApolloClient({
  link: aaaLink,
  cache: new InMemoryCache(),
});

const autographLink = new HttpLink({
  uri: `https://gateway.thegraph.com/api/${process.env.NEXT_PUBLIC_GRAPH_KEY}/subgraphs/id/41wxYK53EBTYKtUAe97fHJk6mtHzm6cu9dLAC4nUiYvc`,
});

export const autographClient = new ApolloClient({
  link: autographLink,
  cache: new InMemoryCache(),
});

const httpLinkQuest = new HttpLink({
  uri: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.NEXT_PUBLIC_GRAPH_KEY}/subgraphs/id/Ajf3LcbRNx92R25fVFaUMVxQTUafksyQXLVdLXAoaYqD`,
});

export const graphKinoraClient = new ApolloClient({
  link: httpLinkQuest,
  cache: new InMemoryCache(),
});

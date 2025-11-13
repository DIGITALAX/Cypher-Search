import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const getPrintUri = () => {
  if (typeof window === "undefined") {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    return `${baseUrl}/api/graphql/print`;
  }
  return "/api/graphql/print";
};

const printLink = new HttpLink({
  uri: getPrintUri(),
});

export const graphClient = new ApolloClient({
  link: printLink,

  cache: new InMemoryCache(),
});

const getTripleUri = () => {
  if (typeof window === "undefined") {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    return `${baseUrl}/api/graphql/triplea`;
  }
  return "/api/graphql/triplea";
};

const aaaLink = new HttpLink({
  uri: getTripleUri(),
});

export const tripleAClient = new ApolloClient({
  link: aaaLink,
  cache: new InMemoryCache(),
});

const getAutoUri = () => {
  if (typeof window === "undefined") {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    return `${baseUrl}/api/graphql/auto`;
  }
  return "/api/graphql/auto";
};

const autographLink = new HttpLink({
  uri: getAutoUri(),
});

export const autographClient = new ApolloClient({
  link: autographLink,
  cache: new InMemoryCache(),
});

const getQuestUri = () => {
  if (typeof window === "undefined") {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    return `${baseUrl}/api/graphql/kinora`;
  }
  return "/api/graphql/kinora";
};

const httpLinkQuest = new HttpLink({
  uri: getQuestUri(),
});

export const graphKinoraClient = new ApolloClient({
  link: httpLinkQuest,
  cache: new InMemoryCache(),
});

const printServerLink = new HttpLink({
  uri: process.env.GRAPH_NODE_URL_PRINT,
});

export const graphPrintServer = new ApolloClient({
  link: printServerLink,
  cache: new InMemoryCache(),
});

const kinoraServerLink = new HttpLink({
  uri: process.env.GRAPH_NODE_URL_KINORA,
});

export const graphKinoraServer = new ApolloClient({
  link: kinoraServerLink,
  cache: new InMemoryCache(),
});

const tripleServerLink = new HttpLink({
  uri: process.env.GRAPH_NODE_URL_TRIPLEA,
});

export const graphTripleServer = new ApolloClient({
  link: tripleServerLink,
  cache: new InMemoryCache(),
});

const autoServerLink = new HttpLink({
  uri: process.env.GRAPH_NODE_URL_AUTO,
});

export const graphAutoServer = new ApolloClient({
  link: autoServerLink,
  cache: new InMemoryCache(),
});

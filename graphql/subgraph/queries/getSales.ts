import { FetchResult, gql } from "@apollo/client";
import { graphPrintClient } from "../../../lib/graph/client";

const HISTORY = `
query($owner: String!) {
  collectionCreateds(where: {owner: $owner, soldTokens_gt: "0"}) {
    collectionMetadata {
      mediaCover
      images
    }
    origin
    orderIds
    buyerProfileIds
  }
}
`;

const SINGLE_ORDER_NFT = `
query($orderId: String!) {
  nftonlyOrderCreateds(where: {orderId: $orderId}) {
    orderId
    totalPrice
    currency
    subOrderAmount
    pubId
    profileId
    buyer
    blockTimestamp
    transactionHash
    images
}
}
`;

const SINGLE_ORDER = `
query($orderId: String!) {
  orderCreateds(where: {orderId: $orderId}) {
    orderId
    totalPrice
    currency
    subOrderAmount
    pubId
    profileId
    buyer
    blockTimestamp
    transactionHash
    images
  }
}
`;

export const getSalesHistory = async (
  owner: string
): Promise<FetchResult<any>> => {
  return graphPrintClient.query({
    query: gql(HISTORY),
    variables: {
      owner,
    },
    fetchPolicy: "no-cache",
  });
};

export const getNFTOrderById = async (
  orderId: string
): Promise<FetchResult<any>> => {
  return graphPrintClient.query({
    query: gql(SINGLE_ORDER_NFT),
    variables: {
      orderId,
    },
    fetchPolicy: "no-cache",
  });
};

export const getOrderById = async (
  orderId: string
): Promise<FetchResult<any>> => {
  return graphPrintClient.query({
    query: gql(SINGLE_ORDER),
    variables: {
      orderId,
    },
    fetchPolicy: "no-cache",
  });
};

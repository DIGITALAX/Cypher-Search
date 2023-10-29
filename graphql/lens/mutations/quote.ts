import { FetchResult } from "@apollo/client";
import { apolloClient } from "../../../lib/lens/client";
import {
  OnchainQuoteRequest,
  QuoteOnchainDocument,
  QuoteOnchainMutation,
} from "../../generated";

const quotePost = async (
  request: OnchainQuoteRequest
): Promise<FetchResult<QuoteOnchainMutation>> => {
  return await apolloClient.mutate({
    mutation: QuoteOnchainDocument,
    variables: {
      request: request,
    },
  });
};

export default quotePost;

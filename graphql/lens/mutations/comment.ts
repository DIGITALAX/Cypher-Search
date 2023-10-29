import { FetchResult } from "@apollo/client";
import { apolloClient } from "../../../lib/lens/client";
import {
  CommentOnchainDocument,
  CommentOnchainMutation,
  OnchainCommentRequest,
} from "../../generated";

const commentPost = async (
  request: OnchainCommentRequest
): Promise<FetchResult<CommentOnchainMutation>> => {
  return await apolloClient.mutate({
    mutation: CommentOnchainDocument,
    variables: {
      request: request,
    },
  });
};

export default commentPost;

import { FetchResult } from "@apollo/client";
import { apolloClient } from "../../../lib/lens/client";
import {
  AddReactionDocument,
  AddReactionMutation,
  ReactionRequest,
} from "../../generated";

const likePost = async (
  request: ReactionRequest
): Promise<FetchResult<AddReactionMutation>> => {
  return apolloClient.mutate({
    mutation: AddReactionDocument,
    variables: {
      request: request,
    },
  });
};

export default likePost;

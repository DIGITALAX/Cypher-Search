import { FetchResult } from "@apollo/client";
import { apolloClient } from "../../../lib/lens/client";
import {
  MirrorOnchainDocument,
  MirrorOnchainMutation,
  OnchainMirrorRequest,
} from "../../generated";

const mirrorPost = async (
  request: OnchainMirrorRequest
): Promise<FetchResult<MirrorOnchainMutation>> => {
  return apolloClient.mutate({
    mutation: MirrorOnchainDocument,
    variables: {
      request: request,
    },
  });
};

export default mirrorPost;

import { FetchResult } from "@apollo/client";
import { authClient } from "../../../lib/lens/client";
import {
  AddPublicationBookmarkDocument,
  AddPublicationBookmarkMutation,
  PublicationBookmarkRequest,
} from "../../generated";

const bookmark = async (
  request: PublicationBookmarkRequest
): Promise<FetchResult<AddPublicationBookmarkMutation>> => {
  return await authClient.mutate({
    mutation: AddPublicationBookmarkDocument,
    variables: {
      request: request,
    },
  });
};

export default bookmark;

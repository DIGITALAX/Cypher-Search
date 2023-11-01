import { FetchResult } from "@apollo/client";
import { apolloClient } from "../../../lib/lens/client";
import {
  OnchainSetProfileMetadataRequest,
  SetDefaultProfileMutation,
  SetProfileMetadataDocument,
} from "../../generated";

const profileMetadata = async (
  request: OnchainSetProfileMetadataRequest
): Promise<FetchResult<SetDefaultProfileMutation>> => {
  return await apolloClient.mutate({
    mutation: SetProfileMetadataDocument,
    variables: {
      request: request,
    },
  });
};

export default profileMetadata;

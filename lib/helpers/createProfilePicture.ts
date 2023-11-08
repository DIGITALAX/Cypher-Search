import { ProfilePicture, Maybe, NftImage } from "../../graphql/generated";
import { INFURA_GATEWAY } from "../constants";

const createProfilePicture = (
  publication: Maybe<ProfilePicture> | undefined
): string | undefined => {
  let profileImage: string;

  if (!publication) {
    return undefined;
  }

  if (publication?.__typename === "ImageSet") {
    if (publication?.raw?.uri) {
      profileImage = `${INFURA_GATEWAY}/ipfs/${
        publication?.raw?.uri?.split("ipfs://")[1]
      }`;
    } else {
      profileImage = publication?.optimized?.uri;
    }
  } else {
    if ((publication as NftImage)?.image?.raw?.uri) {
      profileImage = `${INFURA_GATEWAY}/ipfs/${
        (publication as NftImage)?.image?.raw?.uri?.split("ipfs://")[1]
      }`;
    } else {
      profileImage = (publication as NftImage)?.image?.optimized?.uri;
    }
  }

  return profileImage;
};

export default createProfilePicture;

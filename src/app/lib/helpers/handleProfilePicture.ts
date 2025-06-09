import { INFURA_GATEWAY_INTERNAL, GROVE_GATEWAY } from "../constants";

export const handleProfilePicture = (pic: string): string => {
  if (pic?.includes("https://")) {
    return pic;
  } else if (pic?.includes("ipfs://")) {
    return `${INFURA_GATEWAY_INTERNAL}${pic?.split("ipfs://")?.[1]}`;
  } else if (pic?.includes("lens://")) {
    return `${GROVE_GATEWAY}${pic?.split("lens://")?.[1]}`;
  }

  return `${INFURA_GATEWAY_INTERNAL}QmX5Uk9WeqsVHoNQhUP3fzTasv3J6zuat4L5L6zmaTVzBW`;
};

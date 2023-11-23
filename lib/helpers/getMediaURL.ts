import { INFURA_GATEWAY } from "../constants";

const getMediaUrl = (audio: string, video: string, type: string) => {
  let url = "";
  if (type === "audio" && audio) {
    url = audio.includes("ipfs://")
      ? `${INFURA_GATEWAY}/ipfs/${audio.split("ipfs://")[1]}`
      : audio;
  } else if (type === "video" && video) {
    url = video.includes("ipfs://")
      ? `${INFURA_GATEWAY}/ipfs/${video.split("ipfs://")[1]}`
      : video;
  }
  return url;
};

export default getMediaUrl;

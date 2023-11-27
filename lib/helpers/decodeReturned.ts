import { ethers } from "ethers";
import fetchIPFSJSON from "./fetchIpfsJson";

const decodeReturnedData = async (encodedData: ethers.BytesLike) => {
  const coder = new ethers.AbiCoder();

  if (encodedData.length < 96) {
    return;
  }

  let decodedData: any[] = [];

  try {
    decodedData = coder.decode(
      ["uint256[]", "address[]", "string"],
      encodedData
    ) as any[];
  } catch (err: any) {
    console.error(err.message);
  }

  const data = await fetchIPFSJSON(decodedData?.[2]);

  return {
    prices: decodedData?.[0],
    acceptedTokens: decodedData?.[1],
    ...data,
  };
};

export default decodeReturnedData;

import { ethers } from "ethers";
import fetchIPFSJSON from "./fetchIpfsJson";

const decodeReturnedData = async (encodedData: ethers.BytesLike) => {
  const coder = new ethers.AbiCoder();

  if (encodedData.length < 96) {
    return;
  }

  let decodedData = [];

  try {
    decodedData = coder.decode(
      ["uint256[]", "address[]", "string"],
      encodedData
    ) as any[];
  } catch (err: any) {
    console.error(err.message);
  }

  const uint256Array = Object.values(decodedData[0])?.map((item) =>
    String(Number(item) / 10 ** 18)
  );
  const addressArray = Object.values(decodedData[1]);

  const data = await fetchIPFSJSON(decodedData?.[2]);
  const { amount, ...rest } = data;
  return {
    prices: uint256Array,
    acceptedTokens: addressArray,
    amount,
    collectionMetadata: {
      ...rest,
    },
  };
};

export default decodeReturnedData;

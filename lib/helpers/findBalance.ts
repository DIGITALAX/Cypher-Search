import { PublicClient } from "viem";
import { ACCEPTED_TOKENS_MUMBAI } from "../constants";

const findBalance = async (
  publicClient: PublicClient,
  checkoutCurrency: string,
  address: `0x${string}`
) => {
  const data = await publicClient.readContract({
    address: checkoutCurrency as `0x${string}`,
    abi: [
      {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "balanceOf",
    args: [address],
  });

  return data;
};

export default findBalance;

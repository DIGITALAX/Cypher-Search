import { FollowModuleInput } from "../../graphql/generated";

const createSetFollowModule = (
  type: string | undefined,
  value: string | undefined,
  currency: string | undefined,
  recipient: string
): FollowModuleInput => {
  let followModule: FollowModuleInput = {
    freeFollowModule: type === "FreeFollowModule" || !type ? true : undefined,
    revertFollowModule: type === "RevertFollowModule" ? true : undefined,

    feeFollowModule: value
      ? {
          amount: {
            currency,
            value: !value ? "0" : String(Number(value).toFixed(2)),
          },
          recipient,
        }
      : undefined,
  };

  return followModule;
};

export default createSetFollowModule;

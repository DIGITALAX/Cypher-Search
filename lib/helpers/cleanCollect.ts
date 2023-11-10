import { SimpleCollectOpenActionModuleInput } from "../../graphql/generated";

const cleanCollect = (
  collectModuleInput: SimpleCollectOpenActionModuleInput
): SimpleCollectOpenActionModuleInput => {
  if (!collectModuleInput?.hasOwnProperty("followerOnly"))
    collectModuleInput.followerOnly = false;

  if (
    collectModuleInput.hasOwnProperty("amount") &&
    (!collectModuleInput?.amount?.hasOwnProperty("value") ||
      !collectModuleInput?.amount?.hasOwnProperty("currency")) &&
    parseFloat(collectModuleInput?.amount?.value || "") <= 0
  ) {
    delete collectModuleInput?.amount;
  }

  return collectModuleInput;
};

export default cleanCollect;

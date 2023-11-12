import { OpenActionModuleInput } from "../../graphql/generated";

const cleanCollect = (
  openActionModules: OpenActionModuleInput[]
): OpenActionModuleInput[] => {
  if (
    !openActionModules?.[0]?.collectOpenAction?.simpleCollectOpenAction?.hasOwnProperty(
      "followerOnly"
    )
  )
    openActionModules[0].collectOpenAction!.simpleCollectOpenAction!.followerOnly =
      false;

  if (
    openActionModules?.[0]?.collectOpenAction?.simpleCollectOpenAction?.hasOwnProperty(
      "amount"
    ) &&
    (!openActionModules?.[0]?.collectOpenAction.simpleCollectOpenAction.amount?.hasOwnProperty(
      "value"
    ) ||
      !openActionModules?.[0]?.collectOpenAction?.simpleCollectOpenAction?.amount?.hasOwnProperty(
        "currency"
      )) &&
    parseFloat(
      openActionModules?.[0]?.collectOpenAction?.simpleCollectOpenAction?.amount
        ?.value || ""
    ) <= 0
  ) {
    delete openActionModules?.[0]?.collectOpenAction?.simpleCollectOpenAction
      ?.amount;
  }

  return openActionModules;
};

export default cleanCollect;

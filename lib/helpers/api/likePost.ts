import { Dispatch } from "react";
import { PublicationReactionType } from "../../../graphql/generated";
import likePost from "../../../graphql/lens/mutations/like";
import pollUntilIndexed from "../../../graphql/lens/queries/indexed";
import { setInteractError } from "../../../redux/reducers/interactErrorSlice";
import { AnyAction } from "redux";

const lensLike = async (
  id: string,
  dispatch: Dispatch<AnyAction>
): Promise<void> => {
  const data = await likePost({
    for: id,
    reaction: PublicationReactionType.Upvote,
  });

  if (data?.data?.addReaction.__typename === "RelaySuccess") {
    const result = await pollUntilIndexed({
      forTxId: data?.data?.addReaction?.txId,
    });

    if (!result) {
      dispatch(setInteractError(true));
      console.error(result);
    }
  }
};

export default lensLike;

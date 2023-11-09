import { PublicationReactionType } from "../../../graphql/generated";
import likePost from "../../../graphql/lens/mutations/like";
import { AnyAction, Dispatch } from "redux";
import handleIndexCheck from "../../../graphql/lens/queries/indexed";

const lensLike = async (
  id: string,
  dispatch: Dispatch<AnyAction>
): Promise<void> => {
  const data = await likePost({
    for: id,
    reaction: PublicationReactionType.Upvote,
  });

  if (data?.data?.addReaction.__typename === "RelaySuccess") {
    await handleIndexCheck(
      {
        forTxId: data?.data?.addReaction?.txId,
      },
      dispatch
    );
  }
};

export default lensLike;

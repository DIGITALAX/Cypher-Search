import { AnyAction, Dispatch } from "redux";
import { setInteractError } from "../../redux/reducers/interactErrorSlice";
import { setIndexer } from "../../redux/reducers/indexerSlice";

const errorChoice = (
  err: any,
  runner: () => void,
  dispatch: Dispatch<AnyAction>
) => {
  if (
    !err?.messages?.includes("Block at number") &&
    !err?.message?.includes("could not be found")
  ) {
    dispatch(setInteractError(true));
    console.error(err.message);
  } else {
    dispatch(
      setIndexer({
        actionOpen: true,
        actionMessage: "Successfully Indexed",
      })
    );

    runner();

    setTimeout(() => {
      dispatch(
        setIndexer({
          actionOpen: false,
          actionMessage: undefined,
        })
      );
    }, 3000);
  }
};

export default errorChoice;

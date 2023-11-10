import { MouseEvent } from "react";
import { AnyAction, Dispatch } from "redux";

const handleSeek = (
  e: MouseEvent<HTMLDivElement, MouseEvent<Element, MouseEvent>>,
  index: number,
  dispatch: Dispatch<AnyAction>
) => {};

export default handleSeek;

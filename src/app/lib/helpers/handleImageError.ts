import { SyntheticEvent } from "react";
import { INFURA_GATEWAY_INTERNAL } from "../constants";

const handleImageError = (e: SyntheticEvent<HTMLImageElement>): void => {
  (
    e.target as HTMLImageElement
  ).src = `${INFURA_GATEWAY_INTERNAL}QmettvhoKTmwDxLKCw2qNTNn1FnHXyGuiKgA8X5dtQKdbb`;
};

export default handleImageError;
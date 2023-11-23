import { SyntheticEvent } from "react";
import { INFURA_GATEWAY } from "../constants";

const handleImageError = (e: SyntheticEvent<HTMLImageElement>): void => {
  (
    e.target as HTMLImageElement
  ).src = `${INFURA_GATEWAY}/ipfs/QmeupDitCvCXPsq5KSDSdhLrRjcXvNhaqpyuUcGyeW918W`;
};

export default handleImageError;

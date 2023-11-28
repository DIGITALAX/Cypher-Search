import { FunctionComponent } from "react";
import { TextProps } from "../../types/autograph.types";
import descriptionRegex from "../../../../../lib/helpers/descriptionRegex";

const Text: FunctionComponent<TextProps> = ({ metadata }): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col justify-start items-center gap-3">
      <div
        className={`relative w-full h-fit max-h-[20rem] font-aust text-white text-left item-start justify-start break-words flex overflow-y-scroll p-3 text-sm whitespace-preline ${
          metadata?.__typename !== "TextOnlyMetadataV3" &&
          metadata?.content?.length > 200
            ? "bg-black"
            : "bg-oscuro"
        }`}
        dangerouslySetInnerHTML={{
          __html: descriptionRegex(
            metadata?.content,
            metadata?.__typename !== "TextOnlyMetadataV3" &&
              metadata?.content?.length > 200
              ? false
              : true
          ),
        }}
      ></div>
    </div>
  );
};

export default Text;

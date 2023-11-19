import { FunctionComponent } from "react";
import { TextProps } from "../../types/autograph.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import { Post, Quote, Comment } from "../../../../../graphql/generated";
import descriptionRegex from "../../../../../lib/helpers/descriptionRegex";
import Publication from "../Publication";

const Text: FunctionComponent<TextProps> = ({
  metadata,
  type,
  id,
  quote,
  mirror,
  index,
  dispatch,
  router,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-col justify-start items-center gap-3">
      {(type === "Mirror" || type === "Quote") && (
        <div className="flex relative w-full h-fit items-center justify-end">
          {type === "Mirror" ? (
            <div className="relative flex flex-row gap-1.5 items-center justify-center text-white font-earl text-sm">
              <div className="relative flex items-center justify-center w-5 h-4">
                <Image
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3`}
                  draggable={false}
                />
              </div>
              <div className="relative flex items-center justify-center w-fit h-fit">
                Mirrored By
              </div>
              <div className="relative flex items-center justify-center w-fit h-fit">
                {mirror?.by?.handle?.localName}
              </div>
            </div>
          ) : (
            <div className="relative flex flex-row gap-1.5 items-center justify-center text-white font-earl text-sm">
              <div className="relative flex items-center justify-center w-5 h-5">
                <Image
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/QmfDNH347Vph4b1tEuegydufjMU2QwKzYnMZCjygGvvUMM`}
                  draggable={false}
                />
              </div>
              <div className="relative flex items-center justify-center w-fit h-fit">
                Quote Remix
              </div>
              {quote?.metadata?.marketplace?.name && (
                <div className="relative flex items-center justify-center w-fit h-fit">
                  On {quote?.metadata?.marketplace?.name?.slice(0, 8) + "..."}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      <div
        className={`relative w-full h-fit max-h-[20rem] font-aust text-white text-left item-start justify-start break-words flex overflow-y-scroll p-3 text-sm whitespace-preline ${
          metadata?.__typename !== "TextOnlyMetadataV3" &&
          metadata?.content?.length > 200
            ? "bg-black"
            : "bg-oscuro"
        }`}
        dangerouslySetInnerHTML={{
          __html: descriptionRegex(metadata?.content),
        }}
      ></div>
      {type === "Quote" && (
        <div className="relative w-full h-fit">
          <Publication
            index={index}
            item={quote as Comment | Post | Quote}
            router={router}
            disabled={true}
            dispatch={dispatch}
            data-post-id={id}
          />
        </div>
      )}
    </div>
  );
};

export default Text;

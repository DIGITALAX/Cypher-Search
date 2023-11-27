import { FunctionComponent } from "react";
import { PostQuoteProps } from "../types/autograph.types";
import Image from "next/legacy/image";
import createProfilePicture from "../../../../lib/helpers/createProfilePicture";
import moment from "moment";
import PostSwitch from "./PostSwitch";
import handleImageError from "../../../../lib/helpers/handleImageError";
import { ImageMetadataV3 } from "../../../../graphql/generated";
import {
  CHROMADIN_OPEN_ACTION,
  COIN_OP_OPEN_ACTION,
  LISTENER_OPEN_ACTION,
} from "../../../../lib/constants";

const PostQuote: FunctionComponent<PostQuoteProps> = ({
  quote,
  dispatch,
  router,
  pink,
  disabled,
}): JSX.Element => {
  const profilePicture = createProfilePicture(quote?.by?.metadata?.picture);
  return (
    <div
      className="relative w-full h-60 overflow-y-hidden sm:px-5 py-1 flex items-start justify-center"
      id="fadedQuote"
    >
      <div
        className={`relative w-full h-full p-2 flex items-center justify-start flex-col ${
          pink ? "from-lirio" : "from-offBlack cursor-pointer"
        } to-black bg-gradient-to-r rounded-md gap-5`}
        onClick={(e) => {
          e.stopPropagation();
          !pink &&
            (quote?.openActionModules?.[0]?.contract?.address
              ?.toLowerCase()
              ?.includes(CHROMADIN_OPEN_ACTION?.toLowerCase())
              ? router.push(
                  `/item/chromadin/${(
                    quote?.metadata as ImageMetadataV3
                  )?.title?.replaceAll(" ", "_")}`
                )
              : quote?.openActionModules?.[0]?.contract?.address
                  ?.toLowerCase()
                  ?.includes(COIN_OP_OPEN_ACTION?.toLowerCase())
              ? router.push(
                  `/item/coinop/${(
                    quote?.metadata as ImageMetadataV3
                  )?.title?.replaceAll(" ", "_")}`
                )
              : quote?.openActionModules?.[0]?.contract?.address
                  ?.toLowerCase()
                  ?.includes(LISTENER_OPEN_ACTION?.toLowerCase())
              ? router.push(
                  `/item/listener/${(
                    quote?.metadata as ImageMetadataV3
                  )?.title?.replaceAll(" ", "_")}`
                )
              : router.push(`/item/pub/${quote?.id}`));
        }}
      >
        <div className="relative w-full h-fit flex flex-row items-center justify-center gap-2 px-1">
          <div className="relative w-fit h-fit flex items-center justify-center gap-1 mr-auto">
            <div className="relative w-fit h-fit flex items-center justify-center">
              <div
                className="relative flex items-center justify-center rounded-full w-5 h-5"
                id="pfp"
              >
                {profilePicture && (
                  <Image
                    layout="fill"
                    src={profilePicture}
                    draggable={false}
                    className="rounded-full"
                    objectFit="cover"
                    onError={(e) => handleImageError(e)}
                  />
                )}
              </div>
            </div>
            <div
              className={`relative w-fit h-fit text-sm flex items-center justify-center text-white font-bit top-px`}
            >
              {quote?.by?.handle?.suggestedFormatted?.localName
                ? quote?.by?.handle?.suggestedFormatted?.localName.length > 25
                  ? quote?.by?.handle?.suggestedFormatted?.localName.substring(
                      0,
                      20
                    ) + "..."
                  : quote?.by?.handle?.suggestedFormatted?.localName
                : ""}
            </div>
          </div>
          <div className="relative w-fit h-fit flex items-center justify-center">
            <div
              className={`relative w-fit h-fit text-white font-bit items-center justify-center flex text-sm ml-auto top-px`}
            >
              {quote?.createdAt && moment(`${quote?.createdAt}`).fromNow()}
            </div>
          </div>
        </div>
        <div className="relative w-full h-fit flex items-start justify-center">
          <PostSwitch item={quote} dispatch={dispatch} disabled={disabled} />
        </div>
      </div>
    </div>
  );
};

export default PostQuote;

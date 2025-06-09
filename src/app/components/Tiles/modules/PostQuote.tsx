import { FunctionComponent, JSX, useContext } from "react";
import Image from "next/legacy/image";
import moment from "moment";
import PostSwitch from "./PostSwitch";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";
import handleImageError from "@/app/lib/helpers/handleImageError";
import { PostQuoteProps } from "../types/tiles.types";
import { useRouter } from "next/navigation";
import checkActions from "@/app/lib/helpers/checkActions";
import { ModalContext } from "@/app/providers";

const PostQuote: FunctionComponent<PostQuoteProps> = ({
  quote,
  pink,
  disabled,
}): JSX.Element => {
  const router = useRouter();
  const context = useContext(ModalContext);
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
          if (!pink) {
            context?.setFiltersOpen({ value: false, allow: false });
            checkActions(quote, router);
          }
        }}
      >
        <div className="relative w-full h-fit flex flex-row items-center justify-center gap-2 px-1">
          <div className="relative w-fit h-fit flex items-center justify-center gap-1 mr-auto">
            <div className="relative w-fit h-fit flex items-center justify-center">
              <div
                className="relative flex items-center justify-center rounded-full w-5 h-5"
                id="pfp"
              >
                <Image
                  layout="fill"
                  src={handleProfilePicture(quote?.author?.metadata?.picture)}
                  draggable={false}
                  key={quote?.author?.metadata?.picture}
                  className="rounded-full"
                  objectFit="cover"
                  onError={(e) => handleImageError(e)}
                />
              </div>
            </div>
            <div
              className={`relative w-fit h-fit text-xs flex items-center justify-center text-white font-bit top-px`}
            >
              {quote?.author?.username?.localName
                ? quote?.author?.username?.localName.length > 25
                  ? quote?.author?.username?.localName?.substring(0, 20) + "..."
                  : quote?.author?.username?.localName
                : ""}
            </div>
          </div>
          <div className="relative w-fit h-fit flex items-center justify-center">
            <div
              className={`relative w-fit h-fit text-white font-bit items-center justify-center flex text-xs ml-auto top-px`}
            >
              {quote?.timestamp && moment(`${quote?.timestamp}`).fromNow()}
            </div>
          </div>
        </div>
        <div className="relative w-full h-fit flex items-start justify-center">
          <PostSwitch item={quote} disabled={disabled} />
        </div>
      </div>
    </div>
  );
};

export default PostQuote;

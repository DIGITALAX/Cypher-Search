import { FunctionComponent } from "react";
import { PostQuoteProps } from "../types/autograph.types";
import {
  PublicationMetadataMedia,
  TextOnlyMetadataV3,
} from "../../../../graphql/generated";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import Image from "next/legacy/image";
import createProfilePicture from "../../../../lib/helpers/createProfilePicture";
import descriptionRegex from "../../../../lib/helpers/descriptionRegex";
import {
  metadataMedia,
  postMetadata,
} from "../../../../lib/helpers/postMetadata";
import moment from "moment";

const PostQuote: FunctionComponent<PostQuoteProps> = ({
  quote,
}): JSX.Element => {
  const profilePicture = createProfilePicture(quote?.by?.metadata?.picture);
  return (
    <div
      className="relative w-full h-72 overflow-y-hidden px-5 py-1 flex items-start justify-center"
      id="fadedQuote"
    >
      <div className="relative w-full h-fit p-2 flex items-center justify-start flex-col from-gray-400 via-gray-600 to-gray-800 bg-gradient-to-r rounded-md gap-5">
        <div className="relative w-full h-fit flex cursor-pointer">
          <div
            className={`relative w-full h-fit flex flex-row flex-wrap sm:flex-nowrap gap-6 rounded-md z-0`}
          >
            <div
              className={`relative h-auto rounded-md pr-px py-px w-full sm:w-40 preG:min-w-[7.5rem]`}
              id="sideProfile"
            >
              <div
                className={`relative w-full h-full bg-shame rounded-md flex flex-col items-start sm:items-center py-1.5 px-1 gap-3`}
              >
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/QmSjh6dsibg9yDfBwRfC5YSWFTmwpwPxRDTFG8DzLHzFyB`}
                  layout="fill"
                  objectFit="cover"
                  className="absolute w-full h-full rounded-lg"
                  draggable={false}
                />
                <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto">
                  <div
                    className={`w-20 relative h-8 rounded-full flex justify-self-center`}
                  >
                    <Image
                      src={`${INFURA_GATEWAY}/ipfs/QmfDmMCcgcseCFzGam9DbmDk5sQRbt6zrQVhvj4nTeuLGq`}
                      layout="fill"
                      alt="backdrop"
                      priority
                      draggable={false}
                      className="rounded-full w-full h-full"
                    />
                  </div>
                  <div
                    className={`absolute rounded-full flex bg-white w-8 h-full justify-self-center sm:right-6 col-start-1`}
                    id="crt"
                  >
                    {profilePicture && (
                      <Image
                        src={profilePicture}
                        objectFit="cover"
                        alt="pfp"
                        layout="fill"
                        className="relative w-full h-full rounded-full"
                        draggable={false}
                      />
                    )}
                  </div>
                </div>
                <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto">
                  <div
                    className={`relative w-fit h-fit font-dosis text-xs justify-self-center`}
                    id={"username"}
                  >
                    {quote?.by?.handle?.suggestedFormatted?.localName
                      ? quote?.by?.handle?.suggestedFormatted?.localName
                          .length > 25
                        ? quote?.by?.handle?.suggestedFormatted?.localName.substring(
                            0,
                            20
                          ) + "..."
                        : quote?.by?.handle?.suggestedFormatted?.localName
                      : ""}
                  </div>
                </div>
                <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto">
                  <div
                    className={`relative w-fit h-fit ${
                      quote?.by?.handle?.localName
                        ? "row-start-2"
                        : "row-start-1"
                    } font-clash text-xs justify-self-center text-black`}
                  >
                    {quote?.by?.handle?.localName?.length! > 15
                      ? quote?.by?.handle?.localName?.substring(0, 10) + "..."
                      : quote?.by?.handle?.suggestedFormatted?.localName}
                  </div>
                </div>
                <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto">
                  <div
                    className={`relative w-fit h-fit text-offBlack font-dosis justify-self-center fo:pb-0 pb-2 text-xs `}
                  >
                    {quote?.createdAt &&
                      moment(`${quote?.createdAt}`).fromNow()}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`relative w-full h-auto grow rounded-md grid grid-flow-row auto-rows-auto p-3 preG:p-6 gap-6 border-2  bg-gradient-to-r ${
                (quote as any)?.gated
                  ? "from-gray-400 via-gray-600 to-gray-800 border-white"
                  : "from-offBlack via-gray-600 to-black border-black"
              }`}
            >
              <div
                className={`${
                  quote?.__typename === "Comment"
                    ? "row-start-2"
                    : "row-start-1"
                } relative w-full h-fit text-left font-dosis grid grid-flow-row auto-rows-auto gap-6`}
              >
                <div
                  className={`relative w-full h-fit row-start-1 relative h-fit text-white font-dosis self-center justify-self-start break-all preG:break-words`}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: descriptionRegex(
                        (quote as any)?.gated
                          ? (quote as any)?.result?.content
                          : (quote?.metadata as TextOnlyMetadataV3)?.content
                      ),
                    }}
                    className="relative place-self-center whitespace-preline break-all preG:break-words"
                  ></div>
                </div>
              </div>
              <div
                className={`relative w-fit max-w-full h-fit rounded-lg overflow-x-scroll grid grid-flow-col auto-cols-auto gap-3 z-10 ${
                  quote?.__typename === "Comment"
                    ? "row-start-3"
                    : "row-start-2"
                }`}
              >
                {postMetadata(quote) &&
                  postMetadata(quote)?.map(
                    (item: PublicationMetadataMedia, index: number) => {
                      const media = metadataMedia(item);
                      return (
                        <div
                          key={index}
                          className={`${
                            media?.type !== "Audio"
                              ? "h-40 preG:h-60 border-2 border-black rounded-lg bg-black"
                              : "h-10"
                          } w-40  preG:w-60 relative grid grid-flow-col auto-cols-auto col-start-${
                            index + 1
                          } `}
                        >
                          <div className="relative w-full h-full col-start-1 flex rounded-md">
                            {media?.type === "Image" ? (
                              <Image
                                src={media?.url}
                                layout="fill"
                                objectFit="cover"
                                objectPosition={"center"}
                                className="rounded-md"
                                draggable={false}
                              />
                            ) : media?.type === "Audio" ? (
                              <audio
                                muted
                                controls
                                className="rounded-md absolute w-full h-full object-cover"
                              >
                                <source src={media?.url} />
                              </audio>
                            ) : (
                              <video
                                muted
                                controls
                                className="rounded-md absolute w-full h-full object-cover"
                              >
                                <source src={media?.url} />
                              </video>
                            )}
                          </div>
                        </div>
                      );
                    }
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostQuote;

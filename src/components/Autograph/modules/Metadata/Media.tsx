import { FunctionComponent } from "react";
import { PublicationMetadataMedia } from "../../../../../graphql/generated";
import Image from "next/legacy/image";
import { ImageProps } from "../../types/autograph.types";
import { metadataMedia } from "../../../../../lib/helpers/postMetadata";
import { setImageViewer } from "../../../../../redux/reducers/ImageLargeSlice";
import Waveform from "../Screen/Waveform";
import descriptionRegex from "../../../../../lib/helpers/descriptionRegex";

const Media: FunctionComponent<ImageProps> = ({
  dispatch,
  metadata,
  disabled,
  encrypted,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-col justify-start items-center gap-3 break-words max-w-full">
      {((metadata?.content && metadata?.content?.trim() !== "") ||
        (encrypted &&
          !encrypted?.decrypted &&
          metadata?.title &&
          metadata?.title?.trim() !== "")) && (
        <div
          className={`relative w-full h-fit max-h-[12rem] font-aust  text-left item-start justify-start break-words flex overflow-y-scroll p-3 text-sm whitespace-preline ${
            metadata?.__typename === "ImageMetadataV3"
              ? "bg-offBlack text-white"
              : metadata?.__typename === "VideoMetadataV3"
              ? "bg-viol text-black"
              : "bg-nuba text-black"
          }`}
          dangerouslySetInnerHTML={{
            __html: descriptionRegex(
              encrypted && !encrypted?.decrypted
                ? metadata?.title
                : metadata?.content,
              metadata?.__typename === "VideoMetadataV3" ? true : false
            ),
          }}
        ></div>
      )}
      <div
        className={`relative w-full h-fit overflow-x-scroll gap-2 items-center justify-start flex`}
      >
        <div className="relative w-fit h-fit gap-2 flex flex-row items-center justify-start">
          {((!encrypted &&
            [metadata?.asset, ...(metadata?.attachments || [])].filter(Boolean)
              ?.length > 0) ||
            (encrypted &&
              encrypted?.operations?.canDecrypt?.result &&
              encrypted?.decrypted)) &&
            [metadata?.asset, ...(metadata?.attachments || [])]
              ?.filter(Boolean)
              ?.map((item: PublicationMetadataMedia, index: number) => {
                const media = metadataMedia(item);

                return (
                  <div
                    key={index}
                    className={`w-60 border border-white rounded-sm h-60 flex items-center justify-center bg-offBlack ${
                      media?.url && !disabled && "cursor-pointer"
                    }`}
                    onClick={() =>
                      media?.type === "Image" &&
                      !disabled &&
                      dispatch(
                        setImageViewer({
                          actionValue: true,
                          actionType: "png",
                          actionImage: media.url,
                        })
                      )
                    }
                  >
                    <div className="relative w-full h-full flex rounded-sm items-center justify-center">
                      {media?.url &&
                        (media?.type === "Image" ? (
                          <Image
                            src={media?.url}
                            layout="fill"
                            objectFit="cover"
                            objectPosition={"center"}
                            className="rounded-sm"
                            draggable={false}
                          />
                        ) : media?.type === "Video" ? (
                          <>
                            <video
                              draggable={false}
                              controls={false}
                              muted
                              // autoPlay
                              playsInline
                              loop
                              id={media?.url}
                              className="rounded-sm absolute w-full h-full object-cover"
                              poster={media?.cover}
                            >
                              <source src={media?.url} />
                            </video>
                            <Waveform
                              audio={media?.url}
                              type={"video"}
                              keyValue={media?.url!}
                              video={media?.url!}
                            />
                          </>
                        ) : (
                          <>
                            <Image
                              src={media?.cover!}
                              layout="fill"
                              objectFit="cover"
                              objectPosition={"center"}
                              className="rounded-md"
                              draggable={false}
                            />
                            <Waveform
                              audio={media?.url!}
                              type={"audio"}
                              keyValue={media?.url!}
                              video={media?.url!}
                            />
                          </>
                        ))}
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
};

export default Media;

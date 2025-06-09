import { FunctionComponent, JSX, useContext } from "react";
import MediaSwitch from "../../Common/modules/MediaSwitch";
import { MediaAudio, MediaVideo, MediaImage } from "@lens-protocol/client";
import { handleMedia } from "@/app/lib/helpers/handleMedia";
import descriptionRegex from "@/app/lib/helpers/descriptionRegex";
import { ModalContext } from "@/app/providers";
import { ImageProps } from "../types/tiles.types";

const Media: FunctionComponent<ImageProps> = ({
  metadata,
  disabled,
}): JSX.Element => {
  const context = useContext(ModalContext);
  return (
    <div className="relative w-full h-fit flex flex-col justify-start items-center gap-3 break-words max-w-full">
      {metadata?.content && metadata?.content?.trim() !== "" && (
        <div
          className={`relative w-full h-fit max-h-[12rem] font-aust  text-left items-start justify-start break-all flex overflow-y-scroll p-3 text-sm whitespace-preline ${
            metadata?.__typename === "ImageMetadata"
              ? "bg-offBlack text-white"
              : metadata?.__typename === "VideoMetadata"
              ? "bg-viol text-black"
              : "bg-nuba text-black"
          }`}
          dangerouslySetInnerHTML={{
            __html: descriptionRegex(
              metadata?.content,
              metadata?.__typename === "VideoMetadata" ? true : false
            ),
          }}
        ></div>
      )}
      <div
        className={`relative w-full h-fit overflow-x-scroll gap-2 items-center justify-start flex`}
      >
        <div className="relative w-fit h-fit gap-2 flex flex-row items-center justify-start">
          {[
            metadata?.__typename == "AudioMetadata"
              ? metadata?.audio
              : metadata?.__typename == "VideoMetadata"
              ? metadata?.video
              : metadata?.image,
            ...(metadata?.attachments || []),
          ]
            ?.filter(Boolean)
            ?.map(
              (item: MediaAudio | MediaImage | MediaVideo, index: number) => {
                const media = handleMedia(item);

                return (
                  <div
                    key={index}
                    className={`w-60 relative border border-white rounded-sm h-60 flex items-center justify-center bg-offBlack ${
                      media?.url && !disabled && "cursor-pointer"
                    }`}
                    onClick={() =>
                      media?.type === "Image" &&
                      !disabled &&
                      context?.setImageViewer({
                        type: "png",
                        image: media?.url!,
                      })
                    }
                  >
                    <div className="relative w-full h-full flex rounded-sm items-center justify-center">
                      {media?.url && (
                        <MediaSwitch
                          type={media?.type}
                          srcUrl={media?.url}
                          srcCover={media?.cover}
                          classNameVideo={{
                            objectFit: "cover",
                            display: "flex",
                            width: "100%",
                            height: "100%",
                            alignItems: "center",
                            justifyItems: "center",
                            borderRadius: "0.125rem",
                            position: "absolute",
                          }}
                          classNameImage={"rounded-sm"}
                          classNameAudio={"rounded-md"}
                        />
                      )}
                    </div>
                  </div>
                );
              }
            )}
        </div>
      </div>
    </div>
  );
};

export default Media;

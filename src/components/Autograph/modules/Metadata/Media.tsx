import { FunctionComponent } from "react";
import { PublicationMetadataMedia } from "../../../../../graphql/generated";
import { ImageProps } from "../../types/autograph.types";
import { metadataMedia } from "../../../../../lib/helpers/postMetadata";
import { setImageViewer } from "../../../../../redux/reducers/ImageLargeSlice";
import descriptionRegex from "../../../../../lib/helpers/descriptionRegex";
import MediaSwitch from "@/components/Common/modules/MediaSwitch";

const Media: FunctionComponent<ImageProps> = ({
  dispatch,
  metadata,
  disabled,
  encrypted,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col justify-start items-center gap-3 break-words max-w-full">
      {((metadata?.content && metadata?.content?.trim() !== "") ||
        (encrypted &&
          !encrypted?.decrypted &&
          metadata?.title &&
          metadata?.title?.trim() !== "")) && (
        <div
          className={`relative w-full h-fit max-h-[12rem] font-aust  text-left items-start justify-start break-all flex overflow-y-scroll p-3 text-sm whitespace-preline ${
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
                    className={`w-60 relative border border-white rounded-sm h-60 flex items-center justify-center bg-offBlack ${
                      media?.url && !disabled && "cursor-pointer"
                    }`}
                    onClick={() =>
                      media?.type === "Image" &&
                      !disabled &&
                      dispatch(
                        setImageViewer({
                          actionValue: true,
                          actionType: "png",
                          actionImage: media?.url,
                        })
                      )
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
              })}
        </div>
      </div>
    </div>
  );
};

export default Media;

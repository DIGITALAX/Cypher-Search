import { FunctionComponent } from "react";
import Publication from "../Publication";
import {
  Post,
  Quote,
  Comment,
  PublicationMetadataMedia,
  PublicationMetadataMediaAudio,
} from "../../../../../graphql/generated";
import Image from "next/legacy/image";
import { ImageProps } from "../../types/autograph.types";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import { metadataMedia } from "../../../../../lib/helpers/postMetadata";
import { setImageViewer } from "../../../../../redux/reducers/ImageLargeSlice";
import Waveform from "../Screen/Waveform";
import descriptionRegex from "../../../../../lib/helpers/descriptionRegex";

const Media: FunctionComponent<ImageProps> = ({
  type,
  dispatch,
  router,
  metadata,
  mirror,
  quote,
  id,
  index,
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
      {metadata?.content && (
        <div
          className={`relative w-full h-fit max-h-[12rem] font-aust  text-left item-start justify-start break-words flex overflow-y-scroll p-3 text-sm whitespace-preline ${
            metadata?.__typename === "ImageMetadataV3"
              ? "bg-offBlack text-white"
              : metadata?.__typename === "VideoMetadataV3"
              ? "bg-viol text-black"
              : "bg-nuba text-black"
          }`}
          dangerouslySetInnerHTML={{
            __html: descriptionRegex(metadata?.content),
          }}
        ></div>
      )}
      <div
        className={`relative w-full h-fit overflow-x-scroll gap-2 items-center justify-start flex`}
      >
        <div className="relative w-fit h-fit gap-2 flex flex-row items-center justify-start">
          {[metadata?.asset, ...(metadata?.attachments || [])]
            .filter(Boolean)
            ?.map((item: PublicationMetadataMedia, index: number) => {
              const media = metadataMedia(item);
              return (
                <div
                  key={index}
                  className={`w-60 border border-white rounded-sm h-60 flex items-center justify-center bg-offBlack`}
                  onClick={() =>
                    media?.type === "Image" &&
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
                    {media?.type === "Image" ? (
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
                          className="rounded-sm absolute w-full h-full object-cover"
                          poster={`${INFURA_GATEWAY}/ipfs/${media?.cover}`}
                        >
                          <source src={media?.url} />
                        </video>
                        <Waveform
                          audio={""}
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
                          video={""}
                        />
                      </>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
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

export default Media;

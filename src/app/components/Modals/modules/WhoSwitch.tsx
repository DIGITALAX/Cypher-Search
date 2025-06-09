import { FunctionComponent, JSX, useContext } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "next/legacy/image";
import { useRouter } from "next/navigation";
import { Account, ImageMetadata, Post } from "@lens-protocol/client";
import handleImageError from "@/app/lib/helpers/handleImageError";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";
import { ModalContext } from "@/app/providers";
import { WhoSwitchProps } from "../types/modals.types";
import Publication from "../../Tiles/modules/Publication";

const WhoSwitch: FunctionComponent<WhoSwitchProps> = ({
  reactors,
  quoters,
  showMore,
  hasMoreQuote,
  hasMore,
  mirrorQuote,
  dict,
}): JSX.Element => {
  const router = useRouter();
  const context = useContext(ModalContext);

  if (mirrorQuote && quoters?.length > 0) {
    return (
      <div className="relative w-full h-fit flex flex-col overflow-y-scroll max-h-[20rem]">
        <InfiniteScroll
          dataLength={quoters?.length}
          loader={<></>}
          hasMore={hasMoreQuote}
          next={showMore}
          className="w-fit h-fit items-start justify-start flex flex-col gap-10"
        >
          {quoters?.map((item: Post, index: number) => {
            return (
              <Publication
                dict={dict}
                index={index}
                item={item}
                disabled={true}
                data-post-id={item?.id}
                key={index}
                top={
                  (item?.metadata as ImageMetadata)?.content?.length < 100 &&
                  item?.metadata?.__typename !== "AudioMetadata" &&
                  item?.metadata?.__typename !== "ImageMetadata" &&
                  item?.metadata?.__typename !== "VideoMetadata"
                    ? "20px"
                    : "auto"
                }
                bottom={
                  (item?.metadata as ImageMetadata)?.content?.length < 100 &&
                  item?.metadata?.__typename !== "AudioMetadata" &&
                  item?.metadata?.__typename !== "ImageMetadata" &&
                  item?.metadata?.__typename !== "VideoMetadata"
                    ? "auto"
                    : "2px"
                }
                left={"auto"}
                right={"2px"}
              />
            );
          })}
        </InfiniteScroll>
      </div>
    );
  } else {
    return reactors?.length > 0 && !mirrorQuote ? (
      <div className="relative w-full h-40 flex flex-col overflow-y-scroll">
        <InfiniteScroll
          hasMore={!mirrorQuote ? hasMore : hasMoreQuote}
          dataLength={!mirrorQuote ? reactors?.length : quoters?.length}
          next={showMore}
          loader={""}
          height={"10rem"}
          className="relative w-full h-40 flex flex-col px-4 gap-2 overflow-y-scroll"
        >
          {reactors?.map((reactor: Account, index: number) => {
            return (
              <div
                key={index}
                className="relative w-full h-14 p-2 flex flex-row border border-black items-center justify-start font-bit text-white cursor-pointer border border-white"
                id="prerollFaded"
                onClick={() => {
                  context?.setFiltersOpen({ value: false, allow: false });
                  context?.setReactBox(undefined);
                  router.push(`/autograph/${reactor?.username?.localName}`);
                }}
              >
                <div className="relative w-fit h-fit flex flex-row gap-3 items-center justify-center">
                  <div
                    className="relative w-8 h-8 rounded-full border border-white items-center justify-center"
                    id="pfp"
                  >
                    <Image
                      src={handleProfilePicture(reactor?.metadata?.picture)}
                      objectFit="cover"
                      key={reactor?.metadata?.picture}
                      layout="fill"
                      alt="pfp"
                      className="relative w-fit h-fit rounded-full self-center flex"
                      draggable={false}
                      onError={(e) => handleImageError(e)}
                    />
                  </div>
                  <div
                    id="handle"
                    className="relative w-fit h-fit justify-center items-center flex top-px text-sm"
                  >
                    {reactor?.username?.localName}
                  </div>
                </div>
              </div>
            );
          })}
        </InfiniteScroll>
      </div>
    ) : (
      <></>
    );
  }
};

export default WhoSwitch;

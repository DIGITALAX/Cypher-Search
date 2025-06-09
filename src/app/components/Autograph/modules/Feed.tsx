import { FunctionComponent, JSX } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Publication from "../../Tiles/modules/Publication";
import { Post, Repost, TextOnlyMetadata } from "@lens-protocol/client";
import { FeedProps } from "../types/autograph.types";
import useFeed from "../hooks/useFeed";

const Feed: FunctionComponent<FeedProps> = ({ dict, profile }): JSX.Element => {
  const { profileFeed, hasMoreFeed, getMoreFeed } = useFeed(profile);
  return (
    <div className="relative flex items-start justify-start w-full h-auto z-10 otro:order-1 order-2">
      <div className="relative flex items-center justify-start flex-col gap-4 bg-olor rounded-sm px-px sm:px-4 py-4 w-full sm:w-96 h-fit">
        <div className="absolute flex items-center justify-center text-xl sm:text-3xl font-bit text-[#00FFBA] top-3 w-fit h-fit blur-sm break-words">
          {dict?.upd}
        </div>
        <div className="absolute flex items-center justify-center text-xl sm:text-3xl font-bit text-white top-3.5 w-fit h-fit blur-sm break-words">
          {dict?.upd}
        </div>
        <div className="relative flex items-center justify-center text-xl sm:text-3xl font-bit text-saph w-fit h-fit break-words">
          {dict?.upd}
        </div>
        <div
          className={`relative flex items-start justify-center w-fit h-full ${
            profileFeed?.length < 1 ? "left-auto" : "left-auto sm:left-20"
          }`}
          id={profileFeed?.length < 1 ? "" : "feedWrapper"}
        >
          <div
            className={`relative h-[80rem] otro:h-[200rem] flex items-start  justify-center overflow-y-scroll max-w-full ${
              profileFeed?.length < 1 ? "w-full" : "w-fit"
            }`}
            id={profileFeed?.length < 1 ? "" : "feed"}
          >
            {profileFeed?.length < 1 ? (
              <div className="relative w-fit h-fit flex items-start justify-center text-center font-bit text-lirio text-xs">
                {dict?.nada}
              </div>
            ) : (
              <InfiniteScroll
                dataLength={profileFeed?.length}
                loader={<></>}
                hasMore={hasMoreFeed}
                next={getMoreFeed}
                className="w-fit h-fit items-start justify-start flex flex-col gap-10"
              >
                {profileFeed?.map((item: Post | Repost, index: number) => {
                  const type =
                    item?.__typename === "Repost" ? item.repostOf : item;
                  return (
                    <Publication
                      dict={dict}
                      top={
                        (type?.metadata as TextOnlyMetadata)?.content?.length <
                          100 &&
                        type?.metadata?.__typename !== "AudioMetadata" &&
                        type?.metadata?.__typename !== "ImageMetadata" &&
                        type?.metadata?.__typename !== "VideoMetadata"
                          ? "20px"
                          : "auto"
                      }
                      bottom={
                        (type?.metadata as TextOnlyMetadata)?.content?.length <
                          100 &&
                        type?.metadata?.__typename !== "AudioMetadata" &&
                        type?.metadata?.__typename !== "ImageMetadata" &&
                        type?.metadata?.__typename !== "VideoMetadata"
                          ? "auto"
                          : "2px"
                      }
                      left={"auto"}
                      right={"2px"}
                      data-post-id={item?.id}
                      key={index}
                      index={index}
                      item={item}
                    />
                  );
                })}
              </InfiniteScroll>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;

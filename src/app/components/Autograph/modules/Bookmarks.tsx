import { FunctionComponent, JSX } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Publication from "../../Tiles/modules/Publication";
import useBookmarks from "../hooks/useBookmarks";
import { TextOnlyMetadata } from "@lens-protocol/client";

const Bookmarks: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const { bookmarksLoading, bookmarks, hasMoreBookmarks, handleMoreBookmarks } =
    useBookmarks();
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative flex w-full tablet:w-4/5 h-fit items-start justify-center rounded-sm">
        <div
          className="relative w-full h-full flex flex-col items-center justify-start gap-5 p-px"
          id="pfp"
        >
          <div
            className={`relative w-full bg-blurs flex bg-cover rounded-sm p-3 justify-center overflow-y-scroll h-[55rem] sm:h-[40rem] min-h-[35rem] tablet:h-[35rem] ${
              !bookmarksLoading && bookmarks?.length == 0
                ? "items-center"
                : "items-start"
            }`}
          >
            {bookmarksLoading ? (
              <div className="relative flex flex-col gap-2 items-start justify-center animate-pulse">
                {Array.from({ length: 20 })?.map((_, index: number) => {
                  return (
                    <div
                      key={index}
                      className="relative bg-lirio rounded-sm h-96 w-110 p-2 flex flex-col gap-2 border-2 items-center justify-between border-cereza"
                      id="staticLoad"
                    ></div>
                  );
                })}
              </div>
            ) : bookmarks?.length > 0 ? (
              <InfiniteScroll
                next={handleMoreBookmarks}
                hasMore={hasMoreBookmarks}
                dataLength={bookmarksLoading ? 20 : bookmarks?.length}
                loader={<></>}
                className="w-full sm:w-fit h-fit items-center justify-start flex flex-col gap-10"
              >
                {bookmarks?.map((item, index: number) => {
                  const type =
                    item?.__typename === "Repost" ? item.repostOf : item;
                  return (
                    <Publication
                      dict={dict}
                      index={index}
                      item={item}
                      key={index}
                      data-post-id={item?.id}
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
                    />
                  );
                })}
              </InfiniteScroll>
            ) : (
              <div className="relative w-1/2  h-full flex items-center justify-center font-ignite text-xl text-white text-center break-words">
                {dict?.book}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;

import { FunctionComponent } from "react";
import { FeedProps } from "../types/autograph.types";
import InfiniteScroll from "react-infinite-scroll-component";
import { Mirror, Post as PostType, Quote } from "../../../../graphql/generated";
import Post from "./Post";

const Feed: FunctionComponent<FeedProps> = ({
  profileFeed,
  getMoreFeed,
}): JSX.Element => {
  return (
    <div className="relative flex items-start justify-start w-full h-auto z-10">
      <div className="relative flex items-center justify-start flex-col gap-4 bg-olor rounded-sm p-4 w-96 h-fit">
        <div className="relative flex items-center justify-center text-3xl font-bit text-saph w-fit h-fit">
          Recent Updates
        </div>
        <div
          className="relative w-fit h-[200rem] flex items-start left-32 justify-center overflow-y-scroll"
          id="feed"
        >
          <InfiniteScroll
            dataLength={16}
            loader={<></>}
            hasMore={true}
            next={getMoreFeed}
            className="w-fit h-fit items-start justify-start flex flex-col gap-10"
          >
            {Array.from({ length: 20 })?.map(
              (item: PostType | Quote | Mirror, index: number) => {
                return (
                  <div
                    key={index}
                    className="relative bg-lirio rounded-sm h-72 w-110 p-2 flex flex-col gap-2"
                  >
                    <Post item={item} />
                    <div className="relative w-full justify-between flex flex-row items-center gap-2">
                      <div></div>
                      <div></div>
                    </div>
                  </div>
                );
              }
            )}
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
};

export default Feed;

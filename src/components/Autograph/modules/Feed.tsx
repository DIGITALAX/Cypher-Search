import { FunctionComponent } from "react";
import { FeedProps } from "../types/autograph.types";
import InfiniteScroll from "react-infinite-scroll-component";
import { Mirror, Post, Quote } from "../../../../graphql/generated";
import PostSwitch from "./PostSwitch";
import PostBar from "./PostBar";

const Feed: FunctionComponent<FeedProps> = ({
  profileFeed,
  getMoreFeed,
  interactionsLoading,
  mirror,
  openMirrorChoice,
  setOpenMirrorChoice,
  like,
  collect,
  comment,
  quote,
  router,
  unfollowProfile,
  followProfile,
  followLoading,
  profileHovers,
  setProfileHovers,
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
              (item: Post | Quote | Mirror, index: number) => {
                return (
                  <div
                    key={index}
                    className="relative bg-lirio rounded-sm h-72 w-110 p-2 flex flex-col gap-2 border-2 items-center justify-between border-cereza"
                  >
                    <PostSwitch item={item} />
                    <PostBar
                      index={index}
                      item={item}
                      router={router}
                      quote={quote}
                      mirror={mirror}
                      like={like}
                      comment={comment}
                      interactionsLoading={interactionsLoading?.[index]}
                      profileHovers={profileHovers}
                      setProfileHovers={setProfileHovers}
                      openMirrorChoice={openMirrorChoice}
                      setOpenMirrorChoice={setOpenMirrorChoice}
                      collect={collect}
                      followLoading={followLoading}
                      followProfile={followProfile}
                      unfollowProfile={unfollowProfile}
                    />
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

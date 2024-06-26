import { FunctionComponent } from "react";
import PostComment from "../PostComment";
import { ScreenPostProps } from "../../types/autograph.types";

const ScreenPost: FunctionComponent<ScreenPostProps> = ({
  post,
  makePost,
  postLoading,
  setMakePost,
  contentLoading,
  setContentLoading,
  postCollectGif,
  dispatch,
  setMentionProfiles,
  setProfilesOpen,
  mentionProfiles,
  profilesOpen,
  caretCoord,
  lensConnected,
  locale,
  setCaretCoord,
  t,
  router,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative flex w-full tablet:w-4/5 h-fit items-start justify-center rounded-sm">
        <div
          className="relative w-full h-full flex flex-col items-center justify-start gap-5 p-px"
          id="pfp"
        >
          <div className="relative w-full bg-blurs flex bg-cover rounded-sm px-8 tablet:px-3 tablet:py-3 items-center justify-center overflow-y-scroll h-[35rem]">
            <div className="relative flex items-center justify-center w-full tablet:w-2/3 h-full">
              <PostComment
                t={t}
                locale={locale}
                setCaretCoord={setCaretCoord}
                router={router}
                itemId={undefined}
                caretCoord={caretCoord}
                profilesOpen={profilesOpen?.[0]}
                mentionProfiles={mentionProfiles}
                setMentionProfiles={setMentionProfiles}
                setProfilesOpen={setProfilesOpen}
                lensConnected={lensConnected}
                commentPost={post}
                commentPostLoading={postLoading[0]}
                makePostComment={makePost[0]}
                setMakePostComment={setMakePost}
                height="30vh"
                imageHeight="1.5rem"
                imageWidth="1.5rem"
                contentLoading={contentLoading[0]}
                setContentLoading={setContentLoading}
                index={0}
                postCollectGif={postCollectGif}
                dispatch={dispatch}
                id="post"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenPost;

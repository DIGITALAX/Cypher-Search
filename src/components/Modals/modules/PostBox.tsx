import { FunctionComponent } from "react";
import { PostBoxProps } from "../types/modals.types";
import PostComment from "@/components/Autograph/modules/PostComment";
import { setPostBox } from "../../../../redux/reducers/postBoxSlice";
import { ImCross } from "react-icons/im";
import PostQuote from "@/components/Autograph/modules/PostQuote";

const PostBox: FunctionComponent<PostBoxProps> = ({
  dispatch,
  quote,
  makePost,
  post,
  setMakePost,
  locale,
  postLoading,
  setContentLoading,
  contentLoading,
  postCollectGif,
  router,
  lensConnected,
  caretCoord,
  profilesOpen,
  mentionProfiles,
  setMentionProfiles,
  setProfilesOpen,
  setCaretCoord,
  t
}): JSX.Element => {
  return (
    <div className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-[90vw] sm:w-[70vw] tablet:w-[40vw] h-fit max-h-[90vh] min-h-[27vh] place-self-center bg-offBlack border border-white overflow-y-scroll">
        <div className="relative w-full h-full flex flex-col gap-3 p-2 items-start justify-center">
          <div className="relative w-fit h-fit items-end justify-end ml-auto cursor-pointer flex">
            <ImCross
              color="#FBDB86"
              size={10}
              onClick={() =>
                dispatch(
                  setPostBox({
                    actionOpen: false,
                  })
                )
              }
            />
          </div>
          {quote && (
            <PostQuote
              pink
              router={router}
              dispatch={dispatch}
              quote={{
                ...quote,
                decrypted: undefined,
              }}
              disabled={true}
            />
          )}
          <div className="relative w-full h-full flex items-center justify-center pb-3">
            <div className="relative h-full w-4/5 items-center justify-center flex">
              <PostComment
                t={t}
                locale={locale}
                itemId={undefined}
                router={router}
                setCaretCoord={setCaretCoord}
                caretCoord={caretCoord}
                profilesOpen={profilesOpen?.[0]}
                mentionProfiles={mentionProfiles}
                setMentionProfiles={setMentionProfiles}
                setProfilesOpen={setProfilesOpen}
                lensConnected={lensConnected}
                main={false}
                setMakePostComment={setMakePost}
                makePostComment={makePost[0]}
                commentPostLoading={postLoading[0]}
                commentPost={post}
                height="25vh"
                imageHeight="1.5rem"
                imageWidth="1.5rem"
                contentLoading={contentLoading[0]}
                index={0}
                setContentLoading={setContentLoading}
                dispatch={dispatch}
                postCollectGif={postCollectGif}
                id={quote?.id || "post"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostBox;

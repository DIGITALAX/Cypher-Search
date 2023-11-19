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
  postLoading,
  setContentLoading,
  contentLoading,
  postCollectGif,
}): JSX.Element => {
  return (
    <div className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-full md:w-[40vw] h-fit min-h-[27vh] place-self-center bg-offBlack rounded-lg border border-white rounded-sm">
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
          {quote && <PostQuote quote={quote} />}
          <div className="relative w-full h-full flex items-center justify-center pb-3">
            <div className="relative h-full w-4/5 items-center justify-center flex">
              <PostComment
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
                id={quote?.id}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostBox;

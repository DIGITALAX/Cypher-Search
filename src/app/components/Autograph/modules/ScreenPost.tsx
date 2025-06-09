import { FunctionComponent, JSX } from "react";
import PostComment from "../../Tiles/modules/PostComment";
import useComment from "../../Tiles/hooks/useComment";

const ScreenPost: FunctionComponent<{ dict: any }> = ({
  dict,
}): JSX.Element => {
  const {
    searchProfiles,
    setProfilesOpen,
    profilesFound,
    profilesOpen,
    commentLoading,
    setCommentDetails,
    commentDetails,
    textElement,
    caretCoord,
    makePost
  } = useComment();

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
                dict={dict}
                commentDetails={commentDetails}
                profilesOpen={profilesOpen}
                comment={makePost}
                commentLoading={commentLoading}
                caretCoord={caretCoord}
                textElement={textElement}
                searchProfiles={searchProfiles}
                setCommentDetails={setCommentDetails}
                setProfilesOpen={setProfilesOpen}
                mentionProfiles={profilesFound!}
                height="30vh"
                imageHeight="1.5rem"
                imageWidth="1.5rem"
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

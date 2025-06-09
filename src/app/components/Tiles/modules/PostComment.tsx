import { FunctionComponent, JSX, useContext, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import Image from "next/legacy/image";
import { ImCross } from "react-icons/im";
import handleImageError from "@/app/lib/helpers/handleImageError";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { Account } from "@lens-protocol/client";
import { PostCommentProps } from "../types/tiles.types";
import MediaSwitch from "../../Common/modules/MediaSwitch";
import { ModalContext } from "@/app/providers";
import { usePathname } from "next/navigation";
import { MediaVideoMimeType } from "@lens-protocol/metadata";
import setPostMedia from "@/app/lib/helpers/setPostMedia";
import { getLocaleFromPath } from "@/app/lib/helpers/getLocalPath";

const PostComment: FunctionComponent<PostCommentProps> = ({
  dict,
  commentDetails,
  profilesOpen,
  comment,
  commentLoading,
  mentionProfiles,
  id,
  height,
  imageHeight,
  imageWidth,
  textElement,
  setCommentDetails,
  setProfilesOpen,
  searchProfiles,
  caretCoord,
}): JSX.Element => {
  const context = useContext(ModalContext);
  const path = usePathname();
  const [mediaLoading, setMediaLoading] = useState<{
    image: boolean;
    video: boolean;
  }>({
    image: false,
    video: false,
  });
  return (
    <div className="relative w-full h-fit flex flex-col items-start justify-start gap-2">
      <div
        className="relative w-full p-2 border border-white text-white font-aust text-sm bg-black flex items-center justify-center text-left rounded-md"
        style={{
          height,
        }}
      >
        <textarea
          className="bg-black relative w-full text-xs h-full p-1 flex"
          style={{ resize: "none" }}
          value={commentDetails}
          onChange={(e) => {
            setCommentDetails(e.target.value);
            searchProfiles(e);
          }}
          ref={textElement}
        ></textarea>
        {mentionProfiles?.length > 0 && profilesOpen && (
          <div
            className="absolute w-full h-fit flex"
            style={{
              top: caretCoord.y + 30,
              left: caretCoord.x,
            }}
          >
            <div
              className={`relative w-32 border border-white h-[10rem] flex flex-col overflow-y-scroll items-start justify-start z-60`}
            >
              {mentionProfiles?.map((user: Account, indexTwo: number) => {
                return (
                  <div
                    key={indexTwo}
                    className={`relative border-y border-white w-full h-10 px-3 py-2 bg-black flex flex-row gap-3 cursor-pointer items-center justify-center`}
                    onClick={() => {
                      setProfilesOpen(false);

                      setCommentDetails(
                        (prev) =>
                          prev?.substring(0, prev?.lastIndexOf("@")) +
                          `${user?.username?.value}`
                      );
                    }}
                  >
                    <div className="relative flex flex-row w-full h-full text-white font-aust items-center justify-center gap-2">
                      <div
                        className={`relative rounded-full flex bg-black w-3 h-3 items-center justify-center`}
                        id="pfp"
                      >
                        <Image
                          src={handleProfilePicture(user?.metadata?.picture)}
                          objectFit="cover"
                          key={user?.metadata?.picture}
                          alt="pfp"
                          layout="fill"
                          className="relative w-fit h-fit rounded-full items-center justify-center flex"
                          draggable={false}
                          onError={(e) => handleImageError(e)}
                        />
                      </div>
                      <div className="relative items-center justify-center w-fit h-fit text-xxs flex">
                        {user?.username?.localName}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <div className="relative w-full h-fit flex flex-col sm:flex-row items-between justify-center sm:items-center sm:justify-between sm:gap-1.5 gap-4">
        <div className="relative w-full sm:w-fit h-fit items-center justify-start flex flex-row gap-2">
          {[
            {
              image: "QmetvVH6tdXP4ZfvB7ihH9J9oQ6KfVUVVktyHpbbaAzztX",
              title: { en: "image", es: "imagen" },
              loader: mediaLoading?.image,
            },
            {
              image: "QmNd2Rj7tzTJiN7vMbWaFoYJuUARUfEnXRpjKRkQ4uEKoD",
              title: { en: "video", es: "vídeo" },
              loader: mediaLoading?.video,
            },
            {
              image: "QmVxaEvPaBfLdLfYX2bUV2Dze6NRDCtepHz7y4NJ6xojue",
              title: { en: "gifs", es: "gifs" },
            },
            {
              image: "QmXA7NqjfnoLMWBoA2KsesRQb1SNGQBe2SBxkcT2jEtT4G",
              title: { en: "collect options", es: "opciones de coleccionar" },
            },
          ].map((element, indexTwo: number) => {
            return element?.loader ? (
              <div
                key={indexTwo}
                className={`relative flex items-center justify-center animate-spin`}
                title={element.title?.[getLocaleFromPath(path)]}
                style={{
                  height: imageHeight,
                  width: imageWidth,
                }}
              >
                <AiOutlineLoading size={15} color={"white"} />
              </div>
            ) : indexTwo !== 2 && indexTwo !== 3 ? (
              <label
                key={indexTwo}
                className={`relative flex items-center justify-center cursor-pointer active:scale-95`}
                title={element.title?.[getLocaleFromPath(path)]}
                style={{
                  height: imageHeight,
                  width: imageWidth,
                }}
              >
                {
                  <Image
                    layout="fill"
                    src={`${INFURA_GATEWAY}/ipfs/${element.image}`}
                    draggable={false}
                    onError={(e) => handleImageError(e)}
                  />
                }
                <input
                  hidden
                  type="file"
                  accept={indexTwo === 0 ? "image/png, image/gif" : "video/mp4"}
                  multiple={true}
                  onChange={async (e: any) => {
                    if (!commentLoading && !mediaLoading.image) {
                      setMediaLoading((prev) => ({
                        ...prev,
                        image: true,
                      }));
                      const media = await setPostMedia(
                        e,
                        "image/png",
                        id,
                        context?.postInfo?.media
                      );

                      if (media) {
                        context?.setPostInfo((prev) => ({
                          ...prev,
                          media,
                        }));
                      }

                      setMediaLoading((prev) => ({
                        ...prev,
                        image: false,
                      }));
                    } else if (!commentLoading && !mediaLoading.video) {
                      setMediaLoading((prev) => ({
                        ...prev,
                        video: true,
                      }));
                      const media = await setPostMedia(
                        e,
                        "video/mp4",
                        id,
                        context?.postInfo?.media
                      );
                      if (media) {
                        context?.setPostInfo((prev) => ({
                          ...prev,
                          media,
                        }));
                      }

                      setMediaLoading((prev) => ({
                        ...prev,
                        video: false,
                      }));
                    }
                  }}
                />
              </label>
            ) : (
              <div
                key={indexTwo}
                className={`relative flex items-center justify-center cursor-pointer active:scale-95`}
                title={element.title?.[getLocaleFromPath(path)]}
                style={{
                  height: imageHeight,
                  width: imageWidth,
                }}
                onClick={() =>
                  indexTwo === 2
                    ? context?.setGif({ open: true, id })
                    : context?.setCollectOptions({
                        open: true,
                        id,
                      })
                }
              >
                <Image
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/${element.image}`}
                  draggable={false}
                  onError={(e) => handleImageError(e)}
                />
              </div>
            );
          })}
        </div>
        <div className="relative w-full sm:w-fit h-fit items-center justify-end flex">
          <div
            className={`relative w-20 h-8 font-aust text-white flex items-center justify-center bg-fuego border border-white text-xs rounded-sm ${
              !commentLoading && "cursor-pointer active:scale-95"
            }`}
            onClick={() => !commentLoading && comment()}
          >
            <div
              className={`${
                commentLoading && "animate-spin"
              } relative w-fit h-fit flex items-center justify-center text-center`}
            >
              {commentLoading ? (
                <AiOutlineLoading size={15} color="white" />
              ) : (
                dict?.sendI
              )}
            </div>
          </div>
        </div>
      </div>
      {Number(context?.postInfo?.media?.[id]?.length) > 0 && (
        <div className="relative w-full h-fit flex overflow-x-scroll justify-start items-start pt-4">
          <div className="relative gap-4 items-center justify-start flex flex-row">
            {context?.postInfo?.media?.[id].map((media, indexTwo: number) => {
              return (
                <div
                  key={indexTwo}
                  className="relative w-40 h-40 rounded-md flex items-center justify-center border border-white"
                >
                  <MediaSwitch
                    type={
                      media.type !== MediaVideoMimeType.MP4 ? "image" : "video"
                    }
                    classNameImage={"rounded-md"}
                    classNameAudio={"rounded-md"}
                    classNameVideo={{
                      objectFit: "cover",
                      display: "flex",
                      width: "100%",
                      height: "100%",
                      alignItems: "center",
                      justifyItems: "center",
                      borderRadius: "0.375rem",
                      position: "relative",
                    }}
                    srcUrl={media?.item}
                  />
                  <div
                    className="absolute w-5 h-5 bg-black p-px -right-2 -top-2 bg-black rounded-full cursor-pointer flex items-center justify-center border border-white"
                    onClick={() =>
                      context?.setPostInfo((prev) => {
                        let newArray = { ...prev?.media };

                        newArray[id] = newArray[id]?.filter(
                          (im) => im?.item !== media?.item
                        );

                        return {
                          ...prev,
                          media: newArray,
                        };
                      })
                    }
                  >
                    <ImCross color={"white"} size={8} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostComment;

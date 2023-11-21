import { FunctionComponent } from "react";
import { PostCommentProps } from "../types/autograph.types";
import { AiOutlineLoading } from "react-icons/ai";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import setPostMedia from "../../../../lib/helpers/setPostMedia";
import { ImCross } from "react-icons/im";
import { setPostCollectGif } from "../../../../redux/reducers/postCollectGifSlice";
import Waveform from "./Screen/Waveform";

const PostComment: FunctionComponent<PostCommentProps> = ({
  commentPost,
  makePostComment,
  setMakePostComment,
  commentPostLoading,
  id,
  height,
  imageHeight,
  imageWidth,
  setContentLoading,
  contentLoading,
  index,
  dispatch,
  postCollectGif,
  main,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col items-start justify-start gap-2">
      <div
        className="relative w-full p-2 border border-white text-white font-aust text-sm bg-black flex items-center justify-center text-left rounded-md"
        style={{
          height,
        }}
      >
        <textarea
          className="bg-black relative w-full h-full p-1 flex"
          style={{ resize: "none" }}
          onChange={(e) =>
            setMakePostComment((prev) => {
              const arr = [...prev];
              arr[index] = {
                ...arr[index],
                content: e.target.value,
              };
              return arr;
            })
          }
        ></textarea>
      </div>
      <div className="relative w-full h-fit flex items-center justify-between">
        <div className="relative w-fit h-fit items-center justify-start flex flex-row gap-2">
          {[
            ["QmetvVH6tdXP4ZfvB7ihH9J9oQ6KfVUVVktyHpbbaAzztX", "image"],
            ["QmNd2Rj7tzTJiN7vMbWaFoYJuUARUfEnXRpjKRkQ4uEKoD", "video"],
            ["QmVxaEvPaBfLdLfYX2bUV2Dze6NRDCtepHz7y4NJ6xojue", "gifs"],
            [
              "QmXA7NqjfnoLMWBoA2KsesRQb1SNGQBe2SBxkcT2jEtT4G",
              "collect options",
            ],
          ].map((image: string[], indexTwo: number) => {
            const loaders = [contentLoading?.image, contentLoading?.video];
            return loaders[indexTwo] ? (
              <div
                key={indexTwo}
                className={`relative flex items-center justify-center  ${
                  loaders[indexTwo] && "animate-spin"
                }`}
                title={image[1]}
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
                title={image[1]}
                style={{
                  height: imageHeight,
                  width: imageWidth,
                }}
              >
                {
                  <Image
                    layout="fill"
                    src={`${INFURA_GATEWAY}/ipfs/${image[0]}`}
                    draggable={false}
                  />
                }
                <input
                  hidden
                  type="file"
                  accept={indexTwo === 0 ? "image/png, image/gif" : "video/mp4"}
                  multiple={true}
                  onChange={(e) =>
                    e?.target?.files?.[0] &&
                    setPostMedia(
                      e,
                      image[1],
                      setMakePostComment,
                      setContentLoading,
                      index
                    )
                  }
                />
              </label>
            ) : (
              <div
                key={indexTwo}
                className={`relative flex items-center justify-center cursor-pointer active:scale-95`}
                title={image[1]}
                style={{
                  height: imageHeight,
                  width: imageWidth,
                }}
                onClick={() =>
                  dispatch(
                    setPostCollectGif({
                      actionType: indexTwo === 2 ? "gif" : "collect",
                      actionId: id,
                      actionGifs: postCollectGif?.gifs,
                      actionCollectTypes: postCollectGif?.collectTypes,
                    })
                  )
                }
              >
                <Image
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/${image[0]}`}
                  draggable={false}
                />
              </div>
            );
          })}
        </div>
        <div className="relative w-fit h-fit items-center justify-end">
          <div
            className={`relative w-20 h-8 font-aust text-white flex items-center justify-center bg-fuego border border-white text-xs rounded-sm ${
              !commentPostLoading && "cursor-pointer active:scale-95"
            }`}
            onClick={() =>
              !commentPostLoading &&
              (main
                ? commentPost(id, main)
                : id
                ? (commentPost as (id: string) => Promise<void>)!(id)
                : (commentPost as () => Promise<void>)())
            }
          >
            <div
              className={`${
                commentPostLoading && "animate-spin"
              } relative w-fit h-fit flex items-center justify-center text-center`}
            >
              {commentPostLoading ? (
                <AiOutlineLoading size={15} color="white" />
              ) : (
                "Send It"
              )}
            </div>
          </div>
        </div>
      </div>
      {((postCollectGif?.gifs?.[id!] &&
        postCollectGif?.gifs?.[id!]?.length > 0) ||
        makePostComment?.images?.length > 0 ||
        makePostComment?.videos?.length > 0) && (
        <div className="relative w-full h-fit flex overflow-x-scroll justify-start items-start pt-4">
          <div className="relative gap-4 items-center justify-start flex flex-row">
            {[
              ...makePostComment?.videos?.map((video) => ({
                type: "video",
                item: video,
              })),
              ...makePostComment?.images?.map((image) => ({
                type: "image",
                item: image?.media,
              })),
              ...(postCollectGif?.gifs?.[id!] || []).map((gif) => ({
                type: "gif",
                item: gif,
              })),
            ].map(
              (
                media: {
                  type: string;
                  item: string;
                },
                indexTwo: number
              ) => {
                return (
                  <div
                    key={indexTwo}
                    className="relative w-40 h-40 rounded-md flex items-center justify-center border border-white"
                  >
                    {media.type !== "video" ? (
                      <Image
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                        src={media?.item}
                        draggable={false}
                      />
                    ) : (
                      <>
                        <video
                          draggable={false}
                          controls={false}
                          muted
                          // autoPlay
                          id={media?.item}
                          playsInline
                          loop
                          className="object-cover w-full h-full flex items-center justify-center rounded-md"
                        >
                          <source src={media?.item} />
                        </video>
                        <Waveform
                          keyValue={media?.item}
                          audio={media?.item}
                          video={media?.item}
                          type="video"
                        />
                      </>
                    )}
                    <div
                      className="absolute w-5 h-5 bg-black p-px -right-2 -top-2 bg-black rounded-full cursor-pointer flex items-center justify-center border border-white"
                      onClick={() => {
                        if (media?.type === "gif") {
                          const newGifs = { ...postCollectGif.gifs };
                          newGifs[id] = newGifs[id].filter(
                            (gif) => gif !== media?.item
                          );
                          dispatch(
                            setPostCollectGif({
                              actionGifs: newGifs,
                              actionCollectTypes: postCollectGif?.collectTypes,
                            })
                          );
                        } else {
                          setMakePostComment((prev) => {
                            const arr = [...prev];
                            arr[index] = {
                              ...arr[index],
                              images:
                                media.type === "image"
                                  ? (arr[index]?.images ?? []).filter(
                                      (_, i) => i !== indexTwo
                                    )
                                  : arr[index]?.images,
                              videos:
                                media.type === "video"
                                  ? (arr[index]?.videos ?? []).filter(
                                      (_, i) => i !== indexTwo
                                    )
                                  : arr[index]?.videos,
                            };
                            return arr;
                          });
                        }
                      }}
                    >
                      <ImCross color={"white"} size={8} />
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostComment;

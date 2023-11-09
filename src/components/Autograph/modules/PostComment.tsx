import { FunctionComponent } from "react";
import { PostCommentProps } from "../types/autograph.types";
import { AiOutlineLoading } from "react-icons/ai";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import setPostMedia from "../../../../lib/helpers/setPostMedia";
import { ImCross } from "react-icons/im";
import setGif from "../../../../lib/helpers/setGif";
import CollectOptions from "./CollectOptions";

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
  gifCollectOpen,
  setGifCollectOpen,
  top,
  availableCurrencies
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
              "collect option",
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
                  accept={indexTwo === 0 ? "image/png" : "video/mp4"}
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
                  setGifCollectOpen((prev) => {
                    const arr = [...prev];
                    indexTwo == 3
                      ? (arr[index] = {
                          ...arr[index],
                          gif: false,
                          collect: !arr[index].collect,
                        })
                      : (arr[index] = {
                          ...arr[index],
                          gif: !arr[index].gif,
                          collect: false,
                        });
                    return arr;
                  })
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
              (id ? commentPost!(id) : (commentPost as () => Promise<void>)())
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
      {gifCollectOpen?.gif ? (
        <div
          className={`absolute bg-black rounded-md flex flex-col gap-5 w-4/5 h-[15rem] p-2 border border-white z-10`}
          style={{
            top,
          }}
        >
          <div className="relative w-full h-fit flex flex-row items-center font-aust text-white justify-between text-xs rounded-md gap-2">
            <input
              className="relative w-full h-10 py-px px-1 border border-white rounded-md bg-black"
              placeholder="search for a gif"
              onChange={(e) =>
                setMakePostComment((prev) => {
                  const arr = [...prev];
                  arr[index] = {
                    ...arr[index],
                    search: e.target.value,
                  };
                  return arr;
                })
              }
              onKeyDown={(e) => {
                e.key === "Enter" &&
                  !contentLoading?.gif &&
                  makePostComment?.search?.trim() !== "" &&
                  setGif(
                    makePostComment.search,
                    setMakePostComment,
                    setContentLoading,
                    index
                  );
              }}
            />
            <div
              className={`w-16 px-2 py-1 border rounded-md text-xs border-white h-10 border flex items-center justify-center ${
                !contentLoading?.gif && "cursor-pointer active-scale-95"
              }`}
              onClick={() =>
                !contentLoading?.gif &&
                makePostComment?.search?.trim() !== "" &&
                setGif(
                  makePostComment.search,
                  setMakePostComment,
                  setContentLoading,
                  index
                )
              }
            >
              <div
                className={`${
                  contentLoading?.gif && "animate-spin"
                } relative w-fit h-fit flex items-center justify-center`}
              >
                {contentLoading?.gif ? (
                  <AiOutlineLoading size={10} color="white" />
                ) : (
                  "search"
                )}
              </div>
            </div>
          </div>
          <div className="relative flex items-start justify-center overflow-y-scroll w-full h-fit">
            <div className="flex flex-wrap item-start justify-center gap-3 w-fit h-fit">
              {makePostComment.searchedGifs?.map((gif: any, index: number) => {
                return (
                  <div
                    key={index}
                    onClick={() =>
                      setMakePostComment((prev) => {
                        const arr = [...prev];
                        arr[index] = {
                          ...arr[index],
                          gifs: [
                            ...prev[index].gifs,
                            gif?.media_formats?.gif?.url,
                          ],
                        };
                        return arr;
                      })
                    }
                    className="relative w-20 h-20 rounded-md flex items-center justify-center cursor-pointer hover:opacity-70 bg-white"
                  >
                    <Image
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                      src={gif?.media_formats?.gif?.url}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        gifCollectOpen?.collect && (
          <CollectOptions
            top={top}
            index={index}
            setMakePostComment={setMakePostComment}
            makePostComent={makePostComment}
            availableCurrencies={availableCurrencies}
          />
        )
      )}
      {(makePostComment.gifs.length > 0 ||
        makePostComment.images.length > 0 ||
        makePostComment.videos.length > 0) && (
        <div className="relative w-full h-fit flex overflow-x-scroll justify-start items-start pt-4">
          <div className="relative gap-4 items-center justify-start flex flex-row">
            {[
              ...makePostComment?.videos?.map((video) => ({
                type: "video",
                item: video,
              })),
              ...makePostComment?.images.map((image) => ({
                type: "image",
                item: image,
              })),
              ...makePostComment?.gifs.map((gif) => ({
                type: "gif",
                item: gif,
              })),
            ].map(
              (
                media: {
                  type: string;
                  item: string;
                },
                index: number
              ) => {
                return (
                  <div
                    key={index}
                    className="relative w-40 h-40 rounded-md flex items-center justify-center border border-white"
                  >
                    {media.type !== "video" ? (
                      <Image
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                        src={media.item}
                        draggable={false}
                      />
                    ) : (
                      <video
                        muted
                        autoPlay
                        className="object-cover w-full h-full flex items-center justify-center rounded-md"
                        draggable={false}
                      >
                        <source src={media.item} />
                      </video>
                    )}
                    <div
                      className="absolute w-5 h-5 bg-black p-px -right-2 -top-2 bg-black rounded-full cursor-pointer flex items-center justify-center border border-white"
                      onClick={() =>
                        setMakePostComment((prev) => {
                          const arr = [...prev];
                          arr[index] = {
                            ...arr[index],
                            videos:
                              media.type === "video"
                                ? prev[index].videos.filter(
                                    (_, i) => i !== index
                                  )
                                : prev[index].videos,
                            images:
                              media.type === "image"
                                ? prev[index].images.filter(
                                    (_, i) => i !== index
                                  )
                                : prev[index].images,
                            gifs:
                              media.type === "gif"
                                ? prev[index].gifs.filter((_, i) => i !== index)
                                : prev[index].gifs,
                          };
                          return arr;
                        })
                      }
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

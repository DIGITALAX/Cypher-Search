import { FunctionComponent } from "react";
import { ImCross } from "react-icons/im";
import { setPostCollectGif } from "../../../../redux/reducers/postCollectGifSlice";
import CollectOptions from "@/components/Autograph/modules/CollectOptions";
import { PostCollectGifProps } from "../types/modals.types";
import { AiOutlineLoading } from "react-icons/ai";
import Image from "next/legacy/image";

const PostCollectGif: FunctionComponent<PostCollectGifProps> = ({
  dispatch,
  type,
  openMeasure,
  setOpenMeasure,
  availableCurrencies,
  gifs,
  searchGifLoading,
  handleGif,
  collectTypes,
  id,
}): JSX.Element => {
  return (
    <div className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-full md:w-[50vw] h-fit min-h-[27vh] place-self-center bg-offBlack rounded-lg border border-white rounded-sm">
        <div className="relative w-full h-full flex flex-col gap-3 p-2 items-center justify-start">
          <div className="relative w-fit h-fit items-end justify-end ml-auto cursor-pointer flex">
            <ImCross
              color="#FBDB86"
              size={10}
              onClick={() =>
                dispatch(
                  setPostCollectGif({
                    actionCollectTypes: collectTypes,
                    actionGifs: gifs,
                  })
                )
              }
            />
          </div>
          {type === "gif" ? (
            <div
              className={`relative rounded-md flex flex-col gap-5 w-5/6 p-2 items-center justify-center max-h-[15rem]`}
            >
              <div className="relative w-full h-fit flex flex-row items-center font-aust text-white justify-between text-xs rounded-md gap-2">
                <input
                  className="relative w-full h-10 py-px px-1 border border-white rounded-md bg-black"
                  placeholder="search for a gif"
                  onChange={(e) =>
                    setOpenMeasure((prev) => ({
                      ...prev,
                      search: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    e.key === "Enter" &&
                      openMeasure?.search?.trim() !== "" &&
                      !searchGifLoading &&
                      handleGif(openMeasure?.search);
                  }}
                />
                <div
                  className={`w-16 px-2 py-1 border rounded-md text-xs border-white h-10 border flex items-center justify-center ${
                    !searchGifLoading && "cursor-pointer active:scale-95"
                  }`}
                  onClick={() =>
                    openMeasure?.search?.trim() !== "" &&
                    handleGif(openMeasure?.search)
                  }
                >
                  <div
                    className={`${
                      searchGifLoading && "animate-spin"
                    } relative w-fit h-fit flex items-center justify-center`}
                  >
                    {searchGifLoading ? (
                      <AiOutlineLoading size={10} color="white" />
                    ) : (
                      "search"
                    )}
                  </div>
                </div>
              </div>
              <div className="relative flex items-start justify-center overflow-y-scroll w-full h-fit">
                <div className="flex flex-wrap item-start justify-center gap-3 w-fit h-fit">
                  {openMeasure.searchedGifs?.map((gif: any, index: number) => {
                    return (
                      <div
                        key={index}
                        onClick={() => {
                          const newGifs = { ...gifs } || {};

                          newGifs[id] = [
                            ...(newGifs?.[id!] || []),
                            gif?.media_formats?.gif?.url,
                          ];

                          dispatch(
                            setPostCollectGif({
                              actionCollectTypes: collectTypes,
                              actionGifs: newGifs,
                            })
                          );
                        }}
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
            <CollectOptions
              openMeasure={openMeasure}
              setOpenMeasure={setOpenMeasure}
              collectTypes={collectTypes}
              id={id}
              availableCurrencies={availableCurrencies}
              dispatch={dispatch}
              gifs={gifs}
              type={type!}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCollectGif;

import Image from "next/legacy/image";
import { FunctionComponent, JSX, useContext } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { ModalContext } from "@/app/providers";
import { MediaImageMimeType } from "@lens-protocol/metadata";
import useGifs from "../hooks/useGifs";
import { ImCross } from "react-icons/im";
import handleImageError from "@/app/lib/helpers/handleImageError";

export const Gifs: FunctionComponent<{ dict: any }> = ({
  dict,
}): JSX.Element => {
  const contexto = useContext(ModalContext);
  const { buscarGifs, setBuscarGifs, gifCargando, manejarGif } = useGifs();
  return (
    <div className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-[90vw] md:w-[50vw] h-fit max-h-[90vh] min-h-[27vh] place-self-center bg-offBlack border border-white overflow-y-scroll">
        <div className="relative w-full h-full flex flex-col gap-3 p-2 items-center justify-start">
          <div className="relative w-fit h-fit items-end justify-end ml-auto cursor-pointer flex">
            <ImCross
              color="#FBDB86"
              size={10}
              onClick={() =>
                contexto?.setGif({
                  open: false,
                })
              }
            />
          </div>
          <div
            className={`relative rounded-md flex flex-col gap-5 w-5/6 p-2 items-center justify-center max-h-[15rem]`}
          >
            <div className="relative w-full h-fit flex flex-row items-center font-aust text-white justify-between text-xs rounded-md gap-2">
              <input
                className="relative w-full h-10 py-px px-1 border border-white rounded-md bg-black"
                placeholder={dict?.seG}
                onChange={(e) =>
                  setBuscarGifs((prev) => ({
                    ...prev,
                    search: e.target.value,
                  }))
                }
                onKeyDown={(e) => {
                  e.key === "Enter" &&
                    buscarGifs?.search?.trim() !== "" &&
                    !gifCargando &&
                    manejarGif(buscarGifs?.search);
                }}
              />
              <div
                className={`w-16 px-2 py-1 border rounded-md text-xs border-white h-10 border flex items-center justify-center ${
                  !gifCargando && "cursor-pointer active:scale-95"
                }`}
                onClick={() =>
                  buscarGifs?.search?.trim() !== "" &&
                  manejarGif(buscarGifs?.search)
                }
              >
                <div
                  className={`${
                    gifCargando && "animate-spin"
                  } relative w-fit h-fit flex items-center justify-center`}
                >
                  {gifCargando ? (
                    <AiOutlineLoading size={10} color="white" />
                  ) : (
                    dict?.se
                  )}
                </div>
              </div>
            </div>
            <div className="relative flex items-start justify-center overflow-y-scroll w-full h-fit">
              <div className="flex flex-wrap items-start justify-center gap-3 w-fit h-fit">
                {buscarGifs.gifs?.map((gif, index: number) => {
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        contexto?.setPostInfo((prev) => {
                          let media = { ...prev?.media };

                          if (
                            Number(
                              contexto?.postInfo?.media?.[contexto?.gif?.id!]
                                ?.length
                            ) == 4
                          ) {
                            let medios = [
                              ...(contexto?.postInfo?.media?.[
                                contexto?.gif?.id!
                              ] || []),
                            ];

                            medios.pop();

                            medios.push({
                              type: MediaImageMimeType.GIF,
                              item: gif?.media_formats?.gif?.url,
                            });

                            media[contexto?.gif?.id!] = medios;
                          } else {
                            let medios = [
                              ...(contexto?.postInfo?.media?.[
                                contexto?.gif?.id!
                              ] || []),
                            ];
                            medios.push({
                              type: MediaImageMimeType.GIF,
                              item: gif?.media_formats?.gif?.url,
                            });

                            media[contexto?.gif?.id!] = medios;
                          }

                          return {
                            ...prev,
                            media,
                          };
                        });
                        contexto?.setGif({
                          open: false,
                        });
                      }}
                      className="relative w-20 h-20 rounded-md flex items-center justify-center cursor-pointer hover:opacity-70 bg-white"
                    >
                      <Image
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                        src={gif?.media_formats?.gif?.url}
                        onError={(e) => handleImageError(e)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gifs;

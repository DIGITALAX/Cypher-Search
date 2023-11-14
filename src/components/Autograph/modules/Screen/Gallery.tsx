import { FunctionComponent } from "react";
import { GalleryScreenProps } from "../../types/autograph.types";
import { AiOutlineLoading } from "react-icons/ai";
import SwitchCreate from "./SwitchCreate";

const Gallery: FunctionComponent<GalleryScreenProps> = ({
  activeGallery,
  gallery,
  setCollectionDetails,
  collectionDetails,
  createDrop,
  createCollection,
  creationLoading,
  router,
  collectionSettings,
  setCollectionSettings,
  isDesigner,
  handleSendMessage,
  messageLoading,
  setMessage,
  message,
  setCreateCase,
  createCase,
  handleMedia,
  lensConnected,
  filterConstants,
  dispatch,
  handlePlayPause,
  waveformRef,
}): JSX.Element => {
  return (
    <div className="relative flex flex-row gap-4 items-start justify-center w-full h-full">
      <div className="relative flex w-4/5 h-fit items-start justify-center rounded-sm">
        <div
          className="relative w-full h-full flex flex-col items-center justify-start gap-5 p-px"
          id="pfp"
        >
          <div
            className={`relative w-full h-full bg-blurs flex bg-cover rounded-sm p-3 items-start justify-center min-h-[70vh] max-h-[70vh] items-start overflow-y-scroll`}
          >
            <SwitchCreate
              waveformRef={waveformRef}
              handlePlayPause={handlePlayPause}
              router={router}
              gallery={gallery}
              dispatch={dispatch}
              type={createCase}
              filterConstants={filterConstants}
              collectionDetails={collectionDetails}
              setCollectionDetails={setCollectionDetails}
              handleMedia={handleMedia}
              lensConnected={lensConnected}
              collectionSettings={collectionSettings}
              setCollectionSettings={setCollectionSettings}
            />
          </div>
        </div>
      </div>
      <div
        className="relative flex w-80 h-full p-px flex-col items-start justify-start"
        id="mar"
      >
        <div className="relative w-full min-h-[70vh] max-h-[70vh] h-full flex flex-col bg-piloto gap-6 items-center justify-start p-3">
          <div className="font-bit text-white text-xs text-center flex w-4/5 h-fit relative">
            Fine-Tune Your gallery, with Art, collectibles, and rare gems that
            are more than they seem.
          </div>
          {isDesigner && (
            <div className="relative w-full h-fit flex items-center justify-center flex-col gap-1">
              <div className="relative w-fit h-fit flex items-center justify-center text-center font-bit text-white text-sm">
                Interested to mint? Send us a message!
              </div>
              <textarea
                className={`relative w-full p-1 bg-offBlack border border-white rounded-md h-32 font-bit text-xs flex items-center justify-center ${
                  message === "Message sent! We'll be in touch shortly."
                    ? "text-sol"
                    : "text-white"
                }`}
                style={{ resize: "none" }}
                onChange={(e) => setMessage(e.target.value)}
                value={message}
              ></textarea>
              <div
                className={`relative w-full h-fit justify-end items-end flex ${
                  message === "Message sent! We'll be in touch shortly." &&
                  "opacity-50"
                }`}
              >
                <div
                  className={`"relative w-20 h-7 border border-white rounded-md text-white font-aust text-sm flex items-center justify-center ${
                    !messageLoading && "cursor-pointer"
                  }`}
                  onClick={() => !messageLoading && handleSendMessage()}
                >
                  <div
                    className={`relative w-fit h-fit items-center justify-center flex ${
                      messageLoading && "animate-spin"
                    }`}
                  >
                    {messageLoading ? (
                      <AiOutlineLoading color="white" size={15} />
                    ) : (
                      "Send"
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div
            className={`relative w-full h-full flex flex-col gap-7 items-center justify-start ${
              !isDesigner && "opacity-70"
            }`}
          >
            {createCase && (
              <div className="relative w-full h-fit flex items-center justify-center">
                <div
                  className="relative w-fit h-fit relative justify-center items-center font-bit text-xs flex cursor-pointer text-white"
                  onClick={() => setCreateCase(undefined)}
                >
                  {`<<<  Back to gallery`}
                </div>
              </div>
            )}

            {!createCase && (
              <>
                <div
                  className="relative w-full h-10 bg-olor border border-[#DAB275] flex items-center justify-center text-saph font-bit text-lg cursor-pointer active:scale-95"
                  onClick={() => !isDesigner && setCreateCase("collection")}
                >
                  <div className="relative w-fit h-fit items-center justify-center flex top-1">
                    + New Collection
                  </div>
                </div>
                <div
                  className="relative w-full h-10 bg-olor border border-[#DAB275] flex items-center justify-center text-saph font-bit text-lg cursor-pointer active:scale-95"
                  onClick={() => !isDesigner && setCreateCase("drop")}
                >
                  <div className="relative w-fit h-fit items-center justify-center flex top-1">
                    + New Drop
                  </div>
                </div>
              </>
            )}
            {createCase === "collection" && (
              <div className="relative w-full h-fit flex flex-col items-start justify-start gap-4">
                <div className="relative w-full h-fit flex flex-col items-center justify-start gap-2">
                  <div className="relative w-fit h-fit font-bit text-white text-sm">
                    Choose Origin
                  </div>
                  <div className="relative w-full h-fit flex flex-col items-center justify-start gap-2">
                    {["chromadin", "coinop", "legend", "the dial"]?.map(
                      (item: string, index: number) => {
                        return (
                          <div
                            key={index}
                            className={`relative w-40 h-8 bg-[#DAB275] border-olor flex items-center justify-center text-white font-bit text-sm ${
                              item === collectionSettings?.origin
                                ? "border-2"
                                : "border"
                            } ${
                              index !== 0
                                ? "opacity-50"
                                : "cursor-pointer active:scale-95"
                            }`}
                            onClick={() =>
                              index === 0 &&
                              setCollectionSettings((prev) => ({
                                ...prev,
                                origin: item,
                              }))
                            }
                          >
                            <div className="relative w-fit h-fit items-center justify-center flex top-1">
                              {item}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
                <div className="relative w-full h-fit flex flex-col items-center justify-start gap-2">
                  <div className="relative w-fit h-fit font-bit text-white text-sm">
                    Choose Media
                  </div>
                  <div className="relative w-full h-fit flex flex-col items-center justify-start gap-2">
                    {["static", "audio", "video"]?.map(
                      (item: string, index: number) => {
                        return (
                          <div
                            key={index}
                            className={`relative w-40 h-8 bg-[#DAB275] border-olor flex items-center cursor-pointer active:scale-95 justify-center text-white font-bit text-sm ${
                              collectionSettings?.media === item
                                ? "border-2"
                                : "border"
                            }`}
                            onClick={() =>
                              setCollectionSettings((prev) => ({
                                ...prev,
                                media: item,
                              }))
                            }
                          >
                            <div className="relative w-fit h-fit items-center justify-center flex top-px">
                              {item}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            )}
            {createCase && (
              <div
                className={`relative w-40 h-8 bg-piloto border-white border flex items-center justify-center text-white font-aust text-sm ${
                  !creationLoading && "cursor-pointer active:scale-95"
                }`}
                onClick={() =>
                  createCase === "collection"
                    ? createCollection()
                    : createDrop()
                }
              >
                <div className="relative w-fit h-fit items-center justify-center flex">
                  Create
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;

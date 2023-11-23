import { FunctionComponent, useEffect, useRef } from "react";
import { NewConversationProps } from "../../types/autograph.types";
import Image from "next/legacy/image";
import { BsSend } from "react-icons/bs";
import { AiOutlineLoading } from "react-icons/ai";
import { DecodedMessage } from "@xmtp/react-sdk";
import { INFURA_GATEWAY, IPFS_REGEX } from "../../../../../lib/constants";
import descriptionRegex from "../../../../../lib/helpers/descriptionRegex";
import { setImageViewer } from "../../../../../redux/reducers/ImageLargeSlice";
import { ImCross } from "react-icons/im";
import handleImageError from "../../../../../lib/helpers/handleImageError";

const NewConversation: FunctionComponent<NewConversationProps> = ({
  messages,
  currentMessage,
  setCurrentMessage,
  handleSendMessage,
  selectedUser,
  sendMessageLoading,
  canMessage,
  dispatch,
  messageImage,
  handleMessageImage,
}): JSX.Element => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages, messagesEndRef]);
  return (
    <div className="relative flex items-center justify-center w-full h-full">
      <div
        className="relative w-4/5 flex bg-offBlack rounded-md border border-white flex-col items-start justify-centers"
        style={{
          height: "calc(60vh - 2.5rem)",
        }}
      >
        <div className="relative w-full h-full flex flex-col justify-between items-start">
          <div className="relative w-full h-10 px-2 py-1 border border-white rounded-t-md flex items-center justify-start">
            <div className="relative flex flex-row gap-2 items-center justify-start font-aust text-white text-xs">
              <div className="relative w-5 rounded-full flex h-5" id="pfp">
                {selectedUser?.image && (
                  <Image
                    className="rounded-full"
                    objectFit="cover"
                    layout="fill"
                    onError={(e) => handleImageError(e)}
                    src={
                      selectedUser?.image?.includes("ipfs://")
                        ? `${INFURA_GATEWAY}/ipfs/${
                            selectedUser?.image?.split("ipfs://")?.[1]
                          }`
                        : selectedUser?.image
                    }
                    draggable={false}
                  />
                )}
              </div>
              <div className="relative w-fit h-fit flex items-center justify-center">
                {selectedUser?.handle}
              </div>
            </div>
          </div>
          <div
            className={`relative w-full flex  ${
              canMessage || (canMessage && messages?.length > 0)
                ? "items-between justify-end overflow-y-scroll"
                : "items-center justify-center"
            }`}
            style={{
              height: "30rem",
            }}
            ref={messagesEndRef}
          >
            {canMessage ? (
              messages?.length > 0 ? (
                <div className="relative w-full h-fit min-h-full gap-3 flex flex-col items-end justify-end p-3 overflow-y-scroll">
                  {messages?.map((item: DecodedMessage, index: number) => {
                    return (
                      <div
                        key={index}
                        className={`relative w-full h-fit flex ${
                          item?.senderAddress?.toLowerCase() ===
                          selectedUser?.address?.toLowerCase()
                            ? "items-start justify-start"
                            : "items-end justify-end"
                        }`}
                      >
                        {IPFS_REGEX.test(item?.content) ? (
                          <div
                            className="relative w-40 h-40 rounded-sm flex items-center justify-center cursor-pointer"
                            id="pfp"
                            onClick={() =>
                              dispatch(
                                setImageViewer({
                                  actionValue: true,
                                  actionImage: `${INFURA_GATEWAY}/ipfs/${item?.content}`,
                                  actionType: "png",
                                })
                              )
                            }
                          >
                            <Image
                              layout="fill"
                              objectFit="cover"
                              src={`${INFURA_GATEWAY}/ipfs/${item?.content}`}
                              className="rounded-sm"
                              onError={(e) => handleImageError(e)}
                            />
                          </div>
                        ) : (
                          <div
                            className={`relative w-fit break-words h-fit px-2 py-1 flex whitespace-preline  ${
                              item?.senderAddress?.toLowerCase() ===
                              selectedUser?.address?.toLowerCase()
                                ? "bg-white/70 border border-white text-xs font-aust text-black justify-end"
                                : "bg-sol/70 border border-sol text-xs font-aust text-black justify-start"
                            }`}
                            dangerouslySetInnerHTML={{
                              __html: descriptionRegex(
                                item?.content! ? item?.content : "???",
                                true
                              ),
                            }}
                          ></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="relative w-full flex h-full text-center items-center justify-center text-white font-aust text-xs">
                  <div className="relative w-fit flex items-center justify-center h-fit break-words">
                    No messages appearing yet. Send something?
                  </div>
                </div>
              )
            ) : (
              <div className="relative w-full flex h-full text-center items-center justify-center text-white font-aust text-xs">
                <div className="relative w-fit flex items-center justify-center h-fit break-words">
                  User is not taking messages atm. Message another?
                </div>
              </div>
            )}
          </div>
          {messageImage?.image?.trim() !== "" && (
            <div
              className="absolute w-20 h-20 rounded-sm flex items-center justify-center right-3 bottom-20"
              id="pfp"
            >
              <Image
                layout="fill"
                src={messageImage?.image}
                objectFit="cover"
                className="rounded-sm"
                draggable={false}
                onError={(e) => handleImageError(e)}
              />
              <div
                className="absolute -top-2 -right-2 w-5 h-5 border border-white bg-black rounded-full p-1 cursor-pointer flex items-center justify-center hover:opacity-70"
                onClick={() => handleMessageImage(undefined, true)}
              >
                <div className="relative w-fit h-fit flex items-center justify-center">
                  <ImCross size={8} color="white" />
                </div>
              </div>
            </div>
          )}
          <div
            className={`relative w-full h-20 border border-white rounded-b-md flex items-center justify-start mb-auto font-aust text-white text-xs ${
              !canMessage && "opacity-50"
            }`}
          >
            <textarea
              style={{ resize: "none" }}
              className="relative p-1 rounded-b-md bg-offBlack flex text-left h-full w-full"
              onChange={(e) => setCurrentMessage(e.target.value)}
              value={currentMessage}
              disabled={!canMessage}
            ></textarea>
            <div className="absolute bottom-2 right-2 flex flex-col w-fit h-fit gap-2">
              <label
                className={`relative flex items-center justify-center cursor-pointer active:scale-95 w-4 h-4`}
              >
                {
                  <Image
                    layout="fill"
                    src={`${INFURA_GATEWAY}/ipfs/QmetvVH6tdXP4ZfvB7ihH9J9oQ6KfVUVVktyHpbbaAzztX`}
                    draggable={false}
                  />
                }
                <input
                  hidden
                  type="file"
                  accept={"image/png, image/gif"}
                  multiple={false}
                  onChange={(e) =>
                    e?.target?.files?.[0] && handleMessageImage(e)
                  }
                />
              </label>
              <div
                className={`relative w-fit h-fit ${
                  sendMessageLoading
                    ? "animate-spin"
                    : canMessage && "cursor-pointer active:scale-95"
                }`}
                onClick={() =>
                  canMessage && !sendMessageLoading && handleSendMessage(false)
                }
              >
                {sendMessageLoading ? (
                  <AiOutlineLoading color="white" size={15} />
                ) : (
                  <BsSend color="white" size={15} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewConversation;

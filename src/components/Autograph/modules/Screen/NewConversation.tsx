import { FunctionComponent } from "react";
import { NewConversationProps } from "../../types/autograph.types";
import Image from "next/legacy/image";
import { BsSend } from "react-icons/bs";
import { AiOutlineLoading } from "react-icons/ai";
import { DecodedMessage } from "@xmtp/react-sdk";

const NewConversation: FunctionComponent<NewConversationProps> = ({
  messages,
  currentMessage,
  setCurrentMessage,
  handleSendMessage,
  selectedUser,
  sendMessageLoading,
}): JSX.Element => {
  return (
    <div className="relative flex items-center justify-center w-full h-full">
      <div
        className="relative w-4/5 flex bg-offBlack rounded-md border border-white flex-col items-start"
        style={{
          maxHeight: "calc(60vh - 2.5rem)",
          minHeight: "calc(60vh - 2.5rem)",
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
                    src={selectedUser?.image}
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
            className="relative w-full h-full flex items-between justify-end overflow-y-scroll"
            style={{
              maxHeight: "calc(60vh - 10rem)",
              minHeight: "calc(60vh - 10rem)",
            }}
          >
            <div className="relative w-full h-fit gap-3 flex flex-col items-end">
              {messages?.map((item: DecodedMessage, index: number) => {
                return (
                  <div
                    key={index}
                    className={`relative w-full h-fit ${
                      item?.recipientAddress === selectedUser?.address
                        ? "items-start justify-start"
                        : "items-end justify-end"
                    }`}
                  >
                    <div
                      className={`relative w-fit break-words h-fit px-2 py-1 flex justify-end  ${
                        item?.recipientAddress === selectedUser?.address
                          ? "bg-white/70 border border-white text-xs font-aust text-black"
                          : "bg-sol/70 border border-sol text-xs font-aust text-black"
                      }`}
                    >
                      {item?.content}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="relative w-full h-20 border border-white rounded-b-md flex items-center justify-start mb-auto font-aust text-white text-xs">
            <textarea
              style={{ resize: "none" }}
              className="relative p-1 rounded-b-md bg-offBlack flex text-left h-full w-full"
              onChange={(e) => setCurrentMessage(e.target.value)}
              value={currentMessage}
            ></textarea>
            <div
              className={`absolute bottom-3 right-3 w-fit h-fit ${
                sendMessageLoading
                  ? "animate-spin"
                  : "cursor-pointer active:scale-95"
              }`}
              onClick={() => !sendMessageLoading && handleSendMessage()}
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
  );
};

export default NewConversation;

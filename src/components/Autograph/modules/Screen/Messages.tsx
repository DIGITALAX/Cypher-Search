import { FunctionComponent } from "react";
import { MessagesProps } from "../../types/autograph.types";
import { Conversation, DecodedMessage } from "@xmtp/react-sdk";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import { Profile } from "../../../../../graphql/generated";
import createProfilePicture from "../../../../../lib/helpers/createProfilePicture";
import NewConversation from "./NewConversation";

const Messages: FunctionComponent<MessagesProps> = ({
  conversations,
  messages,
  handleConversations,
  client,
  sendMessageLoading,
  conversationsLoading,
  selectedUser,
  searchedProfiles,
  setSelectedUser,
  handleSearchUser,
  userSearch,
  currentMessage,
  setCurrentMessage,
  setUserSearch,
  setSearchedProfiles,
  handleSendMessage,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative flex w-4/5 h-fit items-start justify-center rounded-sm">
        <div
          className="relative w-full h-full flex flex-col items-center justify-start gap-5 p-px"
          id="pfp"
        >
          <div
            className={`relative w-full h-full bg-blurs flex bg-cover rounded-sm min-h-[70vh] max-h-[70vh] justify-center overflow-hidden ${
              client ? "items-start" : "items-center"
            }`}
          >
            {client ? (
              <div className="relative w-full h-full flex flex-row items-center justify-center gap-3">
                <div className="relative flex flex-col items-start justify-center w-60 h-full">
                  <div className="relative w-full text-white text-xs font-aust h-fit flex flex-col bg-offBlack">
                    <input
                      className="relative border border-white h-10 px-2 py-1 bg-offBlack"
                      placeholder="Search Profiles..."
                      value={userSearch}
                      onChange={(e) => handleSearchUser(e)}
                    />
                    {searchedProfiles?.length > 0 && (
                      <div className="absolute h-fit max-h-[10rem] w-full overflow-y-scroll top-10 right-0 bg-offBlack border border-white z-10">
                        <div className="relative w-full h-fit flex flex-col">
                          {searchedProfiles?.map(
                            (item: Profile, index: number) => {
                              const pfp = createProfilePicture(
                                item?.metadata?.picture
                              );
                              return (
                                <div
                                  key={index}
                                  className="relative w-full h-10 px-2 py-1 border-b border-white text-aust flex flex-row gap-2 items-center justify-center font-white text-xs hover:opacity-80 cursor-pointer"
                                  onClick={() => {
                                    setSearchedProfiles([]);
                                    setUserSearch(
                                      item?.handle?.suggestedFormatted?.localName?.split(
                                        "@"
                                      )?.[1]!
                                    );
                                    setSelectedUser({
                                      address: item?.ownedBy?.address,
                                      handle:
                                        item?.handle?.suggestedFormatted
                                          ?.localName!,
                                      image: pfp!,
                                    });
                                  }}
                                >
                                  <div className="relative flex flex-row gap-2 items-center justify-start">
                                    <div
                                      className="relative w-5 rounded-full flex h-5"
                                      id="pfp"
                                    >
                                      {pfp && (
                                        <Image
                                          className="rounded-full"
                                          objectFit="cover"
                                          layout="fill"
                                          src={pfp}
                                          draggable={false}
                                        />
                                      )}
                                    </div>
                                    <div className="relative w-fit h-fit">
                                      {
                                        item?.handle?.suggestedFormatted
                                          ?.localName
                                      }
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div
                    className="relative w-full h-full flex overflow-y-scroll items-start justify-start bg-offBlack border-b border-x border-white"
                    style={{
                      maxHeight: "calc(70vh - 2.5rem)",
                      minHeight: "calc(70vh - 2.5rem)",
                    }}
                  >
                    <div
                      className={`relative flex flex-col justify-start items-center h-fit w-full`}
                    >
                      {conversationsLoading
                        ? Array.from({ length: 30 })?.map(
                            (_, index: number) => {
                              return (
                                <div
                                  key={index}
                                  className="relative border-b border-white bg-offBlack p-2 items-start justify-center animate-pulse h-20 w-full flex flex-col gap-2 text-white font-aust text-xs"
                                >
                                  <div className="relative flex flex-row gap-2 items-center justify-start">
                                    <div
                                      className="relative w-6 rounded-full flex h-6"
                                      id="pfp"
                                    ></div>
                                    <div className="relative w-fit h-fit">
                                      @45^#sds
                                    </div>
                                  </div>
                                  <div className="opacity-80 relative w-fit h-fit items-center justify-start">
                                    sdfLe6DFct&*045^#sdsFct&*0...
                                  </div>
                                </div>
                              );
                            }
                          )
                        : conversations?.map(
                            (
                              item: Conversation & {
                                profileImage: string;
                                profileHandle: string;
                                preview: DecodedMessage;
                              },
                              index: number
                            ) => {
                              return (
                                <div
                                  key={index}
                                  className="relative border-b border-white bg-offBlack p-2 items-start justify-center animate-pulse h-20 w-full flex flex-col gap-2 text-white font-aust text-xs"
                                  onClick={() =>
                                    setSelectedUser({
                                      address: item.peerAddress,
                                      handle: item.profileHandle,
                                      image: item.profileImage,
                                    })
                                  }
                                >
                                  <div className="relative flex flex-row gap-2 items-center justify-start">
                                    <div
                                      className="relative w-6 rounded-full flex h-6"
                                      id="pfp"
                                    >
                                      {item?.profileImage?.split(
                                        "ipfs://"
                                      )?.[1] && (
                                        <Image
                                          className="rounded-full"
                                          objectFit="cover"
                                          layout="fill"
                                          src={`${INFURA_GATEWAY}/ipfs/${
                                            item?.profileImage?.split(
                                              "ipfs://"
                                            )?.[1]
                                          }`}
                                          draggable={false}
                                        />
                                      )}
                                    </div>
                                    <div className="relative w-fit h-fit">
                                      {item?.profileHandle}
                                    </div>
                                  </div>
                                  <div className="opacity-80 relative w-fit h-fit items-center justify-start">
                                    {item?.preview?.content?.slice(0, 20)}...
                                  </div>
                                </div>
                              );
                            }
                          )}
                    </div>
                  </div>
                </div>
                <NewConversation
                  messages={messages}
                  currentMessage={currentMessage}
                  setCurrentMessage={setCurrentMessage}
                  selectedUser={selectedUser}
                  handleSendMessage={handleSendMessage}
                  sendMessageLoading={sendMessageLoading}
                />
              </div>
            ) : (
              <div className="relative w-fit h-fit flex flex-col gap-2 items-center justify-center font-ignite text-xl text-white text-center break-words">
                <div className="relative w-fit h-fit flex items-center justify-center">
                  View Messages
                </div>
                <div
                  className="relative w-fit h-fit flex h-8 w-28 cursor-pointer active:scale-95 text-center items-center justify-center border border-white text-sm bg-piloto px-2 py-1"
                  onClick={() => handleConversations()}
                >
                  <div className="relative w-fit h-fit flex items-center justify-center">
                    Unlock
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;

import { ChangeEvent, useEffect, useState } from "react";
import { DecodedMessage, Client, Conversation } from "@xmtp/react-sdk";
import { DIGITALAX_ADDRESS } from "../../../../lib/constants";
import { createWalletClient, custom } from "viem";
import { polygon } from "viem/chains";
import { ScreenDisplay } from "../types/autograph.types";
import { LimitType, Profile } from "../../../../graphql/generated";
import { fetchQuery } from "@airstack/airstack-react";
import searchProfiles from "../../../../graphql/lens/queries/searchProfiles";
import convertToFile from "../../../../lib/helpers/convertToFile";

const useConversations = (
  address: `0x${string}` | undefined,
  screenDisplay: ScreenDisplay,
  lensConnected: Profile | undefined,
  pageProfile: Profile | undefined
) => {
  const [sendMessageLoading, setSendMessageLoading] = useState<boolean>(false);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [digiMessageLoading, setDigiMessageLoading] = useState<boolean>(false);
  const [messageImage, setMessageImage] = useState<{
    image: string;
    type: string;
  }>({
    image: "",
    type: "",
  });
  const [digiMessage, setDigiMessage] = useState<string>("");
  const [conversations, setConversations] = useState<
    (Conversation & {
      profileImage: string;
      profileHandle: string;
      recordedMessages: DecodedMessage[];
    })[]
  >([]);
  const [conversationsLoading, setConversationsLoading] =
    useState<boolean>(false);
  const [searchedProfiles, setSearchedProfiles] = useState<Profile[]>([]);
  const [canMessage, setCanMessage] = useState<boolean>(true);
  const [userSearch, setUserSearch] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<
    | {
        address: string;
        handle: string;
        image: string;
      }
    | undefined
  >();
  const [client, setClient] = useState<Client | undefined>();
  const [messages, setMessages] = useState<DecodedMessage[]>([]);

  const handleSearchUser = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      setUserSearch(e.target.value);
      if (!e.target.value || e.target.value?.trim() === "") return;
      const profileSearch = await searchProfiles(
        {
          limit: LimitType.TwentyFive,
          query: e.target.value,
        },
        lensConnected?.id
      );

      setSearchedProfiles(
        (profileSearch?.data?.searchProfiles?.items?.filter(
          (item) => item.id !== pageProfile?.id
        ) || []) as Profile[]
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleSelected = async (item: Profile, pfp: string) => {
    try {
      setCanMessage(await client?.canMessage(item?.ownedBy?.address!)!);

      setSearchedProfiles([]);
      setUserSearch(
        item?.handle?.suggestedFormatted?.localName?.split("@")?.[1]!
      );
      setSelectedUser({
        address: item?.ownedBy?.address,
        handle: item?.handle?.suggestedFormatted?.localName!,
        image: pfp!,
      });
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const resolveLensSocial = async (
    addresses: `0x${string}`[]
  ): Promise<
    | { profileImage: string; profileHandle: string; userAddress: string }[]
    | undefined
  > => {
    const newQuery = ` 
    query MyQuery($addresses: [Address!]) {
      Socials(input: {
        filter: {
          userAssociatedAddresses: {_in: $addresses}, 
          dappName: {_eq: lens}
        }, 
        blockchain: ethereum
      }) {
        Social {
          profileHandle
          profileImage
          userAddress
        }
      }
    }
    `;
    const response = await fetchQuery(newQuery, { addresses });
    if (
      response?.data?.Socials?.Social &&
      response?.data?.Socials?.Social?.length > 0
    ) {
      return response?.data?.Socials?.Social;
    }
  };

  const handleClient = async (): Promise<Client | undefined> => {
    try {
      const clientWallet = createWalletClient({
        account: address,
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      const client = await Client.create(clientWallet, {
        env: "production",
      });
      setClient(client);

      return client;
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleSendMessage = async (digitalax?: boolean): Promise<void> => {
    if (!digitalax && !selectedUser) return;
    digitalax ? setDigiMessageLoading(true) : setSendMessageLoading(true);
    try {
      let validClient: Client | undefined = client;
      if (!validClient) {
        validClient = await handleClient();
      }

      const conversation = await validClient!.conversations?.newConversation(
        digitalax ? DIGITALAX_ADDRESS : selectedUser?.address?.toLowerCase()!
      );

      if (
        messageImage?.image?.trim() !== "" &&
        messageImage?.type?.trim() !== "" &&
        !digitalax
      ) {
        const response = await fetch("/api/ipfs", {
          method: "POST",
          body: convertToFile(messageImage?.image, messageImage?.type),
        });
        const res = await response.json();
        const sendImage = conversation.send(res?.cid);
        (await sendImage).sent;
      }

      if (digitalax && digiMessage?.trim() !== "") {
        const data = conversation.send(digiMessage);

        if ((await data).sent) {
          setDigiMessage("Message sent! We'll be in touch shortly.");
          setTimeout(() => {
            setDigiMessage("");
          }, 6000);
        }
      } else if (currentMessage?.trim() !== "" && !digitalax) {
        const data = conversation.send(currentMessage);

        if ((await data).sent) {
          setCurrentMessage("");
          setMessageImage({
            image: "",
            type: "",
          });

          const newMessages = await conversation.messages();
          setMessages(newMessages);
          const index = conversations?.findIndex(
            (item) =>
              item?.peerAddress?.toLowerCase() ===
              conversation?.peerAddress?.toLowerCase()
          );

          if (index != -1) {
            setConversations((prev) => {
              const arr = [...prev];

              arr[index] = {
                ...arr[index],
                recordedMessages: newMessages,
              };

              return arr;
            });
          }
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
    digitalax ? setDigiMessageLoading(false) : setSendMessageLoading(false);
  };

  const handleConversations = async () => {
    setConversationsLoading(true);
    try {
      let validClient: Client | undefined = client;
      if (!validClient) {
        validClient = await handleClient();
      }

      const convos = await validClient!.conversations?.list();
      const addresses = convos?.map((item) => item.peerAddress);
      const data = await resolveLensSocial(addresses as `0x${string}`[]);

      if (data) {
        const socialProfilesMap: Record<
          string,
          {
            userAddress: string;
            profileImage: string;
            profileHandle: string;
          }
        > =
          data?.reduce(
            (
              map: Record<
                string,
                {
                  userAddress: string;
                  profileImage: string;
                  profileHandle: string;
                }
              >,
              profile
            ) => {
              map[profile.userAddress?.toLowerCase()] = profile;
              return map;
            },
            {} as Record<
              string,
              {
                userAddress: string;
                profileImage: string;
                profileHandle: string;
              }
            >
          ) || {};

        const filteredAndMappedConversations = convos
          .filter(
            (convo) => socialProfilesMap[convo.peerAddress?.toLowerCase()]
          )
          .map(async (convo) => {
            const messages = await convo.messages();
            const profile = socialProfilesMap[convo.peerAddress?.toLowerCase()];
            if (messages?.length > 0) {
              return {
                ...convo,
                profileImage: profile.profileImage,
                profileHandle: profile.profileHandle,
                recordedMessages: messages,
              };
            }
          });

        const updatedConversations = (
          await Promise.all(filteredAndMappedConversations)
        )?.filter(Boolean);

        updatedConversations.sort((a, b) => {
          const dateA = a?.createdAt && new Date(a?.createdAt);
          const dateB = b?.createdAt && new Date(b?.createdAt);
          return ((dateB || 0) as number) - ((dateA || 0) as number);
        });
        const uniqueConvoSet = new Set();
        const uniqueConversations = updatedConversations.filter((convo) => {
          const uniqueId = convo?.peerAddress || "";
          if (uniqueConvoSet.has(uniqueId)) {
            return false;
          }
          uniqueConvoSet.add(uniqueId);
          return true;
        });

        setConversations(
          uniqueConversations as (Conversation<any> & {
            profileImage: string;
            profileHandle: string;
            recordedMessages: DecodedMessage[];
          })[]
        );
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setConversationsLoading(false);
  };

  const handleChangeConversation = async () => {
    try {
      if (!selectedUser) return;
      setCurrentMessage("");

      const itemExists = conversations?.find(
        (conv) => conv?.profileHandle === selectedUser?.handle
      );

      if (itemExists) {
        setMessages(itemExists?.recordedMessages);
      } else {
        if (await client?.canMessage(selectedUser?.address!)) {
          const conversation = await client!.conversations?.newConversation(
            selectedUser?.address!
          );
          const messages = await conversation.messages();
          setMessages(messages);
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleMessageImage = async (
    e: ChangeEvent<HTMLInputElement> | undefined,
    remove?: boolean
  ): Promise<void> => {
    if (remove) {
      setMessageImage({
        image: "",
        type: "",
      });

      return;
    }

    const file = e?.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setMessageImage({
          image: e.target?.result as string,
          type: file?.type,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (
      address &&
      screenDisplay === ScreenDisplay.Messages &&
      lensConnected?.handle?.fullHandle === pageProfile?.handle?.fullHandle &&
      conversations?.length < 1
    ) {
      handleConversations();
    }
  }, [address, screenDisplay, lensConnected?.id]);

  useEffect(() => {
    if (selectedUser) {
      handleChangeConversation();
    }
  }, [selectedUser]);

  return {
    digiMessageLoading,
    handleSendMessage,
    setDigiMessage,
    digiMessage,
    conversations,
    messages,
    handleConversations,
    conversationsLoading,
    client,
    selectedUser,
    handleSearchUser,
    searchedProfiles,
    userSearch,
    setSelectedUser,
    sendMessageLoading,
    currentMessage,
    setCurrentMessage,
    handleSelected,
    canMessage,
    messageImage,
    handleMessageImage,
  };
};

export default useConversations;

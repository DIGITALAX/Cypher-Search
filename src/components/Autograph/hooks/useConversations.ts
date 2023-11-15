import { ChangeEvent, useEffect, useState } from "react";
import { DecodedMessage, Client, Conversation } from "@xmtp/react-sdk";
import { DIGITALAX_ADDRESS } from "../../../../lib/constants";
import { createWalletClient, custom } from "viem";
import { polygonMumbai } from "viem/chains";
import { ScreenDisplay } from "../types/autograph.types";
import { LimitType, Profile } from "../../../../graphql/generated";
import { init, fetchQuery } from "@airstack/airstack-react";
import searchProfiles from "../../../../graphql/lens/queries/searchProfiles";

init(process.env.AIRSTACK_KEY!);

const useConversations = (
  address: `0x${string}` | undefined,
  screenDisplay: ScreenDisplay,
  lensConnected: Profile | undefined,
  pageProfile: Profile | undefined
) => {
  const [sendMessageLoading, setSendMessageLoading] = useState<boolean>(false);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [digiMessageLoading, setDigiMessageLoading] = useState<boolean>(false);
  const [digiMessage, setDigiMessage] = useState<string>("");
  const [conversations, setConversations] = useState<
    (Conversation & {
      profileImage: string;
      profileHandle: string;
      preview: DecodedMessage;
    })[]
  >([]);
  const [conversationsLoading, setConversationsLoading] =
    useState<boolean>(false);
  const [searchedProfiles, setSearchedProfiles] = useState<Profile[]>([]);
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
      const profileSearch = await searchProfiles({
        limit: LimitType.TwentyFive,
        query: e.target.value,
      });

      setSearchedProfiles(
        (profileSearch?.data?.searchProfiles?.items?.filter(
          (item) => item.id !== pageProfile?.id
        ) || []) as Profile[]
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const resolveLensSocial = async (address: `0x${string}`) => {
    const newQuery = ` 
    query MyQuery {
      Wallet(
        input: {identity: "${address}", blockchain: ethereum, dappName: {_eq: lens}}
      ) {
        socials {
          profileImage
          profileHandle
        }        
      }
    }
    `;
    const response = await fetchQuery(newQuery);

    if (
      response.data.Wallet.socials &&
      response.data.Wallet.socials.length > 0
    ) {
      return response?.data?.Wallet?.socials?.[0];
    }
  };

  const handleClient = async (): Promise<Client | undefined> => {
    try {
      const clientWallet = createWalletClient({
        account: address,
        chain: polygonMumbai,
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

  const handleSendMessage = async (digitalax?: boolean) => {
    if (!digitalax && !selectedUser) return;
    digitalax ? setDigiMessageLoading(true) : setSendMessageLoading(true);
    try {
      let validClient: Client | undefined = client;
      if (!validClient) {
        validClient = await handleClient();
      }

      const conversation = await validClient!.conversations?.newConversation(
        digitalax ? DIGITALAX_ADDRESS : selectedUser?.address!
      );
      const data = conversation.send(digitalax ? digiMessage : currentMessage);
      if ((await data).sent) {
        if (digitalax) {
          setDigiMessage("Message sent! We'll be in touch shortly.");
          setTimeout(() => {
            setDigiMessage("");
          }, 6000);
        }
      } else {
        setCurrentMessage("");
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
      const promises = convos?.map(async (con) => {
        const data = await resolveLensSocial(con.peerAddress as `0x${string}`);
        return {
          ...con,
          profileImage: data?.profileImage,
          profileHandle: data?.profileHandle,
          preview: (await con.messages())?.[0],
        };
      });
      setConversations(await Promise.all(promises));
    } catch (err: any) {
      console.error(err.message);
    }
    setConversationsLoading(false);
  };

  const handleChangeConversation = async () => {
    try {
      if (!selectedUser) return;
      setCurrentMessage("");
      if (await client?.canMessage(selectedUser?.address!)) {
        const conversation = await client!.conversations?.newConversation(
          selectedUser?.address!
        );
        const messages = await conversation.messages();
        setMessages(messages);
      }
    } catch (err: any) {
      console.error(err.message);
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
  }, []);

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
    setUserSearch,
    setSearchedProfiles,
  };
};

export default useConversations;

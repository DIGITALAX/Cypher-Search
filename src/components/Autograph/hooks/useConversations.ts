import { useEffect, useState } from "react";
import { CachedMessageWithId, Client, Conversations } from "@xmtp/react-sdk";
import { DIGITALAX_ADDRESS } from "../../../../lib/constants";
import { createWalletClient, custom } from "viem";
import { polygon } from "viem/chains";
import { ScreenDisplay } from "../types/autograph.types";
import { Profile } from "../../../../graphql/generated";

const useConversations = (
  address: `0x${string}` | undefined,
  screenDisplay: ScreenDisplay,
  lensConnected: Profile | undefined,
  pageProfile: Profile | undefined
) => {
  const [messageLoading, setMessageLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [conversations, setConversations] = useState<Conversations[]>([]);
  const [messages, setMessages] = useState<CachedMessageWithId<any>[]>([]);

  const handleSendMessage = async () => {
    setMessageLoading(true);
    try {
      const clientWallet = createWalletClient({
        account: address,
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      const client = await Client.create(clientWallet, {
        env: "production",
      });
      const conversation = await client.conversations.newConversation(
        DIGITALAX_ADDRESS
      );
      const data = conversation.send(message);
      if ((await data).sent) {
        setMessage("Message sent! We'll be in touch shortly.");
        setTimeout(() => {
          setMessage("");
        }, 6000);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setMessageLoading(false);
  };

  const handleConversations = async () => {
    try {
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleChangeConversation = async () => {
    try {
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

  return {
    messageLoading,
    handleSendMessage,
    setMessage,
    message,
    conversations,
    messages,
    handleChangeConversation,
  };
};

export default useConversations;

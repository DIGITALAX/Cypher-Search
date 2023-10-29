import { v4 as uuidv4 } from "uuid";
import { PublicationMetadataMainFocusType } from "../../graphql/generated";

const uploadCommentQuoteContent = async (
  contentText: string
): Promise<string | undefined> => {
  const data = {
    $schema: "https://json-schemas.lens.dev/publications/text/3.0.0.json",
    lens: {
      mainContentFocus: PublicationMetadataMainFocusType.TextOnly,
      title: contentText.slice(0, 10),
      content: contentText,
      appId: "legend",
      id: uuidv4(),
      hideFromFeed: false,
      locale: "en",
      tags: ["legend", "legendgrant"],
    },
  };

  try {
    const response = await fetch("/api/ipfs", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (response.status === 200) {
      let responseJSON = await response.json();
      return "ipfs://" + responseJSON.cid;
    }
  } catch (err: any) {
    console.error(err.message);
  }
};

export default uploadCommentQuoteContent;

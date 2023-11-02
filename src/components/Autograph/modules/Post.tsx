import { FunctionComponent } from "react";
import { PostProps } from "../types/autograph.types";
import { Post as PostType, Quote } from "../../../../graphql/generated";
import Text from "./Metadata/Text";
import Image from "./Metadata/Image";
import Video from "./Metadata/Video";
import Audio from "./Metadata/Audio";
import Mint from "./Metadata/Mint";
import General from "./Metadata/General";

const Post: FunctionComponent<PostProps> = ({ item }): JSX.Element => {
  switch (
    item?.__typename === "Mirror"
      ? item?.mirrorOn?.metadata?.__typename
      : (item as PostType | Quote)?.metadata?.__typename
  ) {
    case "ArticleMetadataV3":
    case "TextOnlyMetadataV3":
    case "StoryMetadataV3":
      return <Text item={item} />;

    case "ImageMetadataV3":
      return <Image item={item} />;

    case "LiveStreamMetadataV3":
    case "VideoMetadataV3":
      return <Video item={item} />;

    case "AudioMetadataV3":
      return <Audio item={item} />;

    case "MintMetadataV3":
      return <Mint item={item} />;

    default:
      return <General item={item} />;
  }
};

export default Post;

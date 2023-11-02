import { FunctionComponent } from "react";
import { PostProps } from "../types/autograph.types";
import { Mirror, Post, Quote } from "../../../../graphql/generated";
import Text from "./Metadata/Text";
import Image from "./Metadata/Image";
import Video from "./Metadata/Video";
import Audio from "./Metadata/Audio";
import Mint from "./Metadata/Mint";
import General from "./Metadata/General";

const PostSwitch: FunctionComponent<PostProps> = ({ item }): JSX.Element => {
  switch (
    item?.__typename === "Mirror"
      ? item?.mirrorOn?.metadata?.__typename
      : (item as Post | Quote)?.metadata?.__typename
  ) {
    case "ArticleMetadataV3":
    case "TextOnlyMetadataV3":
    case "StoryMetadataV3":
      return (
        <Text
          metadata={
            item?.__typename === "Mirror"
              ? item?.mirrorOn?.metadata
              : (item as Post)?.metadata
          }
          quote={
            item?.__typename === "Quote" ? (item as Quote)?.quoteOn : undefined
          }
          type={item?.__typename!}
        />
      );

    case "ImageMetadataV3":
      return (
        <Image
          metadata={
            item?.__typename === "Mirror"
              ? item?.mirrorOn?.metadata
              : (item as Post)?.metadata
          }
          quote={
            item?.__typename === "Quote" ? (item as Quote)?.quoteOn : undefined
          }
          type={item?.__typename!}
        />
      );

    case "LiveStreamMetadataV3":
    case "VideoMetadataV3":
      return (
        <Video
          metadata={
            item?.__typename === "Mirror"
              ? item?.mirrorOn?.metadata
              : (item as Post)?.metadata
          }
          quote={
            item?.__typename === "Quote" ? (item as Quote)?.quoteOn : undefined
          }
          type={item?.__typename!}
        />
      );

    case "AudioMetadataV3":
      return (
        <Audio
          metadata={
            item?.__typename === "Mirror"
              ? item?.mirrorOn?.metadata
              : (item as Post)?.metadata
          }
          quote={
            item?.__typename === "Quote" ? (item as Quote)?.quoteOn : undefined
          }
          type={item?.__typename!}
        />
      );

    case "MintMetadataV3":
      return (
        <Mint
          metadata={
            item?.__typename === "Mirror"
              ? item?.mirrorOn?.metadata
              : (item as Post)?.metadata
          }
          quote={
            item?.__typename === "Quote" ? (item as Quote)?.quoteOn : undefined
          }
          type={item?.__typename!}
        />
      );

    default:
      return (
        <Text
          item={item}
          quote={
            item?.__typename === "Quote" ? (item as Quote)?.quoteOn : undefined
          }
        />
      );
  }
};

export default PostSwitch;

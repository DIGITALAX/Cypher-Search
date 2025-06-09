import { FunctionComponent, JSX } from "react";
import { PostSwitchProps } from "../types/tiles.types";
import {
  ArticleMetadata,
  ImageMetadata,
  StoryMetadata,
  TextOnlyMetadata,
} from "@lens-protocol/client";
import Media from "./Media";
import Text from "./Text";

const PostSwitch: FunctionComponent<PostSwitchProps> = ({
  item,
  disabled,
}): JSX.Element => {
  switch (
    (item?.__typename === "Repost" ? item?.repostOf : item)?.metadata
      ?.__typename
  ) {
    case "ArticleMetadata":
    case "TextOnlyMetadata":
    case "StoryMetadata":
      return (
        <Text
          metadata={
            (item?.__typename === "Repost" ? item?.repostOf : item)
              ?.metadata as ArticleMetadata | StoryMetadata | TextOnlyMetadata
          }
        />
      );

    default:
      return (
        <Media
          metadata={
            (item?.__typename === "Repost" ? item?.repostOf : item)
              ?.metadata as ImageMetadata
          }
          disabled={disabled}
        />
      );
  }
};

export default PostSwitch;

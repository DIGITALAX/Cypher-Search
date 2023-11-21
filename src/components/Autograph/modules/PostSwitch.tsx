import { FunctionComponent } from "react";
import { PostSwitchProps } from "../types/autograph.types";
import {
  ArticleMetadataV3,
  ImageMetadataV3,
  Post,
  Quote,
  StoryMetadataV3,
  TextOnlyMetadataV3,
} from "../../../../graphql/generated";
import Text from "./Metadata/Text";
import Media from "./Metadata/Media";

const PostSwitch: FunctionComponent<PostSwitchProps> = ({
  item,
  dispatch,
  disabled,
}): JSX.Element => {
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
            (item?.__typename === "Mirror"
              ? item?.mirrorOn?.metadata
              : (item as Post)?.metadata) as
              | ArticleMetadataV3
              | StoryMetadataV3
              | TextOnlyMetadataV3
          }
          encrypted={
            (item?.__typename === "Mirror" ? item?.mirrorOn : (item as Post))
              ?.isEncrypted
              ? ((item?.__typename === "Mirror" ? item?.mirrorOn : item) as (
                  | Post
                  | Quote
                ) & {
                  decrypted: any;
                })
              : undefined
          }
        />
      );

    default:
      return (
        <Media
          metadata={
            (item?.__typename === "Mirror"
              ? item?.mirrorOn?.metadata
              : (item as Post)?.metadata) as ImageMetadataV3
          }
          dispatch={dispatch}
          disabled={disabled}
          encrypted={
            (item?.__typename === "Mirror" ? item?.mirrorOn : (item as Post))
              ?.isEncrypted
              ? ((item?.__typename === "Mirror" ? item?.mirrorOn : item) as (
                  | Post
                  | Quote
                ) & {
                  decrypted: any;
                })
              : undefined
          }
        />
      );
  }
};

export default PostSwitch;

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
  router,
  index,
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
          dispatch={dispatch}
          router={router}
          index={index}
          metadata={
            (item?.__typename === "Mirror"
              ? item?.mirrorOn?.metadata
              : (item as Post)?.metadata) as
              | ArticleMetadataV3
              | StoryMetadataV3
              | TextOnlyMetadataV3
          }
          quote={
            item?.__typename === "Quote" ? (item as Quote)?.quoteOn : undefined
          }
          mirror={item?.__typename === "Mirror" ? item : undefined}
          type={item?.__typename!}
          id={
            item?.__typename === "Mirror"
              ? item?.mirrorOn?.id
              : (item as Post)?.id
          }
        />
      );

    case "AudioMetadataV3":
    case "VideoMetadataV3":
    case "ImageMetadataV3":
      return (
        <Media
          metadata={
            (item?.__typename === "Mirror"
              ? item?.mirrorOn?.metadata
              : (item as Post)?.metadata) as ImageMetadataV3
          }
          quote={
            item?.__typename === "Quote" ? (item as Quote)?.quoteOn : undefined
          }
          mirror={item?.__typename === "Mirror" ? item : undefined}
          type={item?.__typename!}
          id={
            item?.__typename === "Mirror"
              ? item?.mirrorOn?.id
              : (item as Post)?.id
          }
          dispatch={dispatch}
          router={router}
          index={index}
        />
      );

    default:
      return <></>;
  }
};

export default PostSwitch;

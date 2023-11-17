import { FunctionComponent } from "react";
import Chromadin from "./Tiles/Chromadin";
import ImagePost from "./Tiles/ImagePost";
import CoinOp from "./Tiles/CoinOp";
import VideoPost from "./Tiles/VideoPost";
import TextPost from "./Tiles/TextPost";
import { Creation, TileSwitchProps } from "../types/tiles.types";
import Quest from "./Tiles/Quest";
import Legend from "./Tiles/Legend";
import Listener from "./Tiles/Listener";
import Microbrand from "./Tiles/Microbrand";
import Profile from "./Tiles/Profile";
import {
  Mirror,
  Profile as LensProfile,
  Post,
  Comment,
  Quote,
} from "../../../../graphql/generated";
import Community from "./Tiles/Community";
import LoadTile from "./Tiles/LoadTile";

const TileSwitch: FunctionComponent<TileSwitchProps> = ({
  type,
  publication,
  layoutAmount,
  popUpOpen,
  setPopUpOpen,
  apparel,
  setApparel,
  index,
  dispatch,
  router,
  cartItems,
  mirror,
  like,
  interactionsLoading,
  openMirrorChoice,
  setOpenMirrorChoice,
  profileId,
  volume,
  volumeOpen,
  setVolumeOpen,
  fullScreenVideo,
  setVolume,
  followLoading,
  unfollowProfile,
  followProfile,
  profileHovers,
  setProfileHovers,
  simpleCollect,
  community,
  setHeart,
  heart,
  key,
}) => {
  switch (type?.toLowerCase()) {
    case "loader":
      return <LoadTile index={key} key={key} />;

    case "community":
      return (
        <Community
          profileHovers={profileHovers}
          setProfileHovers={setProfileHovers}
          followLoading={followLoading}
          followProfile={followProfile}
          unfollowProfile={unfollowProfile}
          community={community!}
          index={index}
          router={router}
          dispatch={dispatch}
          key={key}
        />
      );

    case "profile":
      return (
        <Profile
          publication={publication?.post as LensProfile}
          index={index}
          router={router}
          followProfile={followProfile}
          unfollowProfile={unfollowProfile}
          followLoading={followLoading}
          layoutAmount={layoutAmount}
          profileHovers={profileHovers}
          setProfileHovers={setProfileHovers}
          dispatch={dispatch}
          key={key}
        />
      );

    case "microbrand":
      return (
        <Microbrand
          publication={publication?.post as LensProfile}
          index={index}
          router={router}
          followProfile={followProfile}
          unfollowProfile={unfollowProfile}
          followLoading={followLoading}
          layoutAmount={layoutAmount}
          profileHovers={profileHovers}
          setProfileHovers={setProfileHovers}
          dispatch={dispatch}
          key={key}
        />
      );

    case "image":
      return (
        <ImagePost
          openMirrorChoice={openMirrorChoice}
          setOpenMirrorChoice={setOpenMirrorChoice}
          layoutAmount={layoutAmount}
          router={router}
          publication={publication?.post as Post | Comment | Quote | Mirror}
          dispatch={dispatch}
          mirror={mirror}
          like={like}
          interactionsLoading={interactionsLoading?.[index]}
          index={index}
          simpleCollect={simpleCollect!}
          followLoading={followLoading}
          followProfile={followProfile}
          unfollowProfile={unfollowProfile}
          profileHovers={profileHovers}
          setProfileHovers={setProfileHovers}
          key={key}
        />
      );
    case "listener":
      return (
        <Listener
          openMirrorChoice={openMirrorChoice}
          setOpenMirrorChoice={setOpenMirrorChoice}
          popUpOpen={popUpOpen}
          setPopUpOpen={setPopUpOpen}
          layoutAmount={layoutAmount}
          index={index}
          dispatch={dispatch}
          router={router}
          publication={publication?.post as Creation}
          cartItems={cartItems}
          mirror={mirror}
          like={like}
          interactionsLoading={interactionsLoading?.[index]}
          followProfile={followProfile}
          unfollowProfile={unfollowProfile}
          followLoading={followLoading}
          profileHovers={profileHovers}
          setProfileHovers={setProfileHovers}
          key={key}
        />
      );
    case "chromadin":
      return (
        <Chromadin
          openMirrorChoice={openMirrorChoice}
          setOpenMirrorChoice={setOpenMirrorChoice}
          popUpOpen={popUpOpen}
          setPopUpOpen={setPopUpOpen}
          layoutAmount={layoutAmount}
          apparel={apparel}
          setApparel={setApparel}
          index={index}
          dispatch={dispatch}
          router={router}
          publication={publication?.post as Creation}
          cartItems={cartItems}
          mirror={mirror}
          like={like}
          interactionsLoading={interactionsLoading?.[index]}
          followProfile={followProfile}
          unfollowProfile={unfollowProfile}
          followLoading={followLoading}
          profileHovers={profileHovers}
          setProfileHovers={setProfileHovers}
          key={key}
        />
      );
    case "coinop":
      return (
        <CoinOp
          openMirrorChoice={openMirrorChoice}
          setOpenMirrorChoice={setOpenMirrorChoice}
          popUpOpen={popUpOpen}
          setPopUpOpen={setPopUpOpen}
          layoutAmount={layoutAmount}
          index={index}
          dispatch={dispatch}
          router={router}
          publication={publication?.post as Creation}
          cartItems={cartItems}
          mirror={mirror}
          like={like}
          interactionsLoading={interactionsLoading?.[index]}
          followProfile={followProfile}
          unfollowProfile={unfollowProfile}
          followLoading={followLoading}
          profileHovers={profileHovers}
          setProfileHovers={setProfileHovers}
          key={key}
        />
      );
    case "text":
      return (
        <TextPost
          openMirrorChoice={openMirrorChoice}
          setOpenMirrorChoice={setOpenMirrorChoice}
          layoutAmount={layoutAmount}
          router={router}
          publication={publication?.post as Post | Comment | Quote | Mirror}
          dispatch={dispatch}
          mirror={mirror}
          like={like}
          interactionsLoading={interactionsLoading?.[index]}
          index={index}
          followProfile={followProfile}
          unfollowProfile={unfollowProfile}
          followLoading={followLoading}
          profileHovers={profileHovers}
          setProfileHovers={setProfileHovers}
          simpleCollect={simpleCollect!}
          key={key}
        />
      );
    case "video":
      return (
        <VideoPost
          openMirrorChoice={openMirrorChoice}
          setOpenMirrorChoice={setOpenMirrorChoice}
          layoutAmount={layoutAmount}
          dispatch={dispatch}
          index={index}
          router={router}
          publication={publication}
          mirror={mirror}
          like={like}
          interactionsLoading={interactionsLoading?.[index]}
          volume={volume!}
          volumeOpen={volumeOpen!}
          setVolumeOpen={setVolumeOpen!}
          profileId={profileId!}
          fullScreenVideo={fullScreenVideo!}
          setVolume={setVolume!}
          setHeart={setHeart!}
          heart={heart!}
          key={key}
        />
      );
    case "quest":
      return (
        <Quest
          layoutAmount={layoutAmount}
          router={router}
          publication={publication?.post as Post | Comment | Quote | Mirror}
          followProfile={followProfile}
          unfollowProfile={unfollowProfile}
          followLoading={followLoading}
          profileHovers={profileHovers}
          setProfileHovers={setProfileHovers}
          key={key}
        />
      );
    case "legend":
      return (
        <Legend
          openMirrorChoice={openMirrorChoice}
          setOpenMirrorChoice={setOpenMirrorChoice}
          layoutAmount={layoutAmount}
          index={index}
          dispatch={dispatch}
          router={router}
          publication={publication?.post as Post}
          cartItems={cartItems}
          mirror={mirror}
          like={like}
          interactionsLoading={interactionsLoading?.[index]}
          key={key}
        />
      );

    default:
      return null;
  }
};

export default TileSwitch;

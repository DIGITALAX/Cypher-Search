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
  videoSync,
  progressRef,
  handleVolumeChange,
  handleSeek,
  handleHeart,
  followLoading,
  unfollowProfile,
  followProfile,
  profileHovers,
  setProfileHovers,
  simpleCollect,
  community,
}) => {
  switch (type?.toLowerCase()) {
    case "community":
      return (
        <Community
          profileHovers={profileHovers}
          setProfileHovers={setProfileHovers}
          followLoading={followLoading}
          followProfile={followProfile}
          unfollowProfile={unfollowProfile}
          community={community}
          index={index}
          router={router}
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
          simpleCollect={simpleCollect}
        />
      );
    case "video":
      return (
        <VideoPost
          openMirrorChoice={openMirrorChoice}
          setOpenMirrorChoice={setOpenMirrorChoice}
          layoutAmount={layoutAmount}
          dispatch={dispatch}
          router={router}
          publication={publication}
          mirror={mirror}
          like={like}
          interactionsLoading={interactionsLoading?.[index]}
          volume={volume!}
          volumeOpen={volumeOpen!}
          setVolumeOpen={setVolumeOpen!}
          profileId={profileId!}
          progressRef={progressRef!}
          videoSync={videoSync!}
          handleHeart={handleHeart!}
          handleSeek={handleSeek!}
          handleVolumeChange={handleVolumeChange!}
          followProfile={followProfile}
          unfollowProfile={unfollowProfile!}
          followLoading={followLoading}
          profileHovers={profileHovers}
          setProfileHovers={setProfileHovers}
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
          followProfile={followProfile}
          unfollowProfile={unfollowProfile}
          followLoading={followLoading}
          profileHovers={profileHovers}
          setProfileHovers={setProfileHovers}
        />
      );

    default:
      return null;
  }
};

export default TileSwitch;

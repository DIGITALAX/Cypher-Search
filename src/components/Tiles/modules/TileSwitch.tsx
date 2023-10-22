import { FunctionComponent } from "react";
import Chromadin from "./Tiles/Chromadin";
import ImagePost from "./Tiles/ImagePost";
import CoinOp from "./Tiles/CoinOp";
import VideoPost from "./Tiles/VideoPost";
import TextPost from "./Tiles/TextPost";
import { TileSwitchProps } from "../types/tiles.types";
import Quest from "./Tiles/Quest";
import Legend from "./Tiles/Legend";
import Listener from "./Tiles/Listener";

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
  comment,
  quote,
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
}) => {
  switch (type) {
    case "image":
      return (
        <ImagePost
          openMirrorChoice={openMirrorChoice}
          setOpenMirrorChoice={setOpenMirrorChoice}
          layoutAmount={layoutAmount}
          router={router}
          publication={publication}
          dispatch={dispatch}
          mirror={mirror}
          like={like}
          comment={comment}
          quote={quote}
          interactionsLoading={interactionsLoading[index]}
          index={index}
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
          apparel={apparel}
          setApparel={setApparel}
          index={index}
          dispatch={dispatch}
          router={router}
          publication={publication}
          cartItems={cartItems}
          mirror={mirror}
          like={like}
          comment={comment}
          quote={quote}
          interactionsLoading={interactionsLoading[index]}
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
          publication={publication}
          cartItems={cartItems}
          mirror={mirror}
          like={like}
          comment={comment}
          quote={quote}
          interactionsLoading={interactionsLoading[index]}
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
          publication={publication}
          cartItems={cartItems}
          mirror={mirror}
          like={like}
          comment={comment}
          quote={quote}
          interactionsLoading={interactionsLoading[index]}
        />
      );
    case "text":
      return (
        <TextPost
          openMirrorChoice={openMirrorChoice}
          setOpenMirrorChoice={setOpenMirrorChoice}
          layoutAmount={layoutAmount}
          router={router}
          publication={publication}
          mirror={mirror}
          like={like}
          comment={comment}
          quote={quote}
          interactionsLoading={interactionsLoading[index]}
          index={index}
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
          comment={comment}
          quote={quote}
          interactionsLoading={interactionsLoading[index]}
          volume={volume}
          volumeOpen={volumeOpen}
          setVolumeOpen={setVolumeOpen}
          profileId={profileId}
          progressRef={progressRef}
          videoSync={videoSync}
          handleHeart={handleHeart}
          handleSeek={handleSeek}
          handleVolumeChange={handleVolumeChange}
        />
      );
    case "quest":
      return (
        <Quest
          layoutAmount={layoutAmount}
          router={router}
          publication={publication}
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
          publication={publication}
          cartItems={cartItems}
          mirror={mirror}
          like={like}
          comment={comment}
          quote={quote}
          interactionsLoading={interactionsLoading[index]}
        />
      );

    default:
      return null;
  }
};

export default TileSwitch;

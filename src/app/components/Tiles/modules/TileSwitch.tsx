import { FunctionComponent } from "react";
import { NFTData, TileSwitchProps } from "../types/tiles.types";
import LoadTile from "./LoadTile";
import {
  AutographCollection,
  Catalogo as CatalogoTipo,
  Award as AwardType,
  Collection,
} from "../../Common/types/common.types";
import ImagePost from "./ImagePost";
import { Account, Post, Repost } from "@lens-protocol/client";
import TextPost from "./TextPost";
import VideoPost from "./VideoPost";
import Profile from "./Profile";
import Microbrand from "./Microbrand";
import Catalogo from "./Catalogo";
import Autografo from "./Autografo";
import Award from "./Award";
import Listener from "./Listener";
import Chromadin from "./Chromadin";
import CoinOp from "./CoinOp";
import TripleA from "./TripleA";

const TileSwitch: FunctionComponent<TileSwitchProps> = ({
  type,
  publication,
  dict,
  index,
}) => {
  if (type?.toLowerCase() == "loader") {
    return <LoadTile index={index} />;
  }

  if (type?.toLowerCase()?.includes("profile")) {
    return (
      <Profile
        index={index}
        profile={publication?.post as Account}
        dict={dict}
      />
    );
  }

  if (type?.toLowerCase() == "microbrand") {
    return (
      <Microbrand
        index={index}
        profile={publication?.post as Account}
        dict={dict}
      />
    );
  }

  if (type?.toLowerCase() == "catalogo") {
    switch ((publication?.post as AutographCollection | CatalogoTipo)?.tipo) {
      case "Catalog":
        return (
          <Catalogo
            publication={publication?.post as CatalogoTipo}
            dict={dict}
          />
        );

      default:
        return (
          <Autografo
            publication={publication?.post as AutographCollection}
            dict={dict}
          />
        );
    }
  }

  if (type?.toLowerCase() == "triplea") {
    return (
      <TripleA dict={dict} publication={publication?.post as NFTData} />
    );
  }

  if (type?.toLowerCase() == "award") {
    return <Award dict={dict} publication={publication?.post as AwardType} />;
  }

  if (type?.toLowerCase() == "listener") {
    return (
      <Listener dict={dict} publication={publication?.post as Collection} />
    );
  }

  if (type?.toLowerCase() == "chromadin") {
    return (
      <Chromadin dict={dict} publication={publication?.post as Collection} />
    );
  }

  if (type?.toLowerCase() == "coinop" || type?.toLowerCase() == "f3m") {
    return <CoinOp dict={dict} publication={publication?.post as Collection} />;
  }

  if (
    type?.toLowerCase()?.includes("video") ||
    type?.toLowerCase()?.includes("audio")
  ) {
    return (
      <VideoPost dict={dict} publication={publication?.post as Post | Repost} />
    );
  }

  if (
    type?.toLowerCase()?.includes("text") ||
    type?.toLowerCase()?.includes("article") ||
    type?.toLowerCase()?.includes("story")
  ) {
    return (
      <TextPost dict={dict} publication={publication?.post as Post | Repost} />
    );
  }

  if (type?.toLowerCase()?.includes("kinora")) {
    return (
      <></>
      // <Quest
      //   locale={locale}
      //   layoutAmount={layoutAmount}
      //   router={router}
      //   publication={publication?.post as QuestType}
      //   followProfile={followProfile}
      //   unfollowProfile={unfollowProfile}
      //   followLoading={followLoading}
      //   profileHovers={profileHovers}
      //   setProfileHovers={setProfileHovers}
      //   lensConnected={lensConnected}
      //   dispatch={dispatch}
      //   index={index}
      //   mirror={mirror}
      //   like={like}
      //   interactionsLoading={interactionsLoading?.[index]}
      //   openMirrorChoice={openMirrorChoice}
      //   setOpenMirrorChoice={setOpenMirrorChoice}
      //   t={t}
      // />
    );
  }

  return (
    <ImagePost dict={dict} publication={publication?.post as Post | Repost} />
  );
};

export default TileSwitch;

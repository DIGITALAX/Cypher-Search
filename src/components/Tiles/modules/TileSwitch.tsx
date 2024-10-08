import { FunctionComponent } from "react";
import Chromadin from "./Tiles/Chromadin";
import ImagePost from "./Tiles/ImagePost";
import CoinOp from "./Tiles/CoinOp";
import VideoPost from "./Tiles/VideoPost";
import TextPost from "./Tiles/TextPost";
import {
  Award as AwardType,
  Catalogo as CatalogoTipo,
  Coleccion,
  Community as CommunityType,
  Creation,
  TileSwitchProps,
} from "../types/tiles.types";
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
import { Quest as QuestType } from "@/components/Search/types/search.types";
import Award from "./Tiles/Award";
import Catalogo from "./Tiles/Catalogo";
import Autografo from "./Tiles/Autografo";

const TileSwitch: FunctionComponent<TileSwitchProps> = ({
  type,
  publication,
  t,
  layoutAmount,
  popUpOpen,
  setPopUpOpen,
  index,
  dispatch,
  router,
  cartItems,
  mirror,
  like,
  interactionsLoading,
  openMirrorChoice,
  setOpenMirrorChoice,
  followLoading,
  unfollowProfile,
  locale,
  followProfile,
  profileHovers,
  setProfileHovers,
  simpleCollect,
  lensConnected,
  filterConstants,
  collectionsRelated,
}) => {
  if (type?.toLowerCase() == "loader") {
    return <LoadTile index={index} />;
  }

  if (type?.toLowerCase() == "community") {
    return (
      <Community
        lensConnected={lensConnected}
        profileHovers={profileHovers}
        setProfileHovers={setProfileHovers}
        followLoading={followLoading}
        followProfile={followProfile}
        unfollowProfile={unfollowProfile}
        community={publication?.post as CommunityType}
        index={index}
        router={router}
        dispatch={dispatch}
      />
    );
  }

  if (type?.toLowerCase()?.includes("profile")) {
    return (
      <Profile
        t={t}
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
        lensConnected={lensConnected}
      />
    );
  }

  if (type?.toLowerCase() == "microbrand") {
    return (
      <Microbrand
        t={t}
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
        lensConnected={lensConnected}
        collectionsRelated={collectionsRelated}
      />
    );
  }

  if (type?.toLowerCase() == "catalogo") {
    switch ((publication?.post as Coleccion | CatalogoTipo)?.tipo) {
      case "Catalog":
        return (
          <Catalogo
            dispatch={dispatch}
            publication={publication?.post as CatalogoTipo}
            router={router}
            t={t}
          />
        );

      default:
        return (
          <Autografo
            dispatch={dispatch}
            publication={publication?.post as Coleccion}
            router={router}
            t={t}
            setProfileHovers={setProfileHovers}
            profileHovers={profileHovers}
            followLoading={followLoading}
            followProfile={followProfile}
            unfollowProfile={unfollowProfile}
            index={index}
            lensConnected={lensConnected}
          />
        );
    }
  }

  if (type?.toLowerCase() == "award") {
    return (
      <Award
        dispatch={dispatch}
        publication={publication?.post as AwardType}
        router={router}
        t={t}
      />
    );
  }

  if (type?.toLowerCase() == "listener") {
    return (
      <Listener
        locale={locale}
        t={t}
        lensConnected={lensConnected}
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
  }

  if (type?.toLowerCase() == "chromadin") {
    return (
      <Chromadin
        lensConnected={lensConnected}
        openMirrorChoice={openMirrorChoice}
        setOpenMirrorChoice={setOpenMirrorChoice}
        popUpOpen={popUpOpen}
        t={t}
        locale={locale}
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
  }

  if (type?.toLowerCase() == "coinop" || type?.toLowerCase() == "f3m") {
    return (
      <CoinOp
        t={t}
        lensConnected={lensConnected}
        openMirrorChoice={openMirrorChoice}
        setOpenMirrorChoice={setOpenMirrorChoice}
        popUpOpen={popUpOpen}
        locale={locale}
        filterConstants={filterConstants}
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
  }

  if (
    type?.toLowerCase()?.includes("video") ||
    type?.toLowerCase()?.includes("audio")
  ) {
    return (
      <VideoPost
        collect={simpleCollect!}
        lensConnected={lensConnected}
        layoutAmount={layoutAmount}
        dispatch={dispatch}
        router={router}
        publication={publication}
        mirror={mirror}
        like={like}
        interactionsLoading={interactionsLoading?.[index]}
      />
    );
  }

  if (
    type?.toLowerCase()?.includes("text") ||
    type?.toLowerCase()?.includes("article") ||
    type?.toLowerCase()?.includes("story")
  ) {
    return (
      <TextPost
        locale={locale}
        lensConnected={lensConnected}
        openMirrorChoice={openMirrorChoice}
        setOpenMirrorChoice={setOpenMirrorChoice}
        layoutAmount={layoutAmount}
        router={router}
        t={t}
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
      />
    );
  }

  if (type?.toLowerCase()?.includes("kinora")) {
    return (
      <Quest
        locale={locale}
        layoutAmount={layoutAmount}
        router={router}
        publication={publication?.post as QuestType}
        followProfile={followProfile}
        unfollowProfile={unfollowProfile}
        followLoading={followLoading}
        profileHovers={profileHovers}
        setProfileHovers={setProfileHovers}
        lensConnected={lensConnected}
        dispatch={dispatch}
        index={index}
        mirror={mirror}
        like={like}
        interactionsLoading={interactionsLoading?.[index]}
        openMirrorChoice={openMirrorChoice}
        setOpenMirrorChoice={setOpenMirrorChoice}
        t={t}
      />
    );
  }

  return (
    <ImagePost
      locale={locale}
      t={t}
      lensConnected={lensConnected}
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

  // case "legend":
  //   return (
  //     <Legend
  //       openMirrorChoice={openMirrorChoice}
  //       setOpenMirrorChoice={setOpenMirrorChoice}
  //       layoutAmount={layoutAmount}
  //       index={index}
  //       dispatch={dispatch}
  //       router={router}
  //       publication={publication?.post as Post}
  //       cartItems={cartItems}
  //       mirror={mirror}
  //       like={like}
  //       interactionsLoading={interactionsLoading?.[index]}
  //     />
  //   );
};

export default TileSwitch;

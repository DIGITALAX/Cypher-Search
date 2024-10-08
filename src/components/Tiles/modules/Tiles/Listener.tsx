import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import {
  INFURA_GATEWAY,
  printTypeToString,
} from "../../../../../lib/constants";
import {
  ListenerProps,
  PrintType as PrintTagType,
} from "../../types/tiles.types";
import PopUp from "@/components/Common/modules/PopUp";
import InteractBar from "@/components/Common/modules/InteractBar";
import { setImageViewer } from "../../../../../redux/reducers/ImageLargeSlice";
import HoverProfile from "@/components/Common/modules/HoverProfile";
import { ItemType } from "@/components/Common/types/common.types";
import handleImageError from "../../../../../lib/helpers/handleImageError";
import PrintType from "@/components/Common/modules/PrintType";

const Listener: FunctionComponent<ListenerProps> = ({
  layoutAmount,
  popUpOpen,
  index,
  setPopUpOpen,
  dispatch,
  router,
  publication,
  locale,
  cartItems,
  interactionsLoading,
  mirror,
  t,
  like,
  openMirrorChoice,
  setOpenMirrorChoice,
  profileHovers,
  setProfileHovers,
  followLoading,
  followProfile,
  unfollowProfile,
  lensConnected,
}): JSX.Element => {
  return (
    <div
      className="relative w-full h-fit flex items-end justify-center flex rounded-sm border border-sol"
      id={publication?.pubId}
    >
      <div
        id="explainerBg"
        className="relative w-full h-full flex items-end justify-center flex-col gap-4 p-4"
      >
        <div className="absolute w-full h-full mix-blend-hard-light bg-listener opacity-60 bg-center bg-cover right-0 top-0"></div>
        <InteractBar
          router={router}
          locale={locale}
          mirror={mirror}
          like={like}
          dispatch={dispatch}
          interactionsLoading={interactionsLoading}
          layoutAmount={layoutAmount}
          openMirrorChoice={openMirrorChoice}
          setOpenMirrorChoice={setOpenMirrorChoice}
          index={index}
          publication={publication?.publication}
          simpleCollect={undefined}
          creation
        />
        <div
          className="relative flex w-full h-100 items-center justify-center border border-white bg-amo/30 cursor-pointer"
          onClick={() =>
            dispatch(
              setImageViewer({
                actionValue: true,
                actionType: publication?.collectionMetadata?.mediaTypes?.[0],
                actionImage: `${INFURA_GATEWAY}/ipfs/${
                  publication?.collectionMetadata?.images?.[0]?.split(
                    "ipfs://"
                  )?.[1]
                }`,
              })
            )
          }
        >
          {publication?.collectionMetadata?.images && (
            <Image
              layout="fill"
              src={`${INFURA_GATEWAY}/ipfs/${
                publication?.collectionMetadata?.images?.[0]?.split(
                  "ipfs://"
                )?.[1]
              }`}
              objectFit="cover"
              draggable={false}
              onError={(e) => handleImageError(e)}
            />
          )}
          <div className="absolute right-2 top-2 w-fit h-fit">
            <PrintType
              t={t}
              printType={
                printTypeToString[
                  Number(publication?.printType) as unknown as PrintTagType
                ]
              }
            />
          </div>
        </div>
        <div className="relative flex flex-row justify-between items-center w-full h-fit gap-1.5">
          <div className="relative flex flex-col items-start justify-center w-fit h-fit mr-auto gap-2">
            <div
              className={`relative items-start justify-center uppercase break-words font-ignite w-fit h-fit ${
                layoutAmount === 4 ? "text-lg" : "text-xl"
              }`}
              id="noCode"
            >
              {publication?.collectionMetadata?.title?.length > 20
                ? publication?.collectionMetadata?.title?.slice(0, 20) + "..."
                : publication?.collectionMetadata?.title}
            </div>
            <div
              className={`relative w-fit h-fit flex text-white font-vcr uppercase ${
                layoutAmount === 4 ? "text-xs" : "text-sm"
              }`}
              onMouseEnter={() =>
                setProfileHovers((prev) => {
                  const updatedArray = [...prev];
                  updatedArray[index] = true;
                  return updatedArray;
                })
              }
            >
              {publication?.profile?.handle?.suggestedFormatted?.localName}
            </div>
            {profileHovers?.[index] && (
              <HoverProfile
                followLoading={followLoading}
                followProfile={followProfile}
                unfollowProfile={unfollowProfile}
                router={router}
                publication={publication?.profile}
                index={index}
                setProfileHovers={setProfileHovers}
                dispatch={dispatch}
                lensConnected={lensConnected}
                parentId={publication?.pubId}
                top={"auto"}
                bottom={"10px"}
                left={"2px"}
                right={"auto"}
              />
            )}
            <div className="relative flex flex-row justify-start items-center w-fit h-fit gap-2">
              <div
                className="relative w-10 h-10 flex items-center justify-center cursor-pointer active:scale-95"
                onClick={() => {
                  const openPopUps = [...popUpOpen];
                  openPopUps[index] = !openPopUps[index];
                  setPopUpOpen(openPopUps);
                }}
              >
                <Image
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/QmZ4v5pzdnCBeyKnS9VrjZiEAbUpAVy8ECArNcpxBt6Tw4`}
                  draggable={false}
                />
              </div>
              {popUpOpen?.[index] && (
                <PopUp
                  t={t}
                  cartItem={publication}
                  index={index}
                  dispatch={dispatch}
                  router={router}
                  level={undefined}
                  bottom={"50px"}
                  left={"-10px"}
                  type={ItemType.Listener}
                  cartItems={cartItems}
                />
              )}
              <div
                className={`relative items-center justify-center uppercase break-words font-vcr text-ballena w-fit h-fit ${
                  layoutAmount === 4 ? "text-xl" : "text-2xl"
                }`}
              >
                ${Number(publication?.prices?.[0] || 0)}
              </div>
            </div>
          </div>
          {publication?.collectionMetadata?.images?.slice(1)?.length > 0 && (
            <div className="relative ml-auto flex items-center justify-center w-20 h-20 rounded-sm border border-white bg-amo/30">
              <Image
                layout="fill"
                src={`${INFURA_GATEWAY}/ipfs/${
                  publication?.collectionMetadata?.images?.[1]?.split(
                    "ipfs://"
                  )?.[1]
                }`}
                objectFit="cover"
                draggable={false}
                onError={(e) => handleImageError(e)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Listener;

import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import { ChromadinProps } from "../../types/tiles.types";
import PopUp from "@/components/Common/modules/PopUp";
import InteractBar from "@/components/Common/modules/InteractBar";
import { setImageViewer } from "../../../../../redux/reducers/ImageLargeSlice";
import HoverProfile from "@/components/Common/modules/HoverProfile";
import { ItemType } from "@/components/Common/types/common.types";
import handleImageError from "../../../../../lib/helpers/handleImageError";

const Chromadin: FunctionComponent<ChromadinProps> = ({
  layoutAmount,
  apparel,
  setApparel,
  index,
  dispatch,
  router,
  setPopUpOpen,
  popUpOpen,
  cartItems,
  publication,
  mirror,
  like,
  interactionsLoading,
  setOpenMirrorChoice,
  openMirrorChoice,
  profileHovers,
  setProfileHovers,
  followProfile,
  followLoading,
  unfollowProfile,
  lensConnected,
}): JSX.Element => {
  return (
    <div
      className="relative w-full h-fit flex items-end justify-center flex flex-col rounded-sm border border-sol p-4 gap-4"
      id={publication?.pubId}
    >
      <InteractBar
        mirror={mirror}
        like={like}
        interactionsLoading={interactionsLoading}
        openMirrorChoice={openMirrorChoice}
        setOpenMirrorChoice={setOpenMirrorChoice}
        index={index}
        publication={publication?.publication}
        simpleCollect={undefined}
        dispatch={dispatch}
        router={router}
      />
      <div className="relative flex flex-col items-center justify-start w-full h-fit gap-5">
        <div className="relative flex flex-row w-full justifty-between items-start h-fit gap-4">
          <div
            className="w-full h-72 rounded-sm bg-amo/30 border border-white cursor-pointer"
            onClick={() =>
              dispatch(
                setImageViewer({
                  actionValue: true,
                  actionType: publication?.mediaTypes?.[0],
                  actionImage: `${INFURA_GATEWAY}/ipfs/${
                    publication?.images?.[0]?.split("ipfs://")?.[1]
                  }`,
                })
              )
            }
          >
            {publication?.images && (
              <Image
                layout="fill"
                src={`${INFURA_GATEWAY}/ipfs/${
                  publication?.images?.[0]?.split("ipfs://")?.[1]
                }`}
                objectFit="cover"
                draggable={false}
                onError={(e) => handleImageError(e)}
              />
            )}
          </div>
          <div className="relative flex flex-col gap-2 justify-start items-center w-fit h-full mt-0">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <Image
                layout="fill"
                src={`${INFURA_GATEWAY}/ipfs/${
                  apparel?.[index]
                    ? "QmcK1EJdp5HFuqPUds3WjgoSPmoomiWfiroRFa3bQUh5Xj"
                    : "QmbjKczJYHKu6FkZMoBRBg2ZuszkJ5CA74x8YF2rYzmA7b"
                }`}
                draggable={false}
              />
            </div>
            <div
              className="relative w-10 h-10 flex items-center justify-center cursor-pointer active:scale-95"
              onClick={() =>
                setApparel((prev) => {
                  const newArray = [...prev];
                  apparel[index] = !newArray[index];
                  return newArray;
                })
              }
            >
              <Image
                layout="fill"
                src={`${INFURA_GATEWAY}/ipfs/QmYzbyMb3okS1RKhxogJZWT56kCFjVcXZWk1aJiA8Ch2xi`}
                draggable={false}
              />
            </div>
          </div>
        </div>
        <div className="relative flex flex-row justify-between gap-2 w-full h-fit items-center">
          <div className="relative gap-1 flex flex-col items-start justify-center">
            <div className="relative flex w-fit h-fit break-words text-nuba font-bit text-lg uppercase">
              {publication?.title}
            </div>
            <div
              className="relative w-fit h-fit flex text-mos text-sm font-bit uppercase cursor-pointer"
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
                bottom={"2px"}
                left={"auto"}
                right={"2px"}
              />
            )}
          </div>
          <div
            className="relative w-10 h-10 flex items-end justify-center mb-0 cursor-pointer active:scale-95"
            onClick={() =>
              setPopUpOpen((prev) => {
                const openPopUps = [...prev];
                openPopUps[index] = !openPopUps[index];
                return openPopUps;
              })
            }
          >
            <Image
              layout="fill"
              src={`${INFURA_GATEWAY}/ipfs/QmZ4v5pzdnCBeyKnS9VrjZiEAbUpAVy8ECArNcpxBt6Tw4`}
              draggable={false}
            />
          </div>
          {popUpOpen?.[index] && (
            <PopUp
              cartItems={cartItems}
              cartItem={publication}
              type={ItemType.Chromadin}
              dispatch={dispatch}
              router={router}
              index={index}
              level={undefined}
              right={"-5px"}
              bottom={"60px"}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Chromadin;

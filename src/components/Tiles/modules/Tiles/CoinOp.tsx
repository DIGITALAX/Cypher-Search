import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import { CoinOpProps } from "../../types/tiles.types";
import PopUp from "@/components/Common/modules/PopUp";
import InteractBar from "@/components/Common/modules/InteractBar";
import { setImageViewer } from "../../../../../redux/reducers/ImageLargeSlice";
import HoverProfile from "@/components/Common/modules/HoverProfile";
import { ItemType } from "@/components/Common/types/common.types";

const CoinOp: FunctionComponent<CoinOpProps> = ({
  layoutAmount,
  popUpOpen,
  index,
  setPopUpOpen,
  dispatch,
  router,
  publication,
  cartItems,
  mirror,
  like,
  interactionsLoading,
  openMirrorChoice,
  setOpenMirrorChoice,
  profileHovers,
  followLoading,
  setProfileHovers,
  followProfile,
  unfollowProfile,
  lensConnected
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex items-end justify-center flex flex-col rounded-sm border border-sol p-4 gap-4" id={publication?.pubId}>
      <InteractBar
        mirror={mirror}
        like={like}
        interactionsLoading={interactionsLoading}
        openMirrorChoice={openMirrorChoice}
        setOpenMirrorChoice={setOpenMirrorChoice}
        index={index}
        publication={publication?.publication}
        simpleCollect={undefined}
        type={undefined}
        dispatch={dispatch}
        router={router}
      />
      <div
        className="relative flex w-full h-100 items-center justify-center border border-white bg-amo/30 cursor-pointer"
        onClick={() =>
          dispatch(
            setImageViewer({
              actionValue: true,
              actionType: "png",
              actionImage: publication?.images[0],
            })
          )
        }
      >
        <Image
          layout="fill"
          src={`${INFURA_GATEWAY}/ipfs/${publication?.images[0]}`}
          draggable={false}
        />
      </div>
      <div className="relative flex flex-row justify-between items-center w-full h-fit gap-1.5">
        <div className="relative flex flex-col items-start justify-center w-fit h-fit mr-auto gap-2">
          <div
            className={`relative items-start justify-center uppercase break-words font-bit text-nuba w-fit h-fit ${
              layoutAmount === 4 ? "text-lg" : "text-2xl"
            }`}
          >
            Coin Op Preroll
          </div>
          <div
            className={`relative w-fit h-fit flex text-pez font-bit uppercase cursor-pointer ${
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
            @hiro.lens
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
            />
          )}
          <div className="relative flex flex-row justify-start items-center w-fit h-fit gap-2">
            <div
              className="relative w-10 h-10 flex items-center justify-center cursor-pointer active:scale-95"
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
                cartItem={publication}
                index={index}
                dispatch={dispatch}
                router={router}
                level={undefined}
                bottom={"50px"}
                left={"-10px"}
                type={ItemType.CoinOp}
                cartItems={cartItems}
              />
            )}
            <div
              className={`relative items-center justify-center uppercase break-words font-bit text-nuba w-fit h-fit ${
                layoutAmount === 4 ? "text-xl" : "text-4xl"
              }`}
            >
              $120
            </div>
          </div>
        </div>
        <div className="relative ml-auto flex items-center justify-center w-20 h-20 rounded-sm border border-white bg-amo/30">
          <Image
            layout="fill"
            src={`${INFURA_GATEWAY}/ipfs/`}
            className="rounded-sm"
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
};

export default CoinOp;

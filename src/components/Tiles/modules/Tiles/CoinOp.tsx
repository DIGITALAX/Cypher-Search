import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import {
  INFURA_GATEWAY,
  printTypeToString,
} from "../../../../../lib/constants";
import {
  CoinOpProps,
  PrintType as PrintTagType,
} from "../../types/tiles.types";
import PopUp from "@/components/Common/modules/PopUp";
import InteractBar from "@/components/Common/modules/InteractBar";
import { setImageViewer } from "../../../../../redux/reducers/ImageLargeSlice";
import HoverProfile from "@/components/Common/modules/HoverProfile";
import { ItemType } from "@/components/Common/types/common.types";
import handleImageError from "../../../../../lib/helpers/handleImageError";
import PrintType from "@/components/Common/modules/PrintType";

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
  lensConnected,
  filterConstants,
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
        creation
      />
      <div
        className="relative flex w-full h-100 items-center justify-center border border-white bg-amo/30 cursor-pointer"
        onClick={() =>
          dispatch(
            setImageViewer({
              actionValue: true,
              actionType: "png",
              actionImage: publication?.collectionMetadata?.images[0],
            })
          )
        }
      >
        {publication?.collectionMetadata?.images?.[0] && (
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
          {publication?.origin !== "4" ? (
            <>
              <PrintType
                printType={
                  printTypeToString[
                    Number(publication?.printType) as unknown as PrintTagType
                  ]
                }
              />
              {publication?.collectionMetadata?.onChromadin == "yes" && (
                <div
                  className="relative flex pt-3 flex-row gap-2 justify-start items-center w-fit h-full cursor-pointer active:scale-95"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    router.push(
                      `/item/chromadin/${publication?.collectionMetadata?.title
                        ?.replaceAll(" ", "_")
                        ?.replaceAll("_(Print)", "")}`
                    );
                  }}
                >
                  <div className="relative w-5 h-5 flex items-center justify-center">
                    <Image
                      layout="fill"
                      src={`${INFURA_GATEWAY}/ipfs/QmcK1EJdp5HFuqPUds3WjgoSPmoomiWfiroRFa3bQUh5Xj`}
                      draggable={false}
                    />
                  </div>
                  <div className="relative w-5 h-5 flex items-center justify-center">
                    <Image
                      layout="fill"
                      src={`${INFURA_GATEWAY}/ipfs/QmYzbyMb3okS1RKhxogJZWT56kCFjVcXZWk1aJiA8Ch2xi`}
                      draggable={false}
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="relative flex w-fit px-1.5 py-1 h-fit text-white font-aust gap-1 items-center justify-center">
              <div
                className="relative flex items-center justify-center w-7 h-7 hover:rotate-45"
                title={
                  filterConstants?.styles?.filter(
                    (item) =>
                      item?.[0]?.toLowerCase() ==
                      publication?.collectionMetadata?.style?.toLowerCase()
                  )?.[0]?.[0]
                }
              >
                <Image
                  layout="fill"
                  draggable={false}
                  src={`${INFURA_GATEWAY}/ipfs/${
                    filterConstants?.styles?.filter(
                      (item) =>
                        item?.[0]?.toLowerCase() ==
                        publication?.collectionMetadata?.style?.toLowerCase()
                    )?.[0]?.[1]
                  }`}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="relative flex flex-row justify-between items-center w-full h-fit gap-1.5">
        <div className="relative flex flex-col items-start justify-center w-fit h-fit mr-auto gap-2">
          <div
            className={`relative items-start justify-center uppercase break-words font-bit text-nuba w-fit h-fit ${
              layoutAmount === 4 ? "text-lg" : "text-xl"
            }`}
          >
            {publication?.collectionMetadata?.title?.length > 20
              ? publication?.collectionMetadata?.title?.slice(0, 20) + "..."
              : publication?.collectionMetadata?.title}
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
                type={
                  publication?.origin == "4" ? ItemType.F3M : ItemType.CoinOp
                }
                cartItems={cartItems}
              />
            )}
            <div
              className={`relative items-center justify-center uppercase break-words font-bit text-nuba w-fit h-fit ${
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
  );
};

export default CoinOp;

import { FunctionComponent } from "react";
import { Drop, GalleryProps } from "../types/autograph.types";
import Image from "next/legacy/image";
import { GALLERY_OPTIONS, INFURA_GATEWAY } from "../../../../lib/constants";
import InfiniteScroll from "react-infinite-scroll-component";
import { Creation as CreationType } from "@/components/Tiles/types/tiles.types";
import Creation from "./Metadata/Creation";
import getGallerySort from "../../../../lib/helpers/getGallerySort";
import handleImageError from "../../../../lib/helpers/handleImageError";

const Gallery: FunctionComponent<GalleryProps> = ({
  optionsOpen,
  setOptionsOpen,
  selectedOption,
  mirror,
  like,
  router,
  openMirrorChoice,
  handleOptionSelect,
  setOpenMirrorChoice,
  interactionsLoading,
  getMoreGallery,
  followLoading,
  followProfile,
  profileHovers,
  setProfileHovers,
  unfollowProfile,
  gallery,
  openInteractions,
  setOpenInteractions,
  dispatch,
  cartItems,
  allDrops,
  lensConnected,
  hasMoreGallery,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-col gap-10 items-start justify-start flex-grow otro:order-2 order-1 sm:pt-0 pt-10">
      <div className="relative w-full justify-end flex items-center h-fit sm:px-0 px-1">
        <div className="relative w-[16rem] h-fit flex items-center justify-between flex p-2 border border-afilado rounded-md gap-3 font-bit">
          <div className="relative w-fit h-fit flex items-center justify-center text-white text-sm sm:text-base top-px">
            Gallery
          </div>
          <div
            className="relative flex flex-row justify-between gap-2 cursor-pointer border items-center rounded-sm w-fit h-fit border-hierba p-2"
            onClick={() => setOptionsOpen(!optionsOpen)}
          >
            <div className="relative w-fit h-fit flex items-center justify-center text-white text-xs sm:text-sm top-px">
              {selectedOption}
            </div>
            <div className="relative w-3 h-2 items-center justify-center flex">
              <Image
                layout="fill"
                src={`${INFURA_GATEWAY}/ipfs/QmUvWVFG5Wq1etv6i7u8T5rrq5t2p4W5kEt1sbQg91236x`}
              />
            </div>
          </div>
        </div>
        {optionsOpen && (
          <div className="absolute flex items-start justify-center w-40 sm:w-60 h-40 top-14 z-10 bg-black overflow-y-scroll border border-afilado rounded-md">
            <div className="relative flex flex-col w-full h-fit gap-2 items-center justify-start">
              {GALLERY_OPTIONS?.map((item: string, index: number) => {
                return (
                  <div
                    key={index}
                    className="relative w-full h-fit border-b border-afilado flex items-center justify-center cursor-pointer hover:opacity-70 text-white font-bit top-px"
                    onClick={() => {
                      handleOptionSelect(item);
                      setOptionsOpen(false);
                    }}
                  >
                    <div className="relative w-fit h-fit flex items-center justify-center text-xs sm:text-sm">
                      {item}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {
        <div className="relative w-full h-fit max-h-[40rem] otro:max-h-[145rem] flex items-start justify-center overflow-y-scroll">
          <InfiniteScroll
            dataLength={
              [...(gallery?.collected || []), ...(gallery?.created || [])]
                ?.length
            }
            loader={<></>}
            hasMore={hasMoreGallery}
            next={getMoreGallery}
            className="w-full h-fit items-start justify-center md:justify-between flex flex-row flex-wrap gap-8"
          >
            {getGallerySort(selectedOption, gallery)?.map(
              (item: CreationType, index: number) => {
                return (
                  <Creation
                    lensConnected={lensConnected}
                    dispatch={dispatch}
                    cartItems={cartItems}
                    key={index}
                    followProfile={followProfile}
                    unfollowProfile={unfollowProfile}
                    followLoading={followLoading}
                    profileHovers={profileHovers}
                    setProfileHovers={setProfileHovers}
                    mirror={mirror}
                    like={like}
                    openMirrorChoice={openMirrorChoice}
                    setOpenMirrorChoice={setOpenMirrorChoice}
                    interactionsLoading={interactionsLoading?.[index]}
                    router={router}
                    item={item}
                    index={index}
                    created={
                      gallery?.created?.find(
                        (value) => item?.pubId === value?.pubId
                      )
                        ? true
                        : false
                    }
                    openInteractions={openInteractions}
                    setOpenInteractions={setOpenInteractions}
                  />
                );
              }
            )}
          </InfiniteScroll>
        </div>
      }
      {allDrops && allDrops?.length > 0 && (
        <div className="relative w-full h-fit flex items-start justify-start overflow-x-scroll max-h-[40rem] otro:max-h-[60rem]">
          <div className="w-full h-fit items-start justify-center md:justify-between flex flex-row flex-wrap gap-8">
            {allDrops?.map((item: Drop, index: number) => {
              return (
                item?.collectionIds?.length > 0 && (
                  <div
                    key={index}
                    className="relative h-80 w-80 rounded-sm flex items-center justify-center cursor-pointer hover:opacity-80 p-3 bg-offBlack"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(
                        `/autograph/${
                          lensConnected?.handle?.suggestedFormatted?.localName?.split(
                            "@"
                          )?.[1]
                        }/drop/${item?.dropDetails?.dropTitle?.replaceAll(
                          " ",
                          "_"
                        )}`
                      );
                    }}
                  >
                    <div
                      className="relative w-full h-full flex items-center justify-center"
                      id="staticLoad"
                    >
                      <div className="relative w-full h-full flex">
                        <Image
                          src={`${INFURA_GATEWAY}/ipfs/${
                            item?.dropDetails?.dropCover?.split("ipfs://")?.[1]
                          }`}
                          className="rounded-sm"
                          objectFit="cover"
                          layout="fill"
                          onError={(e) => handleImageError(e)}
                        />
                      </div>
                      <div className="absolute bottom-0 right-0 w-full h-10 bg-black flex items-center justify-end px-1">
                        <div className="relative w-fit h-fit flex items-center justify-center font-bit top-px text-xs text-white">
                          {item?.dropDetails?.dropTitle?.length > 20
                            ? item?.dropDetails?.dropTitle
                                ?.slice(0, 20)
                                ?.toLowerCase()
                            : item?.dropDetails?.dropTitle?.toLowerCase()}
                        </div>
                        <div
                          className="relative w-4 h-4 justify-end flex items-center cursor-pointer active:scale-95 ml-auto"
                          title="Go to Drop"
                        >
                          <Image
                            draggable={false}
                            layout="fill"
                            src={`${INFURA_GATEWAY}/ipfs/QmRkAoLMAh2hxZfh5WvaxuxRUMhs285umdJWuvLa5wt6Ht`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;

import { FunctionComponent } from "react";
import { GalleryProps } from "../types/autograph.types";
import Image from "next/legacy/image";
import { GALLERY_OPTIONS, INFURA_GATEWAY } from "../../../../lib/constants";
import InfiniteScroll from "react-infinite-scroll-component";
import { Creation as CreationType } from "@/components/Tiles/types/tiles.types";
import Creation from "./Metadata/Creation";

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
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-col gap-4 items-center justify-start flex-grow">
      <div className="relative w-full justify-end flex items-center h-fit">
        <div className="relative w-[16rem] h-fit flex items-center justify-between flex p-2 border border-afilado rounded-md gap-3 font-bit">
          <div className="relative w-fit h-fit flex items-center justify-center text-white text-md top-px">
            Gallery
          </div>
          <div
            className="relative flex flex-row justify-between gap-2 cursor-pointer border items-center rounded-sm w-fit h-fit border-hierba p-2"
            onClick={() => setOptionsOpen(!optionsOpen)}
          >
            <div className="relative w-fit h-fit flex items-center justify-center text-white text-sm top-px">
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
          <div className="absolute flex items-start justify-center w-60 h-40 top-14 z-10 bg-black overflow-y-scroll border border-afilado rounded-md">
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
                    <div className="relative w-fit h-fit flex items-center justify-center">
                      {item}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <div className="relative w-full h-[145rem] flex items-start justify-center overflow-y-scroll">
        <InfiniteScroll
          dataLength={16}
          loader={<></>}
          hasMore={true}
          next={getMoreGallery}
          className="w-full h-fit items-start justify-between flex flex-row flex-wrap gap-8"
        >
          {
            // selectedOption === 'NEWEST'
            // ? [...(gallery?.collected || []), ...(gallery?.created || [])].sort((a, b) => Number( b.blockTimestamp) - Number(a.blockTimestamp))
            // : selectedOption === 'OLDEST'
            // ? [...(gallery?.collected || []), ...(gallery?.created || [])].sort((a, b) => Number(a.blockTimestamp )-Number( b.blockTimestamp))
            // : selectedOption === 'CREATED'
            // ? [...(gallery?.created || []), ...(gallery?.collected || [])]
            // : selectedOption === 'COLLECTED'
            // ? [...(gallery?.collected || []), ...(gallery?.created || [])] :
            // selectedOption === "PRINT TYPE" ? Object.values(
            //   [...(gallery?.collected || []), ...(gallery?.created || [])].reduce((acc: Record<string, any>, item) => {
            //     const printType = item.printType || '6';
            //     acc[printType] = acc[printType] || [];
            //     acc[printType].push(item);
            //     return acc;
            //   }, {})
            // ).flat()
            //  : selectedOption === "PRICE LOWEST" ?
            // [...(gallery?.collected || []), ...(gallery?.created || [])].sort((a, b) => (Number(a.prices?.[0]) || 0) - (Number(b.prices?.[0]) || 0)) : [...(gallery?.collected || []), ...(gallery?.created || [])].sort((a, b) => (Number(b.prices?.[0]) || 0) - (Number(a.prices?.[0]) || 0))

            Array.from({ length: 20 })?.map(
              (item: CreationType, index: number) => {
                return (
                  <Creation
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
                        (value) => item.pubId === value.pubId
                      )
                        ? true
                        : false
                    }
                    openInteractions={openInteractions}
                    setOpenInteractions={setOpenInteractions}
                  />
                );
              }
            )
          }
        </InfiniteScroll>
      </div>
      <div className="relative flex-grow flex items-end justify-center w-full h-[55rem]">
        <div
          className="relative w-full h-[50rem] bottom-0 flex items-end justify-center"
          draggable={false}
        >
          <Image
            layout="fill"
            src={`${INFURA_GATEWAY}/ipfs/QmV4yM96Dt2ypLN9GMHkXPTkeCGfTQfJErJLfVjikxt52s`}
            draggable={false}
          />
          <div className="absolute w-full h-full bg-black opacity-[85%]"></div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;

import { FunctionComponent, JSX, useContext } from "react";
import { Drop, GalleryProps } from "../types/autograph.types";
import Image from "next/legacy/image";
import InfiniteScroll from "react-infinite-scroll-component";
import { GALLERY_OPTIONS, INFURA_GATEWAY } from "@/app/lib/constants";
import handleImageError from "@/app/lib/helpers/handleImageError";
import { usePathname, useRouter } from "next/navigation";
import useGallery from "../hooks/useGallery";
import getGallerySort from "@/app/lib/helpers/getGallerySort";
import Creation from "./Creation";
import { ModalContext } from "@/app/providers";
import { getLocaleFromPath } from "@/app/lib/helpers/getLocalPath";
import { NFTData } from "../../Tiles/types/tiles.types";

const Gallery: FunctionComponent<GalleryProps> = ({
  dict,
  profile,
}): JSX.Element => {
  const router = useRouter();
  const path = usePathname();
  const context = useContext(ModalContext);
  const {
    optionsOpen,
    setOptionsOpen,
    selectedOption,
    handleOptionSelect,
    gallery,
    moreGalleryLoading,
    getMoreGallery,
    cursorInfo,
    allDrops,
    galleryLoading,
  } = useGallery(profile);

  return (
    <div className="relative w-full h-full flex flex-col gap-10 items-start justify-start flex-grow otro:order-2 order-1 sm:pt-0 pt-10">
      <div className="relative w-full justify-end flex items-center h-fit sm:px-0 px-1">
        <div className="relative w-[16rem] h-fit flex items-center justify-between flex p-2 border border-afilado rounded-md gap-3 font-bit">
          <div className="relative w-fit h-fit flex items-center justify-center text-white text-sm sm:text-base top-px">
            {dict?.gal}
          </div>
          <div
            className="relative flex flex-row justify-between gap-2 cursor-pointer border items-center rounded-sm w-fit h-fit border-hierba p-2"
            onClick={() => setOptionsOpen((prev) => !prev)}
          >
            <div className="relative w-fit h-fit flex items-center justify-center text-white text-xs sm:text-sm top-px">
              {selectedOption}
            </div>
            <div className="relative w-3 h-2 items-center justify-center flex">
              <Image
                layout="fill"
                draggable={false}
                src={`${INFURA_GATEWAY}/ipfs/QmUvWVFG5Wq1etv6i7u8T5rrq5t2p4W5kEt1sbQg91236x`}
              />
            </div>
          </div>
        </div>
        {optionsOpen && (
          <div className="absolute flex items-start justify-center w-40 sm:w-60 h-40 top-14 z-10 bg-black overflow-y-scroll border border-afilado rounded-md">
            <div className="relative flex flex-col w-full h-fit gap-2 items-center justify-start">
              {GALLERY_OPTIONS?.map(
                (item: { es: string; en: string }, index: number) => {
                  return (
                    <div
                      key={index}
                      className="relative w-full h-fit border-b border-afilado flex items-center justify-center cursor-pointer hover:opacity-70 text-white font-bit top-px"
                      onClick={() => {
                        handleOptionSelect(item?.[getLocaleFromPath(path)]);
                        setOptionsOpen(false);
                      }}
                    >
                      <div className="relative w-fit h-fit flex items-center justify-center text-xs sm:text-sm">
                        {item?.[getLocaleFromPath(path)]}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}
      </div>
      {galleryLoading ? (
        <div className="relative w-full h-fit max-h-[40rem] otro:max-h-[145rem] flex items-start justify-center overflow-y-scroll">
          <InfiniteScroll
            dataLength={20}
            loader={<></>}
            hasMore={false}
            next={() => {}}
            className="w-full h-fit items-start justify-center md:justify-start flex flex-row flex-wrap gap-8"
          >
            {Array.from({ length: 20 })?.map((_, index: number) => {
              return (
                <div
                  className="relative w-80 h-80 bg-piloto flex items-center justify-start flex-col p-2 gap-4"
                  key={index}
                >
                  <div
                    className={`relative w-full h-full flex items-center justify-center hover:opacity-90 rounded-md cursor-pointer border-2 border-olor`}
                    id="staticLoad"
                  ></div>
                </div>
              );
            })}
          </InfiniteScroll>
        </div>
      ) : (
        <div className="relative w-full h-fit max-h-[40rem] otro:max-h-[145rem] flex items-start justify-center overflow-y-scroll">
          <InfiniteScroll
            dataLength={
              [
                ...(gallery?.collectedPrint || []),
                ...(gallery?.createdPrint || []),
                ...(gallery?.collectedTripleA || []),
                ...(gallery?.collectedTripleA || []),
              ]?.length + (moreGalleryLoading ? 20 : 0)
            }
            loader={<></>}
            hasMore={cursorInfo?.hasMorePrint || cursorInfo?.hasMoreTripleA}
            next={getMoreGallery}
            className="w-full h-fit items-start justify-center md:justify-start flex flex-row flex-wrap gap-8"
          >
            {(moreGalleryLoading
              ? [
                  ...getGallerySort(
                    selectedOption,
                    gallery,
                    getLocaleFromPath(path)
                  ),
                  ...Array.from({ length: 20 }),
                ]
              : getGallerySort(selectedOption, gallery, getLocaleFromPath(path))
            )?.map((item: any, index: number) => {
              return moreGalleryLoading &&
                index >
                  gallery?.collectedPrint?.length +
                    gallery?.createdPrint?.length -
                    1 ? (
                <div
                  className="relative w-80 h-80 bg-piloto flex items-center justify-start flex-col p-2 gap-4"
                  key={index}
                >
                  <div
                    className={`relative w-full h-full flex items-center justify-center hover:opacity-90 rounded-md cursor-pointer border-2 border-olor`}
                    id="staticLoad"
                  ></div>
                </div>
              ) : (
                <Creation
                  dict={dict}
                  key={index}
                  item={item}
                  created={
                    [
                      ...gallery?.createdPrint,
                      ...gallery?.createdTripleA,
                    ]?.find(
                      (value) =>
                        item?.metadata?.title ==
                        (value as NFTData)?.metadata?.title
                    )
                      ? true
                      : false
                  }
                />
              );
            })}
          </InfiniteScroll>
        </div>
      )}
      {allDrops?.length > 0 && (
        <div className="relative w-full h-fit flex items-start justify-start overflow-x-scroll max-h-[40rem] otro:max-h-[60rem]">
          <div className="w-full h-fit items-start justify-center md:justify-start flex flex-row flex-wrap gap-8">
            {allDrops?.map((item: Drop, index: number) => {
              return (
                <div
                  key={index}
                  className="relative h-80 w-80 rounded-sm flex items-center justify-center cursor-pointer hover:opacity-80 p-3 bg-offBlack"
                  onClick={(e) => {
                    e.stopPropagation();
                    context?.setFiltersOpen({ value: false, allow: false });
                    router.push(
                      `/autograph/${
                        profile?.username?.localName
                      }/drop/${item?.metadata?.title?.replaceAll(" ", "_")}`
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
                          item?.metadata?.cover?.split("ipfs://")?.[1] ??
                          (
                            item?.collections?.[0]?.metadata as any
                          )?.image?.split("ipfs://")?.[1]
                        }`}
                        draggable={false}
                        className="rounded-md"
                        objectFit="cover"
                        layout="fill"
                        onError={(e) => handleImageError(e)}
                      />
                    </div>
                    <div className="absolute bottom-0 right-0 w-full h-10 bg-black flex items-center justify-end px-1">
                      <div className="relative w-fit h-fit flex items-center justify-center font-bit top-px text-xs text-white">
                        {item?.metadata?.title?.length > 20
                          ? item?.metadata?.title?.slice(0, 20)?.toLowerCase()
                          : item?.metadata?.title?.toLowerCase()}
                      </div>
                      <div
                        className="relative w-4 h-4 justify-end flex items-center cursor-pointer active:scale-95 ml-auto"
                        title={dict?.goDrop}
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
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;

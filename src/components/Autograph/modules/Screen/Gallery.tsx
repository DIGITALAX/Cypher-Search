import { Creation } from "@/components/Tiles/types/tiles.types";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import { GalleryScreenProps } from "../../types/autograph.types";

const Gallery: FunctionComponent<GalleryScreenProps> = ({
  activeGallery,
  gallery,
}): JSX.Element => {
  return (
    <div className="relative flex flex-row gap-4 items-start justify-center w-full h-full">
      {[...(gallery?.collected || []), ...(gallery?.created || [])]?.length >
      0 ? (
        <div
          className="relative w-4/5 h-full overflow-x-scroll flex justify-start items-start"
          id="prerollScroll"
        >
          <div
            className={`relative w-fit h-fit grid gap-5 justify-start items-start`}
            style={{
              gridTemplateColumns: `repeat(${
                [...(gallery?.collected || []), ...(gallery?.created || [])]
                  ?.length < 4
                  ? 4
                  : Math.ceil(
                      [
                        ...(gallery?.collected || []),
                        ...(gallery?.created || []),
                      ]?.length / 2
                    )
              }, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${
                [...(gallery?.collected || []), ...(gallery?.created || [])]
                  ?.length < 4
                  ? 1
                  : 2
              }, auto)`,
            }}
          >
            {[...(gallery?.collected || []), ...(gallery?.created || [])]
              ?.sort(() => Math.random() - 0.5)
              .map((item: Creation, index: number) => {
                return (
                  <div
                    key={index}
                    className="relative w-60 h-60 rounded-sm p-px cursor-pointer"
                    id="pfp"
                  >
                    <div className="relative w-full h-full">
                      <Image
                        layout="fill"
                        src={`${INFURA_GATEWAY}/ipfs/${item?.images?.[0]}`}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        <div className="relative items-center justify-center text-white font-bit w-full h-full"></div>
      )}
      <div
        className="relative flex gap-3 w-80 h-[65vh] p-px rounded-md"
        id="mar"
      >
        <div className="relative w-full h-full bg-piloto flex flex-col gap-7 rounded-md p-3 items-center justify-start">
          <div className="font-bit text-white text-xs text-center flex w-4/5 h-fit relative">
            Fine-Tune Your gallery, with Art, collectibles, and rare gems that
            are more than they seem.
          </div>
          <div className="relative w-full h-10 bg-olor border border-[#DAB275] flex items-center justify-center text-saph font-bit text-lg cursor-pointer active:scale-95">
            <div className="relative w-fit h-fit items-center justify-center flex top-1">
              + New Collection
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;

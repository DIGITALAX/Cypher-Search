import { FunctionComponent } from "react";
import { DisplaySearchProps } from "../types/modals.types";
import { ImCross } from "react-icons/im";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import Image from "next/legacy/image";
import { setDisplaySearchBox } from "../../../../redux/reducers/displaySearchBoxSlice";
import handleImageError from "../../../../lib/helpers/handleImageError";

const DisplaySearch: FunctionComponent<DisplaySearchProps> = ({
  dispatch,
  gallery,
  sortType,
  itemSearch,
  setItemSearch,
  sortedGallery,
  handleItemSelect,
  numberIndex,
  selectedItem,
  galleryLoading,
}): JSX.Element => {
  return (
    <div className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-[90vw] sm:w-[70vw] tablet:w-[50vw] h-[50vh] place-self-center bg-offBlack rounded-lg border border-white rounded-sm">
        <div className="relative w-full h-full flex flex-col gap-5 p-2">
          <div className="relative w-fit h-fit items-end justify-end ml-auto cursor-pointer flex">
            <ImCross
              color="#FBDB86"
              size={10}
              onClick={() =>
                dispatch(
                  setDisplaySearchBox({
                    actionValue: undefined,
                    actionType: undefined,
                  })
                )
              }
            />
          </div>
          <div className="relative w-full h-fit items-center justify-start flex flex-col gap-3">
            <div className="relative w-5/6 sm:w-2/3 h-fit flex flex-col gap-2 items-center justify-center">
              <div className="relative font font-bit text-white text-sm text-center">
                Search Collected & Created
              </div>
              <div className="relative w-full h-10 rounded-sm bg-piloto border border-fuera p-px flex items-start justify-start text-left text-white font-bit">
                <input
                  onChange={(e) => setItemSearch(e.target.value)}
                  style={{
                    resize: "none",
                  }}
                  value={itemSearch || ""}
                  className="bg-piloto p-1 flex w-full h-full items-start justify-start"
                />
              </div>
            </div>
            <div className="relative w-2/3 h-72 flex items-start justify-center overflow-y-scroll">
              <div className="relative w-full h-fit flex flex-row flex-wrap items-start justify-center gap-2">
                {galleryLoading
                  ? Array.from({ length: 20 })?.map((_, index: number) => {
                      return (
                        <div
                          key={index}
                          className={`relative w-60 h-60 rounded-sm p-px flex animate-pulse items-center justify-center`}
                          id="pfp"
                        ></div>
                      );
                    })
                  : (sortedGallery && sortedGallery?.length > 0
                      ? sortedGallery
                      : [
                          ...(gallery?.collected || []),
                          ...(gallery?.created || []),
                        ]
                    )
                      ?.sort(() => Math.random() - 0.5)
                      ?.filter((item) =>
                        item?.title
                          ?.toLowerCase()
                          ?.includes(itemSearch?.toLowerCase())
                      )
                      ?.map(
                        (
                          item: {
                            collectionId: string;
                            images: string[];
                            title: string;
                          },
                          index: number
                        ) => {
                          return (
                            <div
                              key={index}
                              className={`relative w-60 h-60 rounded-sm p-px flex cursor-pointer ${
                                item?.collectionId ===
                                  selectedItem?.collectionId &&
                                "border-2 border-white"
                              }`}
                              id="pfp"
                              onClick={() =>
                                handleItemSelect(item, sortType, numberIndex)
                              }
                            >
                              <div className="relative w-full h-full rounded-sm">
                                <Image
                                  layout="fill"
                                  src={`${INFURA_GATEWAY}/ipfs/${
                                    item?.images?.[0]?.split("ipfs://")?.[1]
                                  }`}
                                  className="rounded-sm"
                                  objectFit="cover"
                                  onError={(e) => handleImageError(e)}
                                />
                              </div>
                            </div>
                          );
                        }
                      )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplaySearch;

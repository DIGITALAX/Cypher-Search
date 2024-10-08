import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import { Drop as DropType, DropProps } from "../../types/autograph.types";
import handleImageError from "../../../../../lib/helpers/handleImageError";

const Drop: FunctionComponent<DropProps> = ({
  router,
  setDropDetails,
  allDrops,
  dropDetails,
  handle,
  dropsLoading,
  t
}): JSX.Element => {
  return allDrops?.length > 0 || dropsLoading ? (
    <div
      className="relative w-full tablet:w-4/5 h-full overflow-x-scroll flex justify-start items-start"
      id="prerollScroll"
    >
      <div className="relative w-full h-full flex items-start justify-start">
        <div
          className={`relative w-full h-fit flex flex-wrap gap-6 items-start justify-start`}
        >
          {dropsLoading
            ? Array.from({ length: 20 })?.map((_, index: number) => {
                return (
                  <div
                    key={index}
                    className={`relative w-40 h-40 rounded-sm p-px animate-pulse`}
                    id="pfp"
                  ></div>
                );
              })
            : allDrops?.map((item: DropType, index: number) => {
                return (
                  <div
                    key={index}
                    className={`relative w-40 h-40 rounded-sm p-px cursor-pointer z-0 ${
                      dropDetails?.dropId === item?.dropId &&
                      "border-2 border-white"
                    }`}
                    id="pfp"
                    onClick={() =>
                      dropDetails?.dropId === item?.dropId
                        ? setDropDetails({
                            collectionIds: [],
                            cover: "",
                            title: "",
                            dropId: "",
                          })
                        : setDropDetails({
                            collectionIds: item?.collectionIds,
                            cover: item?.dropDetails?.dropCover,
                            title: item?.dropDetails?.dropTitle,
                            dropId: item?.dropId,
                          })
                    }
                  >
                    <div className="relative w-full h-full">
                      {item?.dropDetails?.dropCover && (
                        <Image
                          layout="fill"
                          src={`${INFURA_GATEWAY}/ipfs/${
                            item?.dropDetails?.dropCover?.split("ipfs://")?.[1]
                          }`}
                          objectFit="cover"
                          draggable={false}
                          onError={(e) => handleImageError(e)}
                        />
                      )}
                    </div>
                    <div className="absolute bottom-0 right-0 w-full h-6 bg-offBlack flex items-center justify-end px-1 z-10">
                      <div className="relative mr-auto flex items-center justify-start text-white font-aust text-xxs">
                        {item?.dropDetails?.dropTitle?.length > 15
                          ? item?.dropDetails?.dropTitle?.slice(0, 12) + "..."
                          : item?.dropDetails?.dropTitle}
                      </div>
                      <div
                        className="relative w-4 h-4 justify-end flex items-center cursor-pointer active:scale-95 ml-auto"
                        title={t("goDrop")}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(
                            `/autograph/${handle}/drop/${item?.dropDetails?.dropTitle?.replaceAll(
                              " ",
                              "_"
                            )}`
                          );
                        }}
                      >
                        <Image
                          draggable={false}
                          layout="fill"
                          src={`${INFURA_GATEWAY}/ipfs/QmRkAoLMAh2hxZfh5WvaxuxRUMhs285umdJWuvLa5wt6Ht`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  ) : (
    <div className="relative w-1/2 h-fit flex items-center justify-center font-ignite text-xl text-white text-center break-words">
      Create a new Drop.
    </div>
  );
};

export default Drop;

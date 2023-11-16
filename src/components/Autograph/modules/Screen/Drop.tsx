import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import { Drop, DropProps } from "../../types/autograph.types";

const Drop: FunctionComponent<DropProps> = ({
  router,
  setDropDetails,
  allDrops,
  dropDetails,
  handle,
  dropsLoading,
}): JSX.Element => {
  return allDrops?.length > 0 || dropsLoading ? (
    <div
      className="relative w-4/5 h-full overflow-x-scroll flex justify-start items-start"
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
            : allDrops
                ?.sort(() => Math.random() - 0.5)
                .map((item: Drop, index: number) => {
                  return (
                    <div
                      key={index}
                      className={`relative w-40 h-40 rounded-sm p-px cursor-pointer ${
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
                              collectionIds: item.collectionIds,
                              cover: item.cover,
                              title: item.title,
                              dropId: item.dropId,
                            })
                      }
                    >
                      <div className="relative w-full h-full">
                        <Image
                          layout="fill"
                          src={`${INFURA_GATEWAY}/ipfs/${
                            item?.cover?.split("ipfs://")?.[1]
                          }`}
                          draggable={false}
                        />
                      </div>
                      <div className="absolute bottom-0 right-0 w-full h-6 bg-offBlack flex items-center justify-end px-1">
                        <div
                          className="relative w-4 h-4 justify-end flex items-center cursor-pointer active:scale-95 ml-auto"
                          title="Go to Drop"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/autograph/${handle}/drop/${item.title}`
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

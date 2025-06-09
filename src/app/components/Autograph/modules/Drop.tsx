import { INFURA_GATEWAY } from "@/app/lib/constants";
import handleImageError from "@/app/lib/helpers/handleImageError";
import { ModalContext } from "@/app/providers";
import Image from "next/legacy/image";
import { useRouter } from "next/navigation";
import { FunctionComponent, JSX, useContext } from "react";
import { DropProps } from "../types/autograph.types";

const Drop: FunctionComponent<DropProps> = ({
  setDropDetails,
  allDrops,
  dropDetails,
  dropsLoading,
  dict,
}): JSX.Element => {
  const context = useContext(ModalContext);
  const router = useRouter();
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
            : allDrops?.map((item, index: number) => {
             
                return (
                  <div
                    key={index}
                    className={`relative w-40 h-40 rounded-sm p-px cursor-pointer z-0 ${
                      dropDetails?.dropId === item?.dropId &&
                      dropDetails?.dropId !== "" &&
                      item?.dropId !== undefined &&
                      "border-2 border-white"
                    }`}
                    id="pfp"
                    onClick={() =>
                      dropDetails?.dropId === item?.dropId && item?.dropId !== undefined
                        ? setDropDetails({
                            collectionIds: [],
                            cover: "",
                            title: "",
                            dropId: "",
                          })
                        : setDropDetails({
                            collectionIds: item?.collections?.map((col) =>
                              String(col?.collectionId)
                            ),
                            cover: item?.metadata?.cover,
                            title: item?.metadata?.title,
                            dropId: item?.dropId,
                          })
                    }
                  >
                    <div className="relative w-full h-full">
                      {item?.metadata?.cover && (
                        <Image
                          layout="fill"
                          src={`${INFURA_GATEWAY}/ipfs/${
                            item?.metadata?.cover?.split("ipfs://")?.[1]
                          }`}
                          objectFit="cover"
                          draggable={false}
                          onError={(e) => handleImageError(e)}
                        />
                      )}
                    </div>
                    <div className="absolute bottom-0 right-0 w-full h-6 bg-offBlack flex items-center justify-end px-1 z-10">
                      <div className="relative mr-auto flex items-center justify-start text-white font-aust text-xxs">
                        {item?.metadata?.title?.length > 15
                          ? item?.metadata?.title?.slice(0, 12) + "..."
                          : item?.metadata?.title}
                      </div>
                      <div
                        className="relative w-4 h-4 justify-end flex items-center cursor-pointer active:scale-95 ml-auto"
                        title={dict?.goDrop}
                        onClick={(e) => {
                          e.stopPropagation();
                          context?.setFiltersOpen({
                            value: false,
                            allow: false,
                          });
                          router.push(
                            `/autograph/${
                              context?.lensConectado?.profile?.username
                                ?.localName
                            }/drop/${item?.metadata?.title?.replaceAll(
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
    <div className="relative w-1/2 h-full flex items-center justify-center font-ignite text-xl text-white text-center break-words">
      Create a new Drop.
    </div>
  );
};

export default Drop;

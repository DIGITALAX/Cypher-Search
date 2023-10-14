import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import { ImagePostProps } from "../../types/tiles.types";

const ImagePost: FunctionComponent<ImagePostProps> = ({
  layoutAmount,
  id,
  router,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex items-center justify-center flex flex-col rounded-sm border border-sol p-4 gap-4">
      {layoutAmount === 4 ? (
        <>
          <div className="relative flex w-full h-40 rounded-sm border border-white bg-amo/30 cursor-pointer items-center justify-center">
            <Image
              layout="fill"
              src={`${INFURA_GATEWAY}/ipfs/`}
              className="rounded-sm"
              draggable={false}
            />
          </div>
          <div className="relative w-full h-80 rounded-sm border border-mosgu bg-fuego p-1 font-bit text-nuba text-sm text-left break-words flex justify-center items-center"></div>
          <div className="flex flex-row w-full justify-between gap-2 items-center justify-center">
            <div className="relative flex flex-wrap items-start justify-start gap-2 w-fit h-fit">
              {Array.from({ length: 3 }).map((_, index: number) => {
                return (
                  <div
                    className="relative w-24 h-24 flex border border-white rounded-sm cursor-pointer bg-amo/30"
                    key={index}
                  >
                    <Image
                      layout="fill"
                      src={`${INFURA_GATEWAY}/ipfs/`}
                      className="rounded-sm"
                      draggable={false}
                    />
                  </div>
                );
              })}
            </div>
            <div className="relative h-full w-fit items-center justify-center flex flex-col gap-4">
              <div className="relative w-fit h-fit rounded-sm border border-frio text-base font-bit text-mar flex flex-col gap-2 p-2 items-center justify-center">
                {[
                  "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3",
                  "QmT1aZypVcoAWc6ffvrudV3JQtgkL8XBMjYpJEfdFwkRMZ",
                  "QmNomDrWUNrcy2SAVzsKoqd5dPMogeohB8PSuHCg57nyzF",
                  "QmXD3LnHiiLSqG2TzaNd1Pmhk2nVqDHDqn8k7RtwVspE6n",
                ].map((image: string, index: number) => {
                  return (
                    <div
                      className="relative w-full h-full flex flex-row items-center justify-center gap-4"
                      key={index}
                    >
                      <div className="relative w-4 h-4 flex cursor-pointer items-center justify-center active:scale-95">
                        <Image
                          layout="fill"
                          src={`${INFURA_GATEWAY}/ipfs/${image}`}
                          draggable={false}
                        />
                      </div>
                      <div className="relative w-fit h-fit flex items-center justify-center text-center cursor-pointer active:scale-95">
                        77
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="relative mb-0 flex flex-row items-center justify-between gap-2 w-full h-fit">
                <div className="relative w-6 h-6 items-center justify-center flex">
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/QmeA7R3J8FrhZuMmiFFrVqNmWzKkJCbP51pajFrYdEGBVX`}
                    priority
                    draggable={false}
                    layout="fill"
                  />
                </div>
                <div
                  className="relative w-6 h-6 flex items-center justify-center cursor-pointer active:scale-95"
                  onClick={() => router.push(`/item/pub/${id}`)}
                >
                  <Image
                    layout="fill"
                    src={`${INFURA_GATEWAY}/ipfs/QmZ4v5pzdnCBeyKnS9VrjZiEAbUpAVy8ECArNcpxBt6Tw4`}
                    draggable={false}
                  />
                </div>

                <div
                  className="relative w-6 h-6 rounded-full flex items-center justify-center p-1 cursor-pointer"
                  id="pfp"
                ></div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="relative w-full h-full flex flex-row gap-5 items-center justify-end">
            <div className="flex items-center justify-center w-full border border-white h-[28rem] rounded-sm cursor-pointer bg-amo/30">
              <Image
                layout="fill"
                src={`${INFURA_GATEWAY}/ipfs/`}
                className="rounded-sm"
                draggable={false}
              />
            </div>
            <div className="relative flex flex-col w-36 h-full gap-2 items-end justify-center">
              {Array.from({ length: 3 }).map((_, index: number) => {
                return (
                  <div
                    className="relative w-full h-24 flex border border-white rounded-sm cursor-pointer bg-amo/30"
                    key={index}
                  >
                    <Image
                      layout="fill"
                      src={`${INFURA_GATEWAY}/ipfs/`}
                      className="rounded-sm"
                      draggable={false}
                    />
                  </div>
                );
              })}
              <div className="relative w-full h-fit rounded-sm border border-frio text-base font-bit text-mar flex flex-col gap-2 p-2 items-center justify-center">
                {[
                  "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3",
                  "QmT1aZypVcoAWc6ffvrudV3JQtgkL8XBMjYpJEfdFwkRMZ",
                  "QmNomDrWUNrcy2SAVzsKoqd5dPMogeohB8PSuHCg57nyzF",
                  "QmXD3LnHiiLSqG2TzaNd1Pmhk2nVqDHDqn8k7RtwVspE6n",
                ].map((image: string, index: number) => {
                  return (
                    <div
                      className="relative w-full h-full flex flex-row items-center justify-center gap-4"
                      key={index}
                    >
                      <div className="relative w-4 h-4 flex cursor-pointer items-center justify-center active:scale-95">
                        <Image
                          layout="fill"
                          src={`${INFURA_GATEWAY}/ipfs/${image}`}
                          draggable={false}
                        />
                      </div>
                      <div className="relative w-fit h-fit flex items-center justify-center text-center cursor-pointer active:scale-95">
                        77
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="relative w-full h-full flex flex-row gap-5 items-center justify-center">
            <div className="relative w-full h-80 rounded-sm border border-mosgu bg-fuego p-1 font-bit text-nuba text-sm text-left break-words flex justify-center items-center"></div>
            <div className="relative w-36 h-full flex flex-col items-center justify-start gap-5">
              <div className="relative w-full h-80 flex flex-col items-center justify-start justify-between p-1">
                <div className="relative w-full h-full items-end justify-start flex flex-col gap-3">
                  <div className="relative w-full h-full items-end justify-start flex flex-col">
                    <div className="relative flex items-center justify-center text-right break-words text-white font-bit uppercase text-base">
                      username
                    </div>
                    <div className="relative flex items-center justify-center text-right break-words text-white/70 font-bit uppercase text-xs">
                      @username.lens
                    </div>
                  </div>
                  <div className="relative w-full h-full items-end justify-start flex flex-col">
                    <div className="relative flex items-center justify-center text-right break-words text-white font-bit uppercase text-sm">
                      posted
                    </div>
                    <div className="relative flex items-center justify-center text-right break-words text-white/70 font-bit uppercase text-sm">
                      4d ago
                    </div>
                  </div>
                </div>
                <div className="relative mb-0 flex flex-row items-center justify-between gap-2 w-full h-fit">
                  <div className="relative w-6 h-6 items-center justify-center flex">
                    <Image
                      src={`${INFURA_GATEWAY}/ipfs/QmeA7R3J8FrhZuMmiFFrVqNmWzKkJCbP51pajFrYdEGBVX`}
                      priority
                      draggable={false}
                      layout="fill"
                    />
                  </div>
                  <div
                    className="relative w-6 h-6 flex items-center justify-center cursor-pointer active:scale-95"
                    onClick={() => router.push(`/item/pub/${id}`)}
                  >
                    <Image
                      layout="fill"
                      src={`${INFURA_GATEWAY}/ipfs/QmZ4v5pzdnCBeyKnS9VrjZiEAbUpAVy8ECArNcpxBt6Tw4`}
                      draggable={false}
                    />
                  </div>
                  <div
                    className="relative w-6 h-6 rounded-full flex items-center justify-center p-1 cursor-pointer"
                    id="pfp"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ImagePost;

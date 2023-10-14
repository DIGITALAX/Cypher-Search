import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import { CoinOpProps } from "../../types/tiles.types";
import PopUp from "@/components/Common/modules/PopUp";
import { ItemType } from "../../../../../redux/reducers/cartItemsSlice";

const CoinOp: FunctionComponent<CoinOpProps> = ({
  layoutAmount,
  popUpOpen,
  index,
  setPopUpOpen,
  dispatch,
  router,
  publication,
  cartItems,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex items-end justify-center flex flex-col rounded-sm border border-sol p-4 gap-4">
      <div className="relative w-full h-fit rounded-sm border border-frio text-base font-bit text-mar flex flex-row gap-2 p-2 items-center justify-center bg-fuego">
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
      <div className="relative flex w-full h-100 items-center justify-center border border-white bg-amo/30">
        <Image
          layout="fill"
          src={`${INFURA_GATEWAY}/ipfs/`}
          draggable={false}
        />
      </div>

      <div className="relative flex flex-row justify-between items-center w-full h-fit gap-1.5">
        <div className="relative flex flex-col items-start justify-center w-fit h-fit mr-auto gap-2">
          <div
            className={`relative items-start justify-center uppercase break-words font-bit text-nuba w-fit h-fit ${
              layoutAmount === 4 ? "text-lg" : "text-2xl"
            }`}
          >
            Coin Op Preroll
          </div>
          <div
            className={`relative w-fit h-fit flex text-pez font-bit uppercase ${
              layoutAmount === 4 ? "text-xs" : "text-sm"
            }`}
          >
            @hiro.lens
          </div>
          <div className="relative flex flex-row justify-start items-center w-fit h-fit gap-2">
            <div
              className="relative w-10 h-10 flex items-center justify-center cursor-pointer active:scale-95"
              onClick={() => {
                const openPopUps = [...popUpOpen];
                openPopUps[index] = !openPopUps[index];
                setPopUpOpen(openPopUps);
              }}
            >
              <Image
                layout="fill"
                src={`${INFURA_GATEWAY}/ipfs/QmZ4v5pzdnCBeyKnS9VrjZiEAbUpAVy8ECArNcpxBt6Tw4`}
                draggable={false}
              />
            </div>
            {popUpOpen?.[index] && (
              <PopUp
                id={publication?.id}
                index={index}
                dispatch={dispatch}
                router={router}
                level={undefined}
                bottom={"50px"}
                left={"-10px"}
                type={ItemType.CoinOp}
                cartItems={cartItems}
              />
            )}
            <div
              className={`relative items-center justify-center uppercase break-words font-bit text-nuba w-fit h-fit ${
                layoutAmount === 4 ? "text-xl" : "text-4xl"
              }`}
            >
              $120
            </div>
          </div>
        </div>
        <div className="relative ml-auto flex items-center justify-center w-20 h-20 rounded-sm border border-white bg-amo/30">
          <Image
            layout="fill"
            src={`${INFURA_GATEWAY}/ipfs/`}
            className="rounded-sm"
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
};

export default CoinOp;

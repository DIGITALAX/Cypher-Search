import { FunctionComponent } from "react";
import { SwitchCreateProps } from "../../types/autograph.types";
import Dispatch from "./Dispatch";
import Image from "next/legacy/image";
import {
  INFURA_GATEWAY,
  numberToItemTypeMap,
} from "../../../../../lib/constants";
import { Creation } from "@/components/Tiles/types/tiles.types";

const SwitchCreate: FunctionComponent<SwitchCreateProps> = ({
  type,
  collectionDetails,
  setCollectionDetails,
  router,
  gallery,
  mediaType,
  handleMedia,
  lensConnected,
  collectionSettings,
  setCollectionSettings,
}): JSX.Element => {
  switch (type) {
    case "collection":
      return (
        <Dispatch
          collectionDetails={collectionDetails}
          setCollectionDetails={setCollectionDetails}
          type={mediaType}
          handleMedia={handleMedia}
          lensConnected={lensConnected}
          collectionSettings={collectionSettings}
          setCollectionSettings={setCollectionSettings}
        />
      );

    case "drop":
      return <div></div>;

    default:
      return [...(gallery?.collected || []), ...(gallery?.created || [])]
        ?.length > 0 ? (
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
                    onClick={() =>
                      router.push(
                        `/item/${numberToItemTypeMap[Number(item?.origin)]}/${
                          "0x" + Number(item?.pubId)?.toString(16)
                        }-${"0x" + Number(item?.profileId)?.toString(16)}`
                      )
                    }
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
        <div></div>
      );
  }
};

export default SwitchCreate;

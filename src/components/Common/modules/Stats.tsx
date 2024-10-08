import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { StatsProps } from "../types/common.types";
import { setReactBox } from "../../../../redux/reducers/reactBoxSlice";
import handleImageError from "../../../../lib/helpers/handleImageError";

const Stats: FunctionComponent<StatsProps> = ({
  profile,
  dispatch,
  layoutAmount,
  microbrand,
  t
}): JSX.Element => {
  return (
    <div
      className={`relative flex h-fit items-between justify-between gap-4 text-pez text-xxs font-bit ${
        layoutAmount === 4
          ? "flex-wrap w-full"
          : "flex-wrap w-full xl:flex-nowrap xl:w-fit"
      }`}
    >
      <div
        className={`relative flex gap-2 items-between justify-between ${
        (microbrand || layoutAmount === 4) ? "flex-row" : "flex-row xl:flex-col"
        }`}
      >
        {[
          ["QmfLepA6hufGLdzWXXCjJZJTyTFjQKhTAXcCB3mNsRq4Nw", t("folo")],
          ["QmZo867R8s4UE5ofN7fSCzPuPrcwpy5cEKUWHbZiUXqJL2", t("foll")],
        ].map((image: string[], indexTwo: number) => {
          return (
            <div
              key={indexTwo}
              className="relative w-fit h-fit flex items-center justify-center flex-row gap-1"
              title={image[1]}
            >
              <div
                className="relative w-5 h-8 flex items-center justify-center cursor-pointer active:scale-95"
                onClick={() =>
                  (indexTwo === 0
                    ? profile?.stats?.followers > 0
                    : profile?.stats?.following > 0) &&
                  dispatch(
                    setReactBox({
                      actionOpen: true,
                      actionId: profile?.id,
                      actionType: image[1],
                    })
                  )
                }
              >
                <Image
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/${image[0]}`}
                  draggable={false}
                  onError={(e) => handleImageError(e)}
                />
              </div>
              <div className="relative w-fit h-fit flex items-center justify-center">
                {indexTwo === 0
                  ? profile?.stats?.followers || 0
                  : profile?.stats?.following || 0}
              </div>
            </div>
          );
        })}
      </div>
      <div className="relative flex flex-wrap gap-4 items-between justify-center">
        {[
          ["QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3", t("mirT")],
          ["QmeE3M7kBpSzBC4j63Da846Sk8ukQrV4qf4FkqF1nBdiDE", t("pubT")],
          ["QmNomDrWUNrcy2SAVzsKoqd5dPMogeohB8PSuHCg57nyzF", t("colT")],
          ["QmXD3LnHiiLSqG2TzaNd1Pmhk2nVqDHDqn8k7RtwVspE6n", t("comT")],
        ].map((image: string[], indexTwo: number) => {
          const stats = [
            profile?.stats?.mirrors || 0,
            profile?.stats?.posts || 0,
            profile?.stats?.countOpenActions || 0,
            profile?.stats?.comments || 0,
          ];
          return (
            <div
              key={indexTwo}
              className="relative w-fit h-fit flex items-center justify-center flex-col gap-1"
              title={image[1]}
            >
              <div className="relative w-4 h-4 flex items-center justify-center">
                <Image
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/${image[0]}`}
                  draggable={false}
                  onError={(e) => handleImageError(e)}
                />
              </div>
              <div className="relative w-fit h-fit flex items-center justify-center">
                {stats?.[indexTwo]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stats;

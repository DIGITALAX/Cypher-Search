import { INFURA_GATEWAY } from "@/app/lib/constants";
import handleImageError from "@/app/lib/helpers/handleImageError";
import { ModalContext } from "@/app/providers";
import Image from "next/legacy/image";
import { FunctionComponent, JSX, useContext } from "react";
import { StatsProps } from "../types/tiles.types";
import useProfile from "../hooks/useProfile";

const Stats: FunctionComponent<StatsProps> = ({
  profile,
  dict,
  microbrand,
}): JSX.Element => {
  const context = useContext(ModalContext);
  const { stats } = useProfile(profile);
  return (
    <div
      className={`relative flex h-fit items-between justify-between gap-4 text-pez text-xxs font-bit ${
        context?.layoutSwitch === 4
          ? "flex-wrap w-full"
          : "flex-wrap w-full xl:flex-nowrap xl:w-fit"
      }`}
    >
      <div
        className={`relative flex gap-2 items-between justify-between ${
          microbrand || context?.layoutSwitch === 4
            ? "flex-row"
            : "flex-row xl:flex-col"
        }`}
      >
        {[
          ["QmfLepA6hufGLdzWXXCjJZJTyTFjQKhTAXcCB3mNsRq4Nw", dict?.folo],
          ["QmZo867R8s4UE5ofN7fSCzPuPrcwpy5cEKUWHbZiUXqJL2", dict?.foll],
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
                    ? Number(stats?.graphFollowStats?.followers) > 0
                    : Number(stats?.graphFollowStats?.following) > 0) &&
                  context?.setReactBox({
                    id: profile?.address,
                    type: image[1],
                  })
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
                  ? Number(stats?.graphFollowStats?.followers) || 0
                  : Number(stats?.graphFollowStats?.following) || 0}
              </div>
            </div>
          );
        })}
      </div>
      <div className="relative flex flex-wrap gap-4 items-between justify-center">
        {[
          {
            image: "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3",
            title: dict?.mirT,
            stat:
              Number(stats?.feedStats?.reposts) +
              Number(stats?.feedStats?.quotes),
          },
          {
            image: "QmeE3M7kBpSzBC4j63Da846Sk8ukQrV4qf4FkqF1nBdiDE",
            title: dict?.pubT,
            stat: Number(stats?.feedStats?.posts),
          },
          {
            image: "QmNomDrWUNrcy2SAVzsKoqd5dPMogeohB8PSuHCg57nyzF",
            title: dict?.colT,
            stat: Number(stats?.feedStats?.collects),
          },
          {
            image: "QmXD3LnHiiLSqG2TzaNd1Pmhk2nVqDHDqn8k7RtwVspE6n",
            title: dict?.comT,
            stat: Number(stats?.feedStats?.comments),
          },
        ].map((element, indexTwo: number) => {
          return (
            <div
              key={indexTwo}
              className="relative w-fit h-fit flex items-center justify-center flex-col gap-1"
              title={element?.title}
            >
              <div className="relative w-4 h-4 flex items-center justify-center">
                <Image
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/${element?.image}`}
                  draggable={false}
                  onError={(e) => handleImageError(e)}
                />
              </div>
              <div className="relative w-fit h-fit flex items-center justify-center">
                {element?.stat || 0}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stats;

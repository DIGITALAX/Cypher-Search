import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";

const Stats: FunctionComponent = (): JSX.Element => {
  return (
    <div className="relative flex flex-row w-fit h-fit items-between justify-between gap-4 text-pez text-xxs font-bit">
      <div className="relative flex flex-col gap-2 items-between justify-between">
        {[
          ["QmfLepA6hufGLdzWXXCjJZJTyTFjQKhTAXcCB3mNsRq4Nw", "Followers"],
          ["QmZo867R8s4UE5ofN7fSCzPuPrcwpy5cEKUWHbZiUXqJL2", "Following"],
        ].map((image: string[], indexTwo: number) => {
          return (
            <div
              key={indexTwo}
              className="relative w-fit h-fit flex items-center justify-center flex-row gap-1"
              title={image[1]}
            >
              <div className="relative w-5 h-8 flex items-center justify-center cursor-pointer active:scale-95">
                <Image
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/${image[0]}`}
                  draggable={false}
                />
              </div>
              <div className="relative w-fit h-fit flex items-center justify-center">
                100
              </div>
            </div>
          );
        })}
      </div>
      <div className="relative flex flex-wrap gap-4 items-between justify-center">
        {[
          ["QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3", "Total Mirrors"],
          ["QmeE3M7kBpSzBC4j63Da846Sk8ukQrV4qf4FkqF1nBdiDE", "Total Pubs"],
          ["QmNomDrWUNrcy2SAVzsKoqd5dPMogeohB8PSuHCg57nyzF", "Total Collects"],
          ["QmXD3LnHiiLSqG2TzaNd1Pmhk2nVqDHDqn8k7RtwVspE6n", "Total Comments"],
        ].map((image: string[], indexTwo: number) => {
          return (
            <div
              key={indexTwo}
              className="relative w-fit h-fit flex items-start justify-center flex-col gap-1"
              title={image[1]}
            >
              <div className="relative w-4 h-4 flex items-center justify-center cursor-pointer active:scale-95">
                <Image
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/${image[0]}`}
                  draggable={false}
                />
              </div>
              <div>100</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stats;

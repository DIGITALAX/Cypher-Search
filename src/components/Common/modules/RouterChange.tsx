import Image from "next/legacy/image";
import { FunctionComponent, useEffect, useState } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";

const RouterChange: FunctionComponent = (): JSX.Element => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress < 100 ? prevProgress + 10 : 0
      );
    }, 400);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="relative w-screen h-screen flex justify-center items-center bg-offBlack">
      <div className="relative flex justify-center items-center flex-col gap-4">
        <div className="relative w-20 h-20 flex justify-center items-center">
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmYbjMNQAVuQSWNNQ5AKbQtt4Dxw2ax4SvLNwKhCNDniL2`}
            className="relative w-fit h-fit relative"
            layout="fill"
            draggable={false}
          />
        </div>
        <div className="w-20 h-2 rounded-sm border border-white flex items-center justify-center">
          <div
            className="h-full bg-fertil relative flex"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default RouterChange;

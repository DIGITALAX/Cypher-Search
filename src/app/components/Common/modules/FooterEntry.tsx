"use client";

import Image from "next/legacy/image";
import { FunctionComponent, JSX } from "react";
import { BsTwitter } from "react-icons/bs";
import { BiArrowToTop } from "react-icons/bi";
import { INFURA_GATEWAY_INTERNAL } from "@/app/lib/constants";

const FooterEntry: FunctionComponent<{ dict: any }> = ({
  dict,
}): JSX.Element => {
  const handleRewind = (): void => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={`relative bottom-0 w-full h-fit flex w-full`}>
      <div className="relative grid auto-rows-auto grid-flow-row w-full h-full pt-12">
        <div className="relative row-start-4 w-full h-full text-midWhite">
          <div className="relative grid auto-cols-auto grid-flow-col h-full w-full">
            <div className="col-start-1 h-full w-full relative pt-6">
              <div className="relative w-fit h-fit grid grid-flow-row auto-rows-auto">
                <div className="relative w-fit h-fit col-start-1 row-start-1 sm:row-start-1 pl-6 pb-1 hover:text-skyBlue cursor-pointer hover:rotate-3">
                  {dict?.end}
                </div>
                <div className={`relative w-36 h-4 row-start-2`}>
                  <Image
                    src={`${INFURA_GATEWAY_INTERNAL}QmXbwk3dg9GKWhjVTQGsrt6dKARFCyqNz71ssUo2SGx1zc`}
                    draggable={false}
                    width={160}
                    height={20}
                    priority
                  />
                </div>
              </div>
            </div>
            <div className="col-start-1 row-start-1 sm:col-start-2 h-full w-fit relative sm:pl-0 sm:pb-0 sm:pr-0 pr-6 pb-6 pl-6 place-self-center pt-6 cursor-pointer active:scale-95">
              <div
                className="grid grid-flow-col auto-cols-auto relative w-fit h-fit"
                onClick={() => handleRewind()}
              >
                <div className="col-start-1 w-full h-fit pr-3 place-self-center">
                  <BiArrowToTop color="#F7F8E8" size={20} />
                </div>
                <div className="col-start-2 w-full h-fit place-self-center">
                  {dict?.rebo}
                </div>
              </div>
            </div>
            <div className="col-start-1 row-start-2 sm:row-start-1 sm:col-start-3 h-full w-fit relative place-self-center sm:pb-0 pb-8 pl-6 sm:pl-0 sm:place-self-end pr-4 pt-6">
              <div className="row-start-2 grid grid-flow-col auto-cols-auto relative h-fit w-fit gap-3">
                <div className="relative w-fit h-fit col-start-1 place-self-end">
                  <a
                    href={"https://blog.digitalax.xyz/"}
                    target="_blank"
                    rel="noreferrer"
                    className={`cursor-pointer h-fit relative pr-1`}
                  >
                    <Image
                      src={`${INFURA_GATEWAY_INTERNAL}QmWVdyGgXbPL5SiRnQwALHvWzAnyiXBos1oB4TVTqg7saV`}
                      width={21}
                      height={26}
                      priority
                      draggable={false}
                    />
                  </a>
                </div>
                <div className="relative w-fit h-fit col-start-2 place-self-end">
                  <a
                    href={"https://github.com/digitalax"}
                    target="_blank"
                    rel="noreferrer"
                    className={`cursor-pointer h-fit relative pr-1`}
                  >
                    <Image
                      src={`${INFURA_GATEWAY_INTERNAL}QmP5349vcKLNXUhtLyZWQXB8vEbFwRcKLzzB93vxkLsvpw`}
                      width={29}
                      height={28}
                      priority
                      draggable={false}
                    />
                  </a>
                </div>
                <div className="relative w-fit h-fit col-start-3">
                  <a
                    href={"https://cypher.digitalax.xyz/autograph/digitalax"}
                    target="_blank"
                    rel="noreferrer"
                    className={`cursor-pointer h-fit relative`}
                  >
                    <Image
                      src={`${INFURA_GATEWAY_INTERNAL}QmeA7R3J8FrhZuMmiFFrVqNmWzKkJCbP51pajFrYdEGBVX`}
                      width={30}
                      height={30}
                      priority
                      draggable={false}
                    />
                  </a>
                </div>
                <div className="relative w-fit h-fit col-start-4">
                  <a
                    href={"https://twitter.com/digitalax_"}
                    target="_blank"
                    rel="noreferrer"
                    className="cursor-pointer h-fit relative"
                  >
                    <BsTwitter size={30} color={"#FFDCFF"} />
                  </a>
                </div>
                <div className="relative w-fit h-fit col-start-5 place-self-center">
                  <a
                    href={"https://youtube.com/@digitalax"}
                    target="_blank"
                    rel="noreferrer"
                    className="cursor-pointer h-fit relative"
                  >
                    <Image
                      src={`${INFURA_GATEWAY_INTERNAL}Qmchp1UWTavZBxq9mTbjASESgRRmsFNXzmxzaMzRSf9aax`}
                      width={30}
                      height={20}
                      draggable={false}
                      priority
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterEntry;

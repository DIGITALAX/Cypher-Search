"use client";

import Image from "next/legacy/image";
import { FunctionComponent, JSX } from "react";
import NotFoundEntry from "../../Common/modules/NotFoundEntry";
import useAutograph from "../hooks/useAutograph";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import Web from "./Web";
import RouterChange from "../../Common/modules/RouterChange";
import Bio from "./Bio";
import Feed from "./Feed";
import Gallery from "./Gallery";

const AutographEntry: FunctionComponent<{
  dict: any;
  autograph: string | undefined;
}> = ({ autograph, dict }): JSX.Element => {
  const { profile, profileLoading } = useAutograph(autograph);

  return (
    <>
      {!profile ? (
        <RouterChange />
      ) : !profile && !profileLoading ? (
        <NotFoundEntry dict={dict} />
      ) : (
        <div
          className="relative flex flex-col w-full h-full flex-grow"
          id="results"
        >
          <Web dict={dict} profile={profile} />
          <Bio dict={dict} profile={profile} />
          <div className="relative flex flex-row gap-12 otro:gap-3 items-start justify-between sm:px-4 w-full h-full otro:flex-nowrap flex-wrap">
            <Feed dict={dict} profile={profile} />
            <Gallery dict={dict} profile={profile} />
            <div
              className="absolute w-[60vw] h-[30rem] lg:h-[50rem] bottom-0 items-end justify-center opacity-20 hidden sm:flex mb-auto mr-auto right-0"
              draggable={false}
            >
              <Image
                layout="fill"
                src={`${INFURA_GATEWAY}/ipfs/QmV4yM96Dt2ypLN9GMHkXPTkeCGfTQfJErJLfVjikxt52s`}
                draggable={false}
                objectFit="contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AutographEntry;

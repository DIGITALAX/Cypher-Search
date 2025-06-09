"use client";

import { useContext } from "react";
import { ModalContext } from "@/app/providers";
import Header from "./Header";
import Tiles from "../../Tiles/modules/Tiles";

export default function Entry({ dict }: { dict: any }) {
  const context = useContext(ModalContext);
  return (
    <div
      className={`relative w-full flex flex-col items-center justify-center sm:h-screen`}
      style={{
        height: context?.searchActive ? "100%" : "calc(105vh - 10rem)",
      }}
    >
      <div
        className={`relative w-full h-fit flex items-center justify-center gap-10 flex-col h-full z-0`}
        id="results"
      >
        <Header dict={dict} includeSearch />
        {context?.searchActive && <Tiles dict={dict} />}
      </div>
    </div>
  );
}

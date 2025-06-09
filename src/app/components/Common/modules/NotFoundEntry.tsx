"use client";

import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import Link from "next/link";
import useSearch from "../hooks/useSearch";
import { useRouter } from "next/navigation";
import Accounts from "./Accounts";

export default function NotFoundEntry({ dict }: { dict: any }) {
  const router = useRouter();
  const { handleShuffleSearch } = useSearch();
  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center gap-5 pre:pt-0 pt-20">
      <div className="relative w-1/2 text-center h-fit flex items-center justify-center font-bit text-white text-sm">
        {dict?.found}
      </div>
      <Link
        className={`absolute top-2 left-2 w-10 h-10 flex cursor-pointer active:scale-95 items-center justify-center`}
        href={"/"}
      >
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmYbjMNQAVuQSWNNQ5AKbQtt4Dxw2ax4SvLNwKhCNDniL2`}
          layout="fill"
          draggable={false}
        />
      </Link>
      <div
        className="relative w-11/12 h-60 sm:w-4/5 md:w-2/3 sm:h-2/3 flex items-center justify-center cursor-pointer hover:opacity-70"
        onClick={() => {
          handleShuffleSearch();
          router.push("/");
        }}
      >
        <Image
          layout="fill"
          objectFit="contain"
          src={`${INFURA_GATEWAY}/ipfs/Qma4968Gu8irNB74GJqg9xMqs8g4aDYqsx5pTUgJAUBD28`}
          draggable={false}
          priority
        />
      </div>
      <div className="absolute right-2 top-2 flex">
        <Accounts dict={dict} />
      </div>
    </div>
  );
}

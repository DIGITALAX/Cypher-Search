import Image from "next/legacy/image";
import { FunctionComponent, JSX, useContext } from "react";
import Link from "next/link";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import handleImageError from "@/app/lib/helpers/handleImageError";
import { ScreenDisplay, SortType, WebProps } from "../types/autograph.types";
import { ModalContext } from "@/app/providers";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useModal } from "connectkit";
import useLens from "../../Common/hooks/useLens";
import useSearch from "../../Common/hooks/useSearch";
import ScreenSwitch from "./ScreenSwitch";

const Web: FunctionComponent<WebProps> = ({ dict, profile }): JSX.Element => {
  const context = useContext(ModalContext);
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { openOnboarding } = useModal();
  const { handleConectarse, salir } = useLens(isConnected, address, dict);
  const { handleShuffleSearch } = useSearch();
  return (
    <div className="relative w-full min-h-[90rem] sm:min-h-[60rem] xl:min-h-[50rem] bg-web bg-cover flex flex-col xl:flex-row p-4 tablet:p-10 items-start xl:justify-between gap-12 sm:gap-10 xl:gap-20 h-fit">
      <div className="relative w-full h-fit flex flex-col items-start justify-start gap-5 xl:order-1 order-2">
        <div className="relative flex flex-col items-start justify-between w-full h-fit gap-1">
          <Link
            href={"/"}
            className="flex relative sm:absolute items-center justify-start w-10 h-10 sm:w-16 sm:h-16 cursor-pointer active:scale-95 z-1"
          >
            <Image
              layout="fill"
              src={`${INFURA_GATEWAY}/ipfs/QmfHsZ5w3oy2ENHek7prhM1XVVW8oPBGfEPcNy1jm7sWQq`}
              draggable={false}
            />
          </Link>
          {
            <div className="relative w-full h-16 gap-6 flex flex-row items-center justify-end">
              {context?.screenDisplay === ScreenDisplay.Display &&
                [
                  {
                    image: "QmVnr2XT1hbkSNBWQNGC4GcTeWJx4cWRFxQjhe26JReQC1",
                    text: dict?.priv?.toLowerCase(),
                    function: () => context?.setSortType(SortType.Private),
                    type: SortType.Private,
                  },
                  {
                    image: "QmTwkfEqUXHAfY47BeMfQm7wGEtVwLxaRQzy5BrsgKyX8r",
                    text: dict?.com?.toLowerCase(),
                    function: () => context?.setSortType(SortType.Community),
                    type: SortType.Community,
                  },
                  {
                    image: "QmNno9d9M82f21Z1633FBLtvA8ZNH8BSmy7BwSwHnuBEy8",
                    text: dict?.pub?.toLowerCase(),
                    function: () => context?.setSortType(SortType.Public),
                    type: SortType.Public,
                  },
                ].map(
                  (
                    item: {
                      image: string;
                      text: string;
                      function: () => void;
                      type: SortType;
                    },
                    index: number
                  ) => {
                    return (
                      <div
                        className="relative flex flex-col items-center justiy-center gap-1.5"
                        key={index}
                      >
                        <div
                          className={`relative w-8 h-8 sm:w-10 sm:h-10 cursor-pointer flex active:scale-95 ${
                            item.type === context?.sortType &&
                            "mix-blend-luminosity"
                          }`}
                          onClick={() => item.function()}
                        >
                          <Image
                            layout="fill"
                            src={`${INFURA_GATEWAY}/ipfs/${item.image}`}
                            draggable={false}
                            onError={(e) => handleImageError(e)}
                          />
                        </div>
                        <div className="relative text-white font-bit text-white font-bit text-xxs sm:text-xs">
                          {item.text}
                        </div>
                      </div>
                    );
                  }
                )}
            </div>
          }
        </div>
        <ScreenSwitch dict={dict} profile={profile} />
      </div>
      {context?.lensConectado?.profile?.address === profile?.address ? (
        <div className="relative w-full xl:w-fit h-fit items-center justify-between xl:justify-center flex flex-row xl:flex-col gap-6 tablet:gap-4 xl:order-2 order-1 flex-wrap xl:flex-nowrap">
          {[
            {
              image: "QmRozkh6CWW9u3ATqcMKr4w4LUEd4h1vNN4Gon3zsrtCA4",
              text: dict?.dis,
              function: () => context?.setScreenDisplay(ScreenDisplay.Display),
              width: "2.5rem",
              height: "2.25rem",
              type: ScreenDisplay.Display,
              sWidth: "1.75rem",
              sHeight: "1.5rem",
            },
            {
              image: "QmaGQyeUd1Upcei8b9UxiTC7TuDaQPP4Ps5mZpVB1w6Gto",
              text: dict?.gal?.toLowerCase(),
              function: () => context?.setScreenDisplay(ScreenDisplay.Gallery),
              width: "2.5rem",
              height: "2rem",
              type: ScreenDisplay.Gallery,
              sWidth: "1.75rem",
              sHeight: "1.4rem",
            },
            {
              image: "QmTTtDqqjwxYbz3rvfGuyB3fz8YQj27qEVdJLHRYkFg4D9",
              text: dict?.cirs,
              function: () => context?.setScreenDisplay(ScreenDisplay.Circuits),
              width: "2.5rem",
              height: "2.5rem",
              type: ScreenDisplay.Circuits,
              sWidth: "1.75rem",
              sHeight: "1.75rem",
            },
            {
              image: "QmaRcPqtKii9T6FZzFekRvaPHMMLzZzQi37KxkMxLW72so",
              text: dict?.books,
              function: () =>
                context?.setScreenDisplay(ScreenDisplay.Bookmarks),
              width: "2rem",
              height: "2.5rem",
              type: ScreenDisplay.Bookmarks,
              sWidth: "1.5rem",
              sHeight: "1.75rem",
            },
            {
              image: "QmeBzqFPc3nvegBtwpNjViVNtiEkWsPSWjJaTem9bysdBU",
              text: dict?.posT,
              function: () => context?.setScreenDisplay(ScreenDisplay.Post),
              width: "2.5rem",
              height: "2.5rem",
              type: ScreenDisplay.Post,
              sWidth: "1.75rem",
              sHeight: "1.75rem",
            },
            {
              image: "Qmd7w4HyNrtWvSy48jGnidSx77mSqgAALTsVrbcVcSMeoG",
              text: dict?.ords,
              function: () => context?.setScreenDisplay(ScreenDisplay.Orders),
              width: "2.5rem",
              height: "2.5rem",
              type: ScreenDisplay.Orders,
              sWidth: "1.75rem",
              sHeight: "1.75rem",
            },
            {
              image: "QmQ8U7cmvoUizxS7tFeWGcUs7f54svfBdxE6aXfTgPbshw",
              text: dict?.sal,
              function: () => context?.setScreenDisplay(ScreenDisplay.Sales),
              width: "2.5rem",
              height: "2.5rem",
              type: ScreenDisplay.Sales,
              sWidth: "1.75rem",
              sHeight: "1.75rem",
            },
            {
              image: "QmevFbk17FCsk2hxS6UChLyMd2rJX1UsgbBThQZ32AKY4V",
              text: dict?.set,
              function: () => context?.setScreenDisplay(ScreenDisplay.Settings),
              width: "2.5rem",
              height: "2.5rem",
              type: ScreenDisplay.Settings,
              sWidth: "1.75rem",
              sHeight: "1.75rem",
            },
            {
              image: "QmdvSykeWq4MphAA8CerK3VqEXMjJBNeVje3Ae2BkKgZxb",
              text: dict?.log?.toLowerCase(),
              function: () => salir(),
              width: "2.2rem",
              height: "2.2rem",
              type: undefined,
               sWidth: "1.5rem",
              sHeight: "1.5rem",
            },
          ].map(
            (
              item: {
                image: string;
                text: string;
                function: () => void;
                width: string;
                height: string;
                type: ScreenDisplay | undefined;
                sWidth: string;
                sHeight: string;
              },
              index: number
            ) => {
              return (
                <div
                  className={
                    "relative flex items-center justify-center w-fit h-fit text-center flex-col gap-1.5"
                  }
                  key={index}
                >
                  <div className="relative w-fit h-fit flex items-center justify-center">
                    <div
                      style={{
                        height:
                          typeof window !== "undefined" &&
                          window?.innerWidth < 648
                            ? item.sHeight
                            : item.height,
                        width:
                          typeof window !== "undefined" &&
                          window?.innerWidth < 648
                            ? item.sWidth
                            : item.width,
                      }}
                      className={`relative flex items-center justify-center cursor-pointer active:scale-95 ${
                        item.type === context?.screenDisplay &&
                        "mix-blend-luminosity"
                      }`}
                      onClick={() => item.function()}
                    >
                      <Image
                        layout="fill"
                        draggable={false}
                        src={`${INFURA_GATEWAY}/ipfs/${item.image}`}
                        onError={(e) => handleImageError(e)}
                      />
                    </div>
                  </div>
                  <div className="relative text-white font-bit text-white font-bit text-xs">
                    {item.text}
                  </div>
                </div>
              );
            }
          )}
        </div>
      ) : (
        <div className="relative w-full xl:w-fit h-fit items-center justify-start flex flex-row xl:flex-col gap-6 tablet:gap-4 xl:order-2 order-1 flex-wrap xl:flex-nowrap">
          {[
            {
              image: !isConnected
                ? "QmZKHPMFLzxngWNbik7TS9jSiHasYSbRPeJs9xXBUvHSwm"
                : "QmdvSykeWq4MphAA8CerK3VqEXMjJBNeVje3Ae2BkKgZxb",
              text: !isConnected
                ? dict?.con2
                : isConnected && !context?.lensConectado?.sessionClient
                ? dict?.len
                : dict?.log?.toLowerCase(),
              function: !isConnected
                ? () => openOnboarding()
                : isConnected && !context?.lensConectado?.sessionClient
                ? () => handleConectarse()
                : () => salir(),
              width: "7",
              height: "7",
            },
            {
              image: "QmP7ESx5WEVSxyvKvsWBCWYhpWJytVt2Eozr6wqMnyb3M5",
              text: dict?.hom,
              function: context?.lensConectado?.profile?.username?.localName
                ? () => {
                    context?.setFiltersOpen({ value: false, allow: false });
                    router.push(
                      `/autograph/${context?.lensConectado?.profile?.username?.localName}`
                    );
                  }
                : !isConnected
                ? () => openOnboarding()
                : () => handleConectarse(),
              width: "8",
              height: "7",
            },
            {
              image: "QmYbjMNQAVuQSWNNQ5AKbQtt4Dxw2ax4SvLNwKhCNDniL2",
              text: dict?.disc,
              function: () => {
                handleShuffleSearch();
                router.push("/");
              },
              width: "8",
              height: "7",
            },
          ].map(
            (
              item: {
                image: string;
                text: string;
                function: () => void;
                width: string;
                height: string;
              },
              index: number
            ) => {
              return (
                <div
                  className={
                    "relative flex items-center justify-center w-fit h-fit text-center flex-col gap-1.5"
                  }
                  key={index}
                >
                  <div className="relative w-fit h-fit flex items-center justify-center">
                    <div
                      className={`relative w-${item.width} h-${item.height} flex items-center justify-center cursor-pointer active:scale-95`}
                      onClick={() => item.function()}
                    >
                      <Image
                        layout="fill"
                        draggable={false}
                        src={`${INFURA_GATEWAY}/ipfs/${item.image}`}
                        onError={(e) => handleImageError(e)}
                      />
                    </div>
                  </div>
                  <div className="relative text-white font-bit text-white font-bit text-xs">
                    {item.text}
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
};

export default Web;

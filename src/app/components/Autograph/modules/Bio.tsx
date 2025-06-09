import { FunctionComponent, JSX, useContext } from "react";
import Image from "next/legacy/image";
import Link from "next/link";
import numeral from "numeral";
import handleImageError from "@/app/lib/helpers/handleImageError";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import { usePathname, useRouter } from "next/navigation";
import { Quest } from "../../Common/types/common.types";
import { BioProps } from "../types/autograph.types";
import useQuests from "../hooks/useQuests";
import { getLocaleFromPath } from "@/app/lib/helpers/getLocalPath";

const Bio: FunctionComponent<BioProps> = ({ profile, dict }): JSX.Element => {
  const context = useContext(ModalContext);
  const { questsLoading, questSample } = useQuests(profile);
  const router = useRouter();
  const path = usePathname();
  return (
    <div className="relative w-full h-fit flex flex-wrap otro:flex-nowrap flex-row items-start justify-start gap-5 px-2 sm:px-5 sm:-top-3 tablet:-top-7 sm:pt-0 pt-4">
      <div className="relative w-full h-fit flex flex-col gap-2">
        <div className="w-full h-fit items-start flex gap-3 flex-col sm:flex-row relative">
          <div className="relative flex items-start justify-between gap-1 w-fit h-fit max-w-[18rem] border border-saph bg-black p-2 flex-col">
            <div className="font-bit text-ballena blur-sm w-fit h-fit absolute top-1 flex tablet:text-base text-xs">
              {dict?.cap}
            </div>
            <div className="font-bit text-olor w-fit h-fit relative flex tablet:text-base text-xs">
              {dict?.cap}
            </div>
            <div className="font-aust text-white text-xxs tablet:text-xs w-fit h-fit relative flex break-words whitespace-preline">
              {dict?.osc}
            </div>
          </div>
          <div className="relative flex items-start justify-between gap-2 w-full h-fit p-2 top-auto sm:top-7 flex-col">
            {profile?.metadata?.bio && (
              <div className="font-aust text-white text-xs tablet:text-xs w-fit h-fit relative flex break-words">
                {profile?.metadata?.bio}
              </div>
            )}
            <div className="relative w-full h-fit flex flex-row gap-10 justify-start items-center flex-wrap">
              {[
                {
                  image: "Qmb6fQG6L2R7Npf1oS55YEB5RS9z7oCyTwxYnTf57DEEjV",
                  title: {
                    en: "Followers",
                    es: "Seguidores",
                  },
                  stats: profile?.followers || 0,
                },
                {
                  image: "QmP141cw2U9TNsU6AXRoo5X5VCPawUTPkWAUJburJayg7x",
                  title: {
                    en: "Following",
                    es: "Siguiendo",
                  },
                  stats: profile?.following || 0,
                },
              ].map((image, indexTwo: number) => {
                return (
                  <div
                    className="font-aust text-white text-xs w-fit h-fit relative items-start justify-center flex flex-col gap-2 break-words"
                    key={indexTwo}
                    title={image.title?.[getLocaleFromPath(path)]}
                  >
                    <div className="relative w-4 h-4 items-center justify-center flex">
                      <Image
                        layout="fill"
                        src={`${INFURA_GATEWAY}/ipfs/${image.image}`}
                        draggable={false}
                        onError={(e) => handleImageError(e)}
                      />
                    </div>
                    <div
                      className={`relative w-fit h-fit flex ${
                        image?.stats > 0 && "cursor-pointer"
                      }`}
                      onClick={() =>
                        image?.stats > 0 &&
                        context?.setReactBox({
                          id: profile?.address,
                          type: image.title?.en,
                        })
                      }
                    >
                      {numeral(image?.stats).format("0a")}
                    </div>
                  </div>
                );
              })}
              {profile?.metadata?.attributes?.find(
                (item) => item?.key === "location"
              )?.value && (
                <div className="font-aust text-white text-xs w-fit h-fit relative items-start justify-center flex flex-col gap-2  break-words">
                  <div className="relative w-4 h-4 items-center justify-center flex">
                    <Image
                      layout="fill"
                      draggable={false}
                      src={`${INFURA_GATEWAY}/ipfs/QmchHAtagS96zqoEL9BxrfHLNN1s7jUXJHiMLgzrcfMVpK`}
                    />
                  </div>
                  <div className="relative w-fit h-fit flex">
                    {
                      profile?.metadata?.attributes?.find(
                        (item) => item?.key === "location"
                      )?.value
                    }
                  </div>
                </div>
              )}
              {profile?.metadata?.attributes?.find(
                (item) => item?.key === "website"
              )?.value && (
                <div className="font-aust text-white text-xs w-fit max-w-full h-fit relative items-start justify-center flex flex-col gap-2  break-words">
                  <div className="relative w-4 h-4 items-center justify-center flex">
                    <Image
                      draggable={false}
                      layout="fill"
                      src={`${INFURA_GATEWAY}/ipfs/QmPVS9QAg4HYCsAFgMnLA8ghd6j1WF6nMb2kbiReVcjRPn`}
                    />
                  </div>
                  <Link
                    target="blank"
                    rel="noreferrer"
                    href={
                      (profile?.metadata?.attributes
                        ?.find((item) => item?.key === "website")
                        ?.value?.includes("https://")
                        ? profile?.metadata?.attributes?.find(
                            (item) => item?.key === "website"
                          )?.value
                        : "https://" +
                          profile?.metadata?.attributes?.find(
                            (item) => item?.key === "website"
                          )?.value) || ""
                    }
                    className="relative break-all max-w-full w-fit h-fit flex cursor-pointer"
                  >
                    {
                      profile?.metadata?.attributes?.find(
                        (item) => item?.key === "website"
                      )?.value
                    }
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        {profile?.metadata?.attributes?.find(
          (item) => item?.key === "microbrandCypher"
        )?.value && (
          <div className="relative w-full hit flex flex-row gap-2 flex-wrap">
            {JSON.parse(
              profile?.metadata?.attributes?.[
                profile?.metadata?.attributes?.findIndex(
                  (item) => item?.key === "microbrandCypher"
                )
              ].value
            )?.map(
              (
                item: {
                  microbrand: string;
                  microbrandCover: string;
                },
                index: number
              ) => {
                return (
                  <div
                    key={index}
                    className="relative w-5 h-5 cursor-pointer active:scale-95"
                    onClick={() => {
                      context?.setFiltersOpen({ value: false, allow: false });
                      router.push(
                        `/item/microbrand/${item?.microbrand?.replaceAll(
                          " ",
                          "_"
                        )}`
                      );
                    }}
                    title={item?.microbrand}
                  >
                    {item?.microbrandCover && (
                      <Image
                        layout="fill"
                        src={`${INFURA_GATEWAY}/ipfs/${
                          item?.microbrandCover?.split("ipfs://")?.[1]
                        }`}
                        draggable={false}
                        objectFit="contain"
                        onError={(e) => handleImageError(e)}
                      />
                    )}
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>
      <div className="relative w-full h-fit flex items-end justify-end sm:justify-center flex-col gap-3 sm:overflow-x-hidden">
        <div className="font-beb text-white text-4xl sm:text-6xl tablet:text-9xl xl:text-8xl w-fit h-fit relative flex items-center justify-end break-words">
          {profile?.username?.localName}
        </div>
        <div className="relative flex flex-col sm:flex-row gap-10 items-end sm:items-center justify-end w-full sm:w-fit h-fit">
          <div className="relative w-fit h-fit flex items-center justify-center">
            <div className="relative flex w-10 h-7 tablet:w-20 tablet:h-16 items-center justify-center">
              <Image
                layout="fill"
                src={`${INFURA_GATEWAY}/ipfs/QmcQibTswkoR7jFQoa4qJcwSmwNU3kBg6AkErsJ3q3qGCW`}
                draggable={false}
              />
            </div>
          </div>
          <div
            className="relative w-full h-fit flex items-center justify-start overflow-x-scroll max-w-[32rem]"
            id="xScroll"
          >
            <div
              className={`gap-2 flex flex-row items-start justify-start w-fit h-fit sm:flex-nowrap flex-wrap ${
                questsLoading && "animate-pulse"
              }`}
            >
              {questsLoading || questSample?.length < 1
                ? Array.from({
                    length: getLocaleFromPath(path) ? 4 : 3,
                  })?.map((_, index: number) => {
                    return (
                      <div
                        key={index}
                        className="gap-3 flex flex-col items-start justify-center w-fit h-fit"
                      >
                        <div className="relative text-white text-xxs tablet:text-xs font-bit w-fit h-fit break-all whitespace-preline">
                          {questsLoading ? (
                            <>{dict?.quest}</>
                          ) : (
                            <>{dict?.kinQ}</>
                          )}
                        </div>
                        <div className="relative flex flex-row gap-4 items-center justify-center w-fit h-fit">
                          <div
                            className={`relative w-6 h-6 tablet:w-14 tablet:h-14 flex items-center justify-center ${
                              !questsLoading &&
                              questSample?.length < 1 &&
                              "cursor-pointer"
                            }`}
                            onClick={() =>
                              !questsLoading &&
                              questSample?.length < 1 &&
                              window.open("https://kinora.irrevocable.dev/")
                            }
                          >
                            <Image
                              draggable={false}
                              layout="fill"
                              src={`${INFURA_GATEWAY}/ipfs/QmQ4iytH1E7T6Mz383bEzSoPWfLhZmmvveb1nfwiHVgQYa`}
                            />
                          </div>
                          {index !== 3 && (
                            <div className="relative flex flex-row items-center justify-center gap-4 w-fit h-fit">
                              <div className="relative w-1 h-1 tablet:w-3 tablet:h-3 items-center justify-center flex bg-lirio rounded-full"></div>
                              <div className="relative w-2 h-2 tablet:w-4 tablet:h-4 items-center justify-center flex bg-olor rounded-full"></div>
                              <div className="relative w-1 h-1 tablet:w-3 tablet:h-3 items-center justify-center flex bg-lirio rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                : questSample?.map((quest: Quest, index: number) => {
                    return (
                      <div
                        key={index}
                        className="gap-3 flex flex-col items-start justify-center w-fit h-fit"
                      >
                        <div className="relative text-white text-xxs tablet:text-xs font-bit w-fit h-fit items-center justify-center flex break-words whitespace-nowrap">
                          {quest?.questMetadata?.title?.length > 10
                            ? quest?.questMetadata?.title?.slice(0, 7) + "..."
                            : quest?.questMetadata?.title}
                        </div>
                        <div className="relative flex flex-row gap-4 items-center justify-center w-fit h-fit">
                          <div
                            className={`relative w-6 h-6 tablet:w-14 tablet:h-14 cursor-pointer active:scale-95 flex items-center border-2 border-[#3887c3] rounded-full justify-center`}
                            onClick={() =>
                              router.push(`/item/kinora/${quest?.postId}`)
                            }
                          >
                            <Image
                              draggable={false}
                              layout="fill"
                              src={`${INFURA_GATEWAY}/ipfs/${
                                quest?.questMetadata?.cover?.split(
                                  "ipfs://"
                                )?.[1]
                              }`}
                              className="rounded-full"
                              objectFit="cover"
                            />
                          </div>
                          {index !== questSample?.length - 1 && (
                            <div className="relative flex flex-row items-center justify-center gap-4 w-fit h-fit">
                              <div className="relative w-1 h-1 tablet:w-3 tablet:h-3 items-center justify-center flex bg-lirio rounded-full"></div>
                              <div className="relative w-2 h-2 tablet:w-4 tablet:h-4 items-center justify-center flex bg-olor rounded-full"></div>
                              <div className="relative w-1 h-1 tablet:w-3 tablet:h-3 items-center justify-center flex bg-lirio rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bio;

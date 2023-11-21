import { FunctionComponent } from "react";
import { BioProps } from "../types/autograph.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import Link from "next/link";
import { setReactBox } from "../../../../redux/reducers/reactBoxSlice";
import numeral from "numeral";
import { MetadataAttributeType } from "../../../../graphql/generated";

const Bio: FunctionComponent<BioProps> = ({
  profile,
  dispatch,
  router,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-row items-start justify-start gap-5 px-5 -top-7">
      <div className="relative w-full h-fit flex flex-col gap-2">
        <div className="w-full h-fit items-start flex gap-3 flex-row relative">
          <div className="relative flex items-start justify-between gap-1 w-fit h-fit max-w-[18rem] border border-saph bg-black p-2 flex-col">
            <div className="font-bit text-ballena blur-sm w-fit h-fit absolute top-1 flex">
              Caption on display:
            </div>
            <div className="font-bit text-olor w-fit h-fit relative flex">
              Caption on display:
            </div>
            <div className="font-aust text-white text-xs w-fit h-fit relative flex">
              Oscillating between 2023 and 1983, where AI meets analog and
              decentralization dons a neon glow. Here, epochs blend and
              governance dances to the beat of synthwave. The underlying ethos:
              "In Autonomy We Trust."
            </div>
          </div>
          <div className="relative flex items-start justify-between gap-2 w-full h-fit p-2 top-7 flex-col">
            {profile?.metadata?.bio && (
              <div className="font-aust text-white text-xs  w-fit h-fit relative flex">
                {profile?.metadata?.bio}
              </div>
            )}
            <div className="relative w-full h-fit flex flex-row gap-10 justify-start items-center">
              {[
                ["Qmb6fQG6L2R7Npf1oS55YEB5RS9z7oCyTwxYnTf57DEEjV", "Followers"],
                ["QmP141cw2U9TNsU6AXRoo5X5VCPawUTPkWAUJburJayg7x", "Following"],
              ].map((image: string[], indexTwo: number) => {
                const amounts: number[] = [
                  profile?.stats?.followers || 0,
                  profile?.stats?.following || 0,
                ];

                return (
                  <div
                    className="font-aust text-white text-xs w-fit h-fit relative items-start justify-center flex flex-col gap-2"
                    key={indexTwo}
                    title={image[1]}
                  >
                    <div className="relative w-4 h-4 items-center justify-center flex">
                      <Image
                        layout="fill"
                        src={`${INFURA_GATEWAY}/ipfs/${image[0]}`}
                        draggable={false}
                      />
                    </div>
                    <div
                      className={`relative w-fit h-fit flex ${
                        amounts[indexTwo] > 0 && "cursor-pointer"
                      }`}
                      onClick={() =>
                        amounts[indexTwo] > 0 &&
                        dispatch(
                          setReactBox({
                            actionOpen: true,
                            actionId: profile?.id,
                            actionType: image[1],
                          })
                        )
                      }
                    >
                      {numeral(amounts[indexTwo]).format("0a")}
                    </div>
                  </div>
                );
              })}
              {profile?.metadata?.attributes?.find(
                (item) => item.key === "location"
              )?.value && (
                <div className="font-aust text-white text-xs w-fit h-fit relative items-start justify-center flex flex-col gap-2">
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
                        (item) => item.key === "location"
                      )?.value
                    }
                  </div>
                </div>
              )}
              {profile?.metadata?.attributes?.find(
                (item) => item.key === "website"
              )?.value && (
                <div className="font-aust text-white text-xs w-fit h-fit relative items-start justify-center flex flex-col gap-2">
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
                        ?.find((item) => item.key === "website")
                        ?.value?.includes("https://")
                        ? profile?.metadata?.attributes?.find(
                            (item) => item.key === "website"
                          )?.value
                        : "https://" +
                          profile?.metadata?.attributes?.find(
                            (item) => item.key === "website"
                          )?.value) || ""
                    }
                    className="relative w-fit h-fit flex cursor-pointer"
                  >
                    {
                      profile?.metadata?.attributes?.find(
                        (item) => item.key === "website"
                      )?.value
                    }
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        {profile?.metadata?.attributes?.find(
          (item) => item.key === "microbrandsCypher"
        )?.value &&
          profile?.metadata?.attributes?.find(
            (item) => item.key === "microbrandsCypher"
          )?.type === MetadataAttributeType.Json && (
            <div className="relative w-full hit flex flex-row gap-2 flex-wrap">
              {JSON.parse(
                profile?.metadata?.attributes?.[
                  profile?.metadata?.attributes?.findIndex(
                    (item) => item.key === "microbrandsCypher"
                  )
                ].value
              )?.map(
                (
                  item: {
                    microbrand: string;
                    microbranCover: string;
                  },
                  index: number
                ) => {
                  return (
                    <div
                      key={index}
                      className="relative w-5 h-5 cursor-pointer active:scale-95 rounded-full"
                      id="pfp"
                      onClick={() =>
                        router.push(`/item/microbrand/${item?.microbrand}`)
                      }
                    >
                      {item?.microbranCover && (
                        <Image
                          layout="fill"
                          src={`${INFURA_GATEWAY}/ipfs/${
                            item?.microbranCover?.split("ipfs://")?.[1]
                          }`}
                          draggable={false}
                          className="rounded-full"
                          objectFit="cover"
                        />
                      )}
                    </div>
                  );
                }
              )}
            </div>
          )}
      </div>
      <div className="relative w-full h-fit flex items-end justify-center flex-col gap-3 overflow-x-hidden">
        <div className="font-beb text-white text-9xl w-fit h-fit relative flex items-center justify-end">
          {profile?.handle?.suggestedFormatted?.localName}
        </div>
        <div className="relative flex flex-row gap-10 items-center justify-end w-fit h-fit">
          <div className="relative flex w-20 h-16 items-center justify-center">
            <Image
              layout="fill"
              src={`${INFURA_GATEWAY}/ipfs/QmcQibTswkoR7jFQoa4qJcwSmwNU3kBg6AkErsJ3q3qGCW`}
              draggable={false}
            />
          </div>
          <div className="gap-2 flex flex-row items-center justify-start w-fit h-fit">
            {Array.from({ length: 4 })?.map((_, index: number) => {
              return (
                <div
                  key={index}
                  className="gap-3 flex flex-col items-start justify-center w-fit h-fit"
                >
                  <div className="relative text-white text-xs font-bit w-fit h-fit">
                    Quests <br />
                    Soon
                  </div>
                  <div className="relative flex flex-row gap-4 items-center justify-center w-fit h-fit">
                    <div className="relative w-14 h-14 flex items-center justify-center">
                      <Image
                        draggable={false}
                        layout="fill"
                        src={`${INFURA_GATEWAY}/ipfs/QmQ4iytH1E7T6Mz383bEzSoPWfLhZmmvveb1nfwiHVgQYa`}
                      />
                    </div>
                    {index !== 3 && (
                      <div className="relative flex flex-row items-center justify-center gap-4 w-fit h-fit">
                        <div className="relative w-3 h-3 items-center justify-center flex bg-lirio rounded-full"></div>
                        <div className="relative w-4 h-4 items-center justify-center flex bg-olor rounded-full"></div>
                        <div className="relative w-3 h-3 items-center justify-center flex bg-lirio rounded-full"></div>
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
  );
};

export default Bio;

import { FunctionComponent } from "react";
import { Profile, Quote } from "../../../../graphql/generated";
import createProfilePicture from "../../../../lib/helpers/createProfilePicture";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "next/legacy/image";
import { WhoSwitchProps } from "../types/modals.types";
import Publication from "@/components/Autograph/modules/Publication";

const WhoSwitch: FunctionComponent<WhoSwitchProps> = ({
  type,
  router,
  reactors,
  quoters,
  showMore,
  hasMoreQuote,
  hasMore,
  mirrorQuote,
  dispatch,
  lensConnected,
}): JSX.Element => {
  switch (type) {
    case "Quote":
      return (
        <div className="relative w-full h-full flex flex-col overflow-y-scroll">
          <InfiniteScroll
            dataLength={quoters?.length}
            loader={<></>}
            hasMore={hasMore}
            next={showMore}
            className="w-fit h-fit items-start justify-start flex flex-col gap-10"
          >
            {quoters?.map(
              (
                item: Quote & {
                  decrypted: any;
                },
                index: number
              ) => {
                return (
                  <Publication
                    lensConnected={lensConnected}
                    index={index}
                    item={item}
                    router={router}
                    disabled={true}
                    dispatch={dispatch}
                    data-post-id={item?.id}
                  />
                );
              }
            )}
          </InfiniteScroll>
        </div>
      );

    default:
      return (
        <>
          {reactors?.length > 0 && !mirrorQuote ? (
            <div className="relative w-full h-full flex flex-col">
              <InfiniteScroll
                hasMore={hasMore}
                dataLength={reactors?.length}
                next={showMore}
                loader={""}
                height={"10rem"}
                className="relative w-full h-fit flex flex-col px-4 gap-2 overflow-y-scroll"
              >
                {reactors?.map((reactor: any, index: number) => {
                  const account =
                    type === "Likes"
                      ? reactor?.profile
                      : type === "Mirrors"
                      ? reactor?.by
                      : reactor;

                  const profileImage = createProfilePicture(
                    account?.metadata?.picture
                  );

                  return (
                    <div
                      key={index}
                      className="relative w-full h-fit p-2 flex flex-row rounded-lg border border-black items-center justify-start font-bit text-white cursor-pointer"
                      id="preroll"
                      onClick={() =>
                        router.push(
                          `/autograph/${
                            account?.handle?.suggestedFormatted?.localName?.split(
                              "@"
                            )[1]
                          }`
                        )
                      }
                    >
                      <div className="relative w-fit h-fit flex flex-row gap-3 items-center justify-center">
                        <div
                          className="relative w-6 h-6 rounded-full border border-white items-center justify-center"
                          id="pfp"
                        >
                          {profileImage && (
                            <Image
                              src={profileImage}
                              objectFit="cover"
                              layout="fill"
                              alt="pfp"
                              className="relative w-fit h-fit rounded-full self-center flex"
                              draggable={false}
                            />
                          )}
                        </div>
                        <div
                          id="handle"
                          className="relative w-fit h-fit justify-center items-center flex top-px text-xs"
                        >
                          {account?.handle?.suggestedFormatted?.localName}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </InfiniteScroll>
            </div>
          ) : (
            quoters.length > 0 &&
            mirrorQuote && (
              <div className="relative w-full h-full flex flex-col">
                <InfiniteScroll
                  hasMore={hasMoreQuote}
                  dataLength={quoters?.length}
                  next={showMore}
                  loader={""}
                  height={"10rem"}
                  className="relative w-full h-fit flex flex-col px-4 gap-2 overflow-y-scroll"
                >
                  {quoters?.map((quoter: any, index: number) => {
                    const profileImage = createProfilePicture(
                      quoter?.by?.metadata?.picture
                    );
                    return (
                      <div
                        key={index}
                        className="relative w-full h-fit p-2 flex flex-row rounded-lg border border-black items-center justify-start font-bit text-white cursor-pointer"
                        id="preroll"
                        onClick={() =>
                          router.push(
                            `/autograph/${
                              quoter?.by?.handle?.suggestedFormatted?.localName?.split(
                                "@"
                              )[1]
                            }`
                          )
                        }
                      >
                        <div className="relative w-fit h-fit flex flex-row gap-3 items-center justify-center">
                          <div
                            className="relative w-6 h-6 rounded-full border border-white items-center justify-center"
                            id="pfp"
                          >
                            {profileImage && (
                              <Image
                                src={profileImage}
                                objectFit="cover"
                                layout="fill"
                                alt="pfp"
                                className="relative w-fit h-fit rounded-full self-center flex"
                                draggable={false}
                              />
                            )}
                          </div>
                          <div
                            id="handle"
                            className="relative w-fit h-fit justify-center items-center flex top-px text-xs"
                          >
                            {quoter?.by?.handle?.suggestedFormatted?.localName}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </InfiniteScroll>
              </div>
            )
          )}
        </>
      );
  }
};

export default WhoSwitch;

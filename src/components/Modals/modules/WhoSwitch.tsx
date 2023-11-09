import { FunctionComponent } from "react";
import {  Profile, Quote } from "../../../../graphql/generated";
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
}): JSX.Element => {
  switch (type) {
    case "Quote":
      return (
        <div className="relative w-full h-[60vh] flex flex-col overflow-y-scroll">
          <InfiniteScroll
            dataLength={16}
            loader={<></>}
            hasMore={hasMore}
            next={showMore}
            className="w-fit h-fit items-start justify-start flex flex-col gap-10"
          >
            {Array.from({ length: 20 })?.map((item: Quote, index: number) => {
              return (
                <Publication
                  index={index}
                  item={item}
                  router={router}
                  disabled={true}
                  dispatch={dispatch}
                  data-post-id={item?.id}
                />
              );
            })}
          </InfiniteScroll>
        </div>
      );

    default:
      return (
        <>
          {reactors?.length > 0 && !mirrorQuote ? (
            <div className="relative w-full h-fit flex flex-col">
              <InfiniteScroll
                hasMore={hasMore}
                dataLength={reactors?.length}
                next={showMore}
                loader={""}
                height={"10rem"}
                className="relative w-full h-fit flex flex-col px-4 gap-2 overflow-y-scroll"
              >
                {reactors?.map((account: any, index: number) => {
                  const reacter: Profile =
                    type === "Likes" ||
                    type === "Acts" ||
                    type === "Followers" ||
                    type === "Following"
                      ? account.profile
                      : account;

                  const profileImage = createProfilePicture(
                    reacter?.metadata?.picture
                  );

                  return (
                    <div
                      key={index}
                      className="relative w-full h-fit p-2 drop-shadow-lg flex flex-row bg-gradient-to-r from-offBlack via-gray-600 to-black auto-cols-auto rounded-lg border border-black top-px font-bit text-white cursor-pointer"
                      onClick={() =>
                        router.push(
                          `/autograph/${
                            reacter?.handle?.suggestedFormatted?.localName?.split(
                              "@"
                            )[1]
                          }`
                        )
                      }
                    >
                      <div className="relative w-fit h-fit flex flex-row gap-6">
                        <div
                          className="relative w-6 h-6 rounded-full col-start-1"
                          id="crt"
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
                          className="relative w-fit h-fit justify-center flex"
                        >
                          {reacter?.handle?.suggestedFormatted?.localName}
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
              <div className="relative w-full h-fit flex flex-col">
                <InfiniteScroll
                  hasMore={hasMoreQuote}
                  dataLength={quoters?.length}
                  next={showMore}
                  loader={""}
                  height={"10rem"}
                  className="relative w-full h-fit flex flex-col px-4 gap-2 overflow-y-scroll"
                >
                  {quoters?.map((quoter: Profile, index: number) => {
                    const profileImage = createProfilePicture(
                      quoter?.metadata?.picture
                    );
                    return (
                      <div
                        key={index}
                        className="relative w-full h-fit p-2 drop-shadow-lg flex flex-row bg-gradient-to-r from-offBlack via-gray-600 to-black auto-cols-auto rounded-lg border border-black top-px font-bit text-white cursor-pointer"
                        onClick={() =>
                          router.push(
                            `/autograph/${
                              quoter?.handle?.suggestedFormatted?.localName?.split(
                                "@"
                              )[1]
                            }`
                          )
                        }
                      >
                        <div className="relative w-fit h-fit flex flex-row gap-6">
                          <div
                            className="relative w-6 h-6 rounded-full col-start-1"
                            id="crt"
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
                            className="relative w-fit h-fit justify-center flex"
                          >
                            {quoter?.handle?.suggestedFormatted?.localName}
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

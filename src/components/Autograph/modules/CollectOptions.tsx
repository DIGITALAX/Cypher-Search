import { FunctionComponent } from "react";
import { CollectOptionsProps } from "../types/autograph.types";
import { setPostCollectGif } from "../../../../redux/reducers/postCollectGifSlice";

const CollectOptions: FunctionComponent<CollectOptionsProps> = ({
  openMeasure,
  setOpenMeasure,
  availableCurrencies,
  collectTypes,
  id,
  dispatch,
  gifs,
  type,
}): JSX.Element => {
  return (
    <div
      className={`relative rounded-md flex flex-col gap-5 w-5/6 items-center justify-start max-h-[20rem] overflow-y-scroll`}
    >
      <div className="relative w-full h-fit flex flex-col flex-wrap justify-start items-start gap-3 break-words p-3">
        <div className="relative flex flex-wrap gap-4 items-start justify-start">
          {[
            {
              type: "drop",
              title: "Collectible?",
              dropValues: ["Yes", "No"],
              dropOpen: openMeasure.collectibleOpen,
              chosenValue: openMeasure.collectible,
              showObject: true,
              openDropdown: () =>
                setOpenMeasure((prev) => ({
                  ...prev,
                  collectibleOpen: !prev.collectibleOpen,
                })),
              setValue: (item: string) =>
                setOpenMeasure((prev) => ({
                  ...prev,
                  collectible: item,
                })),
            },
            {
              type: "drop",
              title: "Who can collect?",
              dropValues: ["Everyone", "Only Followers"],
              dropOpen: openMeasure.whoCollectsOpen,
              chosenValue: collectTypes?.[id]?.followerOnly
                ? "Only Followers"
                : "Everyone",
              showObject: openMeasure.collectible === "Yes" ? true : false,
              openDropdown: () =>
                setOpenMeasure((prev) => ({
                  ...prev,
                  whoCollectsOpen: !prev.whoCollectsOpen,
                })),
              setValue: (item: string) => {
                const newCTs =
                  typeof collectTypes === "object" ? { ...collectTypes } : {};

                newCTs[id] = {
                  ...(newCTs[id] || {}),
                  followerOnly: item === "Only Followers" ? true : false,
                };

                dispatch(
                  setPostCollectGif({
                    actionType: type,
                    actionId: id,
                    actionCollectTypes: newCTs,
                    actionGifs: gifs,
                  })
                );
              },
            },
            {
              type: "drop",
              title: "Creator award?",
              dropValues: ["Yes", "No"],
              dropOpen: openMeasure.creatorAwardOpen,
              chosenValue: openMeasure.award,
              showObject: openMeasure.collectible === "Yes" ? true : false,
              openDropdown: () =>
                setOpenMeasure((prev) => ({
                  ...prev,
                  creatorAwardOpen: !prev.creatorAwardOpen,
                })),
              setValue: (item: string) =>
                setOpenMeasure((prev) => ({
                  ...prev,
                  award: item,
                })),
            },
            {
              type: "input",
              title: "Award amount",
              chosenValue: collectTypes?.[id]?.amount?.value || "0",
              showObject: openMeasure.award === "Yes" ? true : false,
              setValue: (item: string) => {
                const newCTs =
                  typeof collectTypes === "object" ? { ...collectTypes } : {};

                newCTs[id] = {
                  ...(newCTs[id] || {}),
                  amount: {
                    ...(newCTs[id]?.amount || {}),
                    value: item,
                  },
                } as any;

                dispatch(
                  setPostCollectGif({
                    actionType: type,
                    actionId: id,
                    actionCollectTypes: newCTs,
                    actionGifs: gifs,
                  })
                );
              },
            },
            {
              type: "drop",
              title: "Award currency",
              dropValues: availableCurrencies?.map((item) => item.symbol),
              chosenValue:
                availableCurrencies?.find((item) => {
                  if (
                    item.contract.address ===
                    collectTypes?.[id]?.amount?.currency
                  ) {
                    return item;
                  }
                })?.symbol! || availableCurrencies?.[0]?.symbol,
              dropOpen: openMeasure.currencyOpen,
              showObject: openMeasure.award === "Yes" ? true : false,
              openDropdown: () =>
                setOpenMeasure((prev) => ({
                  ...prev,
                  currencyOpen: !prev.currencyOpen,
                })),
              setValue: (item: string) => {
                const newCTs =
                  typeof collectTypes === "object" ? { ...collectTypes } : {};
                newCTs[id] = newCTs[id] || {
                  followerOnly: false,
                };

                newCTs[id] = {
                  ...(newCTs[id] || {}),
                  amount: {
                    ...(newCTs[id]?.amount || {}),
                    currency: item,
                  },
                } as any;

                dispatch(
                  setPostCollectGif({
                    actionType: type,
                    actionId: id,
                    actionCollectTypes: newCTs,
                    actionGifs: gifs,
                  })
                );
              },
            },
            {
              type: "input",
              title: "Referral?",
              chosenValue: String(collectTypes?.[id]?.referralFee) || "0",
              showObject: openMeasure.award === "Yes" ? true : false,

              setValue: (item: string) => {
                const newCTs =
                  typeof collectTypes === "object" ? { ...collectTypes } : {};

                newCTs[id] = {
                  ...(newCTs[id] || {}),
                  referralFee: Number(item),
                } as any;

                dispatch(
                  setPostCollectGif({
                    actionType: type,
                    actionId: id,
                    actionCollectTypes: newCTs,
                    actionGifs: gifs,
                  })
                );
              },
            },
            {
              type: "drop",
              title: "Limited Edition?",
              dropValues: ["Yes", "No"],
              dropOpen: openMeasure.editionOpen,
              chosenValue: openMeasure.edition,
              showObject: openMeasure.award === "Yes" ? true : false,
              openDropdown: () =>
                setOpenMeasure((prev) => ({
                  ...prev,
                  editionOpen: !prev.editionOpen,
                })),
              setValue: (item: string) =>
                setOpenMeasure((prev) => ({
                  ...prev,
                  edition: item,
                })),
            },
            {
              type: "input",
              title: "Edition amount",
              chosenValue: collectTypes?.[id]?.collectLimit || "0",
              showObject: openMeasure.edition === "Yes" ? true : false,
              setValue: (item: string) => {
                const newCTs =
                  typeof collectTypes === "object" ? { ...collectTypes } : {};

                newCTs[id] = {
                  ...(newCTs[id] || {}),
                  collectLimit: item,
                } as any;

                dispatch(
                  setPostCollectGif({
                    actionType: type,
                    actionId: id,
                    actionCollectTypes: newCTs,
                    actionGifs: gifs,
                  })
                );
              },
            },
            {
              type: "drop",
              title: "24hr time limit?",
              dropValues: ["Yes", "No"],
              dropOpen: openMeasure.timeOpen,
              chosenValue: openMeasure.time,
              showObject: openMeasure.award === "Yes" ? true : false,
              openDropdown: () =>
                setOpenMeasure((prev) => ({
                  ...prev,
                  timeOpen: !prev.timeOpen,
                })),
              setValue: (item: string) => {
                setOpenMeasure((prev) => ({
                  ...prev,
                  time: item,
                }));

                const newCTs =
                  typeof collectTypes === "object" ? { ...collectTypes } : {};

                if (item === "Yes") {
                  newCTs[id] = {
                    ...(newCTs[id] || {}),
                    endsAt: new Date(
                      new Date().getTime() + 24 * 60 * 60 * 1000
                    ).getTime(),
                  } as any;
                } else {
                  newCTs[id] = {
                    ...(newCTs[id] || {}),
                    endsAt: undefined,
                  } as any;
                }
                dispatch(
                  setPostCollectGif({
                    actionType: type,
                    actionId: id,
                    actionCollectTypes: newCTs,
                    actionGifs: gifs,
                  })
                );
              },
            },
          ].map(
            (
              item: {
                type: string;
                title: string;
                showObject: boolean;
                dropOpen?: boolean;
                chosenValue: string;
                dropValues?: string[];
                openDropdown?: () => void;
                setValue: (item: string) => void;
              },
              indexTwo: number
            ) => {
              return (
                item.showObject &&
                (item.type === "drop" ? (
                  <div
                    className="relative flex items-center justify-center flex-col w-48 h-fit pb-1.5 gap-2"
                    key={indexTwo}
                  >
                    <div className="relative w-full h-fit flex items-start justify-start font-bit text-white text-sm">
                      {item.title}
                    </div>
                    <div
                      className="relative w-full h-12 p-px rounded-sm flex flex-row items-center justify-center font-bit text-sol text-center"
                      id="borderSearch"
                    >
                      <div className="relative bg-offBlack flex flex-row w-full h-full justify-start items-center rounded-sm p-2 gap-2">
                        <div
                          className={`relative flex items-center justify-center cursor-pointer w-4 h-3 ${
                            item.dropOpen && "-rotate-90"
                          }`}
                          onClick={() => item.openDropdown!()}
                        >
                          <div className="relative w-fit h-fit text-xl">#</div>
                        </div>
                        <div
                          className="relative w-full h-full p-1.5 bg-offBlack flex items-center justify-center"
                          id="searchBar"
                        >
                          {item.chosenValue}
                        </div>
                      </div>
                    </div>
                    {item.dropOpen && (
                      <div
                        className="absolute flex items-start justify-center w-full h-fit max-height-[7rem] overflow-y-scroll z-50 bg-offBlack top-20 p-px border border-azul rounded-sm"
                        id="dropDown"
                      >
                        <div className="relative flex flex-col items-center justify-start w-full h-fit gap-px">
                          {item.dropValues?.map(
                            (value: string, indexThree: number) => {
                              return (
                                <div
                                  key={indexThree}
                                  className="relative w-full h-8 py-px bg-offBlack items-center justify-center flex text-sol text-sm uppercase font-bit hover:bg-skyBlue hover:text-black cursor-pointer"
                                  onClick={() => {
                                    item.setValue(
                                      indexTwo === 4
                                        ? availableCurrencies[indexThree]
                                            .contract.address
                                        : value
                                    );
                                    item.openDropdown!();
                                  }}
                                >
                                  {value}
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className="relative flex items-center justify-center flex-col w-48 h-fit pb-1.5 gap-2"
                    key={indexTwo}
                  >
                    <div className="relative w-full h-fit flex items-start justify-start font-bit text-white text-sm">
                      {item.title}
                    </div>
                    <div
                      className="relative w-full h-12 p-px rounded-sm flex flex-row items-center justify-center font-bit text-sol text-center"
                      id="borderSearch"
                    >
                      <div
                        className={`relative flex items-center justify-center cursor-pointer w-4 h-3`}
                      >
                        <div className="relative w-fit h-fit text-xl">#</div>
                      </div>
                      <input
                        className="relative bg-offBlack flex flex-row w-full h-full justify-start items-center rounded-sm p-2 gap-2"
                        onChange={(e) => item.setValue(e.target.value)}
                      />
                    </div>
                  </div>
                ))
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectOptions;

import { FunctionComponent } from "react";
import { CollectOptionsProps } from "../types/autograph.types";

const CollectOptions: FunctionComponent<CollectOptionsProps> = ({
  top,
  setMakePostComment,
  makePostComent,
  index,
  availableCurrencies,
}): JSX.Element => {
  return (
    <div
      className={`absolute bg-black rounded-md flex flex-col gap-5 w-4/5 h-[15rem] p-1 border border-white z-10 overflow-y-none`}
      style={{
        top,
      }}
    >
      <div className="relative w-full h-fit flex flex-col flex-wrap justify-start items-start gap-3 break-words p-3">
        <div className="relative flex flex-wrap gap-4 items-start justify-start">
          {[
            {
              type: "drop",
              title: "Collectible?",
              dropValues: ["Yes", "No"],
              dropOpen: makePostComent.collectibleOpen,
              chosenValue: makePostComent.collectible,
              showObject: true,
              openDropdown: () =>
                setMakePostComment((prev) => {
                  const arr = [...prev];
                  arr[index] = {
                    ...arr[index],
                    collectibleOpen: !arr[index].collectibleOpen,
                  };
                  return arr;
                }),
              setValue: (item: string) =>
                setMakePostComment((prev) => {
                  const arr = [...prev];
                  arr[index] = {
                    ...arr[index],
                    collectible: item,
                  };
                  return arr;
                }),
            },
            {
              type: "drop",
              title: "Who can collect?",
              dropValues: ["Everyone", "Only Followers"],
              dropOpen: makePostComent.whoCollectsOpen,
              chosenValue: makePostComent.collectType?.followerOnly
                ? "Only Followers"
                : "Everyone",
              showObject: makePostComent.collectible === "Yes" ? true : false,
              openDropdown: () =>
                setMakePostComment((prev) => {
                  const arr = [...prev];
                  arr[index] = {
                    ...arr[index],
                    whoCollectsOpen: !arr[index].whoCollectsOpen,
                  };
                  return arr;
                }),
              setValue: (item: string) =>
                setMakePostComment((prev) => {
                  const arr = [...prev];
                  arr[index] = {
                    ...arr[index],
                    collectType: {
                      ...arr[index].collectType,
                      followerOnly: item === "Only Followers" ? true : false,
                    },
                  };
                  return arr;
                }),
            },
            {
              type: "drop",
              title: "Creator award?",
              dropValues: ["Yes", "No"],
              dropOpen: makePostComent.creatorAwardOpen,
              chosenValue: makePostComent.award,
              showObject: makePostComent.collectible === "Yes" ? true : false,
              openDropdown: () =>
                setMakePostComment((prev) => {
                  const arr = [...prev];
                  arr[index] = {
                    ...arr[index],
                    creatorAwardOpen: !arr[index].creatorAwardOpen,
                  };
                  return arr;
                }),
              setValue: (item: string) =>
                setMakePostComment((prev) => {
                  const arr = [...prev];
                  arr[index] = {
                    ...arr[index],
                    award: item,
                  };
                  return arr;
                }),
            },
            {
              type: "input",
              title: "Award amount",
              chosenValue: makePostComent.collectType?.amount?.value || "0",
              showObject: makePostComent.award === "Yes" ? true : false,
              setValue: (item: string) =>
                setMakePostComment((prev) => {
                  const arr = [...prev];
                  arr[index] = {
                    ...arr[index],
                    collectType: {
                      ...arr[index].collectType,
                      amount: {
                        ...arr[index].collectType?.amount!,
                        value: item,
                      },
                    } as any,
                  };
                  return arr;
                }),
            },
            {
              type: "drop",
              title: "Award currency",
              dropValues: availableCurrencies?.map((item) => item.name),
              chosenValue: availableCurrencies?.find((item) => {
                if (
                  item.contract.address ===
                  makePostComent.collectType?.amount?.currency
                ) {
                  return item;
                }
              })?.name!,
              dropOpen: makePostComent.currencyOpen,
              showObject: makePostComent.award === "Yes" ? true : false,
              openDropdown: () =>
                setMakePostComment((prev) => {
                  const arr = [...prev];
                  arr[index] = {
                    ...arr[index],
                    currencyOpen: !arr[index].currencyOpen,
                  };
                  return arr;
                }),
              setValue: (item: string) =>
                setMakePostComment((prev) => {
                  const arr = [...prev];
                  arr[index] = {
                    ...arr[index],
                    collectType: {
                      ...arr[index].collectType,
                      amount: {
                        ...arr[index].collectType?.amount!,
                        currency: item,
                      },
                    } as any,
                  };
                  return arr;
                }),
            },
            {
              type: "drop",
              title: "Award currency?",
              dropValues: ["Yes", "No"],
              dropOpen: makePostComent.creatorAwardOpen,
              chosenValue: makePostComent.award,
              showObject: makePostComent.collectible === "Yes" ? true : false,

              setValue: (item: string) =>
                setMakePostComment((prev) => {
                  const arr = [...prev];
                  arr[index] = {
                    ...arr[index],
                    award: item,
                  };
                  return arr;
                }),
            },
            //   {
            //     title: "Award currency?",
            //     dropValues: ["Yes", "No"],

            //     openDropdown: () =>
            //       setMakePostComment((prev) => {
            //         const arr = [...prev];
            //         arr[index] = {
            //           ...arr[index],
            //           collectibleOpen: !arr[index].collectibleOpen,
            //         };
            //       }),
            //     setValue: (item) =>
            //       setMakePostComment((prev) => {
            //         const arr = [...prev];
            //         arr[index] = {
            //           ...arr[index],
            //           collectType:
            //             item === "Yes" ? arr[index].collectType : undefined,
            //         };
            //       }),
            //   },
            //   {
            //     title: "Limited edition?",
            //     dropValues: ["Yes", "No"],
            //     openDropdown: () =>
            //       setMakePostComment((prev) => {
            //         const arr = [...prev];
            //         arr[index] = {
            //           ...arr[index],
            //           collectibleOpen: !arr[index].collectibleOpen,
            //         };
            //       }),
            //     setValue: (item) =>
            //       setMakePostComment((prev) => {
            //         const arr = [...prev];
            //         arr[index] = {
            //           ...arr[index],
            //           collectType:
            //             item === "Yes" ? arr[index].collectType : undefined,
            //         };
            //       }),
            //   },
            //   {
            //     title: "Time limit to collect?",
            //     dropValues: ["Yes", "No"],

            //     openDropdown: () =>
            //       setMakePostComment((prev) => {
            //         const arr = [...prev];
            //         arr[index] = {
            //           ...arr[index],
            //           collectibleOpen: !arr[index].collectibleOpen,
            //         };
            //       }),
            //     setValue: (item) =>
            //       setMakePostComment((prev) => {
            //         const arr = [...prev];
            //         arr[index] = {
            //           ...arr[index],
            //           collectType:
            //             item === "Yes" ? arr[index].collectType : undefined,
            //         };
            //       }),
            //   },
            //   {
            //     title: "Referral fee?",
            //     dropValues: ["Yes", "No"],

            //     openDropdown: () =>
            //       setMakePostComment((prev) => {
            //         const arr = [...prev];
            //         arr[index] = {
            //           ...arr[index],
            //           collectibleOpen: !arr[index].collectibleOpen,
            //         };
            //       }),
            //     setValue: (item) =>
            //       setMakePostComment((prev) => {
            //         const arr = [...prev];
            //         arr[index] = {
            //           ...arr[index],
            //           collectType:
            //             item === "Yes" ? arr[index].collectType : undefined,
            //         };
            //       }),
            //   },
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
                                      index === 5
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
                    key={index}
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

import Image from "next/legacy/image";
import { ChangeEvent, FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { PrerollSortProps } from "../types/search.types";
import DropDown from "./DropDown";
import { setMap } from "../../../../redux/reducers/mapSlice";
import { setFilter } from "../../../../redux/reducers/filterSlice";

const PrerollSort: FunctionComponent<PrerollSortProps> = ({
  openDropDown,
  setOpenDropDown,
  filteredDropDownValues,
  setFilteredDropDownValues,
  dispatch,
  filterValues,
  filterConstants,
}): JSX.Element => {
  return (
    <div
      className="relative w-full lg:w-[60rem] h-fit items-center justify-center flex p-px rounded-sm"
      id="preroll"
    >
      <div
        className="bg-offBlack relative flex w-full h-full rounded-sm flex flex-col items-between justify-start py-3 px-4 gap-4 overflow-y-scroll"
        id="prerollScroll"
      >
        <div className="relative w-full h-fit flex flex-row justify-between items-center gap-5">
          <div className="font-bit text-white text-left flex items-center justify-center text-base uppercase break-words h-fit w-3/5">
            Looking for that exact preroll fit?
          </div>
          <div
            className="relative p-px rounded-sm h-6 w-6 flex items-center justify-center"
            id="preroll"
          >
            <div className="relative w-full h-full p-1 bg-offBlack rounded-sm flex items-center justify-center">
              <div className="bg-brill w-full h-full rounded-sm flex"></div>
            </div>
          </div>
        </div>
        <div className="relative w-full h-fit flex flex-wrap justify-center items-center gap-4">
          {[
            ["shirt", "QmVbePRht5te5J9JzGGrnMocPZkSWnqGPEaNMZTSjFoYDr"],
            ["hoodie", "QmRMWKP63xaJQsspfnLL9Fhou484LEb2VbTWFyfYsJ1aep"],
            ["poster", "QmPpDcEHfhMr3z2Romz45P7ETV4hZEXRbcorF9sDsDfxyC"],
            ["sticker", "QmUADJfzGsFgp9n4XUZD66inxTCijJ9fwMXeUkjuKjHVzs"],
          ].map((image: string[], index: number) => {
            return (
              <div
                className="relative w-32 h-20 items-center justify-center flex rounded-sm p-px cursor-pointer"
                key={index}
                id={
                  filterValues.printType.includes(image[0])
                    ? "preroll"
                    : "tiles"
                }
                title={image[0]}
                onClick={() => {
                  dispatch(
                    setFilter({
                      ...filterValues,
                      printType: filterValues.printType.includes(image[0])
                        ? filterValues.printType.filter(
                            (item: string) => item !== image[0]
                          )
                        : [...filterValues.printType, image[0]],
                    })
                  );
                }}
              >
                <div className="relative w-full h-full rounded-sm flex bg-black items-center justify-center">
                  <div className="relative w-2/3 h-full rounded-sm flex">
                    <Image
                      layout="fill"
                      objectFit="cover"
                      className="rounded-sm flex w-2/3 h-full items-center justify-center"
                      src={`${INFURA_GATEWAY}/ipfs/${image[1]}`}
                      draggable={false}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="relative flex flex-col gap-1 w-full h-fit items-start justify-center">
          <div className="relative flex justify-start items-center text-white font-bit uppercase text-sm">
            sizes
          </div>
          <div className="relative w-full h-fit flex flex-col items-start justify-items gap-1">
            <div className="relative w-full h-fit flex flex-row items-center justify-center">
              <div className="flex relative w-full h-fit sm:flex-nowrap flex-wrap flex-row gap-2 items-center justify-start">
                {filterConstants?.sizes?.apparel?.map(
                  (size: string, index: number) => {
                    return (
                      <div
                        key={index}
                        className="relative w-7 h-6 flex items-center justify-center p-px font-bit text-white text-xs cursor-pointer"
                        id={
                          filterValues.size.apparel.includes(size)
                            ? "preroll"
                            : "tiles"
                        }
                      >
                        <div
                          className="relative bg-offBlack w-full h-full flex items-center justify-center text-center"
                          onClick={() => {
                            dispatch(
                              setFilter({
                                ...filterValues,
                                size: {
                                  ...filterValues.size,
                                  apparel: filterValues.size.apparel.includes(
                                    size
                                  )
                                    ? filterValues.size.apparel.filter(
                                        (item: string) => item !== size
                                      )
                                    : [...filterValues.size.apparel, size],
                                },
                              })
                            );
                          }}
                        >
                          {size}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
              <div
                className={`relative flex items-center justify-center cursor-pointer w-4 h-3 ${
                  openDropDown.size && "rotate-90"
                }`}
                onClick={() =>
                  setOpenDropDown({
                    ...openDropDown,
                    size: !openDropDown.size,
                  })
                }
              >
                <Image
                  layout="fill"
                  draggable={false}
                  src={`${INFURA_GATEWAY}/ipfs/QmRKmMYJj7KAwf4BDGwrd51tKWoS8djnLGWT5XNdrJMztk`}
                />
              </div>
            </div>
            {openDropDown.size && (
              <>
                <div className="flex relative w-full h-fit flex-row gap-2 items-center justify-start sm:flex-nowrap flex-wrap">
                  {filterConstants?.sizes?.poster?.map(
                    (size: string, index: number) => {
                      return (
                        <div
                          key={index}
                          className="relative w-fit h-fit flex items-center justify-center p-px font-bit text-white text-xs cursor-pointer"
                          id={
                            filterValues.size.poster.includes(size)
                              ? "preroll"
                              : "tiles"
                          }
                          onClick={() => {
                            dispatch(
                              setFilter({
                                ...filterValues,
                                size: {
                                  ...filterValues.size,
                                  poster: filterValues.size.poster.includes(
                                    size
                                  )
                                    ? filterValues.size.poster.filter(
                                        (item: string) => item !== size
                                      )
                                    : [...filterValues.size.poster, size],
                                },
                              })
                            );
                          }}
                        >
                          <div className="relative bg-offBlack w-full h-full flex items-center justify-center text-center p-1">
                            {size?.match(/^[^\(]+/)?.[0]}
                            <br />
                            {size?.match(/\(([^)]+)\)/)?.[1]}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
                <div className="flex relative w-full h-fit flex-row gap-2 items-center justify-start sm:flex-nowrap flex-wrap">
                  {filterConstants?.sizes?.sticker?.map(
                    (size: string, index: number) => {
                      return (
                        <div
                          key={index}
                          className="relative w-fit h-fit flex items-center justify-center p-px font-bit text-white text-xs cursor-pointer"
                          id={
                            filterValues.size.sticker.includes(size)
                              ? "preroll"
                              : "tiles"
                          }
                          onClick={() => {
                            dispatch(
                              setFilter({
                                ...filterValues,
                                size: {
                                  ...filterValues.size,
                                  sticker: filterValues.size.sticker.includes(
                                    size
                                  )
                                    ? filterValues.size.sticker.filter(
                                        (item: string) => item !== size
                                      )
                                    : [...filterValues.size.sticker, size],
                                },
                              })
                            );
                          }}
                        >
                          <div className="relative bg-offBlack w-full h-full flex items-center justify-center text-center p-1">
                            {size?.match(/^[^\(]+/)?.[0]}
                            <br />
                            {size?.match(/\(([^)]+)\)/)?.[1]}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="relative flex flex-col gap-1 w-full h-fit items-start justify-center">
          <div className="relative flex justify-start items-center text-white font-bit uppercase text-sm">
            base colors
          </div>
          <div className="relative flex flex-row gap-2 items-center justify-start sm:flex-nowrap flex-wrap">
            {filterConstants?.colors?.map((color: string, index: number) => {
              return (
                <div
                  key={index}
                  className="rounded-full w-6 h-6 flex p-px cursor-pointer"
                  id={filterValues.color.includes(color) ? "preroll" : "tiles"}
                  onClick={() => {
                    dispatch(
                      setFilter({
                        ...filterValues,
                        color: filterValues.color.includes(color)
                          ? filterValues.color.filter(
                              (item: string) => item !== color
                            )
                          : [...filterValues.color, color],
                      })
                    );
                  }}
                >
                  <div
                    className="relative rounded-full w-full h-full flex"
                    style={{
                      backgroundColor: color,
                    }}
                  ></div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="relative flex flex-row gap-3 w-full h-fit items-center justify-start sm:flex-nowrap flex-wrap">
          <div className="relative flex flex-col items-center justify-center">
            <div className="relative flex justify-start items-center text-white font-bit uppercase text-sm">
              price range
            </div>
            <div className="relative w-fit h-fit flex flex-row gap-1 items-center justify-center">
              <div
                className="relative w-full h-8 p-px rounded-sm flex flex-row items-center justify-center font-bit text-sol text-center"
                id="borderSearch"
              >
                <input
                  className="relative w-full h-full p-1.5 bg-offBlack flex items-center justify-center text-sm"
                  type="number"
                  placeholder={String(filterValues.price.min)}
                  onChange={(e) => {
                    dispatch(
                      setFilter({
                        ...filterValues,
                        price: {
                          ...filterValues.price,
                          min: Number(e.target.value),
                        },
                      })
                    );
                  }}
                  value={filterValues.price.min}
                />
              </div>
              <div className="relative w-fit h-fit flex items-center justify-center font-bit text-white text-sm uppercase">
                to
              </div>
              <div
                className="relative w-full h-8 p-px rounded-sm flex flex-row items-center justify-center font-bit text-sol text-center"
                id="borderSearch"
              >
                <input
                  className="relative w-full h-full p-1.5 bg-offBlack flex items-center justify-center text-sm"
                  type="number"
                  placeholder={String(filterValues.price.max)}
                  onChange={(e) => {
                    dispatch(
                      setFilter({
                        ...filterValues,
                        price: {
                          ...filterValues.price,
                          max: Number(e.target.value),
                        },
                      })
                    );
                  }}
                  value={filterValues.price.max}
                />
              </div>
            </div>
          </div>
          <DropDown
            dropDownValues={filteredDropDownValues?.token}
            title={"Token"}
            value={filterValues?.token}
            onChange={(e: ChangeEvent) => {
              setFilteredDropDownValues({
                ...filteredDropDownValues,
                token: filterConstants!.token.filter((value) =>
                  value
                    .toLowerCase()
                    .includes(
                      (e.target as HTMLInputElement).value
                        .split(",")
                        [
                          (e.target as HTMLInputElement).value.split(",")
                            .length - 1
                        ].trim()
                        .toLowerCase()
                    )
                ),
              });

              dispatch(
                setFilter({
                  ...filterValues,
                  token: (e.target as HTMLInputElement).value.toLowerCase(),
                })
              );

              if (!openDropDown.token) {
                setOpenDropDown({
                  ...openDropDown,
                  token: true,
                });
              }
            }}
            openDropDown={openDropDown.token}
            setOpenDropDown={() => {
              setOpenDropDown({
                ...openDropDown,
                token: !openDropDown.token,
              });
            }}
            onDropDownChoose={(value: string) => {
              if (!filterValues.token.includes(value)) {
                const allValues = filterValues.token.split(",");
                const isPartialEntry =
                  allValues[allValues.length - 1].trim() !== "";

                let newValues: string;

                if (isPartialEntry) {
                  allValues[allValues.length - 1] = ` ${value},`;
                  newValues = allValues.join(", ").trim();
                } else {
                  newValues = filterValues.token + ` ${value},`;
                }

                dispatch(
                  setFilter({
                    ...filterValues,
                    token: newValues,
                  })
                );
              }
            }}
          />
        </div>
        <div className="relative flex gap-2 w-full h-fit items-center justify-center">
          <div
            className="relative w-full h-12 p-px rounded-sm flex flex-row items-center justify-center"
            id="borderSearch"
          >
            <input
              className={`relative w-full h-full p-1.5 bg-offBlack flex items-center rounded-sm text-white font-bit justify-center uppercase text-sm`}
              id="searchBar"
              placeholder={"find by drop name"}
              value={filterValues.drop}
              onChange={(e) =>
                dispatch(
                  setFilter({
                    ...filterValues,
                    drop: (e.target as HTMLInputElement).value.toLowerCase(),
                  })
                )
              }
            />
          </div>
        </div>
        <div className="relative flex flex-row gap-5 w-full h-fit items-center justify-center">
          <DropDown
            dropDownValues={filteredDropDownValues?.fulfiller}
            title={"Find by Local Fulfiller"}
            value={filterValues?.fulfiller}
            onChange={(e: ChangeEvent) => {
              setFilteredDropDownValues({
                ...filteredDropDownValues,
                fulfiller: filterConstants!.fulfiller.filter((value) =>
                  value
                    .toLowerCase()
                    .includes(
                      (e.target as HTMLInputElement).value
                        .split(",")
                        [
                          (e.target as HTMLInputElement).value.split(",")
                            .length - 1
                        ].trim()
                        .toLowerCase()
                    )
                ),
              });

              dispatch(
                setFilter({
                  ...filterValues,
                  fulfiller: (e.target as HTMLInputElement).value.toLowerCase(),
                })
              );

              if (!openDropDown.fulfiller) {
                setOpenDropDown({
                  ...openDropDown,
                  fulfiller: true,
                });
              }
            }}
            openDropDown={openDropDown.fulfiller}
            setOpenDropDown={() => {
              setOpenDropDown({
                ...openDropDown,
                fulfiller: !openDropDown.fulfiller,
              });
            }}
            onDropDownChoose={(value: string) => {
              if (!filterValues.fulfiller.includes(value)) {
                const allValues = filterValues.fulfiller.split(",");
                const isPartialEntry =
                  allValues[allValues.length - 1].trim() !== "";

                let newValues: string;

                if (isPartialEntry) {
                  allValues[allValues.length - 1] = ` ${value},`;
                  newValues = allValues.join(", ").trim();
                } else {
                  newValues = filterValues.fulfiller + ` ${value},`;
                }

                dispatch(
                  setFilter({
                    ...filterValues,
                    fulfiller: newValues,
                  })
                );
              }
            }}
          />
          <div
            className="relative flex w-10 h-6 cursor-pointer items-center justify-center"
            onClick={() => dispatch(setMap(true))}
          >
            <Image
              layout="fill"
              src={`${INFURA_GATEWAY}/ipfs/QmeVXGLFHVhLHKFy5HzAuqF62cCyF9SniY3hPYLHLfBtGW`}
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrerollSort;

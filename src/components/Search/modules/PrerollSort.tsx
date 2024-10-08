import Image from "next/legacy/image";
import { ChangeEvent, FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { PrerollSortProps } from "../types/search.types";
import DropDown from "./DropDown";
import { setMap } from "../../../../redux/reducers/mapSlice";
import { setFilter } from "../../../../redux/reducers/filterSlice";
import handleImageError from "../../../../lib/helpers/handleImageError";
import { setFilterChange } from "../../../../redux/reducers/filterChangeSlice";

const PrerollSort: FunctionComponent<PrerollSortProps> = ({
  openDropDown,
  setOpenDropDown,
  filteredDropDownValues,
  setFilteredDropDownValues,
  dispatch,
  filterValues,
  filterConstants,
  t,
  locale
}): JSX.Element => {
  return (
    <div
      className="relative order-2 lg:order-3 w-full lg:w-[60rem] h-fit items-center justify-center flex p-px rounded-sm"
      id="preroll"
    >
      <div
        className="bg-offBlack relative flex w-full h-full rounded-sm flex flex-col items-between justify-start py-3 px-4 gap-4 overflow-y-auto galaxy:overflow-y-none"
        id="prerollScroll"
      >
        <div className="relative w-full h-fit flex flex-row justify-between items-center gap-5">
          <div className="font-bit text-white text-left flex items-center justify-center text-base uppercase break-words h-fit w-3/5">
            {t("look")}
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
            {
              title: { en: "shirt", es: "" },
              image: "QmVbePRht5te5J9JzGGrnMocPZkSWnqGPEaNMZTSjFoYDr",
            },
            {
              title: { en: "hoodie", es: "sudadera" },
              image: "QmRMWKP63xaJQsspfnLL9Fhou484LEb2VbTWFyfYsJ1aep",
            },
            {
              title: { en: "poster", es: "cartel" },
              image: "QmPpDcEHfhMr3z2Romz45P7ETV4hZEXRbcorF9sDsDfxyC",
            },
            {
              title: { en: "sticker", es: "pegatina" },
              image: "QmUADJfzGsFgp9n4XUZD66inxTCijJ9fwMXeUkjuKjHVzs",
            },
            {
              title: { en: "sleeve", es: "mangas largas" },
              image: "QmUNhw5w6JzS9PZH9Wgb9f3k9NNsA8yJVXXoBA1NkduypL",
            },
            {
              title: { en: "crop", es: "corto" },
              image: "QmYctXVUMpgeeqzUgPUhrMaHGEToRqGQxvr9mbBMdRcCib",
            },
          ].map(
            (
              image: {
                image: string;
                title: {
                  en: string;
                  es: string;
                };
              },
              index: number
            ) => {
              return (
                <div
                  className="relative w-32 h-20 items-center justify-center flex rounded-sm p-px cursor-pointer"
                  key={index}
                  id={
                    filterValues.printType.includes(image.title.en)
                      ? "preroll"
                      : "tiles"
                  }
                  title={image.title?.[locale as "en" | "es"]}
                  onClick={() => {
                    if (
                      filterValues?.printType !==
                      (filterValues.printType.includes(image.title.en)
                        ? filterValues.printType.filter(
                            (item: string) => item !== image.title.en
                          )
                        : [...filterValues.printType, image.title.en])
                    ) {
                      dispatch(setFilterChange(true));
                    }

                    dispatch(
                      setFilter({
                        ...filterValues,
                        printType: filterValues.printType.includes(
                          image.title.en
                        )
                          ? filterValues.printType.filter(
                              (item: string) => item !== image.title.en
                            )
                          : [...filterValues.printType, image.title.en],
                      })
                    );
                  }}
                >
                  <div className="relative w-full h-full rounded-sm flex bg-black items-center justify-center">
                    <div className="relative w-2/3 h-full rounded-sm flex">
                      <Image
                        layout="fill"
                        objectFit="cover"
                        priority
                        className="rounded-sm flex w-2/3 h-full items-center justify-center"
                        src={`${INFURA_GATEWAY}/ipfs/${image.image}`}
                        draggable={false}
                        onError={(e) => handleImageError(e)}
                      />
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
        <div className="relative flex flex-col gap-1 w-full h-fit items-start justify-center">
          <div className="relative flex justify-start items-center text-white font-bit uppercase text-sm">
            {t("sizs")}
          </div>
          <div className="relative w-full h-fit flex flex-col items-start justify-items gap-1">
            <div className="relative w-full h-fit flex flex-row items-center justify-center">
              <div className="flex relative w-full h-fit sm:flex-nowrap flex-wrap flex-row gap-2 items-center justify-start">
                {filterConstants?.sizes?.apparel &&
                  filterConstants?.sizes?.apparel?.length > 0 &&
                  filterConstants?.sizes?.apparel?.map(
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
                              if (
                                filterValues?.size?.apparel !==
                                (filterValues.size.apparel.includes(size)
                                  ? filterValues.size.apparel.filter(
                                      (item: string) => item !== size
                                    )
                                  : [...filterValues.size.apparel, size])
                              ) {
                                dispatch(setFilterChange(true));
                              }

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
                  priority
                  src={`${INFURA_GATEWAY}/ipfs/QmRKmMYJj7KAwf4BDGwrd51tKWoS8djnLGWT5XNdrJMztk`}
                />
              </div>
            </div>
            {openDropDown.size && (
              <>
                <div className="flex relative w-full h-fit flex-row gap-2 items-center justify-start sm:flex-nowrap flex-wrap">
                  {filterConstants?.sizes?.poster &&
                    filterConstants?.sizes?.poster?.length > 0 &&
                    filterConstants?.sizes?.poster?.map(
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
                              if (
                                filterValues?.size?.poster !==
                                (filterValues.size.poster.includes(size)
                                  ? filterValues.size.poster.filter(
                                      (item: string) => item !== size
                                    )
                                  : [...filterValues.size.poster, size])
                              ) {
                                dispatch(setFilterChange(true));
                              }

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
                  {filterConstants?.sizes?.sticker &&
                    filterConstants?.sizes?.sticker?.length > 0 &&
                    filterConstants?.sizes?.sticker?.map(
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
                              if (
                                filterValues?.size?.sticker !==
                                (filterValues.size.sticker.includes(size)
                                  ? filterValues.size.sticker.filter(
                                      (item: string) => item !== size
                                    )
                                  : [...filterValues.size.sticker, size])
                              ) {
                                dispatch(setFilterChange(true));
                              }

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
            {t("cols")}
          </div>
          <div className="relative flex flex-row gap-2 items-center justify-start sm:flex-nowrap flex-wrap">
            {filterConstants?.colors &&
              filterConstants?.colors?.length > 0 &&
              filterConstants?.colors?.map((color: string, index: number) => {
                return (
                  <div
                    key={index}
                    className="rounded-full w-6 h-6 flex p-px cursor-pointer"
                    id={
                      filterValues.color.includes(color) ? "preroll" : "tiles"
                    }
                    onClick={() => {
                      if (
                        filterValues?.color !==
                        (filterValues.color.includes(color)
                          ? filterValues.color.filter(
                              (item: string) => item !== color
                            )
                          : [...filterValues.color, color])
                      ) {
                        dispatch(setFilterChange(true));
                      }

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
              {t("rang")}
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
                    if (
                      Number(filterValues?.price?.min) !==
                      Number(e.target.value)
                    ) {
                      dispatch(setFilterChange(true));
                    }

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
                {t("to")}
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
                    if (
                      Number(filterValues?.price?.max) !==
                      Number(e.target.value)
                    ) {
                      dispatch(setFilterChange(true));
                    }

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
            title={t("tok")}
            value={filterValues?.token}
            onChange={(e: ChangeEvent) => {
              if (
                filterValues?.token !==
                (e.target as HTMLInputElement).value.toLowerCase()
              ) {
                dispatch(setFilterChange(true));
              }

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
                        ]?.trim()
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
                  allValues[allValues.length - 1]?.trim() !== "";

                let newValues: string;

                if (isPartialEntry) {
                  allValues[allValues.length - 1] = ` ${value},`;
                  newValues = allValues.join(", ")?.trim();
                } else {
                  newValues = filterValues.token + ` ${value},`;
                }

                if (filterValues?.token !== newValues) {
                  dispatch(setFilterChange(true));
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
              placeholder={t("dropN")}
              value={filterValues.drop}
              onChange={(e) => {
                if (
                  filterValues?.drop !==
                  (e.target as HTMLInputElement).value.toLowerCase()
                ) {
                  dispatch(setFilterChange(true));
                }

                dispatch(
                  setFilter({
                    ...filterValues,
                    drop: (e.target as HTMLInputElement).value.toLowerCase(),
                  })
                );
              }}
            />
          </div>
        </div>
        <div className="relative flex flex-row gap-5 w-full h-fit items-center justify-center">
          <DropDown
            dropDownValues={filteredDropDownValues?.fulfiller}
            title={t("fulL")}
            value={filterValues?.fulfiller}
            onChange={(e: ChangeEvent) => {
              if (
                filterValues?.fulfiller !==
                (e.target as HTMLInputElement).value.toLowerCase()
              ) {
                dispatch(setFilterChange(true));
              }

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
                        ]?.trim()
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
                  allValues[allValues.length - 1]?.trim() !== "";

                let newValues: string;

                if (isPartialEntry) {
                  allValues[allValues.length - 1] = ` ${value},`;
                  newValues = allValues.join(", ")?.trim();
                } else {
                  newValues = filterValues.fulfiller + ` ${value},`;
                }

                if (filterValues?.fulfiller !== newValues) {
                  dispatch(setFilterChange(true));
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
              priority
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

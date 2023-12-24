import Image from "next/legacy/image";
import DropDown from "./DropDown";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { ChangeEvent, FunctionComponent } from "react";
import { ContentSortProps } from "../types/search.types";
import { setFilter } from "../../../../redux/reducers/filterSlice";
import ImageDropDown from "./ImageDropDown";
import { setFilterChange } from "../../../../redux/reducers/filterChangeSlice";

const ContentSort: FunctionComponent<ContentSortProps> = ({
  openDropDown,
  setOpenDropDown,
  setFilteredDropDownValues,
  filteredDropDownValues,
  dispatch,
  filterValues,
  handleResetFilters,
  filterConstants,
}): JSX.Element => {
  return (
    <div className="order-1 lg:order-2 relative w-full h-fit items-start justify-center flex flex-col gap-5">
      <div className="relative w-full h-fit justify-between gap-3 flex items-center flex-row sm:flex-nowrap flex-wrap">
        <div className="font-bit text-white text-left flex items-center justify-center text-sm uppercase break-words h-fit w-fit">
          Find what you’re really looking for, with filters for everything you
          can imagine:
        </div>
        <div
          className="relative w-12 h-9 cursor-pointer flex items-center justify-center active:scale-95"
          onClick={() => handleResetFilters()}
          title="reset filters"
        >
          <Image
            layout="fill"
            src={`${INFURA_GATEWAY}/ipfs/QmSqbSXEPerv869YdJAyY7sgE47qC4Btx8FbAeTMLArMqF`}
            draggable={false}
            priority
          />
        </div>
      </div>
      <DropDown
        dropDownValues={filteredDropDownValues?.hashtags}
        hashtag
        title={"Sort By Hashtag"}
        value={filterValues?.hashtag}
        onChange={(e: ChangeEvent) => {
          setFilteredDropDownValues({
            ...filteredDropDownValues,
            hashtags: filterConstants!.hashtags?.filter((value) =>
              value
                .toLowerCase()
                ?.includes(
                  (e.target as HTMLInputElement).value
                    .split(",")
                    [
                      (e.target as HTMLInputElement).value.split(",").length - 1
                    ]?.trim()
                    .toLowerCase()
                )
            ),
          });

          if (
            filterValues?.hashtag !=
            (e.target as HTMLInputElement).value.toLowerCase()
          ) {
            dispatch(setFilterChange(true));
          }

          dispatch(
            setFilter({
              ...filterValues,
              hashtag: (e.target as HTMLInputElement).value.toLowerCase(),
            })
          );

          if (!openDropDown?.hashtag) {
            setOpenDropDown({
              ...openDropDown,
              hashtag: true,
            });
          }
        }}
        openDropDown={openDropDown?.hashtag}
        setOpenDropDown={() => {
          setOpenDropDown({
            ...openDropDown,
            hashtag: !openDropDown?.hashtag,
          });
        }}
        onDropDownChoose={(value: string) => {
          if (!filterValues.hashtag.includes(value)) {
            const allValues = filterValues.hashtag.split(",");
            const isPartialEntry =
              allValues[allValues.length - 1]?.trim() !== "";

            let newValues: string;

            if (isPartialEntry) {
              allValues[allValues.length - 1] = ` ${value},`;
              newValues = allValues.join(", ")?.trim();
            } else {
              newValues = filterValues.hashtag + ` ${value},`;
            }

            if (filterValues?.hashtag != newValues) {
              dispatch(setFilterChange(true));
            }

            dispatch(
              setFilter({
                ...filterValues,
                hashtag: newValues,
              })
            );
          }
        }}
      />
      <ImageDropDown
        dropDownValues={filteredDropDownValues?.community}
        title={"Sort By Community"}
        value={filterValues?.community}
        onChange={(e: ChangeEvent) => {
          setFilteredDropDownValues({
            ...filteredDropDownValues,
            community: filterConstants!.community?.filter((value) =>
              value[0]
                .toLowerCase()
                ?.includes(
                  (e.target as HTMLInputElement).value
                    .split(",")
                    [
                      (e.target as HTMLInputElement).value.split(",").length - 1
                    ]?.trim()
                    .toLowerCase()
                )
            ),
          });

          if (
            filterValues?.community !=
            (e.target as HTMLInputElement).value.toLowerCase()
          ) {
            dispatch(setFilterChange(true));
          }

          dispatch(
            setFilter({
              ...filterValues,
              community: (e.target as HTMLInputElement).value.toLowerCase(),
            })
          );

          if (!openDropDown?.community) {
            setOpenDropDown({
              ...openDropDown,
              community: true,
            });
          }
        }}
        openDropDown={openDropDown?.community}
        setOpenDropDown={() => {
          setOpenDropDown({
            ...openDropDown,
            community: !openDropDown?.community,
          });
        }}
        onDropDownChoose={(value: string) => {
          if (!filterValues?.community.includes(value)) {
            const allValues = filterValues?.community.split(",");
            const isPartialEntry =
              allValues[allValues?.length - 1]?.trim() !== "";

            let newValues: string;

            if (isPartialEntry) {
              allValues[allValues.length - 1] = ` ${value},`;
              newValues = allValues.join(", ")?.trim();
            } else {
              newValues = filterValues.community + ` ${value},`;
            }

            if (filterValues?.community != newValues) {
              dispatch(setFilterChange(true));
            }

            dispatch(
              setFilter({
                ...filterValues,
                community: newValues,
              })
            );
          }
        }}
      />
      <ImageDropDown
        dropDownValues={filteredDropDownValues?.microbrands}
        title={"Sort By Microbrand"}
        value={filterValues?.microbrand}
        onChange={(e: ChangeEvent) => {
          setFilteredDropDownValues({
            ...filteredDropDownValues,
            microbrands: filterConstants!.microbrands.filter((value) =>
              value[0]
                .toLowerCase()
                ?.includes(
                  (e.target as HTMLInputElement).value
                    .split(",")
                    [
                      (e.target as HTMLInputElement).value.split(",").length - 1
                    ].trim()
                    .toLowerCase()
                )
            ),
          });

          if (
            filterValues?.microbrand !=
            (e.target as HTMLInputElement).value.toLowerCase()
          ) {
            dispatch(setFilterChange(true));
          }

          dispatch(
            setFilter({
              ...filterValues,
              microbrand: (e.target as HTMLInputElement).value.toLowerCase(),
            })
          );

          if (!openDropDown?.microbrand) {
            setOpenDropDown({
              ...openDropDown,
              microbrand: true,
            });
          }
        }}
        openDropDown={openDropDown?.microbrand}
        setOpenDropDown={() => {
          setOpenDropDown({
            ...openDropDown,
            microbrand: !openDropDown?.microbrand,
          });
        }}
        onDropDownChoose={(value: string) => {
          if (!filterValues?.microbrand?.includes(value)) {
            const allValues = filterValues?.microbrand?.split(",");
            const isPartialEntry =
              allValues[allValues?.length - 1]?.trim() !== "";

            let newValues: string;

            if (isPartialEntry) {
              allValues[allValues?.length - 1] = ` ${value},`;
              newValues = allValues?.join(", ")?.trim();
            } else {
              newValues = filterValues?.microbrand + ` ${value},`;
            }

            if (filterValues?.microbrand != newValues) {
              dispatch(setFilterChange(true));
            }

            dispatch(
              setFilter({
                ...filterValues,
                microbrand: newValues,
              })
            );
          }
        }}
      />
      <div className="relative w-fit h-fit flex flex-row items-center justify-center gap-2">
        {Array.from({ length: 3 }).map((_, index: number) => {
          return (
            <div className="relative w-4 h-7 flex" key={index}>
              <Image
                src={`${INFURA_GATEWAY}/ipfs/QmUFprxSMc6pQTbXkV5eZtwC4v2ksTzRkGZ19Yk9i244gY`}
                layout="fill"
                draggable={false}
                priority
              />
            </div>
          );
        })}
      </div>
      <div className="relative w-full h-fit flex flex-wrap sm:flex-nowrap flex-row gap-4 items-center justify-center">
        <div className="relative w-fit h-fit flex flex-row gap-4 items-center justify-center">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmRpjossq3S23jYRHUSobGk2jeCeexcPgzeJpc3NE1ZPRf`}
              layout="fill"
              draggable={false}
              priority
            />
          </div>
          <div className="relative w-10 h-10 flex items-center justify-center">
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmUX8vJWZ2aJc3qCGKUwptgX9Ve9UYpQKgddk4oPAaXPdq`}
              layout="fill"
              draggable={false}
              priority
            />
          </div>
        </div>
        <ImageDropDown
          dropDownValues={filteredDropDownValues?.origin}
          reverse
          title={"Sort By Origin"}
          cover
          rounded
          value={filterValues?.origin}
          onChange={(e: ChangeEvent) => {
            setFilteredDropDownValues({
              ...filteredDropDownValues,
              origin: filterConstants!.origin?.filter((value) =>
                value[0]
                  .toLowerCase()
                  ?.includes(
                    (e.target as HTMLInputElement).value
                      .split(",")
                      [
                        (e.target as HTMLInputElement).value.split(",").length -
                          1
                      ]?.trim()
                      .toLowerCase()
                  )
              ),
            });

            if (
              filterValues?.origin !=
              (e.target as HTMLInputElement).value.toLowerCase()
            ) {
              dispatch(setFilterChange(true));
            }

            dispatch(
              setFilter({
                ...filterValues,
                origin: (e.target as HTMLInputElement).value.toLowerCase(),
              })
            );

            if (!openDropDown?.origin) {
              setOpenDropDown({
                ...openDropDown,
                origin: true,
              });
            }
          }}
          openDropDown={openDropDown?.origin}
          setOpenDropDown={() => {
            setOpenDropDown({
              ...openDropDown,
              origin: !openDropDown?.origin,
            });
          }}
          onDropDownChoose={(value: string) => {
            if (!filterValues?.origin?.includes(value)) {
              const allValues = filterValues?.origin?.split(",");
              const isPartialEntry =
                allValues[allValues?.length - 1]?.trim() !== "";

              let newValues: string;

              if (isPartialEntry) {
                allValues[allValues?.length - 1] = ` ${value},`;
                newValues = allValues?.join(", ")?.trim();
              } else {
                newValues = filterValues?.origin + ` ${value},`;
              }

              if (filterValues?.origin != newValues) {
                dispatch(setFilterChange(true));
              }

              dispatch(
                setFilter({
                  ...filterValues,
                  origin: newValues,
                })
              );
            }
          }}
        />
      </div>
      <DropDown
        dropDownValues={filteredDropDownValues?.format}
        title={"Sort By Media Format"}
        value={filterValues?.format}
        onChange={(e: ChangeEvent) => {
          setFilteredDropDownValues({
            ...filteredDropDownValues,
            format: filterConstants!.format?.filter((value) =>
              value
                .toLowerCase()
                ?.includes(
                  (e.target as HTMLInputElement).value
                    .split(",")
                    [
                      (e.target as HTMLInputElement).value.split(",").length - 1
                    ]?.trim()
                    .toLowerCase()
                )
            ),
          });

          if (
            filterValues?.format !=
            (e.target as HTMLInputElement).value.toLowerCase()
          ) {
            dispatch(setFilterChange(true));
          }

          dispatch(
            setFilter({
              ...filterValues,
              format: (e.target as HTMLInputElement).value.toLowerCase(),
            })
          );

          if (!openDropDown?.format) {
            setOpenDropDown({
              ...openDropDown,
              format: true,
            });
          }
        }}
        openDropDown={openDropDown?.format}
        setOpenDropDown={() => {
          setOpenDropDown({
            ...openDropDown,
            format: !openDropDown?.format,
          });
        }}
        onDropDownChoose={(value: string) => {
          if (!filterValues?.format?.includes(value)) {
            const allValues = filterValues?.format.split(",");
            const isPartialEntry =
              allValues[allValues?.length - 1]?.trim() !== "";

            let newValues: string;

            if (isPartialEntry) {
              allValues[allValues?.length - 1] = ` ${value},`;
              newValues = allValues?.join(", ")?.trim();
            } else {
              newValues = filterValues?.format + ` ${value},`;
            }

            if (filterValues?.format != newValues) {
              dispatch(setFilterChange(true));
            }

            dispatch(
              setFilter({
                ...filterValues,
                format: newValues,
              })
            );
          }
        }}
      />
      <DropDown
        dropDownValues={filteredDropDownValues?.catalog}
        title={"Sort By Catalog"}
        value={filterValues?.catalog}
        onChange={(e: ChangeEvent) => {
          setFilteredDropDownValues({
            ...filteredDropDownValues,
            catalog: filterConstants!.catalog.filter((value) =>
              value
                .toLowerCase()
                ?.includes(
                  (e.target as HTMLInputElement).value
                    .split(",")
                    [
                      (e.target as HTMLInputElement).value.split(",").length - 1
                    ]?.trim()
                    .toLowerCase()
                )
            ),
          });

          if (
            filterValues?.catalog !=
            (e.target as HTMLInputElement).value.toLowerCase()
          ) {
            dispatch(setFilterChange(true));
          }

          dispatch(
            setFilter({
              ...filterValues,
              catalog: (e.target as HTMLInputElement).value.toLowerCase(),
            })
          );

          if (!openDropDown?.catalog) {
            setOpenDropDown({
              ...openDropDown,
              catalog: true,
            });
          }
        }}
        openDropDown={openDropDown?.catalog}
        setOpenDropDown={() => {
          setOpenDropDown({
            ...openDropDown,
            catalog: !openDropDown?.catalog,
          });
        }}
        onDropDownChoose={(value: string) => {
          if (!filterValues?.catalog?.includes(value)) {
            const allValues = filterValues?.catalog?.split(",");
            const isPartialEntry =
              allValues[allValues?.length - 1]?.trim() !== "";

            let newValues: string;

            if (isPartialEntry) {
              allValues[allValues?.length - 1] = ` ${value},`;
              newValues = allValues?.join(", ")?.trim();
            } else {
              newValues = filterValues?.catalog + ` ${value},`;
            }

            if (filterValues?.catalog != newValues) {
              dispatch(setFilterChange(true));
            }

            dispatch(
              setFilter({
                ...filterValues,
                catalog: newValues,
              })
            );
          }
        }}
      />
      <ImageDropDown
        dropDownValues={filteredDropDownValues?.access}
        title={"Sort By Access Eco Scale"}
        value={filterValues?.access}
        onChange={(e: ChangeEvent) => {
          setFilteredDropDownValues({
            ...filteredDropDownValues,
            microbrands: filterConstants!.access.filter((value) =>
              value[0]
                .toLowerCase()
                ?.includes(
                  (e.target as HTMLInputElement).value
                    .split(",")
                    [
                      (e.target as HTMLInputElement).value.split(",").length - 1
                    ]?.trim()
                    .toLowerCase()
                )
            ),
          });

          if (
            filterValues?.access !=
            (e.target as HTMLInputElement).value.toLowerCase()
          ) {
            dispatch(setFilterChange(true));
          }

          dispatch(
            setFilter({
              ...filterValues,
              access: (e.target as HTMLInputElement).value.toLowerCase(),
            })
          );

          if (!openDropDown?.access) {
            setOpenDropDown({
              ...openDropDown,
              access: true,
            });
          }
        }}
        openDropDown={openDropDown?.access}
        setOpenDropDown={() => {
          setOpenDropDown({
            ...openDropDown,
            access: !openDropDown?.access,
          });
        }}
        onDropDownChoose={(value: string) => {
          if (!filterValues?.access?.includes(value)) {
            const allValues = filterValues?.access?.split(",");
            const isPartialEntry =
              allValues[allValues?.length - 1]?.trim() !== "";

            let newValues: string;

            if (isPartialEntry) {
              allValues[allValues?.length - 1] = ` ${value},`;
              newValues = allValues?.join(", ")?.trim();
            } else {
              newValues = filterValues?.access + ` ${value},`;
            }

            if (filterValues?.access != newValues) {
              dispatch(setFilterChange(true));
            }

            dispatch(
              setFilter({
                ...filterValues,
                access: newValues,
              })
            );
          }
        }}
      />
      <div className="relative w-full h-fit flex sm:flex-nowrap flex-wrap flex-row items-center justify-center gap-6">
        <div
          className="relative w-full h-10 p-px rounded-sm flex flex-row items-center justify-center font-bit text-sol text-center"
          id="borderSearch"
        >
          <div className="relative bg-offBlack flex flex-row w-full h-full justify-start items-center rounded-sm p-2 gap-2">
            <input
              className="relative w-full h-full p-1.5 bg-offBlack flex items-center justify-center"
              type="number"
              placeholder={String(filterValues.editions)}
              onChange={(e) => {
                if (filterValues?.editions != Number(e.target.value)) {
                  dispatch(setFilterChange(true));
                }
                dispatch(
                  setFilter({
                    ...filterValues,
                    editions: Number(e.target.value),
                  })
                );
              }}
              value={filterValues?.editions}
            />
            <div className="relative w-full h-full p-1.5 bg-offBlack flex items-center justify-center text-sm uppercase">
              editions
            </div>
          </div>
        </div>
        <div className="relative w-fit h-fit items-center justify-center flex flex-col">
          <div className="relative w-full h-full p-1.5 bg-offBlack flex items-center justify-center font-bit text-sol text-xs text-center uppercase">
            available?
          </div>
          <div
            id="borderSearch"
            className="relative w-fit h-fit flex items-center justify-center p-px"
          >
            <div className="relative bg-offBlack flex flex-row w-full h-full justify-center items-center rounded-sm p-1 gap-2 text-sm font-bit text-center">
              <div
                className={`relative w-10 px-1 h-fit items-center justify-center flex cursor-pointer ${
                  filterValues.available ? "bg-brill text-black" : "text-white"
                }`}
                onClick={() => {
                  if (filterValues?.available != true) {
                    dispatch(setFilterChange(true));
                  }
                  dispatch(
                    setFilter({
                      ...filterValues,
                      available: true,
                    })
                  );
                }}
              >
                yes
              </div>
              <div
                className={`relative w-10 px-1 h-fit items-center justify-center flex cursor-pointer ${
                  !filterValues.available ? "bg-brill text-black" : "text-white"
                }`}
                onClick={() => {
                  if (filterValues?.available != false) {
                    dispatch(setFilterChange(true));
                  }
                  dispatch(
                    setFilter({
                      ...filterValues,
                      available: false,
                    })
                  );
                }}
              >
                no
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentSort;

import { INFURA_GATEWAY_INTERNAL } from "@/app/lib/constants";
import handleImageError from "@/app/lib/helpers/handleImageError";
import { ModalContext } from "@/app/providers";
import Image from "next/legacy/image";
import { usePathname } from "next/navigation";
import { ChangeEvent, FunctionComponent, JSX, useContext } from "react";
import DropDown from "./DropDown";
import { getLocaleFromPath } from "@/app/lib/helpers/getLocalPath";

const PrerollSort: FunctionComponent<{ dict: any }> = ({
  dict,
}): JSX.Element => {
  const path = usePathname();
  const context = useContext(ModalContext);
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
            {dict?.look}
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
              title: { en: "shirt", es: "camiseta" },
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
                    context?.filters?.printType?.includes(image.title.en)
                      ? "preroll"
                      : "tiles"
                  }
                  title={image.title?.[getLocaleFromPath(path)]}
                  onClick={() => {
                    if (
                      context?.filters?.printType !==
                      (context?.filters?.printType.includes(image.title.en)
                        ? context?.filters?.printType.filter(
                            (item: string) => item !== image.title.en
                          )
                        : [...context?.filters?.printType!, image.title.en])
                    ) {
                      context?.setFilterChange(true);
                    }

                    context?.setFilters((prev) => ({
                      ...prev,
                      printType: context?.filters?.printType.includes(
                        image.title.en
                      )
                        ? context?.filters?.printType.filter(
                            (item: string) => item !== image.title.en
                          )
                        : [...context?.filters?.printType!, image.title.en],
                    }));
                  }}
                >
                  <div className="relative w-full h-full rounded-sm flex bg-black items-center justify-center">
                    <div className="relative w-2/3 h-full rounded-sm flex">
                      <Image
                        layout="fill"
                        objectFit="cover"
                        priority
                        className="rounded-sm flex w-2/3 h-full items-center justify-center"
                        src={`${INFURA_GATEWAY_INTERNAL}${image.image}`}
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
            {dict?.sizs}
          </div>
          <div className="relative w-full h-fit flex flex-col items-start justify-items gap-1">
            <div className="relative w-full h-fit flex flex-row items-center justify-center">
              <div className="flex relative w-full h-fit sm:flex-nowrap flex-wrap flex-row gap-2 items-center justify-start">
                {context?.filterConstants?.sizes?.apparel &&
                  context?.filterConstants?.sizes?.apparel?.length > 0 &&
                  context?.filterConstants?.sizes?.apparel?.map(
                    (size: string, index: number) => {
                      return (
                        <div
                          key={index}
                          className="relative w-7 h-6 flex items-center justify-center p-px font-bit text-white text-xs cursor-pointer"
                          id={
                            context?.filters?.size.apparel.includes(size)
                              ? "preroll"
                              : "tiles"
                          }
                        >
                          <div
                            className="relative bg-offBlack w-full h-full flex items-center justify-center text-center"
                            onClick={() => {
                              if (
                                context?.filters?.size?.apparel !==
                                (context?.filters?.size.apparel.includes(size)
                                  ? context?.filters?.size.apparel.filter(
                                      (item: string) => item !== size
                                    )
                                  : [...context?.filters?.size.apparel, size])
                              ) {
                                context?.setFilterChange(true);
                              }

                              context?.setFilters((prev) => ({
                                ...prev,
                                size: {
                                  ...context?.filters?.size,
                                  apparel:
                                    context?.filters?.size.apparel.includes(
                                      size
                                    )
                                      ? context?.filters?.size.apparel.filter(
                                          (item: string) => item !== size
                                        )
                                      : [
                                          ...context?.filters?.size.apparel,
                                          size,
                                        ],
                                },
                              }));
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
                  context?.filterDropDown?.state?.size && "rotate-90"
                }`}
                onClick={() =>
                  context?.setFilterDropDown((prev) => ({
                    ...prev,
                    state: {
                      ...prev?.state!,
                      size: !prev?.state?.size,
                    },
                  }))
                }
              >
                <Image
                  layout="fill"
                  draggable={false}
                  priority
                  src={`${INFURA_GATEWAY_INTERNAL}QmRKmMYJj7KAwf4BDGwrd51tKWoS8djnLGWT5XNdrJMztk`}
                />
              </div>
            </div>
            {context?.filterDropDown?.state?.size && (
              <>
                <div className="flex relative w-full h-fit flex-row gap-2 items-center justify-start sm:flex-nowrap flex-wrap">
                  {context?.filterConstants?.sizes?.poster &&
                    context?.filterConstants?.sizes?.poster?.length > 0 &&
                    context?.filterConstants?.sizes?.poster?.map(
                      (size: string, index: number) => {
                        return (
                          <div
                            key={index}
                            className="relative w-fit h-fit flex items-center justify-center p-px font-bit text-white text-xs cursor-pointer"
                            id={
                              context?.filters?.size.poster.includes(size)
                                ? "preroll"
                                : "tiles"
                            }
                            onClick={() => {
                              if (
                                context?.filters?.size?.poster !==
                                (context?.filters?.size.poster.includes(size)
                                  ? context?.filters?.size.poster.filter(
                                      (item: string) => item !== size
                                    )
                                  : [...context?.filters?.size.poster, size])
                              ) {
                                context?.setFilterChange(true);
                              }

                              context?.setFilters((prev) => ({
                                ...prev,
                                size: {
                                  ...context?.filters?.size,
                                  poster:
                                    context?.filters?.size.poster.includes(size)
                                      ? context?.filters?.size.poster.filter(
                                          (item: string) => item !== size
                                        )
                                      : [
                                          ...context?.filters?.size.poster,
                                          size,
                                        ],
                                },
                              }));
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
                  {context?.filterConstants?.sizes?.sticker &&
                    context?.filterConstants?.sizes?.sticker?.length > 0 &&
                    context?.filterConstants?.sizes?.sticker?.map(
                      (size: string, index: number) => {
                        return (
                          <div
                            key={index}
                            className="relative w-fit h-fit flex items-center justify-center p-px font-bit text-white text-xs cursor-pointer"
                            id={
                              context?.filters?.size.sticker.includes(size)
                                ? "preroll"
                                : "tiles"
                            }
                            onClick={() => {
                              if (
                                context?.filters?.size?.sticker !==
                                (context?.filters?.size.sticker.includes(size)
                                  ? context?.filters?.size.sticker.filter(
                                      (item: string) => item !== size
                                    )
                                  : [...context?.filters?.size.sticker, size])
                              ) {
                                context?.setFilterChange(true);
                              }

                              context?.setFilters((prev) => ({
                                ...prev,
                                size: {
                                  ...context?.filters?.size,
                                  sticker:
                                    context?.filters?.size.sticker.includes(
                                      size
                                    )
                                      ? context?.filters?.size.sticker.filter(
                                          (item: string) => item !== size
                                        )
                                      : [
                                          ...context?.filters?.size.sticker,
                                          size,
                                        ],
                                },
                              }));
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
            {dict?.cols}
          </div>
          <div className="relative flex flex-row gap-2 items-center justify-start sm:flex-nowrap flex-wrap">
            {context?.filterConstants?.colors &&
              context?.filterConstants?.colors?.length > 0 &&
              context?.filterConstants?.colors?.map(
                (color: string, index: number) => {
                  return (
                    <div
                      key={index}
                      className="rounded-full w-6 h-6 flex p-px cursor-pointer"
                      id={
                        context?.filters?.color.includes(color)
                          ? "preroll"
                          : "tiles"
                      }
                      onClick={() => {
                        if (
                          context?.filters?.color !==
                          (context?.filters?.color.includes(color)
                            ? context?.filters?.color.filter(
                                (item: string) => item !== color
                              )
                            : [...context?.filters?.color, color])
                        ) {
                          context?.setFilterChange(true);
                        }

                        context?.setFilters((prev) => ({
                          ...prev,
                          color: context?.filters?.color.includes(color)
                            ? context?.filters?.color.filter(
                                (item: string) => item !== color
                              )
                            : [...context?.filters?.color, color],
                        }));
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
                }
              )}
          </div>
        </div>
        <div className="relative flex flex-row gap-3 w-full h-fit items-center justify-start sm:flex-nowrap flex-wrap">
          <div className="relative flex flex-col items-center justify-center">
            <div className="relative flex justify-start items-center text-white font-bit uppercase text-sm">
              {dict?.rang}
            </div>
            <div className="relative w-fit h-fit flex flex-row gap-1 items-center justify-center">
              <div
                className="relative w-full h-8 p-px rounded-sm flex flex-row items-center justify-center font-bit text-sol text-center"
                id="borderSearch"
              >
                <input
                  className="relative w-full h-full p-1.5 bg-offBlack flex items-center justify-center text-sm"
                  type="number"
                  placeholder={String(context?.filters?.price.min)}
                  onChange={(e) => {
                    if (
                      Number(context?.filters?.price?.min) !==
                      Number(e.target.value)
                    ) {
                      context?.setFilterChange(true);
                    }

                    context?.setFilters((prev) => ({
                      ...prev,
                      price: {
                        ...context?.filters?.price,
                        min: Number(e.target.value),
                      },
                    }));
                  }}
                  value={context?.filters?.price.min}
                />
              </div>
              <div className="relative w-fit h-fit flex items-center justify-center font-bit text-white text-sm uppercase">
                {dict?.to}
              </div>
              <div
                className="relative w-full h-8 p-px rounded-sm flex flex-row items-center justify-center font-bit text-sol text-center"
                id="borderSearch"
              >
                <input
                  className="relative w-full h-full p-1.5 bg-offBlack flex items-center justify-center text-sm"
                  type="number"
                  placeholder={String(context?.filters?.price.max)}
                  onChange={(e) => {
                    if (
                      Number(context?.filters?.price?.max) !==
                      Number(e.target.value)
                    ) {
                      context?.setFilterChange(true);
                    }
                    context?.setFilters((prev) => ({
                      ...prev,
                      price: {
                        ...context?.filters?.price,
                        max: Number(e.target.value),
                      },
                    }));
                  }}
                  value={context?.filters?.price.max}
                />
              </div>
            </div>
          </div>
          <DropDown
            dropDownValues={context?.filterDropDown?.values?.token!}
            title={dict?.tok}
            value={context?.filters?.token!}
            onChange={(e: ChangeEvent) => {
              if (
                context?.filters?.token !==
                (e.target as HTMLInputElement).value.toLowerCase()
              ) {
                context?.setFilterChange(true);
              }

              context?.setFilterDropDown((prev) => ({
                ...prev,
                values: {
                  ...prev?.values!,
                  token: context?.filterConstants!.token.filter((value) =>
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
                },
              }));

              context?.setFilters((prev) => ({
                ...prev,
                token: (e.target as HTMLInputElement).value.toLowerCase(),
              }));

              if (!context?.filterDropDown?.state?.token) {
                context?.setFilterDropDown((prev) => ({
                  ...prev,
                  state: {
                    ...prev?.state!,
                    token: true,
                  },
                }));
              }
            }}
            openDropDown={context?.filterDropDown?.state?.token!}
            setOpenDropDown={() => {
              context?.setFilterDropDown((prev) => ({
                ...prev,
                state: {
                  ...prev?.state!,
                  token: prev?.state?.token,
                },
              }));
            }}
            onDropDownChoose={(value: string) => {
              if (!context?.filters?.token.includes(value)) {
                const allValues = context?.filters?.token.split(",");
                const isPartialEntry =
                  allValues![allValues!?.length - 1]?.trim() !== "";

                let newValues: string;

                if (isPartialEntry) {
                  allValues![allValues!?.length - 1] = ` ${value},`;
                  newValues = allValues!?.join(", ")?.trim();
                } else {
                  newValues = context?.filters?.token + ` ${value},`;
                }

                if (context?.filters?.token !== newValues) {
                  context?.setFilterChange(true);
                }

                context?.setFilters((prev) => ({
                  ...prev,
                  token: newValues,
                }));
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
              placeholder={dict?.dropN}
              value={context?.filters?.drop}
              onChange={(e) => {
                if (
                  context?.filters?.drop !==
                  (e.target as HTMLInputElement).value.toLowerCase()
                ) {
                  context?.setFilterChange(true);
                }

                context?.setFilters((prev) => ({
                  ...prev,
                  drop: (e.target as HTMLInputElement).value.toLowerCase(),
                }));
              }}
            />
          </div>
        </div>
        <div className="relative flex flex-row gap-5 w-full h-fit items-center justify-center">
          <DropDown
            dropDownValues={context?.filterDropDown?.values?.fulfiller!}
            title={dict?.fulL}
            value={context?.filters?.fulfiller!}
            onChange={(e: ChangeEvent) => {
              if (
                context?.filters?.fulfiller !==
                (e.target as HTMLInputElement).value.toLowerCase()
              ) {
                context?.setFilterChange(true);
              }

              context?.setFilterDropDown((prev) => ({
                ...prev,
                values: {
                  ...prev?.values!,
                  fulfiller: context?.filterConstants!.fulfiller.filter(
                    (value) =>
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
                },
              }));

              context?.setFilters((prev) => ({
                ...prev,
                fulfiller: (e.target as HTMLInputElement).value.toLowerCase(),
              }));

              if (!context?.filterDropDown?.state?.fulfiller) {
                context?.setFilterDropDown((prev) => ({
                  ...prev,
                  state: {
                    ...prev?.state!,
                    fulfiller: true,
                  },
                }));
              }
            }}
            openDropDown={context?.filterDropDown?.state?.fulfiller!}
            setOpenDropDown={() => {
              context?.setFilterDropDown((prev) => ({
                ...prev,
                state: {
                  ...prev?.state!,
                  fulfiller: !prev?.state?.fulfiller,
                },
              }));
            }}
            onDropDownChoose={(value: string) => {
              if (!context?.filters?.fulfiller.includes(value)) {
                const allValues = context?.filters?.fulfiller.split(",");
                const isPartialEntry =
                  allValues!?.[allValues!?.length - 1]?.trim() !== "";

                let newValues: string;

                if (isPartialEntry) {
                  allValues![allValues!?.length - 1] = ` ${value},`;
                  newValues = allValues!?.join(", ")?.trim();
                } else {
                  newValues = context?.filters?.fulfiller + ` ${value},`;
                }

                if (context?.filters?.fulfiller !== newValues) {
                  context?.setFilterChange(true);
                }

                context?.setFilters((prev) => ({
                  ...prev,
                  fulfiller: newValues,
                }));
              }
            }}
          />
          <div
            className="relative flex w-10 h-6 cursor-pointer items-center justify-center"
            onClick={() => context?.setMap(true)}
          >
            <Image
              layout="fill"
              priority
              src={`${INFURA_GATEWAY_INTERNAL}QmeVXGLFHVhLHKFy5HzAuqF62cCyF9SniY3hPYLHLfBtGW`}
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrerollSort;

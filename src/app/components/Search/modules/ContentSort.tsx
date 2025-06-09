import Image from "next/legacy/image";
import DropDown from "./DropDown";
import { ChangeEvent, FunctionComponent, JSX, useContext } from "react";
import { INFURA_GATEWAY_INTERNAL } from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import ImageDropDown from "./ImageDropDown";

const ContentSort: FunctionComponent<{ dict: any }> = ({
  dict,
}): JSX.Element => {
  const context = useContext(ModalContext);
  return (
    <div className="order-1 lg:order-2 relative w-full h-fit items-start justify-center flex flex-col gap-5">
      <div className="relative w-full h-fit justify-between gap-3 flex items-center flex-row sm:flex-nowrap flex-wrap">
        <div className="font-bit text-white text-left flex items-center justify-center text-sm uppercase break-words h-fit w-fit">
          {dict?.find}
        </div>
        <div
          className="relative w-12 h-9 cursor-pointer flex items-center justify-center active:scale-95"
          onClick={() => {
            context?.setFilters({
              hashtag: "",
              microbrand: "",
              catalog: "",
              access: "",
              format: "",
              origin: "",
              editions: 1,
              available: true,
              fulfiller: "",
              drop: "",
              size: {
                apparel: [],
                poster: [],
                sticker: [],
              },
              color: [],
              price: {
                min: 0,
                max: 500,
              },
              token: "",
              printType: [],
            });

            context?.setFilterChange(true);

            context?.setFilterDropDown((prev) => ({
              ...prev,
              state: {
                hashtag: false,
                community: false,
                microbrand: false,
                catalog: false,
                access: false,
                format: false,
                origin: false,
                size: false,
                price: false,
                token: false,
                fulfiller: false,
              },
            }));
          }}
          title={dict?.res}
        >
          <Image
            layout="fill"
            src={`${INFURA_GATEWAY_INTERNAL}QmSqbSXEPerv869YdJAyY7sgE47qC4Btx8FbAeTMLArMqF`}
            draggable={false}
            priority
          />
        </div>
      </div>
      <DropDown
        dropDownValues={context?.filterDropDown?.values?.hashtags!}
        hashtag
        title={dict?.hash}
        value={context?.filters?.hashtag || ""}
        onChange={(e: ChangeEvent) => {
          context?.setFilterDropDown((prev) => ({
            ...prev,
            values: {
              ...prev?.values!,
              hashtags: context?.filterConstants!.hashtags?.filter((value) =>
                value
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
            },
          }));

          if (
            context?.filters?.hashtag !=
            (e.target as HTMLInputElement).value.toLowerCase()
          ) {
            context?.setFilterChange(true);
          }

          context?.setFilters((prev) => ({
            ...prev,
            hashtag: (e.target as HTMLInputElement).value.toLowerCase(),
          }));

          if (!context?.filterDropDown?.state?.hashtag) {
            context?.setFilterDropDown((prev) => ({
              ...prev,
              state: {
                ...prev?.state!,
                hashtag: true,
              },
            }));
          }
        }}
        openDropDown={context?.filterDropDown?.state?.hashtag!}
        setOpenDropDown={() => {
          context?.setFilterDropDown((prev) => ({
            ...prev,
            state: {
              ...prev?.state!,
              hashtag: !prev.state?.hashtag,
            },
          }));
        }}
        onDropDownChoose={(value: string) => {
          if (!context?.filters?.hashtag?.includes(value)) {
            const allValues = context?.filters?.hashtag?.split(",") || [];
            if (allValues?.length < 1) return;
            const isPartialEntry =
              allValues[allValues.length - 1]?.trim() !== "";

            let newValues: string;

            if (isPartialEntry) {
              allValues[allValues.length - 1] = ` ${value},`;
              newValues = allValues?.join(", ")?.trim();
            } else {
              newValues = context?.filters?.hashtag + ` ${value},`;
            }

            if (context?.filters?.hashtag != newValues) {
              context?.setFilterChange(true);
            }

            context?.setFilters((prev) => ({
              ...prev,
              hashtag: newValues,
            }));
          }
        }}
      />

      <ImageDropDown
        dropDownValues={context?.filterDropDown?.values?.microbrands!}
        title={dict?.micS}
        value={context?.filters?.microbrand || ""}
        onChange={(e: ChangeEvent) => {
          context?.setFilterDropDown((prev) => ({
            ...prev,
            values: {
              ...prev?.values!,
              microbrands: context?.filterConstants!.microbrands.filter(
                (value) =>
                  value[0]
                    .toLowerCase()
                    ?.includes(
                      (e.target as HTMLInputElement).value
                        .split(",")
                        [
                          (e.target as HTMLInputElement).value.split(",")
                            .length - 1
                        ].trim()
                        .toLowerCase()
                    )
              ),
            },
          }));

          if (
            context?.filters?.microbrand !=
            (e.target as HTMLInputElement).value.toLowerCase()
          ) {
            context?.setFilterChange(true);
          }

          context?.setFilters((prev) => ({
            ...prev,
            microbrand: (e.target as HTMLInputElement).value.toLowerCase(),
          }));

          if (!context?.filterDropDown?.state?.microbrand) {
            context?.setFilterDropDown((prev) => ({
              ...prev,
              state: {
                ...prev?.state!,
                microbrand: true,
              },
            }));
          }
        }}
        openDropDown={context?.filterDropDown?.state?.microbrand!}
        setOpenDropDown={() => {
          context?.setFilterDropDown((prev) => ({
            ...prev,
            state: {
              ...prev?.state!,
              microbrand: !prev?.state?.microbrand,
            },
          }));
        }}
        onDropDownChoose={(value: string) => {
          if (!context?.filters?.microbrand?.includes(value)) {
            const allValues = context?.filters?.microbrand?.split(",") || [];
            if (allValues?.length < 1) return;
            const isPartialEntry =
              allValues[allValues?.length - 1]?.trim() !== "";

            let newValues: string;

            if (isPartialEntry) {
              allValues[allValues?.length - 1] = ` ${value},`;
              newValues = allValues?.join(", ")?.trim();
            } else {
              newValues = context?.filters?.microbrand + ` ${value},`;
            }

            if (context?.filters?.microbrand != newValues) {
              context?.setFilterChange(true);
            }

            context?.setFilters((prev) => ({
              ...prev,
              microbrand: newValues,
            }));
          }
        }}
      />
      <div className="relative w-fit h-fit flex flex-row items-center justify-center gap-2">
        {Array.from({ length: 3 }).map((_, index: number) => {
          return (
            <div className="relative w-4 h-7 flex" key={index}>
              <Image
                src={`${INFURA_GATEWAY_INTERNAL}QmUFprxSMc6pQTbXkV5eZtwC4v2ksTzRkGZ19Yk9i244gY`}
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
              src={`${INFURA_GATEWAY_INTERNAL}QmRpjossq3S23jYRHUSobGk2jeCeexcPgzeJpc3NE1ZPRf`}
              layout="fill"
              draggable={false}
              priority
            />
          </div>
          <div className="relative w-10 h-10 flex items-center justify-center">
            <Image
              src={`${INFURA_GATEWAY_INTERNAL}QmUX8vJWZ2aJc3qCGKUwptgX9Ve9UYpQKgddk4oPAaXPdq`}
              layout="fill"
              draggable={false}
              priority
            />
          </div>
        </div>
        <ImageDropDown
          dropDownValues={context?.filterDropDown?.values?.origin!}
          reverse
          title={dict?.ori}
          cover
          rounded
          value={context?.filters?.origin || ""}
          onChange={(e: ChangeEvent) => {
            context?.setFilterDropDown((prev) => ({
              ...prev,
              values: {
                ...prev?.values!,
                origin: prev?.values?.origin!?.filter((value) =>
                  value[0]
                    .toLowerCase()
                    ?.includes(
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

            if (
              context?.filters?.origin !=
              (e.target as HTMLInputElement).value.toLowerCase()
            ) {
              context?.setFilterChange(true);
            }

            context?.setFilters((prev) => ({
              ...prev,
              origin: (e.target as HTMLInputElement).value.toLowerCase(),
            }));

            if (!context?.filterDropDown?.state?.origin) {
              context?.setFilterDropDown((prev) => ({
                ...prev,
                origin: true,
              }));
            }
          }}
          openDropDown={context?.filterDropDown?.state?.origin!}
          setOpenDropDown={() => {
            context?.setFilterDropDown((prev) => ({
              ...prev,
              state: {
                ...prev?.state!,
                origin: !prev?.state?.origin,
              },
            }));
          }}
          onDropDownChoose={(value: string) => {
            if (!context?.filters?.origin?.includes(value)) {
              const allValues = context?.filters?.origin?.split(",") || [];
              if (allValues?.length < 1) return;
              const isPartialEntry =
                allValues[allValues?.length - 1]?.trim() !== "";

              let newValues: string;

              if (isPartialEntry) {
                allValues[allValues?.length - 1] = ` ${value},`;
                newValues = allValues?.join(", ")?.trim();
              } else {
                newValues = context?.filters?.origin + ` ${value},`;
              }

              if (context?.filters?.origin != newValues) {
                context?.setFilterChange(true);
              }

              context?.setFilters((prev) => ({
                ...prev,
                origin: newValues,
              }));
            }
          }}
        />
      </div>
      <DropDown
        dropDownValues={context?.filterDropDown?.values?.format!}
        title={dict?.form}
        value={context?.filters?.format || ""}
        onChange={(e: ChangeEvent) => {
          context?.setFilterDropDown((prev) => ({
            ...prev,
            values: {
              ...prev?.values!,
              format: context?.filterConstants!.format?.filter((value) =>
                value
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
            },
          }));

          if (
            context?.filters?.format !=
            (e.target as HTMLInputElement).value.toLowerCase()
          ) {
            context?.setFilterChange(true);
          }

          context?.setFilters((prev) => ({
            ...prev,
            format: (e.target as HTMLInputElement).value.toLowerCase(),
          }));

          if (!context?.filterDropDown?.state?.format) {
            context?.setFilterDropDown((prev) => ({
              ...prev,
              state: {
                ...prev?.state!,
                format: true,
              },
            }));
          }
        }}
        openDropDown={context?.filterDropDown?.state?.format!}
        setOpenDropDown={() => {
          context?.setFilterDropDown((prev) => ({
            ...prev,
            state: {
              ...prev?.state!,
              format: !prev?.state?.format,
            },
          }));
        }}
        onDropDownChoose={(value: string) => {
          if (!context?.filters?.format?.includes(value)) {
            const allValues = context?.filters?.format?.split(",") || [];
            if (allValues?.length < 1) return;
            const isPartialEntry =
              allValues[allValues?.length - 1]?.trim() !== "";

            let newValues: string;

            if (isPartialEntry) {
              allValues[allValues?.length - 1] = ` ${value},`;
              newValues = allValues?.join(", ")?.trim();
            } else {
              newValues = context?.filters?.format + ` ${value},`;
            }

            if (context?.filters?.format != newValues) {
              context?.setFilterChange(true);
            }

            context?.setFilters((prev) => ({
              ...prev,
              format: newValues,
            }));
          }
        }}
      />
      <DropDown
        dropDownValues={context?.filterDropDown?.values?.catalog!}
        title={dict?.cat}
        value={context?.filters?.catalog!}
        onChange={(e: ChangeEvent) => {
          context?.setFilterDropDown((prev) => ({
            ...prev,
            values: {
              ...prev?.values!,
              catalog: context?.filterConstants!.catalog.filter((value) =>
                value
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
            },
          }));

          if (
            context?.filters?.catalog !=
            (e.target as HTMLInputElement).value.toLowerCase()
          ) {
            context?.setFilterChange(true);
          }

          context?.setFilters((prev) => ({
            ...prev,
            catalog: (e.target as HTMLInputElement).value.toLowerCase(),
          }));

          if (!context?.filterDropDown?.state?.catalog) {
            context?.setFilterDropDown((prev) => ({
              ...prev,
              state: {
                ...prev?.state!,
                catalog: true,
              },
            }));
          }
        }}
        openDropDown={context?.filterDropDown?.state?.catalog!}
        setOpenDropDown={() => {
          context?.setFilterDropDown((prev) => ({
            ...prev,
            state: {
              ...prev?.state!,
              catalog: !prev?.state?.catalog,
            },
          }));
        }}
        onDropDownChoose={(value: string) => {
          if (!context?.filters?.catalog?.includes(value)) {
            const allValues = context?.filters?.catalog?.split(",");
            const isPartialEntry =
              allValues![allValues!?.length - 1]?.trim() !== "";

            let newValues: string;

            if (isPartialEntry) {
              allValues![allValues!?.length - 1] = ` ${value},`;
              newValues = allValues!?.join(", ")?.trim();
            } else {
              newValues = context?.filters?.catalog + ` ${value},`;
            }

            if (context?.filters?.catalog != newValues) {
              context?.setFilterChange(true);
            }

            context?.setFilters((prev) => ({
              ...prev,
              catalog: newValues,
            }));
          }
        }}
      />
      <ImageDropDown
        dropDownValues={context?.filterDropDown?.values?.access!}
        title={dict?.eco}
        value={context?.filters?.access || ""}
        onChange={(e: ChangeEvent) => {
          context?.setFilterDropDown((prev) => ({
            ...prev,
            values: {
              ...prev?.values!,
              microbrands: context?.filterConstants!.access.filter((value) =>
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
            },
          }));

          if (
            context?.filters?.access !=
            (e.target as HTMLInputElement).value.toLowerCase()
          ) {
            context?.setFilterChange(true);
          }

          context?.setFilters((prev) => ({
            ...prev,
            access: (e.target as HTMLInputElement).value.toLowerCase(),
          }));

          if (!context?.filterDropDown?.state?.access) {
            context?.setFilterDropDown((prev) => ({
              ...prev,
              state: {
                ...prev?.state!,
                access: true,
              },
            }));
          }
        }}
        openDropDown={context?.filterDropDown?.state?.access!}
        setOpenDropDown={() => {
          context?.setFilterDropDown((prev) => ({
            ...prev,
            state: {
              ...prev?.state!,
              access: !prev?.state?.access,
            },
          }));
        }}
        onDropDownChoose={(value: string) => {
          if (!context?.filters?.access?.includes(value)) {
            const allValues = context?.filters?.access?.split(",") || [];
            if (allValues?.length < 1) return;
            const isPartialEntry =
              allValues[allValues?.length - 1]?.trim() !== "";

            let newValues: string;

            if (isPartialEntry) {
              allValues[allValues?.length - 1] = ` ${value},`;
              newValues = allValues?.join(", ")?.trim();
            } else {
              newValues = context?.filters?.access + ` ${value},`;
            }

            if (context?.filters?.access != newValues) {
              context?.setFilterChange(true);
            }

            context?.setFilters((prev) => ({
              ...prev,
              access: newValues,
            }));
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
              placeholder={String(context?.filters?.editions)}
              onChange={(e) => {
                if (context?.filters?.editions != Number(e.target.value)) {
                  context?.setFilterChange(true);
                }
                context?.setFilters((prev) => ({
                  ...prev,
                  editions: Number(e.target.value),
                }));
              }}
              value={context?.filters?.editions}
            />
            <div className="relative w-full h-full p-1.5 bg-offBlack flex items-center justify-center text-sm uppercase">
              {dict?.eds}
            </div>
          </div>
        </div>
        <div className="relative w-fit h-fit items-center justify-center flex flex-col">
          <div className="relative w-full h-full p-1.5 bg-offBlack flex items-center justify-center font-bit text-sol text-xs text-center uppercase">
            {dict?.av}
          </div>
          <div
            id="borderSearch"
            className="relative w-fit h-fit flex items-center justify-center p-px"
          >
            <div className="relative bg-offBlack flex flex-row w-full h-full justify-center items-center rounded-sm p-1 gap-2 text-sm font-bit text-center">
              <div
                className={`relative w-10 px-1 h-fit items-center justify-center flex cursor-pointer ${
                  context?.filters?.available
                    ? "bg-brill text-black"
                    : "text-white"
                }`}
                onClick={() => {
                  if (context?.filters?.available != true) {
                    context?.setFilterChange(true);
                  }
                  context?.setFilters((prev) => ({
                    ...prev,
                    available: true,
                  }));
                }}
              >
                {dict?.yes?.toLowerCase()}
              </div>
              <div
                className={`relative w-10 px-1 h-fit items-center justify-center flex cursor-pointer ${
                  !context?.filters?.available
                    ? "bg-brill text-black"
                    : "text-white"
                }`}
                onClick={() => {
                  if (context?.filters?.available != false) {
                    context?.setFilterChange(true);
                  }

                  context?.setFilters((prev) => ({
                    ...prev,
                    available: false,
                  }));
                }}
              >
                {dict?.no?.toLowerCase()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentSort;

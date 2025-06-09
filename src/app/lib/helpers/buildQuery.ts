import { Filter, ItemType } from "@/app/components/Common/types/common.types";
import {
  Format,
  itemStringToNumberType,
  numberToFormat,
  printStringToNumber,
} from "../constants";

type FilterField = "format" | "hashtag" | "microbrand" | "access" | "color";

export const buildQuery = (filters: Filter) => {
  const splitString = (value: string): string[] => {
    return value
      ?.split(",")
      ?.map((item) => item.trim())
      ?.filter((item) => item);
  };

  let query: any = { and: [] };
  let groupedOrConditions: any = {};
  let otherOrConditions: any[] = [];

  const mapFormats = (format: string) => {
    switch (format) {
      case "IMAGE":
        return "static";
      case "VIDEO":
      case "LIVESTREAM":
        return "video";
      case "AUDIO":
        return "audio";
      default:
        return "";
    }
  };

  const collectionFields: FilterField[] = [
    "format",
    "hashtag",
    "microbrand",
    "access",
    "color",
  ];

  collectionFields.forEach((field: FilterField) => {
    if (
      filters[field] &&
      typeof filters[field] === "string" &&
      (filters[field] as string).trim() !== ""
    ) {
      const values =
        field === "format"
          ? Array.from(new Set(splitString(filters[field]).map(mapFormats)))
          : splitString(filters[field] as string);
      const fieldName =
        field === "hashtag"
          ? "tags"
          : field === "format"
          ? "mediaTypes"
          : field;

      values
        ?.filter((item) => item?.trim() !== "")
        .forEach((value) => {
          if (!groupedOrConditions[fieldName]) {
            groupedOrConditions[fieldName] = [];
          }
          groupedOrConditions[fieldName].push({
            [`${fieldName}_contains_nocase`]: value,
          });
        });
    }
  });

  Object.keys(groupedOrConditions).forEach((fieldName) => {
    if (groupedOrConditions[fieldName].length > 0) {
      query.and.push({
        metadata_: {
          or: groupedOrConditions[fieldName],
        },
      });
    }
  });

  if (filters.size) {
    let sizeConditions: any = [];
    const combinedSizes = [
      ...filters.size.apparel,
      ...filters.size.poster,
      ...filters.size.sticker,
    ]?.filter(Boolean);
    combinedSizes.forEach((size) => {
      sizeConditions.push({ sizes_contains_nocase: size });
    });

    if (sizeConditions.length > 0) {
      otherOrConditions.push({ or: sizeConditions });
    }
  }

  if (filters?.editions !== undefined && filters?.editions > 1) {
    otherOrConditions.push({
      amount: Math.max(1, Math.floor(Number(filters.editions))),
    });
  }

  if (filters.printType && filters.printType.length > 0) {
    let printTypeConditions = filters.printType.map((printType) => ({
      printType:
        printStringToNumber[
          printType
            ?.split(" ")
            .map(
              (palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1)
            )
            .join(" ")
        ],
    }));

    if (printTypeConditions.length > 0) {
      otherOrConditions.push({ or: printTypeConditions });
    }
  }

  if (filters.origin && filters.origin.length > 0) {
    let originConditions = filters.origin
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
      .map((origin) => ({
        origin:
          itemStringToNumberType[
            origin?.toUpperCase() == "LIT LISTENER"
              ? "listener"
              : origin?.toUpperCase() == "THE DIAL"
              ? "dial"
              : origin?.toLowerCase() == "f3manifesto"
              ? "f3m"
              : (origin?.replaceAll(" ", "")?.toLowerCase() as ItemType)
          ],
      }));

    if (originConditions.length > 0) {
      otherOrConditions.push({ or: originConditions });
    }
  }

  otherOrConditions.forEach((condition) => {
    query.and.push(condition);
  });

  return query;
};

export const buildQueryTripleA = (filters: Filter) => {
  let query: any = { and: [] };
  let otherOrConditions: any[] = [];

  if (filters?.editions !== undefined && filters?.editions > 1) {
    otherOrConditions.push({
      amount: Math.max(1, Math.floor(Number(filters.editions))),
    });
  }

  if (filters.printType && filters.printType.length > 0) {
    let printTypeConditions = filters.printType.map((printType) => ({
      metadata_: {
        format:
          numberToFormat[
            Number(
              printStringToNumber[
                printType
                  ?.split(" ")
                  .map(
                    (palabra) =>
                      palabra.charAt(0).toUpperCase() + palabra.slice(1)
                  )
                  .join(" ")
              ]
            )
          ],
      },
    }));

    if (printTypeConditions.length > 0) {
      otherOrConditions.push({ or: printTypeConditions });
    }
  }

  otherOrConditions.forEach((condition) => {
    query.and.push(condition);
  });

  return query;
};

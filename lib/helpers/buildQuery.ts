import { Filter } from "@/components/Search/types/search.types";

type FilterField =
  | "format"
  | "hashtag"
  | "microbrand"
  | "community"
  | "access"
  | "color";

const buildQuery = (filters: Filter) => {
  const splitString = (value: string): string[] => {
    return value
      ?.split(",")
      ?.map((item) => item?.trim())
      ?.filter((item) => item);
  };

  let query: any = { or: [] };
  let collectionMetadataOrConditions: any[] = [];
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
    "community",
    "access",
    "color",
  ];
  collectionFields.forEach((field) => {
    if (
      typeof filters[field] === "string" &&
      (filters[field] as string)?.trim() !== ""
    ) {
      const values =
        field === "format"
          ? Array.from(
              new Set(splitString(filters[field] as string).map(mapFormats))
            )
          : splitString(filters[field] as string);
      const fieldName =
        field === "hashtag"
          ? "tags"
          : field === "community"
          ? "communities"
          : field === "format"
          ? "mediaTypes"
          : field;
      values.forEach((value) => {
        collectionMetadataOrConditions.push({
          [`${fieldName}_contains_nocase`]: value,
        });
      });
    }
  });

  if (filters.size) {
    const combinedSizes = [
      ...filters.size.apparel,
      ...filters.size.poster,
      ...filters.size.sticker,
    ].filter(Boolean);
    combinedSizes.forEach((size) => {
      collectionMetadataOrConditions.push({ sizes_contains_nocase: size });
    });
  }

  if (collectionMetadataOrConditions.length > 0) {
    query.or.push({
      collectionMetadata_: { or: collectionMetadataOrConditions },
    });
  }

  if (filters?.editions !== undefined) {
    otherOrConditions.push({
      amount: Math.max(1, Math.floor(Number(filters.editions) || 1)),
    });
  }

  if (filters.printType && filters.printType.length > 0) {
    filters.printType.forEach((printType) => {
      otherOrConditions.push({ printType_contains_nocase: printType });
    });
  }

  otherOrConditions.forEach((condition) => {
    query.or.push(condition);
  });

  return query;
};

export default buildQuery;

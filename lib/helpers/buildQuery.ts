import { Filter } from "@/components/Search/types/search.types";
import { FilterInput } from "@/components/Tiles/types/tiles.types";

type FilterField =
  | "format"
  | "hashtag"
  | "microbrand"
  | "community"
  | "access"
  | "color";

interface AndBlock {
  and?: {
    [key: string]: string;
  };
}

const buildQuery = (filters: Filter): FilterInput => {
  const splitString = (value: string): string[] => {
    return value.split(",").map((item) => item.trim());
  };

  const buildAndBlock = (
    values: string[],
    fieldName: string,
    prefix: string
  ): AndBlock => {
    return values.slice(1).reduce<AndBlock>(
      (acc, value) => {
        return {
          and: {
            ...(acc.and || {}),
            [`${prefix}${fieldName}_contains_nocase`]: value,
          },
        };
      },
      { [`${prefix}${fieldName}_contains_nocase`]: values[0] }
    );
  };

  let query: any = {};

  if (filters.drop) {
    const values = [filters.drop];
    query = {
      ...query,
      ...buildAndBlock(values, "dropTitle", "dropMetadata_"),
    };
  }

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

  const collectionMetadata: any = {};

  collectionFields.forEach((field) => {
    if (typeof filters[field] === "string") {
      const values =
        field === "format"
          ? Array.from(new Set(splitString(filters[field]).map(mapFormats)))
          : splitString(filters[field] as string);

      const fieldName =
        field === "hashtag"
          ? "tags"
          : field === "community"
          ? "communities"
          : field === "format"
          ? "mediaTypes"
          : field;

      const fieldQuery = buildAndBlock(
        values,
        fieldName,
        "collectionMetadata_"
      );
      collectionMetadata.and = { ...collectionMetadata.and, ...fieldQuery.and };
    }
  });

  if (Object.keys(collectionMetadata).length > 0) {
    query.collectionMetadata_ = collectionMetadata;
  }

  if (filters.size) {
    const sizes = [
      ...filters.size.apparel,
      ...filters.size.poster,
      ...filters.size.sticker,
    ];
    if (sizes.length > 0) {
      query = {
        ...query,
        ...buildAndBlock(sizes, "sizes", "collectionMetadata_"),
      };
    }
  }

  if (filters?.editions !== undefined) {
    query.editions = filters.editions;
  }

  if (filters.price) {
    query.price_gte = filters.price.min;
    query.price_lte = filters.price.max;
  }

  if (filters.printType && filters.printType.length > 0) {
    const printTypeValues = splitString(filters.printType.join(","));
    query = {
      ...query,
      ...buildAndBlock(printTypeValues, "printType", "collectionMetadata_"),
    };
  }

  if (filters.token) {
    const tokenValues = splitString(filters.token);
    query = {
      ...query,
      ...buildAndBlock(tokenValues, "acceptedTokens", "collectionMetadata_"),
    };
  }

  return query;
};

export default buildQuery;

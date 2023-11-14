import { Filter } from "@/components/Search/types/search.types";
import { FilterInput } from "@/components/Tiles/types/tiles.types";

interface AndBlock {
  and?: {
    [key: string]: string;
  };
}

const buildQuery = (filters: Filter): FilterInput => {
  const splitString = (value: string): string[] => {
    return value.split(",").map((item) => item.trim());
  };

  const buildAndBlock = (values: string[], fieldName: string): AndBlock => {
    return values.slice(1).reduce<AndBlock>(
      (acc, value) => {
        return {
          and: { ...(acc.and || {}), [`${fieldName}_contains`]: value },
        };
      },
      { [`${fieldName}_contains`]: values[0] }
    );
  };

  let query: any = {};

  if (filters.access) {
    const values = splitString(filters?.access);
    query = { ...query, ...buildAndBlock(values, "access") };
  }

  if (filters.drop) {
    const values = splitString(filters.drop);
    query = { ...query, ...buildAndBlock(values, "drop") };
  }

  if (filters.editions !== undefined) {
    query.editions = filters.editions;
  }

  if (filters.size.apparel.length > 0) {
    query = {
      ...query,
      ...buildAndBlock(filters.size.apparel, "size_apparel"),
    };
  }

  if (filters.size.poster.length > 0) {
    query = { ...query, ...buildAndBlock(filters.size.poster, "size_poster") };
  }

  if (filters.size.sticker.length > 0) {
    query = {
      ...query,
      ...buildAndBlock(filters.size.sticker, "size_sticker"),
    };
  }

  if (filters.color.length > 0) {
    query = { ...query, ...buildAndBlock(filters.color, "color") };
  }

  if (filters.price) {
    query.price_gte = filters.price.min;
    query.price_lte = filters.price.max;
  }

  if (filters.printType.length > 0) {
    query = {
      ...query,
      ...buildAndBlock(
        filters.printType,
        "printType"
      ),
    };
  }

  return query;
};

export default buildQuery;

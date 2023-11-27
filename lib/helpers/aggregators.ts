import { PrintType } from "@/components/Tiles/types/tiles.types";
import { INFURA_GATEWAY } from "../constants";

export const aggregateMicrobrands = (
  collection: {
    tags: string[];
    microbrandCover: string;
    microbrand: string;
    drop: string;
    colors: string[];
    sizes: string[];
    printType: string;
    profileId: string;
  }[]
): string[][] => {
  const uniquePairs = new Set<string>();

  collection?.forEach((item) => {
    if (item.microbrand && item.microbrandCover) {
      const pair = JSON.stringify([
        item.microbrand,
        item.microbrandCover?.split("ipfs://")?.[1],
        item.profileId,
      ]);
      uniquePairs.add(pair);
    }
  });

  return Array.from(uniquePairs).map((pair) => JSON.parse(pair));
};

export const aggregateUniqueValues = (
  collection: {
    tags: string[];
    microbrandCover: string;
    microbrand: string;
    dropTitle: string;
    colors: string[];
    sizes: string[];
    printType: string;
  }[],
  key: keyof {
    tags: string[];
    microbrandCover: string;
    microbrand: string;
    dropTitle: string;
    colors: string[];
    sizes: string[];
    printType: string;
  }
): string[] => {
  const uniqueValues = new Set<string>();

  collection.forEach((item) => {
    if (key === "tags" && item[key]) {
      const tagsArray = item[key]
        .toString()
        .split(",")
        .map((tag) => tag.trim());
      tagsArray.forEach((tag) => {
        if (tag) uniqueValues.add(tag);
      });
    } else if (item[key]) {
      uniqueValues.add(item[key].toString());
    }
  });

  return Array.from(uniqueValues);
};

export const aggregateSizes = (
  collection: {
    tags: string[];
    microbrandCover: string;
    microbrand: string;
    drop: string;
    colors: string[];
    sizes: string[];
    printType: string;
  }[]
): {
  poster: string[];
  sticker: string[];
  apparel: string[];
} => {
  const sizes = {
    poster: new Set<string>(),
    sticker: new Set<string>(),
    apparel: new Set<string>(),
  };

  collection?.forEach((item) => {
    switch (item.printType) {
      case PrintType.Sticker:
        item.sizes?.forEach((size) => sizes.sticker.add(size));
        break;
      case PrintType.Poster:
        item.sizes?.forEach((size) => sizes.poster.add(size));
        break;
      case PrintType.Shirt:
      case PrintType.Hoodie:
      case PrintType.Sleeve:
      case PrintType.Crop:
        item.sizes?.forEach((size) => sizes.apparel.add(size));
        break;
    }
  });

  return {
    poster: Array.from(sizes.poster),
    sticker: Array.from(sizes.sticker),
    apparel: Array.from(sizes.apparel),
  };
};

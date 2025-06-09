export const aggregateMicrobrands = (
  collection: {
    metadata: {
      tags: string;
      microbrandCover: string;
      microbrand: string;
    };
    drop: {
      metadata: {
        title: string;
      };
    };
    printType: string;
    designer: string;
  }[]
): string[][] => {
  const uniquePairs = new Set<string>();

  collection?.forEach((item) => {
    if (item?.metadata?.microbrand && item?.metadata?.microbrandCover) {
      const pair = JSON.stringify([
        item?.metadata?.microbrand,
        item?.metadata?.microbrandCover?.split("ipfs://")?.[1],
        item?.designer,
      ]);
      uniquePairs.add(pair);
    }
  });

  return Array.from(uniquePairs).map((pair) => JSON.parse(pair));
};

export const aggregateUniqueValues = (
  collection: {
    metadata: {
      tags: string;
      microbrandCover: string;
      microbrand: string;
    };
    drop: {
      metadata: {
        title: string;
      };
    };
    printType: string;
    designer: string;
  }[],
  key: keyof {
    tags: string[];
    title: string;
    colors: string[];
  }
): string[] => {
  const uniqueValues = new Set<string>();

  collection?.forEach((item) => {
    if (key === "tags" && item?.metadata?.[key]) {
      const tagsArray = item.metadata.tags
        ?.split(",")
        ?.map((tag) => tag?.trim())
        ?.filter((tag) => tag.length > 0);

      tagsArray?.forEach((tag) => uniqueValues.add(tag));
    } else if (key === "title") {
      uniqueValues.add(item?.drop?.metadata?.[key]?.toString());
    }
  });

  return Array.from(uniqueValues);
};

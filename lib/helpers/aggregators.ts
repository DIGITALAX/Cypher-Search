export const aggregateMicrobrands = (
  collection: {
    collectionMetadata: {
      tags: string;
      microbrandCover: string;
      microbrand: string;
    };
    dropMetadata: {
      dropTitle: string;
    };
    printType: string;
    profileId: string;
  }[]
): string[][] => {
  const uniquePairs = new Set<string>();

  collection?.forEach((item) => {
    if (
      item?.collectionMetadata?.microbrand &&
      item?.collectionMetadata?.microbrandCover
    ) {
      const pair = JSON.stringify([
        item?.collectionMetadata?.microbrand,
        item?.collectionMetadata?.microbrandCover?.split("ipfs://")?.[1],
        item?.profileId,
      ]);
      uniquePairs.add(pair);
    }
  });

  return Array.from(uniquePairs).map((pair) => JSON.parse(pair));
};

export const aggregateUniqueValues = (
  collection: {
    collectionMetadata: {
      tags: string;
      microbrandCover: string;
      microbrand: string;
    };
    dropMetadata: {
      dropTitle: string;
    };
    printType: string;
    profileId: string;
  }[],
  key: keyof {
    tags: string[];
    dropTitle: string;
    colors: string[];
  }
): string[] => {
  const uniqueValues = new Set<string>();

  collection?.forEach((item) => {
    if (key === "tags" && item?.collectionMetadata?.[key]) {
      const tagsArray = item.collectionMetadata.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      tagsArray?.forEach((tag) => uniqueValues.add(tag));
    } else if (key === "dropTitle") {
      uniqueValues.add(item?.dropMetadata?.[key]?.toString());
    }
  });

  return Array.from(uniqueValues);
};



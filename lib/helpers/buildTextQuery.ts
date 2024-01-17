import { KINORA_QUEST_DATA } from "../constants";

const buildTextQuery = (inputText: string): Object | void => {
  const trimmedInputText = inputText?.trim();
  if (trimmedInputText === "" || !trimmedInputText) return;

  const commonWords = new Set([
    "a",
    "and",
    "or",
    "the",
    "in",
    "on",
    "for",
    "with",
  ]);
  const fieldsToSearch = [
    "mediaTypes",
    "tags",
    "profileHandle",
    "access",
    "microbrand",
    "prompt",
    "sizes",
    "colors",
    "title",
    "description",
    "communities",
    "visibility",
  ];

  const searchWords = trimmedInputText
    ?.split(/\s+/)
    ?.map((word) => word?.trim())
    ?.filter(
      (word) =>
        word && (word.length > 1 || trimmedInputText?.split(/\s+/).length === 1)
    )
    ?.filter((word) => !commonWords.has(word.toLowerCase()));

  let orConditions: any[] = [];
  fieldsToSearch?.forEach((field) => {
    searchWords?.forEach((word) => {
      orConditions.push({ [`${field}_contains_nocase`]: word });
    });
  });

  const query = {
    or: [
      {
        collectionMetadata_: { or: orConditions },
      },
    ],
  };

  return query;
};

export default buildTextQuery;

export const combineQueryObjects = (obj1: any, obj2: any) => {
  const obj1CollectionMetadataOrConditions = obj1.or[0].collectionMetadata_.or;

  if (obj2.and[0].hasOwnProperty("collectionMetadata_")) {
    obj2.and[0].collectionMetadata_.or = [
      ...obj2.and[0].collectionMetadata_.or,
      ...obj1CollectionMetadataOrConditions,
    ];
  } else {
    obj2.and.unshift({
      collectionMetadata_: { or: obj1CollectionMetadataOrConditions },
    });
  }

  return obj2;
};

export const buildKinoraTextQuery = (inputText: string): Object | void => {
  const trimmedInputText = inputText?.trim();
  if (trimmedInputText === "" || !trimmedInputText) return;

  const commonWords = new Set([
    "a",
    "and",
    "or",
    "the",
    "in",
    "on",
    "for",
    "with",
  ]);
  const fieldsToSearch = ["description", "title", "prompt"];

  const searchWords = trimmedInputText
    ?.split(/\s+/)
    ?.map((word) => word?.trim())
    ?.filter(
      (word) =>
        word && (word.length > 1 || trimmedInputText?.split(/\s+/).length === 1)
    )
    ?.filter((word) => !commonWords.has(word.toLowerCase()));

  let orConditions: any[] = [];
  fieldsToSearch?.forEach((field) => {
    searchWords?.forEach((word) => {
      orConditions.push({ [`${field}_contains_nocase`]: word });
    });
  });

  const query = {
    and: [
      {
        contractAddress: KINORA_QUEST_DATA,
      },
      {
        questMetadata_: { or: orConditions },
      },
    ],
  };

  return query;
};

export const buildKinoraProfileIds = (ids: string[]): Object | void => {
  if (ids?.length < 1) return;

  let orConditions: any[] = [];
  ids?.forEach((id) => {
    orConditions.push({ [`profileId`]: parseInt(id, 16) });
  });

  const query = {
    or: orConditions,
  };

  return query;
};

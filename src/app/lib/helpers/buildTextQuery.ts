import { KINORA_QUEST_DATA } from "../constants";

const buildTextQuery = (
  inputText: string,
  designer?: string
): Object | void => {
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
    "access",
    "microbrand",
    "prompt",
    "sizes",
    "colors",
    "title",
    "description",
  ];

  const dropFields = ["title"];

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

  let orConditionsDrop: any[] = [];
  dropFields?.forEach((field) => {
    searchWords?.forEach((word) => {
      orConditionsDrop.push({ [`${field}_contains_nocase`]: word });
    });
  });

  const query = {
    or: [
      designer && { designer },
      ...orConditionsDrop.map((condition) => {
        const key = Object.keys(condition)[0];
        return {
          dropMetadata_: {
            [key]: condition[key],
          },
        };
      }),
      ...orConditions.map((condition) => {
        const key = Object.keys(condition)[0];
        return {
          metadata_: {
            [key]: condition[key],
          },
        };
      }),
    ]?.filter(Boolean),
  };
  return query;
};
export default buildTextQuery;

export const buildTextQueryTripleA = (
  inputText: string,
  artist?: string
): Object | void => {
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
  const fieldsToSearch = ["title", "description", "format", "model", "prompt"];

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
      artist && { artist },
      ...orConditions.map((condition) => {
        const key = Object.keys(condition)[0];
        return {
          metadata_: {
            [key]: condition[key],
          },
        };
      }),
    ]?.filter(Boolean),
  };
  return query;
};

export const combineQueryObjects = (obj1: any, obj2: any) => {
  const obj1CollectionMetadataOrConditions = obj1.or[0].metadata_.or;

  if (obj2.and[0]?.hasOwnProperty("metadata_")) {
    obj2.and[0].metadata_.or = [
      ...obj2.and[0].metadata_.or,
      ...obj1CollectionMetadataOrConditions,
    ];
  } else {
    obj2.and.unshift({
      metadata_: { or: obj1CollectionMetadataOrConditions },
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

export const buildKinoraProfiles = (ids: string[]): Object | void => {
  if (ids?.length < 1) return;

  let orConditions: any[] = [];
  ids?.forEach((id) => {
    orConditions.push({ [`playerProfile`]: id });
  });

  const query = {
    or: orConditions,
  };

  return query;
};

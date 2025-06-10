import { MetadataAttributeType } from "@lens-protocol/metadata";
import { Status } from "../components/Autograph/types/autograph.types";
import { ItemType, PrintType } from "../components/Common/types/common.types";

export const CHROMADIN: `0x${string}` =
  "0x16a362A10C1f6Bc0565C8fFAd298f1c2761630C5";
export const INFURA_GATEWAY: string = "https://thedial.infura-ipfs.io";
export const GROVE_GATEWAY: string = "https://api.grove.storage/";
export const INFURA_GATEWAY_INTERNAL: string =
  "https://digitalax.xyz/api/infura/";
export const AUTOGRAPH_MARKET: `0x${string}` =
  "0x67819a22df4232726C7B911C1D4d5c06Cf080Cf8";
export const NFT_CREATOR_ADDRESS: `0x${string}` =
  "0x871bbD97035f8E7aD75dc9efc3939eDAab4BC614";
export const CHROMADIN_OPEN_ACTION: `0x${string}` =
  "0x9d92ceD1a44B0B509EC3b3ea13F79C152cdb1876";
export const LISTENER_OPEN_ACTION: `0x${string}` =
  "0xFA80e7EC17819A1724c32e49C760Ca0Ab0ceAb2a";
export const COIN_OP_OPEN_ACTION: `0x${string}` =
  "0x77D6D8A6d059820AD2C6DC2e3Fba73BcB1eFddf8";
export const KINORA_OPEN_ACTION: `0x${string}` = "0xUNDEFINED";
export const F3M_OPEN_ACTION: `0x${string}` =
  "0xBe8FBd070bD469bd486794C5f6a8C7D1DB2FcDc1";
export const PRINT_ACCESS_CONTROL: `0x${string}` =
  "0xBA1b711Be72AF33B168613D61B6497c35B055190";
export const COLLECTION_CREATOR: `0x${string}` =
  "0x52b229A682689Cd4f33E9fA7A47b0895cEB8Fe47";
export const DIGITALAX_ADDRESS: `0x${string}` =
  "0xAA3e5ee4fdC831e5274FE7836c95D670dC2502e6";
export const ZERO_ADDRESS: `0x${string}` =
  "0x0000000000000000000000000000000000000000";
export const F3M_ADDRESS: `0x${string}` =
  "0xbE20D3f61f6995996a5B8dd58B036ADa7cf30945";
export const TRIPLEA_MARKET: `0x${string}` =
  "0x6c7a9d566F6c2a9829B940b7571A220c70817c1a";
export const KINORA_QUEST_DATA: `0x${string}` = "0x";

export const IPFS_REGEX: RegExp = /\b(Qm[1-9A-Za-z]{44}|ba[A-Za-z2-7]{57})\b/;
export const PLACEHOLDERS: { en: string; es: string }[] = [
  {
    es: "¿Conoce al creador por nombre? menciónele con @, no juzgaremos",
    en: "know the creator by name? @ them, we won't judge",
  },
  {
    es: "tranformar, retocar, o renovar por completo — cada mineto e impresión en Cypher es CC0",
    en: "transform, tinker, or totally overhaul – every mint & print on Cypher is CC0",
  },
  {
    es: "algunas ideas de los hashes en tendencia: #synthwave #neobrutalism #autonomy",
    en: "some ideas from trending hashes: #synthwave #neobrutalism #autonomy",
  },
  {
    es: "Con el ecosistem a sus manos, ¿por dónde empieza?",
    en: "with the ecosystem at your fingertips, where do you start?",
  },
  {
    es: "¿No sabe lo que busca? pruebe una mezcla aleatoria",
    en: "don't know what you're looking for? try a random mix",
  },
];

export const ACCEPTED_TOKENS: string[][] = [
  [
    "QmYCDxCv7mJyjn49n84kP6d3ADgGp422ukKzRyd2ZcGEsW",
    "WGHO",
    "0x6bDc36E20D267Ff0dd6097799f82e78907105e2F",
  ],
  [
    "QmYJ6cpGRgQAr2d5hJDJ9CaJukt2szcHc1AqFBy9m6knUw",
    "WETH",
    "0xE5ecd226b3032910CEaa43ba92EE8232f8237553",
  ],
  [
    "QmZSDyGYYy9hn8RAUC1vZeZXC5y2H3YimzajJRngCTu5Fq",
    "MONA",
    "0x28547B5b6B405A1444A17694AC84aa2d6A03b3Bd",
  ],
  [
    "QmXoAwGW51843qTUxV8pkouewRHDvkyJ3A7tsCUGgGXqVs",
    "BONSAI",
    "0xB0588f9A9cADe7CD5f194a5fe77AcD6A58250f82",
  ],
];

export const ACCEPTED_TOKENS_MUMBAI: string[][] = [
  [
    "QmYYUQ8nGDnyuk8jQSung1WmTksvLEQBXjnCctdRrKtsNk",
    "WMATIC",
    "0x3cf7283c025d82390e86d2feb96eda32a393036b",
  ],
  [
    "QmZRhUgjK6bJM8fC7uV145yf66q2e7vGeT7CLosw1SdMdN",
    "WETH",
    "0x566d63f1cc7f45bfc9b2bdc785ffcc6f858f0997",
  ],
  [
    "QmS6f8vrNZok9j4pJttUuWpNrjsf4vP9RD5mRL36z6UdaL",
    "MONA",
    "0xf87b6343c172720ac9cc7d1c9465d63454a8ef30",
  ],
  [
    "QmSbpsDRwxSCPBWPkwWvcb49jViSxzmNHjYy3AcGF3qM2x",
    "USDT",
    "0x07b722856369f6b923e1f276abca58dd3d15243d",
  ],
];

export const GALLERY_OPTIONS: { en: string; es: string }[] = [
  { es: "MÁS NUEVO", en: "NEWEST" },
  { es: "MÁS VIEJO", en: "OLDEST" },
  { es: "TIPO DE IMPRESIÓN", en: "PRINT TYPE" },
  { es: "CREADO", en: "CREATED" },
  { es: "COLECCIONADO", en: "COLLECTED" },
  { es: "BAJO PRECIO", en: "PRICE LOWEST" },
  { es: "ALTO PRECIO", en: "PRICE HIGHEST" },
];

export const numberToItemTypeMap: { [key: number]: ItemType } = {
  1: ItemType.CoinOp,
  0: ItemType.Chromadin,
  5: ItemType.TripleA,
  4: ItemType.Kinora,
  2: ItemType.Listener,
  3: ItemType.F3M,
  6: ItemType.Other,
};

export const itemTypeToNumber: { [key in ItemType]: string } = {
  [ItemType.CoinOp]: "1",
  [ItemType.Chromadin]: "0",
  [ItemType.TripleA]: "5",
  [ItemType.Listener]: "2",
  [ItemType.F3M]: "3",
  [ItemType.Other]: "6",
  [ItemType.Kinora]: "4",
  [ItemType.TheDial]: "7",
};

export const itemStringToNumber: { [key: string]: string } = {
  ["Chromadin"]: "0",
  ["CoinOp"]: "1",
  ["Listener"]: "2",
  ["F3M"]: "3",
  ["Kinora"]: "4",
  ["TripleA"]: "5",
  ["Other"]: "6",
  ["Dial"]: "7",
};

export const addressToItemType: { [key: `0x${string}`]: number } = {
  ["0x9d92ceD1a44B0B509EC3b3ea13F79C152cdb1876"]: 0,
  ["0x77D6D8A6d059820AD2C6DC2e3Fba73BcB1eFddf8"]: 1,
  ["0xFA80e7EC17819A1724c32e49C760Ca0Ab0ceAb2a"]: 2,
  ["0xBe8FBd070bD469bd486794C5f6a8C7D1DB2FcDc1"]: 3,
  ["0x"]: 4,
};

export const itemStringToType: { [key: string]: ItemType } = {
  ["chromadin"]: ItemType.Chromadin,
  ["coinop"]: ItemType.CoinOp,
  ["listener"]: ItemType.Listener,
  ["f3m"]: ItemType.F3M,
  ["kinora"]: ItemType.Kinora,
  ["TripleA"]: ItemType.TripleA,
  ["other"]: ItemType.Other,
  ["dial"]: ItemType.TheDial,
};

export const itemStringToNumberType: { [key: string]: string } = {
  ["chromadin"]: "0",
  ["coinop"]: "1",
  ["listener"]: "2",
  ["f3m"]: "3",
  ["kinora"]: "4",
  ["triplea"]: "5",
  ["other"]: "6",
  ["dial"]: "7",
};

export const itemTypeToString: { [key in ItemType]: string } = {
  [ItemType.Chromadin]: "chromadin",
  [ItemType.CoinOp]: "coinop",
  [ItemType.Listener]: "listener",
  [ItemType.F3M]: "f3m",
  [ItemType.Kinora]: "kinora",
  [ItemType.TripleA]: "triplea",
  [ItemType.Other]: "other",
  [ItemType.TheDial]: "dial",
};

export const printTypeToNumber: { [key in PrintType]: string } = {
  [PrintType.Sticker]: "0",
  [PrintType.Poster]: "1",
  [PrintType.Shirt]: "2",
  [PrintType.Hoodie]: "3",
  [PrintType.Sleeve]: "4",
  [PrintType.Crop]: "5",
  [PrintType.NFTOnly]: "6",
  [PrintType.Custom]: "7",
  [PrintType.Other]: "8",
};

export enum Format {
  Hoodie = "Hoodie",
  LongSleeve = "Long Sleeve",
  Tee = "Tee",
  Sticker = "Sticker",
  Poster = "Poster",
}

export const formatToString: { [key in Format]: string } = {
  [Format.Sticker]: "sticker",
  [Format.Poster]: "poster",
  [Format.LongSleeve]: "sleeve",
  [Format.Hoodie]: "hoodie",
  [Format.Tee]: "shirt",
};

export const numberToFormat: { [key in number]: Format } = {
  [0]: Format.Sticker,
  [1]: Format.Poster,
  [4]: Format.LongSleeve,
  [3]: Format.Hoodie,
  [2]: Format.Tee,
};

export const numberToPrintType: { [key in number]: PrintType } = {
  0: PrintType.Sticker,
  1: PrintType.Poster,
  2: PrintType.Shirt,
  3: PrintType.Hoodie,
  4: PrintType.Sleeve,
  5: PrintType.Crop,
  6: PrintType.NFTOnly,
  7: PrintType.Custom,
  8: PrintType.Other,
};

export const printTypeToString: { [key in PrintType]: string } = {
  [PrintType.Sticker]: "sticker",
  [PrintType.Poster]: "poster",
  [PrintType.Shirt]: "shirt",
  [PrintType.Hoodie]: "hoodie",
  [PrintType.Sleeve]: "sleeve",
  [PrintType.Crop]: "crop",
  [PrintType.NFTOnly]: "nftOnly",
  [PrintType.Custom]: "custom",
  [PrintType.Other]: "other",
};

export const LANGS: string[] = ["/", "/es/", "/en/"];

export const orderStatus: { [key in number]: Status } = {
  [0]: Status.Fulfilled,
  [1]: Status.Shipped,
  [2]: Status.Shipping,
  [3]: Status.Designing,
};

export const formatToNumber: { [key in Format]: string } = {
  [Format.Sticker]: "0",
  [Format.Poster]: "1",
  [Format.LongSleeve]: "4",
  [Format.Hoodie]: "3",
  [Format.Tee]: "2",
};

export const printStringToNumber: { [key: string]: string } = {
  ["Sticker"]: "0",
  ["Poster"]: "1",
  ["Shirt"]: "2",
  ["Hoodie"]: "3",
  ["Sleeve"]: "4",
  ["Crop"]: "5",
  ["NFTOnly"]: "6",
  ["Custom"]: "7",
  ["Other"]: "8",
};

export const COUNTRIES: string[] = [
  "United States",
  "Algeria",
  "Argentina",
  "Australia",
  "Belgium",
  "Brazil",
  "Canada",
  "Chile",
  "China",
  "Colombia",
  "Egypt",
  "France",
  "Germany",
  "Greece",
  "India",
  "Indonesia",
  "Ireland",
  "Israel",
  "Italy",
  "Japan",
  "Kenya",
  "Malaysia",
  "Mexico",
  "Morocco",
  "Netherlands",
  "New Zealand",
  "Nigeria",
  "Norway",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Singapore",
  "South Africa",
  "South Korea",
  "Spain",
  "Sweden",
  "Switzerland",
  "Tanzania",
  "Thailand",
  "Turkey",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "Venezuela",
  "Vietnam",
];

export const TAGS: string[] = [
  "AI",
  "public domain",
  "cc0",
  "cypherpunk",
  "solarpunk",
  "lofi",
  "bedroom punk",
  "crypto",
  "Autonomy",
  "retrofuturism",
  "cybernetics",
  "bio punk",
  "digital art",
  "urban exploration",
  "ambient",
  "sustainable",
  "augmented",
  "fashion",
  "abstract expressionism",
  "street photography",
  "minimalist landscapes",
  "digital surrealism",
  "contemporary sculpture",
  "vintage fashion",
  "ceramic artistry",
  "urban graffiti",
  "fantasy illustration",
  "retro pop culture",
  "artisan crafts",
  "eco-friendly designs",
  "watercolor botanicals",
  "avant-garde film",
  "jazz age posters",
  "psychedelic patterns",
  "geometric tattoos",
  "steampunk inventions",
  "gothic architecture",
  "conceptual installations",
  "Abstract",
  "Bohemian",
  "Cyberpunk",
  "Deco",
  "Ethereal",
  "Futurism",
  "Graffiti",
  "neo",
  "Holographic",
  "Impressionist",
  "Juxtaposed",
  "Kinetic",
  "Luminous",
  "Minimalist",
  "Neon",
  "Organic",
  "Pixel",
  "Quirky",
  "Retro",
  "Surreal",
  "Textured",
];

export const REFINED_TAGS: string[] = [
  "graffiti",
  "streetwear",
  "new york",
  "arabia",
  "cypher",
];

export const FILTER_SHUFFLE: Object[] = [
  {
    hashtag: "",

    microbrand: "",
    catalog: "",
    access: "",
    format: "",
    origin: "chromadin",
    editions: 0,
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
      max: 0,
    },
    token: "",
    printType: [],
  },
  {
    hashtag: "",

    microbrand: "",
    catalog: "",
    access: "",
    format: "",
    origin: "kinora",
    editions: 0,
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
      max: 0,
    },
    token: "",
    printType: [],
  },
  {
    hashtag: "",

    microbrand: "synthetic futures",
    catalog: "",
    access: "",
    format: "",
    origin: "chromadin",
    editions: 0,
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
      max: 0,
    },
    token: "",
    printType: [],
  },
  {
    hashtag: "",

    microbrand: "",
    catalog: "",
    access: "",
    format: "",
    origin: "coinop, lit listener",
    editions: 0,
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
      max: 0,
    },
    token: "",
    printType: ["hoodie"],
  },
  {
    hashtag: "",

    microbrand: "",
    catalog: "",
    access: "",
    format: "",
    origin: "chromadin",
    editions: 0,
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
      max: 0,
    },
    token: "",
    printType: [],
  },
  {
    hashtag: "",

    microbrand: "isekai",
    catalog: "",
    access: "",
    format: "",
    origin: "",
    editions: 0,
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
      max: 0,
    },
    token: "",
    printType: [],
  },
  {
    hashtag: "",

    microbrand: "",
    catalog: "",
    access: "",
    format: "",
    origin: "coinop",
    editions: 0,
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
      max: 0,
    },
    token: "",
    printType: [],
  },
  {
    hashtag: "mariposas",

    microbrand: "",
    catalog: "",
    access: "",
    format: "",
    origin: "",
    editions: 0,
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
      max: 0,
    },
    token: "",
    printType: [],
  },
  {
    hashtag: "streetwear",

    microbrand: "",
    catalog: "",
    access: "",
    format: "",
    origin: "",
    editions: 0,
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
      max: 0,
    },
    token: "",
    printType: [],
  },
  {
    hashtag: "graffiti",

    microbrand: "",
    catalog: "",
    access: "",
    format: "",
    origin: "",
    editions: 0,
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
      max: 0,
    },
    token: "",
    printType: [],
  },
  {
    hashtag: "girl",

    microbrand: "",
    catalog: "",
    access: "",
    format: "",
    origin: "",
    editions: 0,
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
      max: 0,
    },
    token: "",
    printType: [],
  },
  {
    hashtag: "sticky",

    microbrand: "",
    catalog: "",
    access: "",
    format: "",
    origin: "",
    editions: 0,
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
      max: 0,
    },
    token: "",
    printType: [],
  },
  {
    hashtag: "",

    microbrand: "verbandden",
    catalog: "",
    access: "",
    format: "",
    origin: "",
    editions: 0,
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
      max: 0,
    },
    token: "",
    printType: [],
  },
  {
    hashtag: "drawn lines",

    microbrand: "",
    catalog: "",
    access: "",
    format: "",
    origin: "",
    editions: 0,
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
      max: 0,
    },
    token: "",
    printType: [],
  },
  {
    hashtag: "",

    microbrand: "put2",
    catalog: "",
    access: "",
    format: "",
    origin: "",
    editions: 0,
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
      max: 0,
    },
    token: "",
    printType: [],
  },
  {
    hashtag: "boots",

    microbrand: "",
    catalog: "",
    access: "",
    format: "",
    origin: "",
    editions: 0,
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
      max: 0,
    },
    token: "",
    printType: [],
  },
  {
    hashtag: "flying",

    microbrand: "",
    catalog: "",
    access: "",
    format: "",
    origin: "",
    editions: 0,
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
      max: 0,
    },
    token: "",
    printType: [],
  },
  {
    hashtag: "nyc",

    microbrand: "",
    catalog: "",
    access: "",
    format: "",
    origin: "",
    editions: 0,
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
      max: 0,
    },
    token: "",
    printType: [],
  },
  {
    hashtag: "arabe",

    microbrand: "",
    catalog: "",
    access: "",
    format: "",
    origin: "",
    editions: 0,
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
      max: 0,
    },
    token: "",
    printType: [],
  },
  {
    hashtag: "sunset, beach",

    microbrand: "",
    catalog: "",
    access: "",
    format: "",
    origin: "",
    editions: 0,
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
      max: 0,
    },
    token: "",
    printType: [],
  },
  {
    hashtag: "",

    microbrand: "",
    catalog: "",
    access: "",
    format: "",
    origin: "f3manifesto",
    editions: 0,
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
      max: 0,
    },
    token: "",
    printType: [],
  },
  {
    hashtag: "",

    microbrand: "",
    catalog: "",
    access: "",
    format: "",
    origin: "Lit Listener",
    editions: 0,
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
      max: 0,
    },
    token: "",
    printType: [],
  },
];

export const numberToAutograph: { [key in number]: string } = {
  [0]: "NFT",
  [1]: "Hoodie",
  [2]: "Shirt",
  [3]: "Catalog",
  [4]: "Mix",
};

export const autographTypeToNumber: { [key in string]: number } = {
  ["NFT"]: 0,
  ["Hoodie"]: 1,
  ["Shirt"]: 2,
  ["Catalog"]: 3,
  ["Mix"]: 4,
};

export const typeMapping: { [key in string]: MetadataAttributeType } = {
  ["STRING"]: MetadataAttributeType.STRING,
  ["string"]: MetadataAttributeType.STRING,
  ["String"]: MetadataAttributeType.STRING,
  ["BOOLEAN"]: MetadataAttributeType.BOOLEAN,
  ["boolean"]: MetadataAttributeType.BOOLEAN,
  ["Boolean"]: MetadataAttributeType.BOOLEAN,
  ["DATE"]: MetadataAttributeType.DATE,
  ["date"]: MetadataAttributeType.DATE,
  ["Date"]: MetadataAttributeType.DATE,
  ["NUMBER"]: MetadataAttributeType.NUMBER,
  ["number"]: MetadataAttributeType.NUMBER,
  ["Number"]: MetadataAttributeType.NUMBER,
  ["JSON"]: MetadataAttributeType.JSON,
  ["json"]: MetadataAttributeType.JSON,
  ["Json"]: MetadataAttributeType.JSON,
};

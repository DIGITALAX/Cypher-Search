import { ItemType } from "@/components/Common/types/common.types";
import { PrintType } from "@/components/Tiles/types/tiles.types";

export const CHROMADIN_ID: string = "0x01c6a9";
export const INFURA_GATEWAY: string = "https://thedial.infura-ipfs.io";
export const BASE_URL: string = "https://api-v2.lens.dev/";
export const DIGITALAX_PROFILE_ID_LENS: string = "0x012d";
export const LENS_HUB_PROXY_ADDRESS_MUMBAI: `0x${string}` =
  "0xC1E77eE73403B8a7478884915aA599932A677870";
export const LENS_HUB_PROXY_ADDRESS_MATIC: `0x${string}` =
  "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d";
export const NFT_CREATOR_ADDRESS: `0x${string}` =
  "0x0147435c505390Bb1E657c8EBc373DcEdfDe0F08";
export const CHROMADIN_OPEN_ACTION: `0x${string}` =
  "0x98E067473497B7E7A979A7Fe0D1026D9aeDF3bc3";
export const LISTENER_OPEN_ACTION: `0x${string}` =
  "0xF1e111fD643954234d6C8482fFa5f4dE778e7aD6";
export const COIN_OP_OPEN_ACTION: `0x${string}` =
  "0x179ACb90575CfF001c6c767b197FFe100B6ADc3a";
export const F3M_OPEN_ACTION: `0x${string}` =
  "0xb92725B5Bea87C7Ed856898AaC3122548aBA6349";
export const LEGEND_OPEN_ACTION: `0x${string}` = "0x";
export const PRINT_ACCESS_CONTROL: `0x${string}` =
  "0x4931896d9bF48C670FAb6f1b6189DDC122Ff7e2E";
export const COLLECTION_CREATOR: `0x${string}` =
  "0x0c585F09765DF503Bf3C83457bC5834FB761E411";
export const DIGITALAX_ADDRESS: `0x${string}` =
  "0xAA3e5ee4fdC831e5274FE7836c95D670dC2502e6";
export const ZERO_ADDRESS: `0x${string}` =
  "0x0000000000000000000000000000000000000000";
export const F3M_ADDRESS: `0x${string}` =
  "0xbE20D3f61f6995996a5B8dd58B036ADa7cf30945";

export const IPFS_REGEX: RegExp = /\b(Qm[1-9A-Za-z]{44}|ba[A-Za-z2-7]{57})\b/;
export const PLACEHOLDERS: string[] = [
  "know the creator by name? @ them, we won't judge",
  "transform, tinker, or totally overhaul – every mint & print on Cypher is CC0",
  "some ideas from trending hashes: #synthwave #neobrutalism #autonomy",
  "with the ecosystem at your fingertips, where do you start?",
  "don't know what you're looking for? try a random mix",
];

export const ACCEPTED_TOKENS: string[][] = [
  [
    "QmYYUQ8nGDnyuk8jQSung1WmTksvLEQBXjnCctdRrKtsNk",
    "WMATIC",
    "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
  ],
  [
    "QmZRhUgjK6bJM8fC7uV145yf66q2e7vGeT7CLosw1SdMdN",
    "WETH",
    "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
  ],
  [
    "QmSbpsDRwxSCPBWPkwWvcb49jViSxzmNHjYy3AcGF3qM2x",
    "USDT",
    "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
  ],
  [
    "QmS6f8vrNZok9j4pJttUuWpNrjsf4vP9RD5mRL36z6UdaL",
    "MONA",
    "0x6968105460f67c3bf751be7c15f92f5286fd0ce5",
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

export const GALLERY_OPTIONS: string[] = [
  "NEWEST",
  "OLDEST",
  "PRINT TYPE",
  "CREATED",
  "COLLECTED",
  "PRICE LOWEST",
  "PRICE HIGHEST",
];

export const numberToItemTypeMap: { [key: number]: ItemType } = {
  0: ItemType.CoinOp,
  1: ItemType.Chromadin,
  2: ItemType.Legend,
  3: ItemType.Listener,
  4: ItemType.F3M,
  5: ItemType.Other,
};

export const itemTypeToNumber: { [key in ItemType]: string } = {
  [ItemType.CoinOp]: "0",
  [ItemType.Chromadin]: "1",
  [ItemType.Legend]: "2",
  [ItemType.Listener]: "3",
  [ItemType.F3M]: "4",
  [ItemType.Other]: "5",
  [ItemType.Kinora]: "6",
  [ItemType.TheDial]: "7",
};

export const itemStringToNumber: { [key: string]: string } = {
  ["CoinOp"]: "0",
  ["Chromadin"]: "1",
  ["Legend"]: "2",
  ["Listener"]: "3",
  ["F3M"]: "4",
  ["Other"]: "5",
  ["Kinora"]: "6",
  ["Dial"]: "7",
};

export const itemStringToType: { [key: string]: ItemType } = {
  ["coinop"]: ItemType.CoinOp,
  ["chromadin"]: ItemType.Chromadin,
  ["legend"]: ItemType.Legend,
  ["listener"]: ItemType.Listener,
  ["f3m"]: ItemType.F3M,
  ["other"]: ItemType.Other,
  ["kinora"]: ItemType.Kinora,
  ["dial"]: ItemType.TheDial,
};

export const itemTypeToString: { [key in ItemType]: string } = {
  [ItemType.CoinOp]: "coinop",
  [ItemType.Chromadin]: "chromadin",
  [ItemType.Legend]: "legend",
  [ItemType.Listener]: "listener",
  [ItemType.F3M]: "f3m",
  [ItemType.Other]: "other",
  [ItemType.Kinora]: "kinora",
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

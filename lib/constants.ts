import { ItemType } from "@/components/Common/types/common.types";

export const INFURA_GATEWAY: string = "https://thedial.infura-ipfs.io";
export const BASE_URL: string = "https://api-v2-mumbai.lens.dev/";
export const DIGITALAX_PROFILE_ID_LENS: string = "0x012d";
export const LENS_HUB_PROXY_ADDRESS_MUMBAI: `0x${string}` =
  "0xC1E77eE73403B8a7478884915aA599932A677870";
export const LENS_HUB_PROXY_ADDRESS_MATIC: `0x${string}` =
  "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d";

export const PLACEHOLDERS: string[] = [
  "know the creator by name? @ them, we won't judge",
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
};

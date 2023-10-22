export const INFURA_GATEWAY: string = "https://thedial.infura-ipfs.io";

export const PLACEHOLDERS: string[] = [
  "know the creator by name? @ them, we won't judge",
  "some ideas from trending hashes: #synthwave #neobrutalism #autonomy",
  "with the ecosystem at your fingertips, where do you start?",
  "don't know what you're looking for? try a random mix",
];

export const FILTER_VALUES: {
  hashtags: string[];
  microbrands: string[];
  community: string[];
  access: string[];
  format: string[];
  origin: string[];
  publications: string[];
  token: string[];
} = {
  hashtags: ["hashtag1", "hashtag2", "hashtag3", "hashtag4"],
  microbrands: ["microbrand1", "microbrand2", "microbrand3", "microbrand4"],
  community: ["com1", "com2", "com3", "com4"],
  access: ["CC0 Public Domain", "Ethical Climate Core"],
  format: ["Image", "Video", "Text", "Music"],
  origin: ["Chromadin", "Coin Op", "Legend", "The Dial"],
  publications: [],
  token: ["MONA", "USDT", "WMATIC", "WETH"],
};


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
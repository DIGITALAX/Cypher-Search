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

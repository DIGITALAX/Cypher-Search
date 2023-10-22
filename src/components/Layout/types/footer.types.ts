export type FooterProps = {
  handleRewind: () => void;
};

export enum ItemType {
  Chromadin = "chromadin",
  CoinOp = "coinOp",
  Legend = "legend",
  Listener = "listener",
}

export interface CartItem {
  size: string | undefined;
  color: string | undefined;
  amount: number;
  collectionId: string;
  level: number | undefined;
  type: ItemType;
}

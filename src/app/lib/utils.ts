import { CartItem } from "../components/Common/types/common.types";

const CYPHER_STORAGE_KEY = "CYPHER_STORAGE_KEY";

export const setCypherStorageCart = (cartItems: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(CYPHER_STORAGE_KEY, cartItems);
    return;
  }
};

export const getCypherStorageCart = () => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(CYPHER_STORAGE_KEY);

    if (!data) return null;

    return JSON.parse(data) as CartItem[];
  }
};

export const removeCypherStorageCart = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(CYPHER_STORAGE_KEY);
  }
};

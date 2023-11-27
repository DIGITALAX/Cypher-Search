import { Creation } from "@/components/Tiles/types/tiles.types";

const getGallerySort = (
  selectedOption: string,
  gallery:
    | {
        created: Creation[];
        collected: Creation[];
      }
): Creation[] => {
  return selectedOption === "NEWEST"
    ? [...(gallery?.collected || []), ...(gallery?.created || [])].sort(
        (a, b) => Number(b.blockTimestamp) - Number(a.blockTimestamp)
      )
    : selectedOption === "OLDEST"
    ? [...(gallery?.collected || []), ...(gallery?.created || [])].sort(
        (a, b) => Number(a.blockTimestamp) - Number(b.blockTimestamp)
      )
    : selectedOption === "CREATED"
    ? [...(gallery?.created || []), ...(gallery?.collected || [])]
    : selectedOption === "COLLECTED"
    ? [...(gallery?.collected || []), ...(gallery?.created || [])]
    : selectedOption === "PRINT TYPE"
    ? Object.values(
        [...(gallery?.collected || []), ...(gallery?.created || [])].reduce(
          (acc: Record<string, any>, item) => {
            const printType = item.printType || "6";
            acc[printType] = acc[printType] || [];
            acc[printType].push(item);
            return acc;
          },
          {}
        )
      ).flat()
    : selectedOption === "PRICE LOWEST"
    ? [...(gallery?.collected || []), ...(gallery?.created || [])].sort(
        (a, b) => (Number(a.prices?.[0]) || 0) - (Number(b.prices?.[0]) || 0)
      )
    : [...(gallery?.collected || []), ...(gallery?.created || [])].sort(
        (a, b) => (Number(b.prices?.[0]) || 0) - (Number(a.prices?.[0]) || 0)
      );
};

export default getGallerySort;

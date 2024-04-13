import { Creation } from "@/components/Tiles/types/tiles.types";
import { GALLERY_OPTIONS } from "../constants";

const getGallerySort = (
  selectedOption: string,
  gallery: {
    created: Creation[];
    collected: Creation[];
  },
  lan: "es" | "en"
): Creation[] => {
  return selectedOption === GALLERY_OPTIONS[0]?.[lan]
    ? [...(gallery?.collected || []), ...(gallery?.created || [])].sort(
        (a, b) => Number(b.blockTimestamp) - Number(a.blockTimestamp)
      )
    : selectedOption === GALLERY_OPTIONS[1]?.[lan]
    ? [...(gallery?.collected || []), ...(gallery?.created || [])].sort(
        (a, b) => Number(a.blockTimestamp) - Number(b.blockTimestamp)
      )
    : selectedOption === GALLERY_OPTIONS[3]?.[lan]
    ? [...(gallery?.created || []), ...(gallery?.collected || [])]
    : selectedOption === GALLERY_OPTIONS[4]?.[lan]
    ? [...(gallery?.collected || []), ...(gallery?.created || [])]
    : selectedOption === GALLERY_OPTIONS[2]?.[lan]
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
    : selectedOption === GALLERY_OPTIONS[5]?.[lan]
    ? [...(gallery?.collected || []), ...(gallery?.created || [])].sort(
        (a, b) => (Number(a.prices?.[0]) || 0) - (Number(b.prices?.[0]) || 0)
      )
    : [...(gallery?.collected || []), ...(gallery?.created || [])].sort(
        (a, b) => (Number(b.prices?.[0]) || 0) - (Number(a.prices?.[0]) || 0)
      );
};

export default getGallerySort;

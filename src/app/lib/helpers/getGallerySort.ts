import { Collection } from "@/app/components/Common/types/common.types";
import { formatToNumber, GALLERY_OPTIONS } from "../constants";
import { NFTData } from "@/app/components/Tiles/types/tiles.types";

const getGallerySort = (
  selectedOption: string,
  gallery: {
    createdPrint: Collection[];
    collectedPrint: Collection[];
    createdTripleA: NFTData[];
    collectedTripleA: NFTData[];
  },
  lan: "es" | "en"
): (Collection | NFTData)[] => {
  return selectedOption === GALLERY_OPTIONS[0]?.[lan]
    ? [
        ...(gallery?.collectedPrint || []),
        ...(gallery?.collectedTripleA || []),
        ...(gallery?.createdPrint || []),
        ...(gallery?.createdTripleA || []),
      ].sort((a, b) => Number(b.blockTimestamp) - Number(a.blockTimestamp))
    : selectedOption === GALLERY_OPTIONS[1]?.[lan]
    ? [
        ...(gallery?.collectedPrint || []),
        ...(gallery?.collectedTripleA || []),
        ...(gallery?.createdPrint || []),
        ...(gallery?.createdTripleA || []),
      ].sort((a, b) => Number(a.blockTimestamp) - Number(b.blockTimestamp))
    : selectedOption === GALLERY_OPTIONS[2]?.[lan]
    ? Object.values(
        [
          ...(gallery?.collectedPrint || []),
          ...(gallery?.collectedTripleA || []),
          ...(gallery?.createdPrint || []),
          ...(gallery?.createdTripleA || []),
        ].reduce((acc: Record<string, any>, item) => {
          const printType =
            (item as Collection).printType ||
            formatToNumber[(item as NFTData).metadata?.format!] ||
            "6";
          acc[printType] = acc[printType] || [];
          acc[printType].push(item);
          return acc;
        }, {})
      ).flat()
    : selectedOption === GALLERY_OPTIONS[3]?.[lan]
    ? [
        ...(gallery?.createdPrint || []),
        ...(gallery?.createdTripleA || []),
        ...(gallery?.collectedPrint || []),
        ...(gallery?.collectedTripleA || []),
      ]
    : selectedOption === GALLERY_OPTIONS[4]?.[lan]
    ? [
        ...(gallery?.collectedPrint || []),
        ...(gallery?.collectedPrint || []),
        ...(gallery?.createdPrint || []),
        ...(gallery?.createdTripleA || []),
      ]
    : selectedOption === GALLERY_OPTIONS[5]?.[lan]
    ? [
        ...(gallery?.collectedPrint || []),
        ...(gallery?.collectedTripleA || []),
        ...(gallery?.createdPrint || []),
        ...(gallery?.createdTripleA || []),
      ].sort(
        (a, b) =>
          (Number(
            (a as Collection).price ?? (a as NFTData)?.prices?.[0]?.price
          ) || 0) -
          (Number(
            (b as Collection).price ?? (b as NFTData)?.prices?.[0]?.price
          ) || 0)
      )
    : [
        ...(gallery?.collectedPrint || []),
        ...(gallery?.collectedTripleA || []),
        ...(gallery?.createdPrint || []),
        ...(gallery?.createdTripleA || []),
      ].sort(
        (a, b) =>
          (Number(
            (b as Collection).price ?? (b as NFTData)?.prices?.[0]?.price
          ) || 0) -
          (Number(
            (a as Collection).price ?? (a as NFTData)?.prices?.[0]?.price
          ) || 0)
      );
};

export default getGallerySort;

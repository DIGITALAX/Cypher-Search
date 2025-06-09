import { GeneralPub } from "@/app/components/Tiles/types/tiles.types";

const mixArrays = (arrays: GeneralPub[][]): GeneralPub[] => {
  let maxLength: number = Math.max(...arrays.map((arr) => arr.length));
  let mixedArray: GeneralPub[] = [];

  for (let i = 0; i < maxLength; i++) {
    arrays.forEach((arr: GeneralPub[]) => {
      if (arr[i] !== undefined) {
        mixedArray.push(arr[i]);
      }
    });
  }
  return mixedArray;
};

export default mixArrays;

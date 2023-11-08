export const getRandomElement = (arr: string[]): string => {
  const numberOfElements = Math.floor(Math.random() * 4) + 1;
  const tempArr = [...arr];
  const selectedElements: string[] = [];
  for (let i = 0; i < numberOfElements; i++) {
    const randomIndex = Math.floor(Math.random() * tempArr.length);
    selectedElements.push(tempArr.splice(randomIndex, 1)[0]);
  }
  return selectedElements.join(", ");
};

export const getRandomArrayElement = (arr: string[]): string[] => {
  const numberOfElements = Math.floor(Math.random() * 4) + 1;
  const tempArr = [...(arr || [])];
  const selectedElements: string[] = [];
  for (let i = 0; i < numberOfElements; i++) {
    const randomIndex = Math.floor(Math.random() * tempArr.length);
    selectedElements.push(tempArr.splice(randomIndex, 1)[0]);
  }
  return selectedElements;
};

export const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

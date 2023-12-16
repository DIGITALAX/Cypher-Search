const cleanObject = (obj: Record<string, any>): Record<string, any> => {
  return Object.entries(obj).reduce(
    (acc: Record<string, any>, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    },
    {}
  );
};

export default cleanObject;

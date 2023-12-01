const serializeQuery = (
    obj: { [key: string]: any },
    depth: number = 0
  ): string => {
    const indent: string = "  ".repeat(depth);
    const entries: string[] = Object.entries(obj).map(([key, value]): string => {
      if (Array.isArray(value)) {
        const arrayValues: string = value
          .map((val) => {
            if (typeof val === "object" && val !== null) {
              // Enclose each object in the array with {}
              return `{\n${serializeQuery(val, depth + 1)}\n${indent}}`;
            } else {
              return serializeQuery(val, depth + 1);
            }
          })
          .join(",\n" + indent);
        return `${key}: [\n${indent}${arrayValues}\n${indent}]`;
      } else if (typeof value === "object" && value !== null) {
        return `${key}: {\n${serializeQuery(value, depth + 1)}\n${indent}}`;
      } else {
        return `${key}: ${JSON.stringify(value)}`;
      }
    });
    return entries.join(",\n" + indent);
  };
  
  export default serializeQuery;
  
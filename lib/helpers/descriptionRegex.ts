const descriptionRegex = (description: string, colorChange: boolean) => {
  const replacedDescription = description?.replace(/\n\n/g, "\n \n"); // Replace all occurrences of "\n \n" with "\n\n"
  const lines = replacedDescription?.split(/[\r\n]+/);
  const styledLines = lines?.map((line: string) => {
    const words = line.split(" ");
    const styledWords = words.map((word: string) => {
      if (word[0] === "#") {
        if (colorChange) {
          return `<em id="hashtags" style="color: #f9ed00; font-style: normal;">${word}</em>`;
        } else {
          return `<em id="hashtags" style="color: #81A8F8; font-style: normal;">${word}</em>`;
        }
      } else if (word[0] === "@") {
        if (colorChange) {
          return `
              <a href="${`https://cypher.digitalax.xyz/autograph/${
                word?.includes(".lens")
                  ? word?.replace(".lens", "")?.replace("@", "")
                  : word?.replace("@", "")
              }`}" rel="noreferrer" target="_blank" style="margin-right: 4px;">
                <span style="color: #f9ed00;">${word}</span>
              </a>
            `;
        } else {
          return `
              <a href="${`https://cypher.digitalax.xyz/autograph/${
                word?.includes(".lens")
                  ? word?.replace(".lens", "")?.replace("@", "")
                  : word?.replace("@", "")
              }`}" target="_blank" rel="noreferrer" style="margin-right: 4px;">
                <span style="color: #81A8F8;">${word}</span>
              </a>
            `;
        }
      } else if (
        (word[0] === "h" &&
          word[1] === "t" &&
          word[2] === "t" &&
          word[3] === "p") ||
        (word[0] === "w" &&
          word[1] === "w" &&
          word[2] === "w" &&
          word[3] === ".") ||
        (word[word.length] === "z" &&
          word[word.length - 1] === "y" &&
          word[word.length - 2] === "x" &&
          word[word.length - 3] === ".") ||
        (word[word.length] === "m" &&
          word[word.length - 1] === "o" &&
          word[word.length - 2] === "c" &&
          word[word.length - 3] === ".")
      ) {
        if (colorChange) {
          return `
              <a href=${
                word?.includes("//") ? word : `//${word}`
              } target="_blank" rel="noreferrer">
                <span style="color: #f9ed00;">${word}</span>
              </a>
            `;
        } else {
          return `
              <a href=${
                word?.includes("//") ? word : `//${word}`
              } target="_blank" rel="noreferrer">
                <span style="color: #81A8F8;">${word}</span>
              </a>
            `;
        }
      } else {
        return word;
      }
    });
    const styledLine = `<span>${styledWords?.join(" ")}</span>`;
    return styledLine;
  });
  const formattedDescription = styledLines?.join("<br />");
  return `<div style="word-wrap: break-word; max-width: 100%;">${formattedDescription}</div>`;
};

export default descriptionRegex;

const descriptionRegex = (description: string, colorChange: boolean) => {
  const replacedDescription = description?.replace(/\n\n/g, "\n \n");
  const lines = replacedDescription?.split(/[\r\n]+/);
  const styledLines = lines?.map((line: string) => {
    const words = line.split(/(?=[@#])|\s+/);
    const styledWords = words.map((word: string) => {
      if (word[0] === "#") {
        if (colorChange) {
          return `<em id="hashtags" style="color: #f9ed00; font-style: normal; word-break: break-all; margin-right: 4px;">${word}</em>`;
        } else {
          return `<em id="hashtags" style="color: #81A8F8; font-style: normal; word-break: break-all; margin-right: 4px;">${word}</em>`;
        }
      } else if (word[0] === "@") {
        if (colorChange) {
          return `
              <a href="${`https://cypher.digitalax.xyz/autograph/${
                word?.includes(".lens")
                  ? word?.replace(".lens", "")?.replace("@", "")
                  : word?.replace("@", "")
              }`}" rel="noreferrer" target="_blank" style="word-break: break-all; margin-right: 4px;">
                <span style="color: #f9ed00;">${word}</span>
              </a>
            `;
        } else {
          return `
              <a href="${`https://cypher.digitalax.xyz/autograph/${
                word?.includes(".lens")
                  ? word?.replace(".lens", "")?.replace("@", "")
                  : word?.replace("@", "")
              }`}" target="_blank" rel="noreferrer" style="word-break: break-all; margin-right: 4px;">
                <span style="color: #81A8F8;">${word}</span>
              </a>
            `;
        }
      } else if (
        word.startsWith("http") ||
        word.startsWith("www.") ||
        word.endsWith(".xyz") ||
        word.endsWith(".com")
      ) {
        if (colorChange) {
          return `
              <a href=${
                word?.includes("//") ? word : `//${word}`
              } style="word-break: break-all; margin-right: 4px;" target="_blank" rel="noreferrer">
                <span style="color: #f9ed00;">${word}</span>
              </a>
            `;
        } else {
          return `
              <a href=${
                word?.includes("//") ? word : `//${word}`
              } style="word-break: break-all; margin-right: 4px;" target="_blank" rel="noreferrer">
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

import escapeHtml, { safeHttpUrl } from "./escapeHtml";

const descriptionRegex = (description: string, colorChange: boolean) => {
  const specialPhrase =
    "... This post is encrypted. Do you hold the keys to unlock its' secrets?";
  const replacedDescription = description?.replace(/\n\n/g, "\n \n");
  const lines = replacedDescription?.split(/[\r\n]+/);

  const styledLines = lines?.map((line: string) => {
    if (line.includes(specialPhrase)) {
      const parts = line.split(specialPhrase);
      const styledSpecialPhrase =
        escapeHtml((parts[0] ?? "").replaceAll("undefined", "")) +
        specialPhrase
          .split(" ")
          .map(
            (word) =>
              `<span style="color: #FF0000;">${escapeHtml(word)}</span>`
          )
          .join(" ") +
        escapeHtml((parts[1] ?? "").replaceAll("undefined", ""));
      return `<span>${styledSpecialPhrase}</span>`;
    } else {
      const words = line.split(/(?=[@#])|\s+/);
      const styledWords = words.map((word) => {
        const safeWord = escapeHtml(word);
        if (word[0] === "#") {
          return colorChange
            ? `<em id="hashtags" style="color: #f9ed00; font-style: normal; word-break: break-all; margin-right: 4px;">${safeWord}</em>`
            : `<em id="hashtags" style="color: #81A8F8; font-style: normal; word-break: break-all; margin-right: 4px;">${safeWord}</em>`;
        } else if (word[0] === "@") {
          const link = safeHttpUrl(
            `https://cypher.digitalax.xyz/autograph/${
              word?.includes(".lens")
                ? word?.replace(".lens", "").replace("@", "")
                : word?.replace("@", "")
            }`
          );
          if (!link) return safeWord;
          return colorChange
            ? ` <a href="${escapeHtml(
                link
              )}" rel="noreferrer" target="_blank" style="word-break: break-all; margin-right: 4px;"> <span style="color: #f9ed00;">${safeWord}</span> </a> `
            : ` <a href="${escapeHtml(
                link
              )}" target="_blank" rel="noreferrer" style="word-break: break-all; margin-right: 4px;"> <span style="color: #81A8F8;">${safeWord}</span> </a> `;
        } else if (
          word.startsWith("http") ||
          word.startsWith("www.") ||
          word.endsWith(".xyz") ||
          word.endsWith(".com")
        ) {
          const url = word?.includes("//") ? word : `//${word}`;
          const checked = safeHttpUrl(
            url.startsWith("//") ? `https:${url}` : url
          );
          if (!checked) return safeWord;
          return colorChange
            ? ` <a href="${escapeHtml(
                url
              )}" style="word-break: break-all; margin-right: 4px;" target="_blank" rel="noreferrer"> <span style="color: #f9ed00;">${safeWord}</span> </a> `
            : ` <a href="${escapeHtml(
                url
              )}" style="word-break: break-all; margin-right: 4px;" target="_blank" rel="noreferrer"> <span style="color: #81A8F8;">${safeWord}</span> </a> `;
        } else {
          return safeWord;
        }
      });
      return `<span>${styledWords.join(" ")}</span>`;
    }
  });

  const formattedDescription = styledLines.join("<br />");
  return `<div style="word-wrap: break-word; max-width: 100%;">${formattedDescription}</div>`;
};

export default descriptionRegex;

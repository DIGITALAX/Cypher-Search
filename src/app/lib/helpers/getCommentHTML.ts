const getCommentHTML = (
  e: any,
  resultElement: Element,
  saved?: boolean
): string => {
  const regexLinks = /\b(https?:\/\/)?(www\.)?\w+\.\b(com|xyz)\b/gi;
  const regexMentions = /(?:^|\s)[#@](\S+)/g;
  // const linkHighlight = (saved ? e : e.target.value).replace(
  //   regexLinks,
  //   (match: string) => {
  //     return `<span style="color: #0091ff">${match}</span>`;
  //   }
  // );
  const mentionHighlight = (saved ? e : e.target.value).replace(
    regexMentions,
    (match: string) => {
      return `<span style="color: #0091ff">${match}</span>`;
    }
  );
  const finalHTML = mentionHighlight
    ?.replace(new RegExp("&", "g"), "&")
    ?.replace(new RegExp("<", "g"), "<");
  if (finalHTML && resultElement) (resultElement as any).innerHTML = finalHTML;
  return finalHTML;
};

export default getCommentHTML;

export const getLocaleFromPath = (path: string): "en" | "es" => {
  const match = path.match(/(?:\/|^)(en|es)(?:\/|$)/);
  return match ? (match[1] as "en" | "es") : "en";
};

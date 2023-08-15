export const resolveBaseUrl = (): string => {
  const baseUrl = process.env.BASE_URL;
  const url = baseUrl != null ? baseUrl : process.env.VERCEL_URL;
  if (url === undefined) {
    throw new Error("Could not resolve VERCEL_URL or BASE_URL");
  }
  return url.startsWith("http://") || url.startsWith("https://")
    ? url
    : ["https://", url].join("");
};

export const restAPI = () => `${resolveBaseUrl()}/api/client/`;

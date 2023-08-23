import httpProxy from "http-proxy";
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

const proxy = httpProxy.createProxyServer({});

const fetcher = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  // call getAccessToken since it contains checks for session validity
  return new Promise((_, reject) => {
    const url2 = `${process.env.REST_API_ENDPOINT}${req.url?.replace(
      "api/client/",
      ""
    )}`;

    req.url = url2;
    const url = new URL(url2);

    console.log(`Invoking API: ${url2}`);

    proxy.once("error", reject);

    // Forward the request to the API
    proxy.web(req, res, {
      target: {
        protocol: "https:",
        host: url.host,
        port: 443,
      },
      xfwd: true,
      autoRewrite: false,
      changeOrigin: true,
      selfHandleResponse: false,
    });
  });
};

export default fetcher;

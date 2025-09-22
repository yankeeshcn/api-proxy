// server/routes/[...].ts

import { proxyTargets } from "~/utils/proxy";

export default defineEventHandler(async (event) => {
  const path = event.path;

  const targetConfig = proxyTargets.find((item) => path.startsWith(item.path));

  if (targetConfig) {
    const requestUrl = getRequestURL(event);
    const remainingPath = requestUrl.pathname.replace(targetConfig.path, "");
    const targetUrl = new URL(remainingPath, targetConfig.target);
    targetUrl.search = requestUrl.search;

    const headers = getRequestHeaders(event);
    delete headers["x-forwarded-for"];
    delete headers["x-real-ip"];

    try {
      return await proxyRequest(event, targetUrl.toString(), {
        headers,
      });
    } catch (error) {
      setResponseStatus(event, error.statusCode || 500);
      return {
        error: "Proxy request failed",
        details: error.message,
      };
    }
  }

  setResponseStatus(event, 404);
  return "404 Not Found";
});

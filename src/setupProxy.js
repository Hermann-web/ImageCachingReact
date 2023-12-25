const { createProxyMiddleware } = require("http-proxy-middleware");

const API_ENDPOINT = "http://localhost:3002";

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: API_ENDPOINT,
      changeOrigin: true, // Change the origin of the host header to the target URL
      pathRewrite: {
        "^/api": "", // Remove the /api prefix from the URL
      },
    }),
  );
};

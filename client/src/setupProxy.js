const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://gr-let-him-cook-api-v1.vercel.app/",
      changeOrigin: true,
    })
  );
};

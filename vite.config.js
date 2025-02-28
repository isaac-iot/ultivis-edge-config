import { defineConfig, loadEnv } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const baseUrl = env.VITE_BASE_URL;
  const httpProxyTarget = `https://${env.VITE_PROXY}`;
  const wsProxyTarget = `ws://${env.VITE_PROXY}`;
  // 백엔드 주소 (fast-api)
  const appProxyTarget = `http://${env.VITE_APP_PROXY}`;

  return {
    base: baseUrl,
    plugins: [react()],
    resolve: {
      alias: {
        "@ultivis/library": resolve(
          __dirname,
          "./library/ultivis-react-library.es"
        ),
        "@ultivis/style": resolve(__dirname, "./library/index.css"),

        "@components": resolve(__dirname, "./src/components"),
        "@data": resolve(__dirname, "./src/data"),
        "@locales": resolve(__dirname, "./src/locales"),
        "@pages": resolve(__dirname, "./src/pages"),
        "@shared": resolve(__dirname, "./src/shared"),
        "@utils": resolve(__dirname, "./src/utils"),
      },
    },
    build: {
      minify: "terser",
      outDir: "dist/dashboard",
      sourcemap: false,
      assetsInlineLimit: 8192,
      cssCodeSplit: true,
      rollupOptions: {
        input: "index.html",
        output: {
          entryFileNames: "assets/[name].[hash].js",
          chunkFileNames: "assets/[name].[hash].js",
          assetFileNames: "assets/[name].[hash].[ext]",
          manualChunks: (id) => {
            if (id.indexOf("node_modules") !== -1) {
              const module = id.split("node_modules/").pop().split("/")[0];

              if (
                [
                  "detect-node-es",
                  "html-parse-stringify",
                  "void-elements",
                ].includes(module)
              ) {
                return "vendor";
              }

              return `vendor-${module}`;
            }
          },
        },
      },
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      brotliSize: true,
    },
    server: {
      host: "0.0.0.0",
      port: 5173,
      proxy: {
        "/notification/realtime": {
          target: wsProxyTarget,
          ws: true,
        },
        "/api": {
          target: appProxyTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
        "^/": {
          target: httpProxyTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\//, ""),
          configure: (proxy, options) => {
            proxy.on("proxyReq", (proxyReq, req, res) => {
              proxyReq.setHeader("origin", httpProxyTarget);
            });
          },
          bypass: (req, res, proxyOptions) => {
            if (req.url === "/" || req.url.startsWith("/apps")) {
              return req.url;
            }
            return null;
          },
        },
      },
    },
  };
});

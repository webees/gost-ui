import { defineConfig, UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import { analyzer } from "vite-bundle-analyzer";
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const config: UserConfig = {
    base: "./",
    plugins: [react(), viteStaticCopy({ targets: [
      {
        src: 'node_modules/monaco-editor/min',
        dest: 'monaco-editor'
      }
    ]})],
  };

  if (mode === "development") {
    return config;
  }

  if (mode === "production" || mode === "analyzer") {
    config.build = {
      rollupOptions: {
        output: {
          // manualChunks 配置
          manualChunks: {
            monaco: ["monaco-editor"],
            antd: ["antd"],
            // 将组件库的代码打包
            // "ant-design": ["@ant-design/icons", "@ant-design/pro-components"],
          },
        },
      },
    };
  }

  if (mode === "analyzer") {
    config.plugins.push(analyzer());
    config.build.sourcemap="hidden";
  }

  return config;
});

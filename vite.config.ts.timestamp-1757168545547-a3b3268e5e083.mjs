// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import { viteMockServe } from "file:///home/project/node_modules/vite-plugin-mock/dist/index.js";
import { createSvgIconsPlugin } from "file:///home/project/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import AutoImport from "file:///home/project/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///home/project/node_modules/unplugin-vue-components/dist/vite.mjs";
import { ElementPlusResolver } from "file:///home/project/node_modules/unplugin-vue-components/dist/resolvers.mjs";
import vue from "file:///home/project/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
import svgLoader from "file:///home/project/node_modules/vite-svg-loader/index.js";
var __vite_injected_original_dirname = "/home/project";
var vite_config_default = defineConfig(({ command }) => {
  return {
    plugins: [
      // ...
      vue(),
      svgLoader(),
      viteMockServe({
        localEnabled: command === "serve",
        supportTs: false,
        logger: false,
        mockPath: "./src/mock/"
      }),
      createSvgIconsPlugin({
        // Specify the icon folder to be cached
        iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
        // Specify symbolId format
        symbolId: "icon-[dir]-[name]"
      }),
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      })
    ],
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "src")
        // 相对路径别名配置，使用 @ 代替 src
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "@/style/variable.scss";'
        }
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjsvLyB2aXRlLmNvbmZpZy50c1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB7IHZpdGVNb2NrU2VydmUgfSBmcm9tICd2aXRlLXBsdWdpbi1tb2NrJ1xuaW1wb3J0IHsgY3JlYXRlU3ZnSWNvbnNQbHVnaW4gfSBmcm9tICd2aXRlLXBsdWdpbi1zdmctaWNvbnMnXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcbmltcG9ydCB7IEVsZW1lbnRQbHVzUmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgc3ZnTG9hZGVyIGZyb20gJ3ZpdGUtc3ZnLWxvYWRlcidcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBjb21tYW5kIH0pID0+IHtcbiAgcmV0dXJuIHtcbiAgICBwbHVnaW5zOiBbXG4gICAgICAvLyAuLi5cbiAgICAgIHZ1ZSgpLFxuICAgICAgc3ZnTG9hZGVyKCksXG4gICAgICB2aXRlTW9ja1NlcnZlKHtcbiAgICAgICAgbG9jYWxFbmFibGVkOiBjb21tYW5kID09PSAnc2VydmUnLFxuICAgICAgICBzdXBwb3J0VHM6IGZhbHNlLFxuICAgICAgICBsb2dnZXI6IGZhbHNlLFxuICAgICAgICBtb2NrUGF0aDogJy4vc3JjL21vY2svJyxcbiAgICAgIH0pLFxuICAgICAgY3JlYXRlU3ZnSWNvbnNQbHVnaW4oe1xuICAgICAgICAvLyBTcGVjaWZ5IHRoZSBpY29uIGZvbGRlciB0byBiZSBjYWNoZWRcbiAgICAgICAgaWNvbkRpcnM6IFtwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgJ3NyYy9hc3NldHMvaWNvbnMnKV0sXG4gICAgICAgIC8vIFNwZWNpZnkgc3ltYm9sSWQgZm9ybWF0XG4gICAgICAgIHN5bWJvbElkOiAnaWNvbi1bZGlyXS1bbmFtZV0nLFxuICAgICAgfSksXG4gICAgICBBdXRvSW1wb3J0KHtcbiAgICAgICAgcmVzb2x2ZXJzOiBbRWxlbWVudFBsdXNSZXNvbHZlcigpXSxcbiAgICAgIH0pLFxuICAgICAgQ29tcG9uZW50cyh7XG4gICAgICAgIHJlc29sdmVyczogW0VsZW1lbnRQbHVzUmVzb2x2ZXIoKV0sXG4gICAgICB9KSxcbiAgICBdLFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpLCAvLyBcdTc2RjhcdTVCRjlcdThERUZcdTVGODRcdTUyMkJcdTU0MERcdTkxNERcdTdGNkVcdUZGMENcdTRGN0ZcdTc1MjggQCBcdTRFRTNcdTY2RkYgc3JjXG4gICAgICB9LFxuICAgIH0sXG4gICAgY3NzOiB7XG4gICAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICAgIHNjc3M6IHtcbiAgICAgICAgICBqYXZhc2NyaXB0RW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICBhZGRpdGlvbmFsRGF0YTogJ0BpbXBvcnQgXCJAL3N0eWxlL3ZhcmlhYmxlLnNjc3NcIjsnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9XG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLFNBQVMsb0JBQW9CO0FBQzdCLFNBQVMscUJBQXFCO0FBQzlCLFNBQVMsNEJBQTRCO0FBQ3JDLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVMsMkJBQTJCO0FBQ3BDLE9BQU8sU0FBUztBQUNoQixPQUFPLFVBQVU7QUFDakIsT0FBTyxlQUFlO0FBVHRCLElBQU0sbUNBQW1DO0FBVXpDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsUUFBUSxNQUFNO0FBQzNDLFNBQU87QUFBQSxJQUNMLFNBQVM7QUFBQTtBQUFBLE1BRVAsSUFBSTtBQUFBLE1BQ0osVUFBVTtBQUFBLE1BQ1YsY0FBYztBQUFBLFFBQ1osY0FBYyxZQUFZO0FBQUEsUUFDMUIsV0FBVztBQUFBLFFBQ1gsUUFBUTtBQUFBLFFBQ1IsVUFBVTtBQUFBLE1BQ1osQ0FBQztBQUFBLE1BQ0QscUJBQXFCO0FBQUE7QUFBQSxRQUVuQixVQUFVLENBQUMsS0FBSyxRQUFRLFFBQVEsSUFBSSxHQUFHLGtCQUFrQixDQUFDO0FBQUE7QUFBQSxRQUUxRCxVQUFVO0FBQUEsTUFDWixDQUFDO0FBQUEsTUFDRCxXQUFXO0FBQUEsUUFDVCxXQUFXLENBQUMsb0JBQW9CLENBQUM7QUFBQSxNQUNuQyxDQUFDO0FBQUEsTUFDRCxXQUFXO0FBQUEsUUFDVCxXQUFXLENBQUMsb0JBQW9CLENBQUM7QUFBQSxNQUNuQyxDQUFDO0FBQUEsSUFDSDtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsS0FBSztBQUFBO0FBQUEsTUFDcEM7QUFBQSxJQUNGO0FBQUEsSUFDQSxLQUFLO0FBQUEsTUFDSCxxQkFBcUI7QUFBQSxRQUNuQixNQUFNO0FBQUEsVUFDSixtQkFBbUI7QUFBQSxVQUNuQixnQkFBZ0I7QUFBQSxRQUNsQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==

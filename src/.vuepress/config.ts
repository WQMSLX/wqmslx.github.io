import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import otherPlugins from "./plugins.js";
export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "纸飞机的博客",
  description: "行百里者半九十",

  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
  plugins: otherPlugins
});

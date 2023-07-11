import search from "./search.js"
import { autoCatalogPlugin } from "vuepress-plugin-auto-catalog";

const base = <"/" | `/${string}/`>process.env["BASE"] || "/";
export default ([
    search,
    autoCatalogPlugin({
      //插件选项
    }),
])
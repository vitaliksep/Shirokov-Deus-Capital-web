import type { Config } from "@react-router/dev/config";

export default {
  ssr: false,
  appDirectory: "src/app",
  ignoredRouteFiles: ["**/__create/**"],
} satisfies Config;

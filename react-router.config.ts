import type { Config } from "@react-router/dev/config";

export default {
  ssr: false,
  appDirectory: "src/app",
  ignoredRouteFiles: ["**/__create/**"],
  future: {
    v3_singleFetchStreamTransformers: true,
  },
} satisfies Config;

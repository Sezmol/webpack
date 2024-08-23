import path from "path";
import { buildWebpack } from "./config/buildWebpack/buildWebpack";
import type { Configuration } from "webpack";

type ModeType = "development" | "production";

interface EnvVariables {
  mode: ModeType;
  port: number;
  analyze: boolean;
  test: string;
}

export default ({ mode, port, analyze, test }: EnvVariables): Configuration => {
  const entry = path.resolve(__dirname, "src", "index.tsx");
  const output = path.resolve(__dirname, "dist");
  const html = path.resolve(__dirname, "public", "index.html");
  const src = path.resolve(__dirname, "src");
  const pathToPublic = path.resolve(__dirname, "public");

  return buildWebpack({
    mode: mode,
    port: port ?? 3000,
    paths: {
      entry,
      output,
      html,
      src,
      public: pathToPublic,
    },
    analyze,
    test: test ?? "test",
  });
};

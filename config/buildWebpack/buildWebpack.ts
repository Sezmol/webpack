import { Configuration } from "webpack";
import { buildRules } from "./buildRules";
import { buildPlugins } from "./buildPlugins";
import { buildDevServer } from "./buildDevServer";
import { BuildWebpackOptions } from "./types";
import { buildResolves } from "./buildResolves";
import { buildOptimization } from "./buildOptimization";

export const buildWebpack = (options: BuildWebpackOptions): Configuration => {
  const { mode, paths } = options;
  const { entry, output } = paths;

  return {
    mode: mode ?? "development", // режим работы сборки
    entry: entry, // путь к файлу с запуском приложения
    output: {
      path: output, // путь к папке с результатами сборки
      filename: "[name].[contenthash].js", // имя файла сборки
      clean: true, // чистит папку с результатом сборки перед новой сборкой
    },

    module: {
      rules: buildRules(options),
    },

    resolve: buildResolves(options),

    plugins: buildPlugins(options),

    optimization: buildOptimization(options),

    devtool: mode === "development" ? "eval" : "source-map", // стиль отображения исходного кода в браузере

    devServer: buildDevServer(options),
  };
};

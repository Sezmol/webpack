import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import webpack, { Configuration } from "webpack";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import { BuildWebpackOptions } from "./types";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

export const buildPlugins = ({
  mode,
  paths,
  analyze,
  test,
}: BuildWebpackOptions): Configuration["plugins"] => {
  const isDev = mode === "development";
  const isProd = mode === "production";

  const plugins: Configuration["plugins"] = [
    new HtmlWebpackPlugin({
      template: paths.html, // автоматически добавляет JS и CSS-файлы в index.html
      favicon: path.resolve(paths.public, "favicon.ico"), // добавляет favicon в index.html
    }),

    new webpack.DefinePlugin({
      __ENV_VAR__: JSON.stringify(test), // добавляет глобальную переменную
    }),

    new ForkTsCheckerWebpackPlugin(), // выполняет проверку типов TypeScript и линтинга (ESLint) в отдельном процессе, что позволяет ускорить сборку и избежать блокировки основного потока Webpack
  ];

  if (isDev) {
    plugins.push(new webpack.ProgressPlugin()); // показывае прогресс сборки в консоли, но может замедлять процесс сборки
    plugins.push(new ReactRefreshWebpackPlugin()); // включает поддержку hot module reload для react
  }

  if (isProd) {
    plugins.push(new MiniCssExtractPlugin()); // позволяет извлечь css в отдельный файл
    analyze && plugins.push(new BundleAnalyzerPlugin());
  }

  return plugins;
};

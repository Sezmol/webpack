import MiniCssExtractPlugin from "mini-css-extract-plugin";
import ReactRefreshTypeScript from "react-refresh-typescript";
import { ModuleOptions, runtime } from "webpack";
import { BuildWebpackOptions } from "./types";

export const buildRules = ({
  mode,
}: BuildWebpackOptions): ModuleOptions["rules"] => {
  const isDev = mode === "development";

  return [
    // {
    //   // ts-loader умеет работать с jsx и tsx файлами, если не использоватьс typescript, то придется использовать babel-loader
    //   test: /\.tsx?$/, // правило для типа файлов с расширением .ts и .tsx
    //   exclude: /node_modules/, // исключает папку node_modules из подгрузки файлов
    //   use: [
    //     {
    //       loader: "ts-loader", // использует ts-loader для подгрузки файлов с расширением .ts и .tsx
    //       options: {
    //         transpileOnly: isDev, // webpack не будет проверять ошибки связанные с типизацией, из-за чего сборка ускорится. Эту опцию лучше включать, если стоит плагин fork-ts-checker-webpack-plugin.
    //         getCustomTransformers: () => ({
    //           before: [isDev && ReactRefreshTypeScript()].filter(Boolean),
    //         }),
    //       },
    //     },
    //   ],
    // },
    {
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader",
        options: {
          presets: [
            "@babel/preset-env",
            "@babel/preset-typescript",
            [
              "@babel/preset-react",
              {
                runtime: isDev ? "automatic" : "classic",
              },
            ],
          ],
        },
      },
    },
    {
      test: /\.(sc|sa|c)ss$/i,
      use: [
        isDev ? "style-loader" : MiniCssExtractPlugin.loader,
        {
          loader: "css-loader",
          options: {
            modules: {
              localIdentName: isDev
                ? "[name]__[local]___[hash:base64:8]"
                : "[hash:base64:8]",
              namedExport: false, // определяет, как экспортируются css-модули. При false происходдит export default, при true происходдит export { className }
            },
          },
        },
        "sass-loader",
      ], // Порядок лоадеров важен. Все начинается с конца, то есть первым будет sass-loader, а последним будет MiniCssExtractPlugin.loader. css-loader обрабатывает css файлы и позволяет их импортировать в js. style-lodaer берет CSS, который был преобразован css-loader'ом, и добавляет его в теги style. sass-loader преобразует scss в css
    },
    {
      test: /\.(png|jpg|jpeg|gif)$/i,
      use: [
        {
          loader: "file-loader",
        },
      ],
    },
    {
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    },
  ];
};

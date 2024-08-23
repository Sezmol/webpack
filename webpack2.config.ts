import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import type { Configuration } from "webpack";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";

type ModeType = "development" | "production";

interface EnvVariables {
  mode: ModeType;
  port: number;
  analyze: boolean;
}

export default ({ mode, port, analyze }: EnvVariables): Configuration => {
  const isDev = mode === "development";
  const isProd = mode === "production";

  const plugins: Configuration["plugins"] = [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public", "index.html"), // автоматически добавляет JS и CSS-файлы в index.html
    }),
    new ForkTsCheckerWebpackPlugin(), // выполняет проверку типов TypeScript и линтинга (ESLint) в отдельном процессе, что позволяет ускорить сборку и избежать блокировки основного потока Webpack
  ];

  if (isDev) {
    plugins.push(new webpack.ProgressPlugin()); // показывае прогресс сборки в консоли, но может замедлять процесс сборки
    plugins.push(new ReactRefreshWebpackPlugin()); // включает поддержку hot module reload для react
  }

  if (isProd) {
    plugins.push(new MiniCssExtractPlugin()); // минипозволяет извлечь css в отдельный файл
    analyze && plugins.push(new BundleAnalyzerPlugin()); // показывает результаты анализа пакетов в браузере
  }

  return {
    mode: mode ?? "development", // режим работы сборки
    entry: path.resolve(__dirname, "src", "index.tsx"), // путь к файлу с запуском приложения
    output: {
      path: path.resolve(__dirname, "dist"), // путь к папке с результатами сборки
      filename: "[name].[contenthash].js", // имя файла сборки
      clean: true, // чистит папку с результатом сборки перед новой сборкой
    },

    module: {
      rules: [
        // {
        //   // ts-loader умеет работать с jsx и tsx файлами, если не использоватьс typescript, то придется использовать babel-loader
        //   test: /\.[jt]sx?$/, // правило для типа файлов с расширением .ts и .tsx
        //   exclude: /node_modules/, // исключает папку node_modules из подгрузки файлов
        //   use: [
        //     {
        //       loader: "ts-loader", // использует ts-loader для подгрузки файлов с расширением .ts и .tsx
        //       options: {
        //         transpileOnly: isDev, // webpack не будет проверять ошибки связанные с типизацией, из-за чего сборка ускорится. Если стоит плагин  fork-ts-checker-webpack-plugin, то transpileOnly всегда будет true, так что эту настройку можно не писать(почему-то это не работает, хотя в документации написано: When you add the fork-ts-checker-webpack-plugin to your webpack config, the transpileOnly will default to true, so you can skip that option)
        //         getCustomTransformers: () => ({
        //           before: [isDev && ReactRefreshTypeScript()].filter(Boolean), // включает поддержку hmr для react ts
        //         }),
        //       },
        //     },
        //   ],
        // },
        {
          test: /\.[jt]sx?$/,
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
                    runtime: isDev ? "automatic" : "classic", // automatic: auto imports the functions that JSX transpiler to. classic: does not automatic import anything. (позволяет не импортировать React в каждом компоненте, если стоит automatic)
                  },
                ],
              ],
            },
          },
        },
        {
          test: /\.(sc|sa|c)ss$/i,
          use: [
            isProd ? MiniCssExtractPlugin.loader : "style-loader", // MiniCssExtractPlugin.loader загружает стили через отдельные CSS-файлы, что улучшает производительность. style-loader он внедряет CSS прямо в `<style>` теги внутри html, что позволяет быстро обновлять стили без необходимости перезагрузки страницы.
            {
              loader: "css-loader",
              options: {
                // позволяет импортировать css-модули
                modules: {
                  localIdentName: isDev // тут описывается правило именования css-модулей
                    ? "[name]__[local]___[hash:base64:8]"
                    : "[hash:base64:8]",
                  namedExport: false, // определяет, как экспортируются css-модули. При false происходдит export default, при true происходдит export { className }
                },
              },
            },
            "sass-loader",
          ], // Порядок лоадеров важен. Все начинается с конца, то есть первым будет sass-loader, а последним будет style-loader. css-loader обрабатывает css файлы и позволяет их импортировать в js. style-lodaer берет CSS, который был преобразован css-loader'ом, и добавляет его в теги style. sass-loader преобразует scss в css
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
          use: ["@svgr/webpack"], // позволяет использовать svg как react компоненты
        },
      ],
    },

    resolve: {
      extensions: [".tsx", ".ts", ".js"], // позволяет импортировать файлы с расширениями, которые указаны в массиве, без необходимости указывать расширение в import
    },

    plugins,

    devtool: isDev ? "eval" : "source-map", // стиль отображения исходного кода в браузере

    devServer: {
      port: port ?? 3000, // порт для разработки
      open: true, // открывает браузер после запуска сервера
      historyApiFallback: true, //
      hot: true, // включает поддержку hot module reload, (но это работает только для js/ts, для фрейморков нужно ставить плагины и настройки)
    },
  };
};

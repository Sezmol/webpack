import { Configuration } from "webpack-dev-server";
import { BuildWebpackOptions } from "./types";

export const buildDevServer = ({
  port,
}: BuildWebpackOptions): Configuration => ({
  port: port, // порт для разработки
  open: true, // открывает браузер после запуска сервера
  historyApiFallback: true, // используется в случае разработки SPA. Он перенаправляет запросы к несуществующим маршрутам на корневой HTML-файл
  hot: true, // когда мы изменяем код, страница не будет полностью перезагружена, состояние приложения будет сохраняться (но это работает только для js/ts, для фрейморков нужно ставить плагины и настройки)
});

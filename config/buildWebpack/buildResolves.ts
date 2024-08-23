import { Configuration } from "webpack";
import { BuildWebpackOptions } from "./types";

export const buildResolves = ({
  paths,
}: BuildWebpackOptions): Configuration["resolve"] => {
  return {
    extensions: [".tsx", ".ts", ".js"], // позволяет импортировать файлы с расширениями, которые указаны в массиве, без необходимости указывать расширение в import
    alias: {
      "@": paths.src,
    },
  };
};

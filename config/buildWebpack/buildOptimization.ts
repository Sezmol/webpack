import TerserPlugin from "terser-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import { Configuration } from "webpack";
import { BuildWebpackOptions } from "./types";

export const buildOptimization = ({
  mode,
}: BuildWebpackOptions): Configuration["optimization"] => {
  const isProd = mode === "production";

  return {
    minimize: isProd, // минификация только в проде
    minimizer: [
      new TerserPlugin(), // мнификация js
      new CssMinimizerPlugin(), // минификация css
    ],
  };
};

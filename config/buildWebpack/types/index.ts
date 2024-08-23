export type BuildModeType = "development" | "production";

interface BuildPaths {
  entry: string;
  output: string;
  html: string;
  src: string;
  public: string;
}

export interface BuildWebpackOptions {
  mode: BuildModeType;
  port?: number;
  paths: BuildPaths;
  analyze?: boolean;
  test?: string;
}

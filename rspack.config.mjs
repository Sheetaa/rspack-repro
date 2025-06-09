import { rspack } from '@rspack/core';
import { ReactRefreshRspackPlugin } from "@rspack/plugin-react-refresh";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isRunningWebpack = !!process.env.WEBPACK;
const isRunningRspack = !!process.env.RSPACK;
if (!isRunningRspack && !isRunningWebpack) {
  throw new Error("Unknown bundler");
}

const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = !isProduction;

/**
 * @type {import('webpack').Configuration | import('@rspack/cli').Configuration}
 */
const config = {
  mode: isProduction ? "production" : "development",
  entry: {
    main: "./src/index",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'builtin:swc-loader',
          options: {
            module: {
              type: 'es6',
            },
            sourceMaps: true,
            minify: false,
            isModule: 'unknown',
            jsc: {
              parser: {
                syntax: 'ecmascript',
                jsx: true,
                dynamicImport: true,
                privateMethod: true,
                functionBind: true,
                classProperty: true,
                classPrivateProperty: true,
                exportDefaultFrom: true,
                exportNamespaceFrom: true,
                decorators: true,
                decoratorsBeforeExport: true,
                importMeta: true,
                autoAccessors: true,
              },
              transform: {
                decoratorMetadata: true,
                decoratorVersion: '2022-03',
                react: {
                  runtime: 'classic',
                  throwIfNamespace: true,
                  useBuiltins: false,
                  development: isDevelopment,
                  refresh: isDevelopment
                },
              },
              externalHelpers: true,
            },
          },
        },
        type: 'javascript/auto',
      },
    ]
  },
  plugins: [
    new rspack.HtmlRspackPlugin(),
    isDevelopment && new ReactRefreshRspackPlugin(),

  ],
  output: {
    clean: true,
    path: isRunningWebpack
      ? path.resolve(__dirname, "webpack-dist")
      : path.resolve(__dirname, "rspack-dist"),
    filename: "[name].[chunkhash:8].js",
    chunkFilename: "[name].[chunkhash:8].js",
    library: 'main-[name]',
    libraryTarget: 'umd',

  },
  experiments: {
    css: true,
  },
  optimization: {
    minimizer: [
      new rspack.SwcJsMinimizerRspackPlugin({
        minimizerOptions: {
          // remove warnings
          warnings: isProduction,
          // Drop console statements
          drop_console: isProduction,
        },
        extractComments: false,
      }),
      new rspack.LightningCssMinimizerRspackPlugin(),
    ],
    runtimeChunk: {
      name: "runtime",
    }
  },
  devtool: "source-map",
  devServer: {
    historyApiFallback: true,
  }
};

export default config;

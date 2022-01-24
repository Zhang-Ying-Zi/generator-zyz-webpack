const path = require("path");
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const devConfig = require("./webpackConfig/webpack-dev-config.js");
const cssConfig = require("./webpackConfig/webpack-css-config.js");
const jsConfig = require("./webpackConfig/webpack-js-config.js");
<%_ if(typescript) { -%>
const tsConfig = require("./webpackConfig/webpack-ts-config.js");
<%_ } -%>
<%_ if(react) { -%>
const reactConfig = require("./webpackConfig/webpack-react-config.js");
<%_ } -%>
<%_ if(vue) { -%>
const vueConfig = require("./webpackConfig/webpack-vue-config.js");
<%_ } -%>

const BuildMode =
  process.env.NODE_ENV === "development" ? "development" : "production";
const isDevelopment = BuildMode === "development";
const isProduction = BuildMode === "production";
const EntryPathBase = path.resolve(__dirname, "src");
const OutputPathBase = path.resolve(__dirname, "dist");
const jsExtension = ".js"; // .js .ts

const WebpackConfig = {
  mode: BuildMode, // "production" | "development" | "none"
  devtool: isProduction ? "source-map" : "inline-source-map",
  target: "web", // web async-node node browserslist
  entry: {
    main: path.join(EntryPathBase, "index" + jsExtension)
  },
  output: {
    path: OutputPathBase,
    filename: "[name].[contenthash:4].js", // [id] [name] [contenthash] [chunkhash] [hash]
    chunkFilename: "[name].[contenthash:4].[id].js",
    assetModuleFilename: "assets/[name][ext][query]",
    publicPath: "" // the url to the output directory resolved relative to the HTML page
  },
  module: {
    rules: [
      {
        test: /\.(woff|woff2|eot|ttf|otf|ogg|m4a)$/,
        type: "asset/resource" // asset/resource  asset/inline  asset/source  asset
      },
      {
        test: /\.(png|svg|jpe?g|gif)$/,
        type: "asset/resource"
      },
      {
        test: /\.(html)$/,
        use: ["html-loader"]
      }
    ]
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebPackPlugin({
      filename: "index.html",
      template: path.join(EntryPathBase, "index.html"),
      favicon: path.join(EntryPathBase, "favicon.ico"),
      hash: false,
      minify: {
        removeAttributeQuotes: true,
        removeComments: true,
        collapseWhitespace: true,
        removeScriptTypeAttributes: false,
        removeStyleLinkTypeAttributes: false
      }
    }),
    isDevelopment && new webpack.HotModuleReplacementPlugin(),
    isProduction &&
      new BundleAnalyzerPlugin({
        analyzerMode: "static", // server，static，json，disabled
        openAnalyzer: false
      })
  ].filter(Boolean),
  optimization: {
    // chunkIds: "size",
    // // method of generating ids for chunks
    // moduleIds: "size",
    // // method of generating ids for modules
    // mangleExports: "size",
    // // rename export names to shorter names
    minimize: true,
    minimizer: [
      isProduction && new TerserPlugin({ exclude: /node_modules/ })
    ].filter(Boolean),
    splitChunks: {
      chunks: "all", // all async initial
      minSize: 1, // default to 20000 bytes
      minRemainingSize: 1,
      minChunks: 1, // The minimum times must a module be shared among chunks before splitting.
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      automaticNameDelimiter: "~",
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          priority: -10,
          reuseExistingChunk: true
        },
        default: {
          minChunks: 1,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  // externals: {jquery: 'jQuery'}
  // externals: ["react", /^@angular/] // Don't follow/bundle these modules, but request them at runtime from the environment
  resolve: {
    // options for resolving module requests
    // (does not apply to resolving of loaders)
    modules: ["node_modules", EntryPathBase],
    extensions: [".js", ".jsx", ".ts", ".tsx", ".vue"],
    alias: {
      // "react-dom": "@hot-loader/react-dom"
      // // a list of module name aliases
      // // aliases are imported relative to the current context
      // "module": "new-module",
      // // alias "module" -> "new-module" and "module/path/file" -> "new-module/path/file"
      // "only-module$": "new-module",
      // // alias "only-module" -> "new-module", but not "only-module/path/file" -> "new-module/path/file"
      // "module": path.resolve(__dirname, "app/third/module.js"),
      // // alias "module" -> "./app/third/module.js" and "module/file" results in error
      // "module": path.resolve(__dirname, "app/third"),
      // // alias "module" -> "./app/third" and "module/file" -> "./app/third/file"
      // [path.resolve(__dirname, "app/module.js")]: path.resolve(__dirname, "app/alternative-module.js"),
      // // alias "./app/module.js" -> "./app/alternative-module.js"
    }
  }
};

module.exports = merge(
  [
    <%_ if(vue) { -%>
    vueConfig(BuildMode), // VueLoaderPlugin 需要放在 HtmlWebPackPlugin 之前
    <%_ } -%>
    WebpackConfig,
    isDevelopment && devConfig(OutputPathBase),
    cssConfig(BuildMode),
    jsConfig(BuildMode),
    <%_ if(typescript) { -%>
    tsConfig(BuildMode),
    <%_ } -%>
    <%_ if(react) { -%>
    reactConfig(BuildMode)
    <%_ } -%>
  ].filter(Boolean)
);

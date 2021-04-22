module.exports = {
  options: {
    "skip-install": {
      desc: "跳过下载node_modules",
      type: Boolean,
      required: false,
    },
  },
  prompts: [
    {
      type: "confirm",
      name: "vue",
      message: "需要编译vue么？",
    },
  ],
  filesToCopy: [
    {
      input: "CONSTANT.js",
      output: "CONSTANT.js",
    },
    {
      input: "webpackConfig/webpack-css-config.js",
      output: "webpackConfig/webpack-css-config.js",
    },
    {
      input: "webpackConfig/webpack-dev-config.js",
      output: "webpackConfig/webpack-dev-config.js",
    },
    {
      input: "webpackConfig/webpack-js-config.js",
      output: "webpackConfig/webpack-js-config.js",
    },
    {
      if: "react",
      input: "webpackConfig/webpack-react-config.js",
      output: "webpackConfig/webpack-react-config.js",
    },
    {
      if: "typescript",
      input: "webpackConfig/webpack-ts-config.js",
      output: "webpackConfig/webpack-ts-config.js",
    },
    {
      if: "vue",
      input: "webpackConfig/webpack-vue-config.js",
      output: "webpackConfig/webpack-vue-config.js",
    },
  ],
  filesToRender: [
    {
      input: "webpack.config.js.tpl",
      output: "webpack.config.js",
    },
  ],
  filesToMerge: [
    {
      file: "package.json",
      default: {
        scripts: {
          watch:
            "cross-env NODE_ENV=development webpack --watch --config webpack.config.js",
          start:
            "cross-env NODE_ENV=development webpack serve --hot --mode development --config webpack.config.js --open --color",
          build:
            "cross-env NODE_ENV=production webpack --mode production --config webpack.config.js",
        },
        devDependencies: {
          "@types/node": "^14.14.37",
          "@types/webpack": "^4.41.27",
          "@types/webpack-dev-server": "^3.11.3",
          autoprefixer: "^10.2.5",
          "babel-loader": "^8.2.2",
          "clean-webpack-plugin": "^3.0.0",
          "cross-env": "^7.0.3",
          "css-loader": "^5.2.0",
          "css-minimizer-webpack-plugin": "^2.0.0",
          "file-loader": "^6.2.0",
          "html-loader": "^2.1.2",
          "html-webpack-plugin": "^5.3.1",
          less: "^4.1.1",
          "less-loader": "^8.0.0",
          "mini-css-extract-plugin": "^1.4.1",
          postcss: "^8.2.9",
          "postcss-loader": "^5.2.0",
          sass: "^1.32.8",
          "sass-loader": "^11.0.1",
          "script-loader": "^0.7.2",
          "style-loader": "^2.0.0",
          "terser-webpack-plugin": "^5.1.1",
          webpack: "^5.30.0",
          "webpack-bundle-analyzer": "^4.4.0",
          "webpack-cli": "^4.6.0",
          "webpack-dev-server": "^3.11.2",
          "webpack-merge": "^5.7.3",
        },
        dependencies: {},
      },
      typescript: {
        devDependencies: {
          "ts-loader": "^8.1.0",
          "ts-node": "^9.1.1",
          "type-fest": "^0.13.1",
        },
      },
      react: {
        devDependencies: {
          "@pmmmwh/react-refresh-webpack-plugin": "^0.4.3",
          "@types/react": "^17.0.3",
          "@types/react-dom": "^17.0.3",
          "react-refresh": "^0.9.0",
        },
        dependencies: {
          react: "^17.0.1",
          "react-dom": "^17.0.1",
        },
      },
      vue: {
        devDependencies: {
          "vue-loader": "^15.9.6",
          "vue-template-compiler": "^2.6.12",
        },
        dependencies: {
          vue: "^2.6.12",
        },
      },
    },
  ],
  dirsToCreate: ["webpackConfig"],
};

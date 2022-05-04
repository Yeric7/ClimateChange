const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: { bundle: path.resolve(__dirname, "src/index.js") },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    assetModuleFilename: "[name][ext]",
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    port: 3000,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.csv$/,
        loader: "csv-loader",
        options: {
          dynamicTyping: true,
          header: true,
          skipEmptyLines: true,
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(svg)$/i,
        type: "asset/resource",
      },
      // {
      //   test: /\.html$/,
      //   type: "asset/resource",
      //   generator: {
      //     filename: "[name][ext]",
      //   },
      // },
      {
        test: /\.html$/i,
        use: [
          { loader: "html-loader"},
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "App",
      filename: "index.html",
      template: "src/template.html",
    }),
  ],
};

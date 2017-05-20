import path from "path";

export default {
  entry: path.resolve(__dirname, "./app.jsx"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "client.bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader"
      }
    ]
  },
  devtool: "cheap-module-eval-source-map"
};

import path from "path";

export default {
  entry: path.resolve(__dirname, "..", "./app.jsx"),
  output: {
    path: path.resolve(__dirname, "..", "dist"),
    filename: "client.bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader"
      },
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader", options: { singleton: true } },
          { loader: "css-loader" }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"]
  },
  devtool: "eval",
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: /node_modules/
  }
};

import path from "path";

export default {
  entry: path.resolve(__dirname, "./app.js"),
  output: {
    path: path.resolve(__dirname, "..", "..", "dist", "dev"),
    filename: "client.dev.bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader"
      }
    ]
  }
};

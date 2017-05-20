import path from "path";
import webpack from "webpack";

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
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    })
  ]
};

import webpack from "webpack";
import MemoryFs from "memory-fs";

import webpackConfig from "../client/webpack.config.prod.babel";
import devWebpackConfig from "../client/webpack.config.dev.babel";

/**
 * Compiles the client bundle in-memory.
 * @returns {Promise}
 */
export default () => {
  const config = process.env.NODE_ENV === "production"
    ? webpackConfig
    : devWebpackConfig;
  const compiler = webpack(config);
  compiler.outputFileSystem = new MemoryFs();

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) return reject(err);

      if (stats.hasErrors() || stats.hasWarnings()) {
        return reject(
          new Error(
            stats.toString({
              errorDetails: true,
              warnings: true
            })
          )
        );
      }

      const result = compiler.outputFileSystem.data[
        "client.bundle.js"
      ].toString();
      return resolve(result);
    });
  });
};

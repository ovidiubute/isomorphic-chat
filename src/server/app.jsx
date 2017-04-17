// Backend dependencies
import Koa from "koa";
import render from "koa-ejs";
import path from "path";

// Client dependencies
import webpack from "webpack";
import MemoryFs from "memory-fs";
import React from "react";
import { renderToString } from "react-dom/server";
import webpackConfig from "../client/webpack.config.prod.babel";
import devWebpackConfig from "../client/webpack.config.dev.babel";
import MainChat from "../client/main-chat";

const app = new Koa();

// Render the main layout file using EJS
render(app, {
  root: path.join(__dirname, "view"),
  layout: "template",
  viewExt: "ejs",
  cache: true
});

/**
 * Compiles the client bundle in-memory.
 * @returns {Promise}
 */
function compileBundle() {
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
}

// Compile the bundle and save it
app.use(async (ctx, next) => {
  if (!app.clientWebBundle) {
    app.clientWebBundle = await compileBundle();
  }
  return next();
});

// Koa main handler
app.use(async ctx => {
  await ctx.render("main", {
    reactOutput: renderToString(<MainChat />),
    clientBundle: app.clientWebBundle
  });
});

// Main entry point
if (process.env.NODE_ENV === "test") {
  // ES6 exports not allowed in a dynamic context
  module.exports = app.callback();
} else {
  app.listen(7001);
}

// Error handler
app.on("error", err => console.error(err.stack));

// Backend dependencies
import Koa from "koa";
import render from "koa-ejs";
import serve from "koa-static";
import path from "path";

// Client dependencies
import React from "react";
import { renderToString } from "react-dom/server";
import MainChat from "../client/main-chat";

const app = new Koa();

// Render the main layout file using EJS
render(app, {
  root: path.join(__dirname, "view"),
  layout: "template",
  viewExt: "ejs",
  cache: true
});

// Koa static handler
app.use(serve(`${__dirname}/../../dist/`));

// Koa main handler
app.use(async ctx => {
  let clientBundleUrl = "/dev/client.dev.bundle.js";
  if (process.env.NODE_ENV === "production") {
    clientBundleUrl = "/prod/client.bundle.js";
  }

  await ctx.render("main", {
    reactOutput: renderToString(<MainChat />),
    clientBundleUrl
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

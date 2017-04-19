import Koa from "koa";
import IO from "koa-socket";
import render from "koa-ejs";
import path from "path";
import React from "react";
import { renderToString } from "react-dom/server";
import compileBundle from "./compile-bundle";
import MainChat from "../client/main-chat";

// Init backend app
const app = new Koa();

// Init socket.io chat endpoint
const io = new IO();
io.attach(app);

// Init Redis connection
const pub = require("redis").createClient({
  host: process.env.NODE_ENV === "production" ? "redis" : "127.0.0.1"
});
const sub = require("redis").createClient({
  host: process.env.NODE_ENV === "production" ? "redis" : "127.0.0.1"
});

// Subscribe to receive all messages on channel
sub.subscribe("main-channel");

sub.on("message", (channel, message) => {
  // Broadcasts to all connections
  io.broadcast("message", message);
});

// On incoming socket message, publish to Redis
io.on("message", ctx => {
  pub.publish("main-channel", ctx.data);
});

// Render the main layout file using EJS
render(app, {
  root: path.join(__dirname, "view"),
  layout: "template",
  viewExt: "ejs",
  cache: true
});

// Compile client bundle and cache it for future requests
app.use(async (ctx, next) => {
  if (!app.clientWebBundle) {
    app.clientWebBundle = await compileBundle();
  }

  await next();
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
// eslint-disable-next-line no-console
app.on("error", err => console.error(err.stack));

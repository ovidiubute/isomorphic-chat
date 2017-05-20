import Koa from "koa";
import IO from "koa-socket";
import render from "koa-ejs";
import serve from "koa-static";
import path from "path";
import React from "react";
import { createClient } from "redis";
import { renderToString } from "react-dom/server";
import MainChat from "../client/main-chat";

// Init Redis connection
const pub = createClient({
  host: "redis"
});
const sub = createClient({
  host: "redis"
});

// Subscribe to receive all messages on channel
sub.subscribe("main-channel");

// Init backend app
const app = new Koa();
// Init socket.io chat endpoint
const io = new IO();

io.attach(app);

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

// Koa static handler
app.use(serve(path.resolve(__dirname, "/src/client/dist")));

// Koa main handler
app.use(async ctx => {
  await ctx.render("main", {
    reactOutput: renderToString(<MainChat />)
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

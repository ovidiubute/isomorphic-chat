// @ts-check

const Koa = require("koa");
const IO = require("koa-socket");
const render = require("koa-ejs");
const serve = require("koa-static");
const path = require("path");
const React = require("react");
const { renderToString } = require("react-dom/server");
const { createClient } = require("redis");
const nano = require("nano")("http://couchdb:5984");
const MainChat = require("../client/main-chat").default;

/**
 * Get last 10 messages from the database
 * to serve as starting point for SSR of our app
 */
async function getLastMessages(db) {
  return new Promise((resolve, reject) => (
    db.list({ limit: 10, include_docs: true }, (err, body) => {
      if (err) {
        reject(err);
      }

      resolve(body.rows);
    })
  ));
}

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

// DB
const messagesDB = nano.use("ic-messages");

// Init socket.io chat endpoint
const io = new IO();

// Attach socket.io handler to Koa app
io.attach(app);

sub.on("message", (channel, message) => {
  // Broadcasts to all connections
  io.broadcast("message", message);
});

// On incoming socket message, publish to Redis and save to DB
io.on("message", ctx => {
  const timestamp = Date.now();

  pub.publish("main-channel", JSON.stringify(ctx.data));
  messagesDB.insert({
    _id: `${ctx.data.userId}-${timestamp}`,
    msg: ctx.data.msg,
    timestamp
  });
});

// Attach render middleware
render(app, {
  root: path.join(__dirname, "view"),
  layout: "template",
  viewExt: "ejs",
  cache: true
});

// Koa static handler
app.use(serve(path.resolve(__dirname, "..", "client", "dist")));

// Koa main handler
app.use(async ctx => {
  const messages = await getLastMessages(messagesDB);
  
  await ctx.render("main", {
    reactOutput: renderToString(
      React.createElement(MainChat, {
        messages
      })
    )
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

// @ts-check

const Koa = require("koa");
const IO = require("koa-socket");
const render = require("koa-ejs");
const serve = require("koa-static");
const path = require("path");
const React = require("react");
const { renderToString } = require("react-dom/server");
const { createClient } = require("redis");
const MongoClient = require("mongodb").MongoClient;
const MainChat = require("../client/main-chat").default;

MongoClient.connect("mongodb://mongodb/isomorphic-chat", (err, db) => {
  if (err) {
    throw new Error("Unable to connect to MongoDB. Aborting!");
  }

  /**
   * Get last 10 messages from the database
   * to serve as starting point for SSR of our app
   */
  async function getLastMessages() {
    return db
      .collection("messages")
      .find({})
      .sort({
        timestamp: -1
      })
      .limit(10)
      .toArray();
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
    pub.publish("main-channel", JSON.stringify(ctx.data));
    db.collection("messages").insert(
      Object.assign({}, ctx.data, {
        timestamp: Date.now()
      })
    );
  });

  // Attach render middleware
  render(app, {
    root: path.join(__dirname, "view"),
    layout: "template",
    viewExt: "ejs",
    cache: process.env.NODE_ENV === "production"
  });

  // Koa static handlers
  app.use(serve(path.resolve(__dirname, "..", "client", "dist")));
  app.use(serve(path.resolve(__dirname, "..", "client", "public")));

  // Koa main handler
  app.use(async ctx => {
    const messages = await getLastMessages();

    await ctx.render("main", {
      reactOutput: renderToString(
        React.createElement(MainChat, {
          messages: messages.reverse() // Note that this reverses in-place
        })
      ),
      __state_messages__: JSON.stringify(messages)
    });
  });

  // Main entry point
  if (process.env.NODE_ENV === "test") {
    // ES6 exports not allowed in a dynamic context
    module.exports = app.callback();
  } else {
    app.listen(7001);
  }

  // eslint-disable-next-line no-console
  app.on("error", err2 => console.error(err2.stack));
});

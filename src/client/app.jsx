import React from "react";
import ReactDOM from "react-dom";
import MainChat from "./main-chat";

const socket = require("socket.io-client")();

ReactDOM.render(
  // eslint-disable-next-line no-underscore-dangle
  <MainChat socket={socket} messages={window.__state_messages__} />,
  document.getElementById("root")
);

import React from "react";
import ReactDOM from "react-dom";
import MainChat from "./main-chat";

const socket = require("socket.io-client")();

ReactDOM.render(<MainChat socket={socket} />, document.getElementById("root"));

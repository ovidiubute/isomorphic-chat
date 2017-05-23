const main = {
  height: "80vh",
  maxHeight: "80vh",
  width: 600,
  margin: "auto"
};

const list = {
  listStyleType: "none",
  padding: 8,
  margin: 0
};

const username = {
  fontSize: "x-small",
  verticalAlign: "middle",
  color: "peru"
};

const myUsername = Object.assign({}, username, {
  color: "white"
});

const container = {
  height: "inherit",
  maxHeight: "inherit",
  overflow: "scroll",
  border: "1px solid #d3d3d3",
  borderRadius: 8,
  color: "rgb(89, 68, 68)",
  backgroundColor: "white"
};

const comment = {
  display: "inline-block",
  boxShadow: "2px 2px 2px 1px rgba(0, 0, 0, 0.07)",
  borderRadius: 8,
  overflowWrap: "break-word",
  padding: 8,
  verticalAlign: "baseline",
  userSelect: "text",
  margin: "0 0 12px 0"
};

const ownComment = Object.assign({}, comment, {
  backgroundColor: "lightgreen",
  color: "white"
});

const input = {
  fontSize: 24,
  marginTop: 4,
  padding: 4,
  width: 600,
  border: "1px solid #d3d3d3",
  outline: "none"
};

export default {
  main,
  container,
  list,
  username,
  myUsername,
  comment,
  ownComment,
  input
};

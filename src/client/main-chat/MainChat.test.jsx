import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import MainChat from "./MainChat";

describe("MainChat", () => {
  it("should render in empty state", () => {
    const r = new ReactShallowRenderer();
    r.render(<MainChat />);

    const result = r.getRenderOutput();
    expect(result.type).toBe("div");
    expect(result.props.children).toHaveLength(2);
    expect(result.props.children[0].type).toBe("ul");
    expect(result.props.children[1].type).toBe("input");
  });
});

/* eslint-disable react/prop-types */
import React from "react";

class MainChat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      username: null
    };
  }

  componentWillMount() {
    if (this.props.socket) {
      this.setState((prevState, props) => ({
        username: `anon-${props.socket.id}`
      }));
      this.props.socket.on("message", this.receiveMessage);
    }
  }

  onKeyUp = e => {
    if (e.keyCode === 13) {
      this.props.socket.emit("message", e.target.value);
    }
  };

  receiveMessage = message => {
    this.setState(prevState => ({
      messages: prevState.messages.concat(message)
    }));
  };

  render() {
    return (
      <div>
        <ul>
          {this.state.messages.map(m => <li>{m}</li>)}
        </ul>
        <input
          type="text"
          placeholder="Type something..."
          onKeyUp={this.onKeyUp}
        />
      </div>
    );
  }
}

export default MainChat;

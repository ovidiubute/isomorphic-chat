/* eslint-disable react/prop-types */
/* eslint-disable no-underscore-dangle */
import React from "react";

class MainChat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: this.props.messages || [],
      username: null,
      input: ""
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
      this.props.socket.emit("message", {
        userId: `anon-${this.props.socket.id}`,
        msg: this.state.input
      });

      this.setState({
        input: ""
      });
    }
  };

  onInputChange = e => {
    this.setState({
      input: e.target.value
    });
  };

  receiveMessage = message => {
    this.setState(prevState => ({
      messages: prevState.messages.concat(JSON.parse(message))
    }));
  };

  render() {
    return (
      <div>
        <ul>
          {this.state.messages.map(m => (
            <li key={m._id}>
              <p>
                {`${m.userId} : ${m.msg}`}
              </p>
            </li>
          ))}
        </ul>
        <input
          type="text"
          placeholder="Type something..."
          value={this.state.input}
          onKeyUp={this.onKeyUp}
          onChange={this.onInputChange}
        />
      </div>
    );
  }
}

export default MainChat;

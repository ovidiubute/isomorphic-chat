/* eslint-disable react/prop-types */
/* eslint-disable no-underscore-dangle */
import React from "react";

import styles from "./styles";

class MainChat extends React.Component {
  constructor(props) {
    super(props);

    this.messageElements = [];

    this.state = {
      messages: this.props.messages || [],
      input: ""
    };
  }

  componentWillMount() {
    this.props.socket.on("message", this.receiveMessage);
  }

  componentDidMount() {
    this.input.focus();
  }

  componentDidUpdate() {
    if (this.messageElements.length) {
      this.messageElements[this.messageElements.length - 1].scrollIntoView();
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
      <div style={styles.main}>
        <div style={styles.container}>
          <ul style={styles.list}>
            {this.state.messages.map(m => (
              <li key={m._id}>
                <p
                  ref={elm => {
                    this.messageElements.push(elm);
                  }}
                  style={
                    m.userId === `anon-${this.props.socket.id}`
                      ? styles.ownComment
                      : styles.comment
                  }
                >
                  <span
                    style={
                      m.userId === `anon-${this.props.socket.id}`
                        ? styles.myIsername
                        : styles.username
                    }
                  >{`${m.userId}: `}</span>
                  <span>{m.msg}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
        <input
          ref={elm => {
            this.input = elm;
          }}
          style={styles.input}
          type="text"
          value={this.state.input}
          onKeyUp={this.onKeyUp}
          onChange={this.onInputChange}
        />
      </div>
    );
  }
}

MainChat.defaultProps = {
  socket: {
    id: 42,
    on: () => {}
  }
};

export default MainChat;

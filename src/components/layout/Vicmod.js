import React, { Component } from "react";
import { connect } from "react-redux";
import { vicActionOne } from "../../store/actions/victorActions";

class Vicmod extends Component {
  state = {
    value: ""
  };
  handleSubmit = e => {
    e.preventDefault();
    var rand = 1 + Math.random() * 100;

    this.setState({
      value: rand.toFixed(0)
    });
    this.props.vicDoSth(this.state);
  };
  render() {
    return (
      <div className="container">
        <form onSubmit={this.handleSubmit}>
          <span className="prompt">{this.state.value}</span>
          <button className="btn pink lighten-1">vicmod</button>
        </form>
      </div>
    );
  }
}

// export default Vicmod;

const mapDispatchToProps = dispatch => {
  return {
    vicDoSth: something => dispatch(vicActionOne(something))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(Vicmod);

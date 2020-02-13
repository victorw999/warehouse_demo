import React, { Component } from "react";
import { connect } from "react-redux";
import { createJob } from "../../store/actions/jobActions";

class CreateJob extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ""
    };
  }
  handleChange = e => {
    this.setState({
      text: e.target.value
    });
  };
  handleSubmit = e => {
    e.preventDefault();

    this.props.createJob({ date: new Date(), text: this.state.text });
    alert("job created!");
  };

  render() {
    return (
      <div className="container white">
        <form action="" onSubmit={this.handleSubmit.bind(this)}>
          <input type="text" onChange={this.handleChange.bind(this)} />
          <input type="submit" value="create job" className="btn" />
        </form>
      </div>
    );
  }
}
const mapDispatchToProps = dispatch => {
  return {
    createJob: job => dispatch(createJob(job))
  };
};

export default connect(null, mapDispatchToProps)(CreateJob);

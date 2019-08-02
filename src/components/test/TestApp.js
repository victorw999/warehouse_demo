import React, { Component } from "react";
import AddButton from "./AddButton";
import Another from "./Another";
// import Child from "./Child";

class TestApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEmptyState: true,
      MyProjects: [1, 2, 3, 4, 5]
    };
  }

  triggerAddTripState = () => {
    this.setState({
      ...this.state,
      isEmptyState: false,
      isAddTripState: true
    });
  };

  render() {
    return (
      <div>
        {/* <Child /> */}
        {this.state.isEmptyState && (
          <AddButton addTrip={this.triggerAddTripState} />
        )}

        {this.state.isAddTripState && <Another />}
      </div>
    );
  }
}
export default TestApp;

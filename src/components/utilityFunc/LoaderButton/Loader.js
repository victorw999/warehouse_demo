// REF: https://stackoverflow.com/q/47606594/5844090
import React, { Component } from "react";

const Loader = WrappedComponent => {
  return class Loader extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isLoading: false
      };
      this.showLoader = this.showLoader.bind(this);
    }

    showLoader() {
      this.setState({ isLoading: true });
    }

    render() {
      return this.state.isLoading ? (
        this.props.status === "n/a" || this.props.status === "mixed" ? (
          ""
        ) : (
          <div className="preloader-wrapper small active">
            <div className="spinner-layer spinner-red-only">
              <div className="circle-clipper left">
                <div className="circle"></div>
              </div>
              <div className="gap-patch">
                <div className="circle"></div>
              </div>
              <div className="circle-clipper right">
                <div className="circle"></div>
              </div>
            </div>
          </div>
        )
      ) : (
        <WrappedComponent {...this.props} showLoader={this.showLoader} />
      );
    }
  };
};

export default Loader;

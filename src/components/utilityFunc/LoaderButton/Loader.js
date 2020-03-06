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

    showLoader(input) {
      this.setState({ isLoading: input }); // original default was true
    }

    /**
     *    * this feature is obsolete
     *    when receiving prop "stop_loader"
     *    Loader.js will stop loader animation
     */
    componentDidUpdate(prevProps) {
      if (prevProps.stop_loader !== this.props.stop_loader) {
        // if detecting the 'stop_loader' prop has been filled, then turn off loader animation
        if (this.props.stop_loader === "stop_loader") {
          setTimeout(() => {
            this.setState({ isLoading: false });
          }, 3000);
        }
      }
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

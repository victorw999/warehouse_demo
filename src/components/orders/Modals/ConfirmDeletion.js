import React, { Component } from "react";
import { Modal } from "react-materialize";

class ConfirmDeletion extends Component {
  render() {
    const { name, open, actions } = this.props;
    return (
      <Modal
        id="confirmDeletion"
        open={open}
        actions={actions}
        header="Delete this order?"
      >
        <div className="modal-content ">
          <p> Are you sure you want to delete '{name}'? </p>
        </div>
      </Modal>
    );
  }
}

export default ConfirmDeletion;

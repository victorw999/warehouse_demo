import React, { Component } from "react";
import { Modal } from "react-materialize";

class ConfirmDeletion extends Component {
  render() {
    const { name, open, actions, header, options } = this.props;
    return (
      <Modal
        id="confirmDeletion"
        open={open}
        actions={actions}
        header={header}
        options={options}
      >
        <div className="modal-content ">
          <p> Are you sure you want to delete '{name}'? </p>
        </div>
      </Modal>
    );
  }
}

export default ConfirmDeletion;

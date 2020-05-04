import React, { Component } from "react";
import { Modal } from "react-materialize";

class MsgModal extends Component {
  render() {
    const { id, open, actions, header, content, options } = this.props;
    return (
      <Modal
        id={id}
        open={open}
        actions={actions}
        header={header}
        options={options}
      >
        <div className="modal-content ">
          <p> {content} </p>
        </div>
      </Modal>
    );
  }
}

export default MsgModal;

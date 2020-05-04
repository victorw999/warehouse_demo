import React, { Component } from "react";
import { Modal } from "react-materialize";

class ConfirmDeletion extends Component {
  render() {
    const { name, open, actions, header, trigger, options } = this.props;
    return (
      <Modal
        bottomSheet={false}
        fixedFooter={false}
        // options={options}
        // options={{
        //   dismissible: true,
        //   endingTop: "10%",
        //   inDuration: 250,
        //   onCloseEnd: null,
        //   onCloseStart: null,
        //   onOpenEnd: null,
        //   onOpenStart: null,
        //   opacity: 0.5,
        //   outDuration: 250,
        //   preventScrolling: true,
        //   startingTop: "4%",
        // }}
        //
        id="confirmDeletion"
        open={open}
        actions={actions}
        header={header}
        root={document.getElementById("modal-root")}
        trigger={trigger}
      >
        <div className="modal-content ">
          <p> Are you sure you want to delete '{name}'? </p>
        </div>
      </Modal>
    );
  }
}

export default ConfirmDeletion;

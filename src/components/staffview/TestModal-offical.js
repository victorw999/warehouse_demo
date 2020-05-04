import React, { useState } from "react";
import LoaderButton from "../utilityFunc/LoaderButton/LoaderButton";
import ConfirmDeletion from "../modals/ConfirmDeletion";

import { Modal, Button } from "react-materialize";

const TestModal = () => {
  return (
    <Modal
      actions={[
        <Button flat modal="close" node="button" waves="green">
          Close
        </Button>,
      ]}
      bottomSheet={false}
      fixedFooter={false}
      header="Modal Header"
      id="Modal-0"
      open={false}
      options={{
        dismissible: true,
        endingTop: "10%",
        inDuration: 250,
        onCloseEnd: null,
        onCloseStart: null,
        onOpenEnd: null,
        onOpenStart: null,
        opacity: 0.5,
        outDuration: 250,
        preventScrolling: true,
        startingTop: "4%",
      }}
      //root={[object HTMLBodyElement]}
      root={document.getElementById("modal-root")}
      trigger={<Button node="button">MODAL</Button>}
    >
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum
      </p>
    </Modal>
  );
};

export default TestModal;

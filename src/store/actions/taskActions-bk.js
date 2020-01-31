export const createPickTask = task => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    // make async calls to db: add this order to firebase, b4 dispatch the action
    const firestore = getFirestore();
    const profile = getState().firebase.profile;
    const authorId = getState().firebase.auth.uid;

    console.log("new picktask : ", task);
    firestore
      .collection("picktasks")
      .add({
        ...task,
        authorFirstName: profile.firstName,
        authorLastName: profile.lastName,
        authorId: authorId,
        startTime: new Date()
      })
      .then(docRef => {
        console.log("Document written with ID: ", docRef.id);
      })
      .then(() => {
        // dispatch({ type: "CREATE_PICKTASK", task });
        console.log("pick task created! ", task);
      })
      .catch(err => {
        // dispatch({ type: "CREATE_PICKTASK_ERROR", err });
        console.log("pick task err! ", err);
      });
  };
};

// cancel btn
export const deletePickTask = pickId => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    // make async calls to db: add this order to firebase, b4 dispatch the action
    const firestore = getFirestore();
    const profile = getState().firebase.profile;
    const authorId = getState().firebase.auth.uid;

    firestore
      .delete({
        collection: "picktasks",
        doc: pickId
      })
      .then(() => {
        // dispatch({ type: "DELETE_PICKTASK",  });
        console.log("pick task deleted! ", pickId);
      })
      .catch(err => {
        // dispatch({ type: "DELETE_PICKTASK_ERROR", err });
      });
  };
};

// complete picktask
export const completePickTask = pickId => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    // make async calls to db: add this order to firebase, b4 dispatch the action
    const firestore = getFirestore();
    const profile = getState().firebase.profile;
    const authorId = getState().firebase.auth.uid;

    firestore
      .collection("picktasks")
      .doc(pickId)
      .update({
        status: "pick_complete"
      })
      .then(() => {
        // dispatch({ type: "DELETE_PICKTASK",  });
        console.log("pick task completed! ", pickId);
      })
      .catch(err => {
        // dispatch({ type: "DELETE_PICKTASK_ERROR", err });
      });
  };
};

// fail picktask (item N/A)
export const failPickTask = pickId => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    // make async calls to db: add this order to firebase, b4 dispatch the action
    const firestore = getFirestore();
    const profile = getState().firebase.profile;
    const authorId = getState().firebase.auth.uid;

    firestore
      .collection("picktasks")
      .doc(pickId)
      .update({
        status: "n/a"
      })
      .then(() => {
        // dispatch({ type: "DELETE_PICKTASK",  });
        console.log("pick task failed! item not available ", pickId);
      })
      .catch(err => {
        // dispatch({ type: "DELETE_PICKTASK_ERROR", err });
      });
  };
};

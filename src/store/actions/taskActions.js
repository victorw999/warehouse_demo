export const createPickTask_bk1 = task => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    // make async calls to db: add this order to firebase, b4 dispatch the action
    const firestore = getFirestore();
    const profile = getState().firebase.profile;
    const authorId = getState().firebase.auth.uid;

    task.itemlist.forEach(picktask_item => {
      firestore
        .collection("picktasks")
        .add({
          ...picktask_item,
          status: "picking",
          authorFirstName: profile.firstName,
          authorLastName: profile.lastName,
          authorId: authorId,
          startTime: new Date()
        })
        .then(docRef => {
          // console.log("new picktask created : ", docRef.id);
          console.log("creating task for sku: ", picktask_item.sku);
          console.log("creating task for sku: ", picktask_item);
        })
        .catch(err => {
          // dispatch({ type: "CREATE_PICKTASK_ERROR", err });
          console.log("pick task err! ", err);
        });
    }); // end forEach looping itemlist
  };
};
/**
 *
 *  CREATE
 */
export const createPickTask = task => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    // make async calls to db: add this order to firebase, b4 dispatch the action
    const firestore = getFirestore();
    const profile = getState().firebase.profile;
    const authorId = getState().firebase.auth.uid;

    var batch = firestore.batch();
    var tempTasks = [];

    // creat task(s)
    task.itemlist.forEach(picktask_item => {
      var newRef = firestore.collection("picktasks").doc();
      var newPicktask = {
        ...picktask_item,
        status: "picking",
        authorFirstName: profile.firstName,
        authorLastName: profile.lastName,
        authorId: authorId,
        startTime: new Date(),
        id: newRef.id // put the new task's ref id inside
      };
      batch.set(newRef, newPicktask);
      tempTasks.push(newPicktask);
    }); // end forEach looping itemlist

    // commit task, then start updating orders
    batch.commit().then(() => {
      updateOrdersAfterTasksAction(firestore, tempTasks, "create");
    }); // batch.commit()
  };
};

/**
 *
 *  CANCEL, delete indivual ones, then this'll trigger cloud func
 */
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

/**
 *
 *  CANCEL MULTIPLE
 */
export const deleteMultiPickTasks = list => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    // make async calls to db: add this order to firebase, b4 dispatch the action
    const firestore = getFirestore();
    const profile = getState().firebase.profile;
    const authorId = getState().firebase.auth.uid;

    // filter list that belong to current user
    var currentUserList = list.filter(i => {
      if (i.picker === profile.firstName) {
        return true;
      } else {
        console.error("canceling tasks, some tasks are assigned to other usrs");
        return false;
      }
    });
    // batch init
    var batch = firestore.batch();
    // delete tasks (belong to current user)
    currentUserList.forEach(picktask_item => {
      var newRef = firestore
        .collection("picktasks")
        .doc(`${picktask_item.pickId}`);
      batch.delete(newRef); //
    }); // end forEach looping

    // commit task, then start updating orders
    batch.commit().then(() => {
      updateOrdersAfterTasksAction(firestore, currentUserList, "delete");
    });
    // batch.commit()
  };
};

/**
 *
 *  COMPLETE
 */
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

/**
 *
 *  UPDATE
 */
export const updatePickTask = (pickId, newStatus) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    // make async calls to db: add this order to firebase, b4 dispatch the action
    const firestore = getFirestore();
    const profile = getState().firebase.profile;
    const authorId = getState().firebase.auth.uid;

    firestore
      .collection("picktasks")
      .doc(pickId)
      .update({
        status: newStatus
      })
      .then(() => {
        // dispatch({ type: "DELETE_PICKTASK",  });
      })
      .catch(err => {
        // dispatch({ type: "DELETE_PICKTASK_ERROR", err });
      });
  };
};

/**
 * re-usable func to update 'orders'
 * via firestore "transaction"
 */

const updateOrdersAfterTasksAction = (firestore, list, type) => {
  /**
   * transaction starts
   */
  list.forEach(picktask_item => {
    if (picktask_item.msg === "skip_cloud_trigger") {
      var orderRef = firestore
        .collection("orders")
        .doc(`${picktask_item.order_docId}`);

      return firestore
        .runTransaction(transaction => {
          /**
           * This code may get re-run multiple times if there are conflicts.
           */
          return transaction.get(orderRef).then(doc => {
            if (!doc.exists) {
              throw "vic: Document does not exist!";
            }
            var newItemList = [...doc.data().itemlist];
            newItemList = newItemList.map(i => {
              if (picktask_item.key === i.key) {
                return {
                  ...i,
                  pickId: type === "delete" ? "" : picktask_item.id, // for delete operation,
                  status: type === "delete" ? "" : picktask_item.status,
                  picker:
                    type === "delete" ? "" : picktask_item.authorFirstName,
                  authorId: type === "delete" ? "" : picktask_item.authorId
                };
              } else {
                return i;
              }
            }); // end: newItemList map loop
            /**
             * update "order"
             */

            transaction.update(orderRef, {
              ...doc.data(),
              itemlist: newItemList
            });
          }); // end: transaction.get()
          /**
           * if want to chain another, here is the tutorial:  ref: https://stackoverflow.com/a/57653880/5844090
           */
        }) // end: runTransaction()
        .then(() => {
          // console.log("Transaction: updated 'order' for ", picktask_item.sku);
        })
        .catch(function(error) {
          console.log("Transaction failed: ", error, picktask_item.sku);
        });
    } // if "skip_cloud_trigger"
    else {
      /**
       * picktask was created frm StyleList.js
       * regular creating picktask, skip above transaction, wait for triggers to update order
       */
    }
  }); // end forEach looping itemlist

  /**
   * transaction end
   */
};

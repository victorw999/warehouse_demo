const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

const createNotification = notification => {
  return admin
    .firestore()
    .collection("notifications")
    .add(notification)
    .then(doc => {
      // console.log("notification added", doc);
    })
    .catch(error => {
      console.log("cloudfunc createNotification err", error);
    });
};

// change Data outside the trigger event //REF: https://bit.ly/34gL32J
const db = admin.firestore();

// modify order's item status after detecting a new pick tast is created in 'picktask'
const updateItemStatusOnCreate = picktask => {
  return db
    .collection("orders")
    .where("amzId", "==", picktask.oid)
    .get()
    .then(querySnapshot => {
      // QuerySnapshot API: http://tiny.cc/riyigz

      const promises = []; // holds results returned by each 'update' (in my case, i only have one)
      querySnapshot.forEach(doc => {
        let array = doc.data().itemlist; // find the item, and update its status
        array = array.map(item => {
          if (item.key === picktask.itemkey) {
            return {
              ...item,
              status: picktask.status, // update "order" collection frm "picktasks" collection
              picker: picktask.authorFirstName,
              pickId: picktask.id // for delete operation
            };
          } else {
            return item;
          }
        });
        try {
          // p holds the result of 'update()', which is a Promise,
          const p = db
            .collection("orders")
            .doc(doc.id)
            .update({
              itemlist: array
            });
          promises.push(p); // push results into promises array
        } catch (err) {
          console.error(
            "cloud func > updateItemStatusOnCreate() > error: ",
            err
          );
        }
      });
      return Promise.all(promises); // return promises so the next then() can chain after
    })
    .then(results => {
      // "results" is a WriteResult obj returned by update()
      const notification = {
        content: `${picktask.authorFirstName} wants to pick (${picktask.qty}x, ${picktask.sku} )`,
        user: `${picktask.authorFirstName}`,
        time: admin.firestore.FieldValue.serverTimestamp()
      };
      return createNotification(notification);
    })
    .catch(err => {
      console.error("cloud func updateItemStatusOnCreate(): ", err);
    });
};

const updateItemStatusOnCreate3 = picktask => {
  const promises = []; // holds results returned by each 'update'
  const queryResult = db
    .collection("orders")
    .get()
    .then(querySnapshot => {
      querySnapshot.docs.map(doc => {
        let itemlist_in_order = doc.data().itemlist; // current order

        loop1: for (var orderItem of itemlist_in_order) {
          for (var taskItem of picktask.itemlist) {
            if (orderItem.key === taskItem.key) {
              var newItem = {
                ...orderItem,
                status: picktask.status, // update "order" collection frm "picktasks" collection
                picker: picktask.authorFirstName,
                pickId: picktask.id // for delete operation
              };

              // build new order itemlist to replace the original order
              // eslint-disable-next-line no-loop-func
              let newItemList = itemlist_in_order.map(item => {
                if (item.key === taskItem.key) {
                  return newItem;
                } else {
                  return item;
                }
              });

              // update this 1 order
              try {
                db.collection("orders")
                  .where("amzId", "==", doc.data().amzId) // only return 1 doc
                  .get()
                  .then(querySnapshot => {
                    const update_promises = [];
                    querySnapshot.forEach(doc => {
                      const p3 = db
                        .collection("orders")
                        .doc(doc.id)
                        .update({ itemlist: newItemList });
                      update_promises.push(p3); // push each update promise into array
                    });
                    return Promise.all(update_promises);
                  }); // end then
              } catch (e) {
                console.error("error when updating original orders: ", e);
              }
              break loop1; // since order's itemlist only contain unique item, so no need to check rest in the itemlist
            } // end if (found the item in orders matching item in task)
          } // end for
        } // end for
      }); // end map (end loop of all orders)
      return Promise.all(promises); // return promises so the next then() can chain after
    })
    .then(results => {
      const notification = {
        content: `${picktask.authorFirstName} wants to pick (${picktask.skuQty}x, ${picktask.sku} )`,
        user: `${picktask.authorFirstName}`,
        time: admin.firestore.FieldValue.serverTimestamp()
      };
      return createNotification(notification);
    })
    .catch(err => {
      console.error("cloud func updateItemStatusOnCreate(): ", err);
    });
  return queryResult;
};

const updateItemStatusOnCreate4 = picktask => {
  const promises = []; // holds results returned by each 'update'

  // loop thru "picktask's itemlist"
  picktask.itemlist.forEach(picktask_item => {
    let order_docId = picktask_item.order_docId;
    var docRef = db.doc(`orders/${order_docId}`);
    const queryResult = docRef.get().then(snap => {
      // re-shape itemlist
      var order_itemlist = snap.data().itemlist;
      for (let i = 0; i < order_itemlist.length; i++) {
        if (picktask_item.key === order_itemlist[i].key) {
          order_itemlist[i] = {
            ...order_itemlist[i],
            status: picktask.status, // update "order" collection frm "picktasks" collection
            picker: picktask.authorFirstName,
            pickId: picktask.id // for delete operation
          };
          break;
        }
      }
      docRef
        .update({
          itemlist: [...order_itemlist]
        })
        .catch(err => {
          console.error(" updateItemStatusOnCreate error: ", err);
        });
      console.log(`update() ${order_docId} done`);
    }); // end queryResult
    promises.push(queryResult);
  }); // end looping "picktask's itemlist"

  return Promise.all(promises);
};

/**
 *  UPDATE ORDER @ PICKTAST CREATED
 */
const updateItemStatusOnCreate5 = picktask => {
  const promises = []; // holds results returned by each 'update'

  let order_docId = picktask.order_docId;
  var docRef = db.doc(`orders/${order_docId}`);
  const queryResult = docRef.get().then(snap => {
    // re-shape itemlist
    var order_itemlist = snap.data().itemlist;
    for (let i = 0; i < order_itemlist.length; i++) {
      if (picktask.key === order_itemlist[i].key) {
        order_itemlist[i] = {
          ...order_itemlist[i],
          status: picktask.status, // update "order" collection frm "picktasks" collection
          picker: picktask.authorFirstName,
          pickId: picktask.id // for delete operation
        };
        break;
      }
    }
    docRef
      .update({
        itemlist: [...order_itemlist]
      })
      .catch(err => {
        console.error(" updateItemStatusOnCreate error: ", err);
      });
    console.log(`update() ${order_docId} done`);
  }); // end queryResult
  promises.push(queryResult);

  return Promise.all(promises);
};

/**
 *  UPDATE ORDER @ PICKTAST DELETED
 */
const updateItemStatusOnDelete = picktask => {
  const delete_promises = [];
  picktask.itemlist.map(task_item => {
    // p holds the each order updates
    const p = db
      .collection("orders")
      .where("amzId", "==", task_item.oid)
      .get()
      .then(querySnapshot => {
        const promises = []; // holds results returned by each 'update' (in my case, i only have one)
        querySnapshot.forEach(doc => {
          let array = doc.data().itemlist;
          array = array.map(item => {
            if (item.key === task_item.key && picktask.id === item.pickId) {
              return {
                ...item,
                status: "", // reset
                picker: "", // reset
                pickId: "" // reset
              };
            } else {
              return item;
            }
          }); // end looping order's itemlist's item
          try {
            // p holds the result of 'update()', which is a Promise,
            const p = db
              .collection("orders")
              .doc(doc.id) // maybe picktask should remember order's doc ID
              .update({
                itemlist: array
              });
            promises.push(p); // push results into promises array
            console.log("updateItemStatusOnDelete() > mod order > ", doc.id);
          } catch (err) {
            console.error(
              "cloud func > updateItemStatusOnDelete() > error: ",
              err
            );
          }
        }); // end looping this order querysnapshot

        return Promise.all(promises); // return promises so the next then() can chain after
      });
    /** comment out the notification to see if it will run faster */
    // .then(results => {
    //   // "results" is a WriteResult obj returned by update()
    //   const notification = {
    //     content: `Delete task (${picktask.qty}x, ${picktask.sku} )`,
    //     user: `${picktask.authorFirstName}`,
    //     time: admin.firestore.FieldValue.serverTimestamp()
    //   };
    //   return createNotification(notification);
    // })
    // .catch(err => {
    //   console.error("cloud func updateItemStatusOnDelete(): ", err);
    // });
    delete_promises.push(p);
  }); // end looping picktask's itemlist
  return Promise.all(delete_promises);
};

/**
 *  UPDATE ORDER @ PICKTAST DELETED
 */
const updateItemStatusOnDelete2 = picktask => {
  const delete_promises = [];
  // p holds the each order updates
  const p = db
    .collection("orders")
    .where("amzId", "==", picktask.oid)
    .get()
    .then(querySnapshot => {
      const promises = [];
      // holds results returned by each 'update' (in my case, i only have one)
      querySnapshot.forEach(doc => {
        let array = doc.data().itemlist;
        array = array.map(item => {
          if (item.key === picktask.key && picktask.id === item.pickId) {
            return {
              ...item,
              status: "", // reset
              picker: "", // reset
              pickId: "" // reset
            };
          } else {
            return item;
          }
        }); // end looping order's itemlist's item
        try {
          const p = db
            .collection("orders")
            .doc(doc.id) // maybe picktask should remember order's doc ID
            .update({
              itemlist: array
            });
          promises.push(p); // push results into promises array
        } catch (err) {
          console.error("updateItemStatusOnDelete2() > error: ", err);
        }
      });
      return Promise.all(promises); // return promises so the next then() can chain after
    });

  delete_promises.push(p);
  return Promise.all(delete_promises);
};

/**
 * PROJRECT CREATE
 */
exports.projectCreated = functions.firestore
  .document("projects/{projectId}")
  .onCreate(doc => {
    const project = doc.data();
    const notification = {
      content: "Added a new project",
      user: `${project.authorFirstName} ${project.authorLastName}`,
      time: admin.firestore.FieldValue.serverTimestamp()
    };
    return createNotification(notification);
  });

// when picker selects a task
// exports.pickTaskCreated = functions.firestore
//   .document("picktasks/{picktask}")
//   .onCreate(doc => {
//     const picktask = { ...doc.data(), id: doc.id };
//     return updateItemStatusOnCreate(picktask);
//   });

/**
 * PICKTASK CREATED
 */
exports.pickTaskCreated = functions.firestore
  .document("picktasks/{picktask}")
  .onCreate(
    // ref#1: https://stackoverflow.com/a/47078220/5844090
    // Match value of array from db object in Firebase Cloud Functions
    doc => {
      const picktask = { ...doc.data(), id: doc.id };
      return updateItemStatusOnCreate5(picktask);
    }
  );

/**
 * PICKTASK DELETED
 */
exports.pickTaskDeleted = functions.firestore
  .document("picktasks/{picktask}")
  .onDelete(doc => {
    const picktask = { ...doc.data(), id: doc.id };
    console.log("pickTaskDeleted2 -->", picktask);
    return updateItemStatusOnDelete2(picktask);
  });

/**
 * PICKTASK updated: completed
 */
exports.pickTaskCompleted = functions.firestore
  .document("picktasks/{picktask}")
  .onUpdate((change, context) => {
    const newValue = change.after.data();
    const picktask = { ...newValue, id: change.after.ref.id };
    // console.log("---:: change.after.ref", change.after.ref);
    // console.log("---:: change.after.ref.id", change.after.ref.id);
    return updateItemStatusOnCreate5(picktask);
  });

/**
 *  USER JOINED
 */
exports.userJoined = functions.auth.user().onCreate(user => {
  return admin
    .firestore()
    .collection("users")
    .doc(user.uid)
    .get()
    .then(doc => {
      const newUser = doc.data();
      const notification = {
        content: "Joined the party",
        user: `${newUser.firstName} ${newUser.lastName}`,
        time: admin.firestore.FieldValue.serverTimestamp()
      };

      return createNotification(notification);
    });
});

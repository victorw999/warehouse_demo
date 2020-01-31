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
        console.log("===> picktask create: ", picktask.sku, picktask.quantity);
        order_itemlist[i] = {
          ...order_itemlist[i],
          status: picktask.status, // update "order" collection frm "picktasks" collection
          picker: picktask.authorFirstName,
          pickId: picktask.id // for delete operation
        };
        // break;
      }
    }
    docRef
      .update({
        itemlist: [...order_itemlist]
      })
      .catch(err => {
        console.error(" updateItemStatusOnCreate error: ", err);
      });
    console.log(`update() order done, new itemlist:  `);
    console.log(order_itemlist);
  }); // end queryResult
  promises.push(queryResult);

  return Promise.all(promises);
};

/**
 *  UPDATE ORDER @ PICKTAST CREATED
 */
const updateItemStatusOnCreate6 = picktask => {
  const promises = []; // holds results returned by each 'update'

  let order_docId = picktask.order_docId;
  var docRef = db.doc(`orders/${order_docId}`);
  var order_itemlist = [];

  const queryResult = docRef
    .get()
    .then(snap => {
      // re-shape itemlist
      order_itemlist = snap.data().itemlist;
      var output;
      for (let i = 0; i < order_itemlist.length; i++) {
        if (picktask.key === order_itemlist[i].key) {
          console.log(`===> picktask creating for: ${picktask.sku}`);
          order_itemlist[i] = {
            ...order_itemlist[i],
            status: picktask.status, // update "order" collection frm "picktasks" collection
            picker: picktask.authorFirstName,
            pickId: picktask.id // for delete operation
          };
          output = `+++ ${picktask.sku} - pickid: ${picktask.id}`;
          break;
        }
      }
      var finishedUpdate = false;
      /** moved from here */
      docRef
        .update({
          itemlist: [...order_itemlist]
        })
        .then(() => {
          console.log(
            `*****>update() ${picktask.sku} is finished, new itemlist:  ${output}`
          );
          // console.log(order_itemlist);
          finishedUpdate = true;

          /**
           *
           */
        }) // end then
        .catch(err => {
          console.error(" updateItemStatusOnCreate error: ", err);
        });

      /**
       *
       */
      return new Promise((resolve, reject) => {
        // check if order's updated,
        if (finishedUpdate) {
          resolve("done in new promise");
        } else {
          reject("reject!");
        }
      });
    }) // end queryResult
    .then(result => {
      console.log("--->", result);
    })
    .catch(err => {
      console.log("updateItemStatusOnCreate6: ", err);
    });

  promises.push(queryResult);

  return Promise.all(promises);
};

const updateItemStatusOnCreate7 = picktask => {
  const promises = []; // holds results returned by each 'update'

  let order_docId = picktask.order_docId;
  var docRef = db.doc(`orders/${order_docId}`);
  var order_itemlist = [];
  var output;
  const queryResult = docRef
    .get()
    .then(snap => {
      // re-shape itemlist
      order_itemlist = snap.data().itemlist;

      for (let i = 0; i < order_itemlist.length; i++) {
        if (picktask.key === order_itemlist[i].key) {
          console.log(`===> picktask creating for: ${picktask.sku}`);
          order_itemlist[i] = {
            ...order_itemlist[i],
            status: picktask.status, // update "order" collection frm "picktasks" collection
            picker: picktask.authorFirstName,
            pickId: picktask.id // for delete operation
          };
          output = `+++ ${picktask.sku} - pickid: ${picktask.id}`;
          break;
        }
      }

      /** moved from here */

      return new Promise((resolve, reject) => {
        // check if order's updated,
        if (true) {
          resolve(order_itemlist);
        } else {
          reject("reject!");
        }
      });
    }) // end queryResult
    .then(order_itemlist => {
      // start updating
      return docRef
        .update({
          itemlist: [...order_itemlist]
        })
        .then(() => {
          console.log(
            `*****>update() ${picktask.sku} is finished, new itemlist:  ${output}`
          );
        });
    })
    .then(result => {
      console.log("--->", result);
    })
    .catch(err => {
      console.log("updateItemStatusOnCreate ", err);
    });

  // promises.push(queryResult);
  // return Promise.all(promises);

  return queryResult;
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
      if (picktask.msg === "note_trigger_not_update_order") {
        // OrderSummary.js: special case, don't need to invoke trigger to update order
        return new Promise((resolve, reject) => {
          if (true) {
            resolve("Do NOT need to update orders!");
          }
        });
      } else {
        return updateItemStatusOnCreate7(picktask);
      }
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

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const projectOnCreate = require("./projectOnCreate.js");

// /**
//  * PROJRECT CREATE
//  */
exports.projectCreated = functions.firestore
  .document("projects/{projectId}")
  .onCreate(projectOnCreate);
// exports.projectCreated = functions.firestore
//   .document("projects/{projectId}")
//   .onCreate(doc => {
//     const project = doc.data();
//     const notification = {
//       content: "Added a new project",
//       user: `${project.authorFirstName} ${project.authorLastName}`,
//       time: admin.firestore.FieldValue.serverTimestamp()
//     };
//     return createNotification(notification);
//   });

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
            pickId: picktask.id, // for delete operation
            msg: "" // remove 'skip trigger' msg if it had one.
          };
          output = `+++ ${picktask.sku} - pickid: ${picktask.id}`;
          break;
        }
      }

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
 *  UPDATE ORDER @ PICKTASK ON_UPDATE
 *
 */
const updateItemStatusOnUpdate = picktask => {
  // need to implement
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
              authorFirstName: "", // reset
              pickId: "", // reset
              pickerId: "" // reset
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
 * PICKTASK CREATED
 */
exports.pickTaskCreated = functions.firestore
  .document("picktasks/{picktask}")
  .onCreate(
    // ref#1: https://stackoverflow.com/a/47078220/5844090
    // Match value of array from db object in Firebase Cloud Functions
    doc => {
      const picktask = { ...doc.data(), id: doc.id };
      if (picktask.msg === "skip_cloud_trigger") {
        console.log("msg: ", picktask.msg, picktask.key);
        return new Promise((resolve, reject) => {
          resolve("Do NOT need to update orders!");
        });
      } else {
        console.log("msg:  empty");
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
    if (picktask.msg === "skip_cloud_trigger") {
      console.log("msg: ", picktask.msg);
      return new Promise((resolve, reject) => {
        if (true) {
          resolve("skip_cloud_trigger");
        }
      });
    } else {
      return updateItemStatusOnDelete2(picktask);
    }
  });

/**
 * PICKTASK updated: completed
 */
exports.pickTaskUpdated = functions.firestore
  .document("picktasks/{picktask}")
  .onUpdate((change, context) => {
    const newValue = change.after.data();
    const picktask = { ...newValue, id: change.after.ref.id };
    // console.log("---:: change.after.ref", change.after.ref);
    // console.log("---:: change.after.ref.id", change.after.ref.id);

    if (picktask.msg === "skip_cloud_trigger") {
      console.log("msg: ", picktask.msg);
      return new Promise((resolve, reject) => {
        if (true) {
          resolve("skip_cloud_trigger");
        }
      });
    } else {
      return updateItemStatusOnCreate7(picktask);
    }
    // need to implement
    // return updateItemStatusOnUpdate(picktask);
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

/**
 * JOB CREATE
 */
exports.jobCreated = functions.firestore
  .document("jobs/{jobId}")
  .onCreate(doc => {
    const job = { ...doc.data(), id: doc.id };
    return asyncActions(job);
  });

/**
 *  AFTER JOB CREATED, Perform a series of actions, depend on jobType
 *  jobType: create/update/deletePickTask, create/update/deletePackTask
 */
const asyncActions = async job => {
  /**
   * 1. creating pick tasks
   */
  if (job.jobType === "createPickTask") {
    const { tasksObj } = await job_createPickTasks(job);
    // don't need to clear msg, need safe msg for future update or delete triggers
    // const result = await job_updateTaskMsg(createdTasksIds);
    // console.log(result);

    /**
     * 2. Update Orders in a batch
     */
    let result = await job_updateOrder_afterTask(tasksObj, job.flag);
    console.log("job_updateOrder_afterTask() done result ===> ", result);
  }
  // do i need to delete job after it's done???
  // delete job after done
  // admin
  //   .firestore()
  //   .collection("jobs")
  //   .doc(job.id)
  //   .delete()
  //   .then(() => {
  //     console.log(`document ${text} deleted !`);
  //   })
  //   .catch(e => {
  //     console.error(e);
  //   });

  return Promise.resolve("asyncActions() finished");
};

/**
 *  UPDATE ORDER AFTER TASK
 *   expecting to use this func to sync w/ 'order' collection
 *   after all tasks functions
 *
 */

const job_updateOrder_afterTask = (tasksObj, flag) => {
  /**
   *  currently func is tailer for 1 senerio: all items are belongs in "same order"
   *  i can provide ways to update diff order in the future
   *  1. update same order
   *  2. update multiple order
   *
   *
   */
  if (flag === "order_view") {
    // update same order
  } else {
    // update diff order in a batch
  }
  /**
   * to handle two senerios, the logic might be too long, maybe split into 2 func?
   * 1. job_updateOneOrder  // for Order View
   * 2. job_updateMultiOrders // for Style View
   */

  // double check all tasks have same order doc ref
  let arr = Object.keys(tasksObj).map(key => tasksObj[key].order_docId);
  let order_docId = arr[0];
  let checkResult = arr.every(v => v === order_docId);

  if (checkResult) {
    var docRef = db.doc(`orders/${order_docId}`);
    var order_itemlist = []; // arr to store retrieved order's itemlist

    docRef
      .get()
      .then(snap => {
        order_itemlist = snap.data().itemlist;
        /**   looping order_itemlist, create new itemlist  */
        for (let i = 0; i < order_itemlist.length; i++) {
          if (!order_itemlist[i].status || order_itemlist[i].status === "") {
            // case 1: all items's status are blank
            let task = tasksObj[order_itemlist[i].key];
            order_itemlist[i] = {
              ...order_itemlist[i],
              status: task.status,
              picker: task.owner,
              picker_init: task.initials,
              pickId: task.id
            };
          } else {
            // case 2: some items are 'picking', 'pick_complete', 'n/a'
          }
        } // end looping order_itemlist
        return Promise.resolve(docRef);
      })
      .then(docRef => {
        /** update order */
        return docRef.update({ itemlist: order_itemlist });
      })
      .then(result => {
        // console.log("order updated via job_updateOrder_afterTask() ", result);
      })
      .catch(e => {
        console.error("job_updateOrder_afterTask() error: ", e);
      });
  } else {
    throw "job_updateOrder_afterTask(): order_docId are not same!!! ";
  }
  return Promise.resolve(" job_updateOrder_afterTask done ");
};

const job_createPickTasks = job => {
  var batch_add = db.batch();
  var createdTasks = []; // for updating orders
  var tasksObj = {}; // use item-key as key, so when updating orders it's faster?
  for (let i of job.list) {
    var newRef = db.collection("picktasks").doc();
    var newPicktask = {
      ...i,
      type: "pick",
      status: job.status,
      owner: job.owner,
      initials: job.initials,
      ownerId: job.ownerId,
      id: newRef.id // new task's ref id
    };
    createdTasks.push(newPicktask);
    tasksObj[i.key] = newPicktask;
    batch_add.set(newRef, newPicktask);
  } // end loop

  return batch_add
    .commit()
    .then(result => {
      return new Promise((resolve, reject) => {
        if (true) {
          resolve({
            resultMsg: "job_createPickTasks() resolved",
            createdTasks: createdTasks,
            tasksObj: tasksObj
          });
        } else {
          reject("reject!");
        }
      });
    })
    .catch(e => {
      console.error("job_createPickTasks(): ", e);
    });
};

/**
 *
 * clear msg field in picktask
 */
const job_updateTaskMsg = taskIds => {
  var batch_update = db.batch();
  for (let t of taskIds) {
    let taskRef = db.collection("picktasks").doc(t);
    batch_update.update(taskRef, { msg: "" });
  }
  return batch_update
    .commit()
    .then(result => {
      return new Promise((resolve, reject) => {
        if (true) {
          resolve("update tasks msg is done");
        } else {
          reject("reject!");
        }
      });
    })
    .catch(e => {
      console.error(e);
    });
};

// const afterjobaction_2 = job => {
//   console.log("start afterjobaction_2()");
//   return new Promise((resolve, reject) => {
//     if (true) {
//       setTimeout(() => {
//         resolve(" afterjobaction_2 takes 20s ");
//       }, 20000);
//     } else {
//       reject(" err msg from afterjobaction_2 ");
//     }
//   });
// };

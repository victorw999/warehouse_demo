const admin = require("firebase-admin");
const tools = require("./tools.js");
const db = admin.firestore();

/**
 * JOB CREATE
 */
module.exports = doc => {
  const job = { ...doc.data(), id: doc.id };
  return asyncActions(job);
};

/**
 *  AFTER JOB CREATED, Perform a series of actions, depend on jobType
 *  jobType: create/update/deletePickTask, create/update/deletePackTask
 */
const asyncActions = async job => {
  /**
   * 1. creating pick tasks
   */
  var tasksObj_toUpdate = {};
  if (job.jobType === "createPickTask") {
    const { tasksObj } = await job_createPickTasks(job);
    // don't need to clear msg, need safe msg for future update or delete triggers
    // const result = await job_updateTaskMsg(createdTasksIds);
    // console.log(result);
    tasksObj_toUpdate = tasksObj;
  } else if (job.jobType === "deletePickTask") {
    const { tasksObj } = await job_deletePickTasks(job);
    tasksObj_toUpdate = tasksObj;
  }

  /**
   * 2. Update Orders in a batch
   */
  let result = await job_updateOrder_afterTask(
    tasksObj_toUpdate,
    job.jobType,
    job.flag
  );
  console.log("  ===> ", result);

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

const job_updateOrder_afterTask = (tasksObj, jobType, flag) => {
  /**
   *  currently func is tailer for 1 senerio: all items are belongs in "same order"
   *  i can provide ways to update diff order in the future
   *  1. update same order
   *  2. update multiple order
   *
   */
  if (flag === "items_from_same_order") {
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
          var status = order_itemlist[i].status;
          // case 1: if status is blank, then add new pick task info
          if (jobType === "createPickTask" && (!status || status === "")) {
            let task = tasksObj[order_itemlist[i].key];
            order_itemlist[i] = {
              ...order_itemlist[i],
              status: task.status,
              picker: task.owner,
              picker_init: task.initials,
              pickId: task.id
            };
          } else if (
            jobType === "deletePickTask" &&
            (status === "picking" ||
              status === "pick_complete" ||
              status === "n/a")
          ) {
            // maybe also need to mk sure status is picking
            let itemkey = order_itemlist[i].key;
            if (Object.keys(tasksObj).indexOf(itemkey) !== -1) {
              order_itemlist[i] = {
                ...order_itemlist[i],
                status: "",
                picker: "",
                picker_init: "",
                pickId: ""
              };
            }
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

/**
 *  job_createPickTasks()
 *
 */
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
 *  job_deletePickTasks()
 *
 */
const job_deletePickTasks = job => {
  var batch_delete = db.batch();
  var tasksObj = {}; //  item-key will be key: order_docId will be value
  job.list.forEach(task => {
    var newRef = db.collection("picktasks").doc(`${task.pickId}`);
    tasksObj[task.key] = { order_docId: task.order_docId };
    batch_delete.delete(newRef);
  }); // end forEach looping

  return batch_delete
    .commit()
    .then(() => {
      return new Promise((resolve, reject) => {
        if (true) {
          resolve({
            resultMsg: "job_deletePickTasks() resolved",
            tasksObj: tasksObj
          });
        } else {
          reject("reject!");
        }
      });
    })
    .catch(e => {
      console.error("job_deletePickTasks(): ", e);
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

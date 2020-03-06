const admin = require("firebase-admin");
const db = admin.firestore();

/**
 *  mixed tasks
 *
 */
module.exports = job => {
  console.log("mixedTasks.js called: job", job);
  var batch_mixed = db.batch();
  var tasksObj = {}; //  item-key will be key: order_docId will be value

  job.list.forEach(task => {
    if (
      job.jobType === "mixedPickTask" &&
      task.item_jobType === "createPickTask"
    ) {
      /**
       * creating
       */
      console.log("mixedPickTask createing....");
      let newRef = db.collection("tasks").doc();

      let newTask = {
        //essentail payload
        order_docId: task.order_docId,
        buyer: task.buyer,
        key: task.key,
        sku: task.sku,
        quantity: task.quantity,
        //
        type: "pick",
        status: "picking",
        owner: job.owner,
        initials: job.initials,
        ownerId: job.ownerId,
        id: newRef.id // new task's ref id
      };

      tasksObj[task.key] = { ...newTask, item_jobType: task.item_jobType };

      batch_mixed.set(newRef, newTask); /** BATCH */
    } else if (
      job.jobType === "mixedPickTask" &&
      task.item_jobType === "updatePickTask"
    ) {
      /**
       * updating
       */
      console.log("mixedPickTask updating ....");
      let taskId = task.pickId;
      let newRef = db.collection("tasks").doc(`${taskId}`);
      let newStatus = task.status;
      tasksObj[task.key] = {
        order_docId: task.order_docId,
        status: newStatus, // for update orders
        item_jobType: task.item_jobType
      };
      batch_mixed.update(newRef, { status: newStatus }); /** BATCH */
    }
  }); // end forEach looping

  console.log("tasksObj b4 return: ", tasksObj);
  return batch_mixed
    .commit()
    .then(() => {
      return Promise.resolve({
        resultMsg: "mixTasks() resolved",
        tasksObj: tasksObj
      });
    })
    .catch(e => {
      console.error("mixTasks(): ", e);
    });
};

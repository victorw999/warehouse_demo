const admin = require("firebase-admin");
const db = admin.firestore();

/**
 *
 * update tasks
 */
module.exports = job => {
  let batch_update = db.batch();
  let tasksObj = {}; // use item-key as key, so when updating orders it's faster

  console.log("updateTask.js ==> job: ", job);

  job.list.forEach(task => {
    let taskId = "";
    if (job.jobType === "updatePickTask") {
      taskId = task.pickId;
    }
    if (job.jobType === "updatePickTask" && job.flag === "staff_view") {
      taskId = task.id; // the list info was from 'task' collection
    }
    if (job.jobType === "updatePackTask" && job.flag === "staff_view") {
      taskId = task.id; // the list info was from 'task' collection
    }

    let newRef = db.collection("tasks").doc(`${taskId}`);
    let newStatus = job.newStatus; // for update orders
    let newKey =
      job.jobType === "updatePickTask"
        ? task.key
        : job.jobType === "updatePackTask"
        ? task.order_docId // pack task only has 1 item in list, don't have item-key
        : "unknown_key";

    tasksObj[newKey] = {
      order_docId: task.order_docId,
      status: newStatus // for update orders
    };
    batch_update.update(newRef, { status: newStatus });
  }); // end loop

  return batch_update
    .commit()
    .then(() => {
      return Promise.resolve({
        resultMsg: "updateTasks() resolved",
        tasksObj: tasksObj
      });
    })
    .catch(e => {
      console.error("updateTasks(): ", e);
    });
};

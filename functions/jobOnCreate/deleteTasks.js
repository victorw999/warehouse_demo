const admin = require("firebase-admin");
const db = admin.firestore();

/**
 *   deleteTasks()
 *
 */
module.exports = job => {
  var batch_delete = db.batch();
  var tasksObj = {}; //  item-key will be key: order_docId will be value

  console.log("deleteTasks.js job received: ", job);
  job.list.forEach(task => {
    var taskId = "";
    if (job.jobType === "deletePickTask") {
      taskId = task.pickId;
    }
    if (job.jobType === "deletePackTask") {
      taskId = task.packId;
    }

    var newRef = db.collection("tasks").doc(`${taskId}`);
    /**
     * prep "update order" payload
     *    - key:
     *       "deletePackTask":  since NO "itemkey" passed frm jobActions.js, so use "order_docId" as key.
     *                          There's really no need to do it. I did this to avoid pass in a obj with 'undefined' key,
     *                          and keep the payload passed to the next function 'clean'
     *       "deletePickTask": use itemkey
     */
    let key = job.jobType === "deletePackTask" ? task.order_docId : task.key;
    tasksObj[key] = { order_docId: task.order_docId };
    batch_delete.delete(newRef);
  }); // end forEach looping

  return batch_delete
    .commit()
    .then(() => {
      return Promise.resolve({
        resultMsg: "job_deleteTasks() resolved",
        tasksObj: tasksObj
      });
    })
    .catch(e => {
      console.error("job_deleteTasks(): ", e);
    });
};

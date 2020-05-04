const admin = require("firebase-admin");
const db = admin.firestore();

/**
 *
 * update tasks
 */
module.exports = job => {
  var fileP = "updateTask.js ==>: "; // current file prompt
  console.log(`${fileP}====================================>`);
  console.log(`${fileP} job:`, job);
  console.log(`${fileP} [${job.jobType}], [${job.newStatus}]`);
  let tasksObj = {}; // use item-key as key, so when updating orders it's faster
  return db
    .runTransaction(t => {
      return Promise.all(
        job.list.map(async task => {
          /**
           * prep task doc ref
           */
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

          let task_docRef = db.collection("tasks").doc(`${taskId}`);
          let newStatus = job.newStatus; // for update orders
          let newKey =
            job.jobType === "updatePickTask"
              ? task.key
              : job.jobType === "updatePackTask"
              ? task.order_docId // pack task only has 1 item in list, don't have item-key
              : "unknown_key";

          /**
           * put all prepared data into taskObj
           */
          tasksObj[newKey] = {
            order_docId: task.order_docId,
            status: newStatus // for update orders
          };
          /**
           * retrieve "task" document
           */
          const doc = await t.get(task_docRef);
          const time = doc.data().time;
          const prev_status = doc.data().status;
          console.log(`${fileP} processing task:`, task);
          console.log(`${fileP} previous status: ${prev_status}`);

          /**
           * set time, update_payload depends on if
           * 1. previous status is "n/a"
           * 2. new status is pick_complete/pack_complete
           */
          var newTime = { ...time };
          var update_payload = { status: newStatus };
          if (newStatus.includes("complete")) {
            if (prev_status === "n/a") {
              newTime = { ...time, na_fixed: getTimeStamp() };
            } else {
              newTime = { ...time, end: getTimeStamp() };
            }
            update_payload = {
              status: newStatus,
              time: { ...newTime } // add end time
            };
          }

          /**
           * update task document
           */
          await t.update(task_docRef, update_payload);
          /**
           *
           */
        }) // end job.list.map()
      ); // end Promise.all()
    }) // end db.runTransaction
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
/**
 * getTimeStamp
 */
const getTimeStamp = () => {
  // let rand = Math.floor(Math.random() * Math.floor(100));
  return new Date(); //firebase Timestamp obj
};

const admin = require("firebase-admin");
const db = admin.firestore();

/**
 *  createTasks()
 *
 */
module.exports = job => {
  var batch_add = db.batch();
  var tasksObj = {}; // use item-key as key, so when updating orders it's faster?
  for (let i of job.list) {
    var newRef = db.collection("tasks").doc();
    let newKey =
      job.jobType === "createPickTask"
        ? i.key
        : job.jobType === "createPackTask"
        ? i.order_docId // since pack task only has 1 item in list, don't have item-key
        : "unknown_key";

    let newType =
      job.jobType === "createPickTask"
        ? "pick"
        : job.jobType === "createPackTask"
        ? "pack"
        : "unknown_type";

    var newTask = {
      ...i,
      type: newType,
      status: job.status,
      owner: job.owner,
      initials: job.initials,
      ownerId: job.ownerId,
      id: newRef.id, // new task's ref id
      // implemenet TIME logic
      time: {
        start: getTimeStamp()
      }
    };
    tasksObj[newKey] = newTask;
    batch_add.set(newRef, newTask);
  } // end loop

  return batch_add
    .commit()
    .then(result => {
      /**
       *
       */
      console.log("createTask===> output tasksObj", tasksObj);
      return Promise.resolve({
        resultMsg: "createTasks() resolved",
        tasksObj: tasksObj
      });
    })
    .catch(e => {
      console.error("createTasks(): ", e);
    });
};

/**
 * getTimeStamp
 */
const getTimeStamp = () => {
  // let rand = Math.floor(Math.random() * Math.floor(100));
  return new Date(); //firebase Timestamp obj
};

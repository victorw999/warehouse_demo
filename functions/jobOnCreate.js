const admin = require("firebase-admin");
const tools = require("./tools.js");
const db = admin.firestore();
const createTasks = require("./jobOnCreate/createTasks");
const updateOneOrder = require("./jobOnCreate/updateOneOrder");
const updateOrderViaTransaction = require("./jobOnCreate/updateOrderViaTransaction");
const deleteTasks = require("./jobOnCreate/deleteTasks");
const updateTasks = require("./jobOnCreate/updateTasks");
const mixedTasks = require("./jobOnCreate/mixedTasks");

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
   *   based on "jobType", selecct actions on "tasks"
   */
  var tasksObj = {};

  switch (job.jobType) {
    case "createPickTask":
    case "createPackTask":
      ({ tasksObj } = await createTasks(job));
      break;
    case "deletePickTask":
    case "deletePackTask":
      ({ tasksObj } = await deleteTasks(job));
      break;
    case "updatePickTask":
    case "updatePackTask":
      ({ tasksObj } = await updateTasks(job));
      break;
    case "mixedPickTask":
      ({ tasksObj } = await mixedTasks(job)); // for StyleListInnerList.js
      break;
    default:
      tasksObj = {};
  }
  console.log("asyncactions(): job : ", job);
  console.log("asyncactions(): tasksObj : ", tasksObj);
  /**
   * 2. Update Orders via Batch or Transactions
   */
  let result = await job_updateOrder_afterTask(tasksObj, job.jobType, job.flag);
  console.log("asyncActions() updateOrder result: ", result.msg);

  return Promise.resolve("asyncActions() finished");
};

/**
 *  UPDATE ORDER AFTER TASK
 *   update 'order' collection, after "tasks" collection is accessed
 */
const job_updateOrder_afterTask = (tasksObj, jobType, flag) => {
  var updateResult;
  if (flag === "order_view") {
    // updateResult = updateOneOrder(orderRefArr[0], tasksObj, jobType);
    updateResult = updateOrderViaTransaction(tasksObj, jobType, flag);
    // if (jobType === "createPackTask" || jobType === "deletePackTask") {
    //   updateResult = updateOrderViaTransaction(tasksObj, jobType, flag);
    // }
  } else if (flag === "style_view" || flag === "staff_view") {
    updateResult = updateOrderViaTransaction(tasksObj, jobType, flag);
  }
  return Promise.resolve({
    result: updateResult,
    msg: "job_updateOrder_afterTask done "
  });
};

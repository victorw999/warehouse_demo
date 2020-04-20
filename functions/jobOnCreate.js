const admin = require("firebase-admin");
const tools = require("./tools.js");
const db = admin.firestore();
const createTasks = require("./jobOnCreate/createTasks");
const updateOrderViaTransaction = require("./jobOnCreate/updateOrderViaTransaction");
const deleteTasks = require("./jobOnCreate/deleteTasks");
const updateTasks = require("./jobOnCreate/updateTasks");
const mixedTasks = require("./jobOnCreate/mixedTasks");
const importJSONOrders = require("./jobOnCreate/importJSONOrders");

/**
 * JOB CREATE
 */
module.exports = (doc) => {
  const job = { ...doc.data(), id: doc.id };
  return asyncActions(job);
};

/**
 *  Once detected "job" created,
 *  depends on "jobType", this'll trigger appropriate action func
 *  jobType: create/update/deletePickTask, create/update/deletePackTask
 */
const asyncActions = async (job) => {
  // the returned obj, based on which we update associated orders
  var tasksObj = {};

  console.log("asyncActions()...begin: jobType: ", job.jobType);
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
    case "importJSONOrders":
      //we don't need return value, it directly updates "orders" collection
      await importJSONOrders(job);
      break;
    default:
      tasksObj = {};
  }
  await console.log("asyncActions(): job : ", job);
  await console.log("asyncActions(): tasksObj : ", tasksObj);
  /**
   * 2. Update Orders via Batch or Transactions
   */
  if (job.jobType !== "importJSONOrders") {
    let result = await updateOrder_afterTask(tasksObj, job.jobType, job.flag);
    await console.log("asyncActions() updateOrder result: ", result.msg);
  }

  return Promise.resolve("asyncActions() finished");
};

/**
 *  UPDATE ORDER AFTER TASK
 *   update 'order' collection, after "tasks" collection is accessed
 */
const updateOrder_afterTask = (tasksObj, jobType, flag) => {
  var updateResult;
  if (flag === "order_view" || flag === "style_view" || flag === "staff_view") {
    updateResult = updateOrderViaTransaction(tasksObj, jobType, flag);
  } else {
    console.error("unknow flag");
  }
  return Promise.resolve({
    result: updateResult,
    msg: "updateOrder_afterTask done ",
  });
};

const admin = require("firebase-admin");
const db = admin.firestore();

/**
 *  mixed tasks
 *
 */
module.exports = (job) => {
  var fileP = "% mixedTask.js **** "; // current file prompt
  console.log(`${fileP}====================================>`);
  console.log(`${fileP} job:`, job);
  console.log(`${fileP} [${job.jobType}], [${job.flag}]`);
  var tasksObj = {}; //  item-key will be key: order_docId will be value

  return db
    .runTransaction((t) => {
      return Promise.all(
        job.list.map(async (task) => {
          if (
            job.jobType === "mixedPickTask" &&
            task.item_jobType === "createPickTask"
          ) {
            /**
             * Get a new write batch
             */
            var batch = db.batch();
            /**
             * creating
             */
            console.log(`${fileP} creating new task`);
            let newRef = db.collection("tasks").doc();

            /**
             * special scenario:
             * Say "style_view" has a sku group contains 3 items, if 1 is picked in "order_view"
             * then 2 would have 'empty' status on "style_view". If we go into innerlist frm
             * "style_view", and set 1 item to "n/a", its "item_jobType" is "createPickTask",
             * but its status is "n/a"
             * I only know this scenrio occur in "style_view", not sure about "order_view"
             */
            let newTaskStatus =
              job.flag === "style_view" ? task.status : "picking";
            //
            let newTask = {
              //essentail payload
              order_docId: task.order_docId,
              buyer: task.buyer,
              key: task.key,
              sku: task.sku,
              quantity: task.quantity,
              //
              type: "pick",
              status: newTaskStatus,
              owner: job.owner,
              initials: job.initials,
              ownerId: job.ownerId,
              id: newRef.id, // new task's ref id
              time: {
                start: getTimeStamp(),
              },
            };

            tasksObj[task.key] = {
              ...newTask,
              item_jobType: task.item_jobType,
            };
            //
            console.log(`${fileP} new task created: `, newTask);

            // Set the value
            batch.set(newRef, newTask);
            // Commit the batch
            return batch.commit();
            /**
             *
             */
          } else if (
            job.jobType === "mixedPickTask" &&
            task.item_jobType === "updatePickTask"
          ) {
            /**
             * updating
             */
            console.log(`${fileP} updating task`);

            let taskId = task.pickId;
            let task_docRef = db.collection("tasks").doc(`${taskId}`);
            let newStatus = task.status;
            /**
             * put all prepared data into taskObj
             */
            tasksObj[task.key] = {
              order_docId: task.order_docId,
              status: newStatus, // for update orders
              item_jobType: task.item_jobType,
            };
            /**
             * retrieve "task" document
             */
            const doc = await t.get(task_docRef);
            const data = doc.data();
            console.log(data ? "" : `${fileP} retrieve task failed: ${data}`);
            //
            const time = data ? data.time : {};
            const prev_status = data.status;
            console.log(`${fileP} processing task:`, task);
            console.log(`${fileP} previous status: ${prev_status}`);

            /**
             * set time, update_payload depends on if
             * 1. previous status is "n/a"
             * 2. new status is pick_complete/pack_complete
             */

            var update_payload = {};

            if (prev_status === "n/a" && newStatus === "picking") {
              update_payload = {
                status: newStatus,
                time: { ...time, start: getTimeStamp() }, // add end time
              };
            } else if (prev_status === newStatus) {
              update_payload = {
                status: newStatus, //  i have to update nothing, but if update nothing cause err
              };
            } else {
              // not sure what condition will occur, thus add this time.update
              update_payload = {
                status: newStatus,
                time: { ...time, update: getTimeStamp() }, // add end time
              };
            }

            /**
             * update task document
             */
            await t.update(task_docRef, update_payload);
            /**
             *
             */
          }
        }) // end job.list.map()
      ); // end Promise.all()
    }) // end db.runTransaction
    .then(() => {
      return Promise.resolve({
        resultMsg: "mixedTasks() resolved",
        tasksObj: tasksObj,
      });
    })
    .catch((e) => {
      console.error("mixedTasks(): ", e);
    });
};
/**
 * getTimeStamp
 */
const getTimeStamp = () => {
  // let rand = Math.floor(Math.random() * Math.floor(100));
  return new Date(); //firebase Timestamp obj
};

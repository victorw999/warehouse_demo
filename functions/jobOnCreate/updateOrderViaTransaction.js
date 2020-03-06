const admin = require("firebase-admin");
const db = admin.firestore();
/**
 *
 * update order using "transaction"
 */

module.exports = (tasksObj, jobType, flag) => {
  console.log("updateOrderViaTransaction() ==> tasksObj: ", tasksObj);
  console.log(
    `updateOrderViaTransaction() ==> jobType: ${jobType}, flag: ${flag}`
  );
  return db
    .runTransaction(transaction => {
      return Promise.all(
        // looping "tasksObj"
        Object.keys(tasksObj).map(async key => {
          var order_docId = tasksObj[key].order_docId;
          var orderRef = db.doc(`orders/${order_docId}`);

          /**
           *  await # 1 : retrieve order
           */
          const get_result = await transaction.get(orderRef).then(doc => {
            if (!doc.exists) {
              throw "no doc";
            }
            var order_itemlist = [...doc.data().itemlist];
            /**
             *    looping itemlist
             */
            for (let i = 0; i < order_itemlist.length; i++) {
              var status = order_itemlist[i].status;
              var key = order_itemlist[i].key;
              var isKeyExist = key in tasksObj; // check if current itemkey is in taskObj{}
              var breakIfSameStyle = false; // if item is found & "style_view", then break the loop

              /**
               *  CREAT PICK TASK (order_view & style_view)
               */
              if (jobType === "createPickTask" && (!status || status === "")) {
                if (isKeyExist) {
                  let task = tasksObj[key];
                  order_itemlist[i] = {
                    ...order_itemlist[i],
                    status: task.status,
                    picker: task.owner,
                    picker_init: task.initials,
                    pickId: task.id
                  };
                  breakIfSameStyle =
                    flag === "style_view"
                      ? true
                      : flag === "order_view"
                      ? false
                      : "";
                }
              } else if (
                /**
                 *  DELETE PICK TASK (order_view & style_view)
                 */
                jobType === "deletePickTask" &&
                (status === "picking" ||
                  status === "pick_complete" ||
                  status === "n/a")
              ) {
                if (isKeyExist) {
                  order_itemlist[i] = {
                    ...order_itemlist[i],
                    status: "",
                    picker: "",
                    picker_init: "",
                    pickId: ""
                  };
                  breakIfSameStyle =
                    flag === "style_view"
                      ? true
                      : flag === "order_view"
                      ? false
                      : "";
                }
              } else if (jobType === "updatePickTask") {
                /**
                 *  UDPATE PICK TASK
                 */
                if (isKeyExist) {
                  order_itemlist[i] = {
                    ...order_itemlist[i],
                    status: tasksObj[key].status
                  };
                  breakIfSameStyle = true;
                }
              } else if (jobType === "mixedPickTask") {
                /**
                 *  MIXED TASK OPERATIONS
                 */
                if (isKeyExist) {
                  let item_jobType = tasksObj[key].item_jobType;
                  if (item_jobType === "createPickTask") {
                    console.log(" item_jobType ===>  createPickTasks  ", key);
                    let task = tasksObj[key];
                    order_itemlist[i] = {
                      ...order_itemlist[i],
                      status: task.status,
                      picker: task.owner,
                      picker_init: task.initials,
                      pickId: task.id
                    };
                  } else if (item_jobType === "updatePickTask") {
                    console.log(" item_jobType ===>  updatePickTasks  ", key);
                    order_itemlist[i] = {
                      ...order_itemlist[i],
                      status: tasksObj[key].status
                    };
                  }
                  breakIfSameStyle = true;
                }
              } else if (
                jobType === "createPackTask" &&
                status === "pick_complete"
              ) {
                /**
                 *  CREAT PACK (order_view)
                 *  loop thru all items and assign them new status
                 *  "pack" tasksObj only have 1 key-value pair, its key is order_docId
                 */
                let task = Object.values(tasksObj)[0];
                order_itemlist[i] = {
                  ...order_itemlist[i],
                  status: task.status,
                  packer: task.owner,
                  packer_init: task.initials,
                  packId: task.id
                };
                console.log(
                  "pack status updated!  jobType='updatePickTask' ",
                  order_itemlist[i].key
                );
              } else if (jobType === "updatePackTask") {
                /**
                 *  UDPATE PACK TASK / COMPLETE PACK  (staff_view)
                 *  loop thru all items and assign them new status
                 *  "pack" tasksObj only have 1 key-value pair, its key is order_docId
                 */
                let task = Object.values(tasksObj)[0];
                order_itemlist[i] = {
                  ...order_itemlist[i],
                  status: task.status
                };
                console.log(
                  "pack status updated!  jobType='updatePackTask' ",
                  order_itemlist[i].key
                );
              } else if (
                /**
                 *  DELETE PACK TASK (order_view/staff_view)
                 */
                jobType === "deletePackTask" &&
                (status === "packing" || status === "pack_complete")
              ) {
                /**
                 *  Reset ALL items:
                 *  when "deletePackTask", the key of "tasksObj" is "order_docId"
                 */
                order_itemlist[i] = {
                  ...order_itemlist[i],
                  status: "pick_complete",
                  packer: "",
                  packer_init: "",
                  packId: ""
                };
                console.log(
                  "updateOrderViaTransaction() pack status reseted: ",
                  order_itemlist[i].key,
                  order_itemlist[i].status
                );
              } else {
                //  NO CONDITION MATCHED!
                console.log(
                  "updateOrderViaTransaction() ==> NO CONDITION MATCHED!",
                  order_itemlist[i]
                );
              }

              if (flag === "style_view" && breakIfSameStyle) {
                break; // if same styles, diff orders, then break the loop
              }
            } // end looping order_itemlist

            return Promise.resolve({
              orderRef: orderRef,
              order_itemlist: order_itemlist
            });
          });
          // end: transaction.get()

          console.log("updateOrderViaTransaction()...updating");
          // await # 2
          return await transaction.update(get_result.orderRef, {
            itemlist: get_result.order_itemlist
          });
        }) // END:  // looping "tasksObj"
      ); // END: Promise.all

      /**
       * if want to chain another, here is the tutorial:
       * ref: https://stackoverflow.com/a/57653880/5844090
       *  /**
       * https://stackoverflow.com/a/48140441/5844090
       * run transactions in a loop
       */
    }) // end: runTransaction()
    .then(() => {
      // console.log("Transaction: updated 'order' for ", picktask_item.sku);
      console.log("updateOrderViaTransaction()...done");
    })
    .catch(function(error) {
      console.log("Transaction failed: ", error);
    });

  /**
   * transaction end
   */
};

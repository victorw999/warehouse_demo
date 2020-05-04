/**
 *
 * "updateList.js"
 * @desc -  "updateList.js" is a auxiliary func in "updateOrderViaTransaction.js"
 *          The main reason for this func is that logic is too long.
 *          let me abbreviate "updateOrderViaTransaction" to "UOVT.js"
 *          "UOVT.js" will retieve the order;
 *          this func will iterate thru its "itemlist" array,
 *          based on flag & jobType, returns a "renewed array"
 *
 */
const do_mixedPickTask = require("./do_mixedPickTask");
const do_createPickTask = require("./do_createPickTask");
const do_deletePickTask = require("./do_deletePickTask");
const do_updatePickTask = require("./do_updatePickTask");
/**
 * @param {array}   list_input: "itemlist" retrived frm current order
 * @param {object}  tasksObj:   obj constains a list of tasks need to be updated in 'orders' collection
 * @param {string}  key:        current key (of taskObj) "UOVT.js" is working on
 * @param {string}  jobType:    "UOVT.js"'s param
 * @param {string}  flag:       "UOVT.js"'s param
 */
module.exports = (list_input, tasksObj, key, jobType, flag) => {
  var list = [...list_input]; // "itemlist" retrived frm current order

  var fileP = "==updateList.js: "; // current file prompt
  //
  console.log(`${fileP} |||||   `);
  console.log(`${fileP} |||||  processing key [${key}]`);
  for (let i = 0; i < list.length; i++) {
    var status = list[i].status;
    var itemkey = list[i].key;
    var breakIfSameStyle = false; // if item is found & "style_view", then break the loop
    var isKeyExist = itemkey in tasksObj; // check if current itemkey is in taskObj{}

    if (!isKeyExist) {
      console.log(`${fileP} CURRENT KEY [${itemkey}] NOT FOUND IN taskObj`);
      // break;
      /**
       *  do NOT break for this particular scenario:
       *  When "deletePickTask" from order_view,
       *  sometimes items are not for deletion, because they belong to other users.
       *  If that's the case, then taskObj{} will have an incomplete list, compare to order's itemlist.
       *  And since "deletePickTask" will only trigger a "single_loop" in "updateOrderViaTransaction.js",
       *  that means, key might not get found in taskObj{}, which leads to 'break' loop.
       *  But, we absolutely need to iterate the entire itemlist of the order in "single_loop".
       *  That's why when key not found, i'll only console out a warning msg.
       */
    }
    var keyPrompt = isKeyExist ? "MATCH" : "NOT MATCH !!!";
    console.log(`${fileP} ------>`);
    console.log(`${fileP} FORLOOP:  KEY:[${key}] ITEMKEY:[${itemkey}]`);
    console.log(`${fileP}  [[[${keyPrompt}]]]`);
    console.log(`${fileP} tasksObj`, tasksObj);
    /**
     * this operation_result will be prompted to console to help coder debug
     * values: SUCCESS, FAIL, ""
     */
    var op_result = "";
    //
    if (jobType === "createPickTask" && (!status || status === "")) {
      /**
       *  CREAT PICK TASK (order_view & style_view)
       */
      if (isKeyExist) {
        list[i] = do_createPickTask(itemkey, tasksObj, list[i]);
        op_result = "SUCCESS";
        breakIfSameStyle = true; // break when it's a match
      } else {
        op_result = "FAIL";
      }
    } else if (
      /**
       *  DELETE PICK TASK (order_view & style_view)
       */
      jobType === "deletePickTask" &&
      (status === "picking" || status === "pick_complete" || status === "n/a")
    ) {
      if (isKeyExist) {
        list[i] = do_deletePickTask(itemkey, tasksObj, list[i]);
        op_result = "SUCCESS";
        breakIfSameStyle = true; // this flag doesn't not affect "order_view"
      } else {
        op_result = "FAIL";
      }
    } else if (jobType === "updatePickTask") {
      if (isKeyExist) {
        list[i] = do_updatePickTask(itemkey, tasksObj, list[i]);
        op_result = "SUCCESS";
        breakIfSameStyle = true; // this flag doesn't not affect "order_view"
      } else {
        op_result = "FAIL";
      }
    } else if (jobType === "mixedPickTask") {
      if (flag === "order_view") {
        /**
         * "order_view"
         */
        list[i] = do_mixedPickTask(itemkey, tasksObj, list[i]);
        op_result = "SUCCESS";
      } else if (flag === "style_view" && isKeyExist) {
        /**
         * "style_view" and key found
         */
        list[i] = do_mixedPickTask(itemkey, tasksObj, list[i]);
        // This flag doesn't not affect "order_view"
        // But. when style_view and current key doesn't match, need to continue the loop
        // to find the correct item
        op_result = "SUCCESS";
        breakIfSameStyle = true;
      } else if (flag === "style_view" && !isKeyExist) {
        /**
         * "style_view" and key NOT found
         */
        console.log(`${fileP} ${jobType} NOT FOUND, continue loop`, list[i]);
      }
      /**
       * In "style_view":
       *    it'll break this loop, becuz there're multi orders,
       *    so once found the item, break this loop and move on to next order
       * In 'order_view':
       *    we don't need to break this for loop. since all items will be updated in one for loop
       *    we don't need to move on to the next tasksObj key
       */
    } else if (jobType === "createPackTask" && status === "pick_complete") {
      /**
       *  CREAT PACK (order_view)
       *  loop thru all items and assign them new status
       *  "pack" tasksObj only have 1 key-value pair, its key is order_docId
       */
      let task = Object.values(tasksObj)[0];
      list[i] = {
        ...list[i],
        status: task.status,
        packer: task.owner,
        packer_init: task.initials,
        packId: task.id,
      };
      op_result = "SUCCESS";
    } else if (jobType === "updatePackTask") {
      /**
       *  UDPATE PACK TASK / COMPLETE PACK  (staff_view)
       *  loop thru all items and assign them new status
       *  "pack" tasksObj only have 1 key-value pair, its key is order_docId
       */
      let task = Object.values(tasksObj)[0];
      list[i] = {
        ...list[i],
        status: task.status,
      };
      op_result = "SUCCESS";
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
      list[i] = {
        ...list[i],
        status: "pick_complete",
        packer: "",
        packer_init: "",
        packId: "",
      };
      op_result = "SUCCESS";
    } else {
      op_result = "NO_MATCH";
    }

    /**
     * prompt operation results:
     */
    switch (op_result) {
      case "SUCCESS":
        console.log(`${fileP} ${jobType} DONE`, list[i]);
        break;
      case "FAIL":
        console.log(`${fileP} ${jobType} key NOT found, won't update!`);
        break;
      case "NO_MATCH":
        console.log(`${fileP} ${jobType} NOTHING MATCHED!`);
        break;
      default:
    }

    if (flag === "style_view" && breakIfSameStyle) {
      break; // if same styles, diff orders, then break the loop
    }
  } // end looping list

  return [...list];
};

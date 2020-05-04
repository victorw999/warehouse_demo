/* eslint-disable no-loop-func */
const admin = require("firebase-admin");
const db = admin.firestore();
const updateList = require("./updateOrder/updateList");

/**
 *
 * update order using "transaction"
 */

module.exports = (tasksObj, jobType, flag) => {
  var fileP = "*UOVT.js: "; // current file prompt
  //
  console.log(`${fileP} tasksObj: `, tasksObj);
  console.log(`${fileP} jobType: ${jobType}, flag: ${flag}`);
  return db
    .runTransaction(transaction => {
      /**
       * multi_loop:    for tasks belongs to multiple order documents
       * single_loop:   for tasks belongs to same order doc
       * these 2 var are array, which hold the "results (promises)" returned by transaction update,
       * then these 2 var will be proccessed by Promise.all()
       */
      var multi_loop, single_loop;

      /**
       * Depending on flags/jobType, it'll choose single_loop or multi_loop
       */
      if (
        (flag === "order_view" && jobType === "mixedPickTask") ||
        (flag === "order_view" && jobType === "createPickTask") ||
        (flag === "order_view" && jobType === "deletePickTask")
      ) {
        /**
         * SINGLE_LOOP
         */
        console.log(`${fileP} ===> SINGLE_LOOP`);
        var keys = Object.keys(tasksObj);
        var singleKey = [keys[0]];
        single_loop = singleKey.map(async key => {
          let orderRef = db.doc(`orders/${tasksObj[key].order_docId}`);
          // await # 1 : @return an updated itemlist
          var get_result = await getOrder(
            transaction,
            orderRef,
            tasksObj,
            key,
            jobType,
            flag
          );

          // await # 2 :  update order
          return await transaction.update(orderRef, {
            itemlist: get_result
          });
        }); // END: looping "tasksObj" via map()

        return Promise.all(single_loop);
      } else {
        /**
         * MULTI_LOOP
         */
        console.log(`${fileP} ===> MULTI_LOOP`);
        multi_loop = Object.keys(tasksObj).map(async key => {
          let orderRef = db.doc(`orders/${tasksObj[key].order_docId}`);
          await console.log(
            `${fileP} ===> process order_docId:${tasksObj[key].order_docId}`
          );
          // await # 1 : @return an updated itemlist
          var get_result = await getOrder(
            transaction,
            orderRef,
            tasksObj,
            key,
            jobType,
            flag
          );

          // await # 2 :  update order
          return await transaction.update(orderRef, {
            itemlist: get_result
          });
        }); // END: looping "tasksObj" via map()

        return Promise.all(multi_loop);
      } // END: if

      /**
       *
       * if want to chain another, here is the tutorial:
       * ref: https://stackoverflow.com/a/57653880/5844090
       *  /**
       * https://stackoverflow.com/a/48140441/5844090
       * run transactions in a loop
       */
    }) // end: runTransaction()
    .then(() => {
      console.log(`${fileP} Transaction Done`);
    })
    .catch(error => {
      console.log(`${fileP} Transaction Failed: `, error);
    });
  /**
   * transaction end
   */
};

/**
 *
 * retrieve order
 * @return a newly updated itemlist
 */

const getOrder = (transaction, orderRef, tasksObj, key, jobType, flag) => {
  var fileP = "*UOVT.js: 'getOrder()'"; // current file prompt

  return transaction
    .get(orderRef)
    .then(doc => {
      if (!doc.exists) {
        throw new Error("no doc");
      }

      // retrieve itemlist frm current order
      var order_itemlist = [...doc.data().itemlist];

      //
      console.log(`${fileP} ---------------------------------------- `);
      console.log(`${fileP} - orig itemlist:`, order_itemlist);
      //

      // based on flag & jobType, returns a "renewed array"
      order_itemlist = updateList(order_itemlist, tasksObj, key, jobType, flag);

      //
      console.log(`${fileP} - updated itemlist:`, order_itemlist);
      //

      return new Promise((resolve, reject) => {
        if (true) {
          resolve([...order_itemlist]);
        }
        reject("nothing");
      });
    })
    .catch(e => {
      console.log(`${fileP} error when getting order ref`, e);
    });
  // end: transaction.get()
};

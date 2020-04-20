/**
 * @desc -  assorOrders.js classify all items in all orders into diff style group
 *
 *          newSkus[] obj shap
 *          { sku, styleno, skuQty, skuStatus, itemlist[] }
 *
 *          styleGroup[] obj shape:
 *          { styleno, totalQty, members[{newSkus's obj}] }
 *
 * @param - orders
 * @returns -
 *          styleGroupNew -  styles & items that are done
 *          styleGroupDone - completed pick tasks
 *
 */
import assortItemToArr from "./assortItemToArr";
import assortArrToStyleGroup from "./assortArrToStyleGroup";

const assortOrders = data => {
  /**
   *  "newSkus" group items in all order by "sku"
   *  each obj in "newSkus" has this shape:
   *  { sku, styleno, skuQty, skuStatus, itemlist[] }
   */
  let newSkus = [],
    doneSkus = [];
  // looping all orders
  for (var order of data) {
    if (order.itemlist) {
      // lopping each order's itemlist
      for (let item of order.itemlist) {
        /**
         * if item.status === packing, pack_complete, or pick_complete
         * then: assort item to "doneSkus"
         * else: assort item to "newSkus"
         */
        if (
          item.status === "packing" ||
          item.status === "pack_complete" ||
          item.status === "pick_complete"
        ) {
          doneSkus = [...assortItemToArr(item, doneSkus, order)];
        } else {
          newSkus = [...assortItemToArr(item, newSkus, order)];
        }
      } // end looping itemlist
    } //end if
  } // end for looping orders

  // console.log("newSkus -> ", newSkus);
  // console.log("doneSkus -> ", doneSkus);
  var newStyleGroup = assortArrToStyleGroup(newSkus);
  var doneStyleGroup = assortArrToStyleGroup(doneSkus);

  // console.log("newStyleGroup -> ", newStyleGroup);
  // console.log("doneStyleGroup -> ", doneStyleGroup);
  return { new: newStyleGroup, done: doneStyleGroup };
}; // END assortOrders func

export default assortOrders;

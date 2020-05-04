/**
 * @desc - update "orderStatus", reresents this order's overall status
 * @param {Object}- complete order obj
 *   "orderStatus" outcomes:
 * @returns : a single string: picking, pick_complete, packing, pack_complete, mixed, n/a
 */
const getOrderStatus = (order) => {
  if (!order) {
    console.log("getOrderStatus() order undefined");
    return "";
  }
  if (!order.itemlist) {
    console.log("getOrderStatus() order.itemlist undefined");
    return "";
  }
  var uniq = []; // arr contains unique status
  var all = []; // arr contains all statuses

  // handle undefined "status" when it is manually deleted
  let itemlist = order.itemlist.map((i) => {
    return i.status
      ? i
      : {
          ...i,
          status: "",
        };
  });

  if (itemlist.length > 0) {
    uniq = [itemlist[0].status]; // push 1st status into "uniq" array

    // generates a array contains unique 'status' & a array contasin all
    itemlist.forEach((i) => {
      if (!uniq.some((s) => s === i.status)) {
        uniq.push(i.status);
      }
      all.push(i.status);
    });

    // remove empty status frm array
    uniq = uniq.filter((x) => x !== "");

    /**
     *  "uniq" has more than 1 element
     */
    if (uniq.length > 1) {
      // if all items are either picking/pick_complete
      if (uniq.every((i) => i === "picking" || i === "pick_complete")) {
        return "all_in_pick_stage";
      }
      // if all items are either packing/pack_complete
      if (uniq.every((i) => i === "packing" || i === "pack_complete")) {
        return "all_in_pack_stage";
      }
      return "mixed";
    } else if (uniq.length === 1) {
      /**
       *  "uniq" has only 1 element
       *
       *  "pick_complete_and_empty":
       *    rare case but happens: in order_view, set n/a, then delete pick, but leave some
       *    item as n/a, some no status, then completes the n/a from staff. Then you'll have
       *    one item as pick_complete, and others no status.         *
       */

      // if "uniq" has only 1 element, then "all" element could only be "" or uniq[0]
      if (all.some((i) => i === "")) {
        return `${uniq[0]}_and_empty`;
      }
      return uniq[0];
    }
  } else {
    return ""; // order.itemlist is not ready
  }
};

export default getOrderStatus;

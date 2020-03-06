/**
 * @desc -    assort/put "item" to "doneSkus" or 'newSkus' arrays
 *            seperate logic out frm assortOrder.js into this function to look nicer
 * @param -   item:   the item to be assorted
 *            arr:    doneSkus/newSkus array
 *            order:  provide additional info to be put in item
 * @returns - new array which populated with the new item
 */

const assortItemToArr = (item, input_arr, order) => {
  var arr = [...input_arr];
  let sameSkuFound = false;
  // looping arr's
  for (let i = 0; i < arr.length; i++) {
    if (item.sku === arr[i].sku) {
      sameSkuFound = true;
      arr[i] = {
        ...arr[i],
        itemlist: [
          ...arr[i].itemlist,
          {
            ...item,
            oid: order.amzId, // must add this field here
            buyer: order.buyer, // must add this field here
            order_docId: order.id // must add this field here
          }
        ],
        sku: item.sku,
        skuQty: addQty(arr[i].skuQty, item.quantity),
        skuStatus: getStatuses(arr[i].itemlist, item.status),
        pickers: getPickers(arr[i].itemlist, item.picker)
      };
      break;
    } // end if
  } //end looping newSkus

  // add new item in array
  if (!sameSkuFound) {
    arr.push({
      sku: item ? item.sku : "",
      styleno: item.sku ? item.sku.split("-")[0] : "", // parse the style_number b4 hyphen
      itemlist: item && [
        {
          // create new item obj
          sku: item ? item.sku : "",
          quantity: item.quantity,
          key: item.key,
          oid: order.amzId,
          buyer: order.buyer,
          order_docId: order.id,
          status: item.status ? item.status : "",
          pickId: item.pickId ? item.pickId : "",
          picker: item.picker ? item.picker : ""
        }
      ],
      skuQty: parseInt(item.quantity, 10),
      skuStatus: item.status ? item.status : "",
      pickers: item.picker ? [item.picker] : []
    });
  } // END: if // add new item in array

  return arr;
};

/**
 * @desc -  check if "status" is same as the status of the item in "itemlist"
 *          if different statuses exist in itemlist, then return "mixed"
 * @param {*} itemlist
 * @param {*} status
 */
const getStatuses = (itemlist, status) => {
  if (!status) {
    return "";
  } else if (itemlist.some(i => i.status !== status)) {
    // diff status exists
    return "mixed";
  } else {
    return status;
  }
};

/**
 * @desc - go thru itemlist
 *         return all the unique pickers exist in the itemlist in an array
 */
const getPickers = (itemlist, picker) => {
  if (!picker) {
    return [];
  }
  var pickers = [picker];

  itemlist.forEach(i => {
    if (!pickers.some(p => p === i.picker)) {
      pickers.push(i.picker);
    }
  });
  return [...pickers];
};

/**
 * add
 */
const addQty = (arr_val, item_val) => {
  return parseInt(arr_val, 10) + parseInt(item_val, 10);
};
export default assortItemToArr;

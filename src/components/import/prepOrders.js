/**
 * @description - massage JSON order into the shape of "orders" collection
 * @param {array} orders
 */

const prepOrders = (input) => {
  // arr1: get the fields that "orders" collection needs
  var arr = [];
  var orders = [...input];
  var first = orders.shift(); // remove the 1st element
  // init arr1
  arr.push({
    amzId: first["order-id"],
    buyer: first["buyer-name"],
    orderDate: new Date(first["purchase-date"]),
    shipAddr: first["ship-address-1"],
    shipCity: first["ship-city"],
    shipState: first["ship-state"],
    shipZip: first["ship-postal-code"],
    shipOption: first["ship-service-level"],
    itemlist: [
      {
        sku: first["sku"],
        quantity: first["quantity-purchased"],
        key: first["order-item-id"],
      },
    ],
  });

  orders.forEach((o) => {
    var exist = false;
    // check if amzId exist in arr[]
    for (var i = 0; i < arr.length; i++) {
      /**
       * amzId doesn't exist
       */
      if (arr[i].amzId !== o["order-id"]) {
        // console.log("FOR " + i + " NOT match");
      } else if (arr[i].amzId === o["order-id"]) {
        /**
         * amzId exist
         */
        arr[i].itemlist.push({
          sku: o["sku"],
          quantity: o["quantity-purchased"],
          key: o["order-item-id"],
        });
        exist = true;
        break;
      } else {
        console.log("EDGE CASE");
      }
    } // END: inner for loop

    // if not exist in arr[] after the for-loop check
    if (!exist) {
      arr.push({
        amzId: o["order-id"],
        buyer: o["buyer-name"],
        orderDate: new Date(o["purchase-date"]),
        shipAddr: o["ship-address-1"],
        shipCity: o["ship-city"],
        shipState: o["ship-state"],
        shipZip: o["ship-postal-code"],
        shipOption: o["ship-service-level"],
        itemlist: [
          {
            sku: o["sku"],
            quantity: o["quantity-purchased"],
            key: o["order-item-id"],
          },
        ],
      });
    }
  }); // END: orders.forEach
  return arr;
};

export default prepOrders;

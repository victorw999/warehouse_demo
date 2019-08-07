const initState = {
  orders: [
    {
      id: "1",
      amzId: "114-9855599-7806616",
      orderDate: "8/2/2019 1:40PM PDT",
      buyer: "Donaul Scarmuzzi",
      shipAddr: "104 Willow Brook Dr NE",
      shipCity: "Warren",
      shipState: "OH",
      shipZip: "44483",
      shipOption: "Standard",
      itemlist: [
        { key: "random-1", sku: "1342-ADQ-BLUE-XXL", quantity: 10 },
        { key: "random-2", sku: "168-ADQ-RED-S", quantity: 1 },
        { key: "random-3", sku: "9611-CBS-CHAR-L", quantity: 1 }
      ]
    },
    {
      id: "2",
      amzId: "114-1234567-1234567",
      orderDate: "8/1/2019 12:40AM PDT",
      buyer: "Jack Gilbert",
      shipAddr: "17528 E Rowland St.",
      shipCity: "City of Industry",
      shipState: "CA",
      shipZip: "91748",
      shipOption: "Free Economy Shipping",
      itemlist: [{ key: "random-4", sku: "1382-OBS-BURG-XL", quantity: 2 }]
    }
  ]
};

const orderReducer = (state = initState, action) => {
  switch (action.type) {
    case "CREATE_ORDER":
      console.log("create order", action.order);
      return state;
    case "CREATE_ORDER_ERROR":
      console.log("create order error", action.err);
      return state;
    default:
      return state;
  }
};

export default orderReducer;

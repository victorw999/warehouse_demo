const initState = {
  orders: [
    {
      id: "1",
      amzId: "114-9855599-7806616",
      orderDate: "8/2/2019 1:40PM PDT",
      buyer: "Donaul Scarmuzzi",
      addr: "104 Willow Brook Dr NE Warren, Ohio 44483",
      shipOption: "Standard",
      itemlist: [
        { sku: "1342-ADQ-XXL", quantity: 10 },
        { sku: "168", quantity: 1 },
        { sku: "9611", quantity: 1 }
      ]
    },
    {
      id: "2",
      amzId: "114-1234567-1234567",
      orderDate: "8/1/2019 12:40AM PDT",
      buyer: "Jack Gilbert",
      addr: "17528 E Rowland St. City of Industry, CA 91748",
      shipOption: "Free Economy Shipping",
      itemlist: [{ sku: "1373", quantity: 2 }]
    }
  ]
};

const orderReducer = (state = initState, action) => {
  switch (action.type) {
    case "CREATE_PROJECT":
      console.log("create project", action.project);
      return state;
    case "CREATE_PROJECT_ERROR":
      console.log("create project error", action.err);
      return state;
    default:
      return state;
  }
};

export default orderReducer;

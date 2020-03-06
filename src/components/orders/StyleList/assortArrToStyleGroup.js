const assortArrToStyleGroup = arr => {
  // add the 1st item into the group
  let styleGroup = [
    {
      styleno: arr[0] ? arr[0].styleno : "",
      totalQty: arr[0] && parseInt(arr[0].itemlist[0].quantity, 10),
      members: [arr[0]]
    }
  ];

  let groupFound = false;

  for (let i = 1; i < arr.length; i++) {
    for (let group of styleGroup) {
      if (group.styleno === arr[i].styleno) {
        group.totalQty += arr[i].skuQty;
        group.members.push({
          ...arr[i]
        });
        groupFound = true;
        break;
      }
    }
    if (!groupFound) {
      styleGroup.push({
        styleno: arr[i].styleno,
        totalQty: arr[i].skuQty,
        members: [arr[i]]
      });
    }
    groupFound = false;
  }
  styleGroup.sort((a, b) => (a.styleno > b.styleno ? 1 : -1));
  // console.log(" StyleGroup => ", styleGroup);
  return styleGroup;
};

export default assortArrToStyleGroup;

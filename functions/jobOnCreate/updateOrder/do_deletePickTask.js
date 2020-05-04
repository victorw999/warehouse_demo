/**
 * do_deletePickTask() *
 *
 * @param  "itemkey"     current item's key
 * @param  "tasksObj"    tasks need to be updated in 'orders' collection
 * @param  "item_input"  current item retrieved frm itemlist
 */

module.exports = (itemkey, tasksObj, item_input) => {
  var item = { ...item_input };

  item = {
    ...item,
    status: "",
    picker: "",
    picker_init: "",
    pickId: ""
  };

  return { ...item };
};

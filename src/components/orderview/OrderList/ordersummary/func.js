import React from "react";
/**
 *
 * @desc - depends on item's status, display icons
 */
export const getStatusIcon = (status) => {
  if (status === "picking") {
    return <i className="fas fa-walking picking"></i>;
  } else if (status === "pick_complete") {
    return (
      <div>
        <i className="fas fa-walking pick_complete"></i>
        <i className="far fa-check-circle pick_complete"></i>
      </div>
    );
  } else if (status === "packing") {
    return <i className="fas fa-box-open packing"></i>;
  } else if (status === "pack_complete") {
    return (
      <div>
        <i className="fas fa-box-open pack_complete"></i>
        <i className="far fa-check-circle pack_complete"></i>
      </div>
    );
  } else if (status === "n/a") {
    return <i className="material-icons orange-text">warning</i>;
  } else {
    return (
      <div>
        {/* <i className="material-icons green white-text">directions_run</i>
          <i className="material-icons orange-text">warning</i>
          <i className="fas fa-box-open pick_complete"></i>
          <i className="far fa-check-circle pick_complete"></i> */}
      </div>
    );
  }
};

/**
 *
 * this func is used to decide wheather to display picker by the side of item
 * packer will not be displayed on the side,
 * there should be only 1 packer for each list,
 * therefore, it'll be displayed on top of the list
 */
export const shouldShowPicker = (itemlist) => {
  /**
   * 1. item is either in "pick" status or "pack" status, or "no status"
   * 2. there could also be a senario: in a list, some item is "pick" status, some is "pack" status
   * 3. no matter what stage this list is current on (pick or pack)
   *    if there're multiple pickers, we need to display them
   */
  if (itemlist) {
    let picker_arr = itemlist.map((i) => i.picker);
    if (picker_arr.length < 2) {
      return false;
    } else {
      let result = picker_arr.every((p) => p === picker_arr[0]);
      return !result;
    }
  } else {
    return false;
  }
};

/**
 *  decide what to display on top of list, for picker(s)
 */
export const getItemListPickers = (itemlist) => {
  if (itemlist) {
    if (shouldShowPicker(itemlist)) {
      return "shared";
    } else {
      let picker = itemlist[0].picker ? itemlist[0].picker : "";
      return picker;
    }
  } else {
    return "";
  }
};

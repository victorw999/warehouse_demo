import React, { Component } from "react";
import AddItemForm from "./AddItemForm";
import Item from "./Item";

class ItemList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemlist: this.props.itemlist ? this.props.itemlist : [],

      qtyMin: 1, // set input floor
      qtyMax: 100 // set input ceiling
    };
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.handleChangeInIntegerInput = this.handleChangeInIntegerInput.bind(
      this
    );
  }

  // adding item from AddItemForm.js
  addItem = newItem => {
    let skuEntered = newItem[0].trim(); // receiving data from AddItemForm.js
    let qtyEntered = parseInt(newItem[1]);
    let currentArray = this.state.itemlist;
    let skuExistsFlag = false;

    // check if SKU already been entered,  if sku already exists in array, accrue qty
    currentArray.forEach(item => {
      if (item.sku === skuEntered) {
        let sum = qtyEntered + item.quantity;
        item.quantity = sum < this.state.qtyMax ? sum : this.state.qtyMax; // new qty not exceeding qtyMax (preset qty ceiling)
        skuExistsFlag = true;
        item.msg =
          sum < this.state.qtyMax
            ? ""
            : ` ${this.state.qtyMin} ~ ${this.state.qtyMax} `;
      }
    });

    // find index of obj in array
    // let matchingIndex = currentArray.findIndex(item => item.sku === skuEntered);

    if (skuExistsFlag === true) {
      this.setState({ itemlist: [...this.state.itemlist] });
    } else {
      let timestamp = new Date().getTime(); //generate an unique key
      let newObj = {
        key: "item-" + timestamp,
        sku: skuEntered,
        quantity:
          qtyEntered < this.state.qtyMax ? qtyEntered : this.state.qtyMax,
        msg:
          qtyEntered < this.state.qtyMax
            ? ""
            : `Quantity can't be larger than ${this.state.qtyMax} `
      };
      this.setState({ itemlist: [...this.state.itemlist, newObj] });
    }

    this.props.updateItemListInOrder(this.state.itemlist); // update parent's state
  };

  removeItem = index => {
    let newlist = this.state.itemlist.splice(index, 1);
    this.setState(newlist);
  };

  /**
   * ref: https://codesandbox.io/s/00xq32n3pn?from-embed
   * using higher order func to pass up
   * 1. event obj which this func is listening to
   * 2. additional data that wrapped around the event func
   *
   * Curruntly this func is not being used
   * since 'handleChangeInIntegerInput' can do the job
   *  */
  handleQtyChange = idx => evt => {
    const newItemlist = this.state.itemlist.map((item, index) => {
      if (idx !== index) return item;
      return { ...item, quantity: evt.target.value };
    });
    this.setState({ itemlist: newItemlist });
  };

  /**
   * pass newValue & currentIndex up here,
   * from Item.js, from Integerinput.js, via param instead of e.target.value
   */
  handleChangeInIntegerInput = (newValue, currentIndex) => {
    const newItemlist = this.state.itemlist.map((item, index) => {
      if (currentIndex !== index) return item;
      else {
        let modifiedItem = { ...item, quantity: newValue };
        if (modifiedItem.quantity < this.state.qtyMax) {
          modifiedItem.msg = "";
        }
        return modifiedItem;
      }
    });
    this.setState({ itemlist: newItemlist });
  };

  componentDidUpdate(prevProps, prevState) {
    //Typical usage, don't forget to compare the props
    if (this.state.itemlist !== prevState.itemlist) {
      // if local component state changes,
      // then update parent's state as well.
      // mk sure it sync with CreateOrder.js
      this.props.updateItemListInOrder(this.state.itemlist);
    }
  }

  render() {
    return (
      <div className="container">
        <AddItemForm
          addItem={this.addItem}
          qtyMin={this.state.qtyMin}
          qtyMax={this.state.qtyMax}
        />
        <ul className="collection with-header">
          {this.state.itemlist.map((item, index) => {
            return (
              <Item
                key={index}
                item={item}
                index={index}
                removeItem={this.removeItem}
                handleChangeInIntegerInput={this.handleChangeInIntegerInput}
                min={this.state.qtyMin}
                max={this.state.qtyMax}
              />
            );
          })}
        </ul>
      </div>
    );
  }
}

export default ItemList;

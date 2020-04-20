import React, { Component } from "react";
import AddItemForm from "./AddItemForm";
import Item from "./Item";

class ItemList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      qtyMin: 1, // set input floor
      qtyMax: 100, // set input ceiling
    };
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.handleChangeInIntegerInput = this.handleChangeInIntegerInput.bind(
      this
    );
  }

  // adding item from AddItemForm.js
  addItem = (newItem) => {
    let skuEntered = newItem.sku;
    let qtyEntered = parseInt(newItem.qty, 10);
    let skuExists = false;

    // check if SKU already been entered,  if sku already exists in array, accrue qty
    var newList = this.props.itemlist.map((item) => {
      var newQty,
        newMsg = "";
      if (item.sku === skuEntered) {
        let sum = qtyEntered + item.quantity;
        newQty = sum < this.state.qtyMax ? sum : this.state.qtyMax; // (preset qty ceiling)
        skuExists = true;
        newMsg =
          sum < this.state.qtyMax
            ? ""
            : ` ${this.state.qtyMin} ~ ${this.state.qtyMax} `;

        return { ...item, quantity: newQty, msg: newMsg };
      } else {
        return item;
      }
    });

    if (skuExists === true) {
      this.props.updateList(newList);
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
            : `Quantity can't be larger than ${this.state.qtyMax} `,
      };
      this.props.updateList([...this.props.itemlist, newObj]);
    }
  };

  removeItem = (index) => {
    let items = this.props.itemlist;
    const newList = items
      .slice(0, index)
      .concat(items.slice(index + 1, items.length));
    this.props.updateList(newList);
  };

  /**
   * pass newValue & currentIndex up here,
   * from Item.js, from Integerinput.js, via param instead of e.target.value
   */
  handleChangeInIntegerInput = (newValue, currentIndex) => {
    const newList = this.props.itemlist.map((item, index) => {
      if (currentIndex !== index) return item;
      else {
        let modifiedItem = {
          ...item,
          quantity: newValue.value,
          msg: newValue.msg,
        };
        // if (modifiedItem.quantity < this.state.qtyMax) {
        //   modifiedItem.msg = "";
        // }
        return modifiedItem;
      }
    });
    this.props.updateList(newList);
  };

  render() {
    return (
      <div className="container">
        <AddItemForm
          addItem={this.addItem}
          qtyMin={this.state.qtyMin}
          qtyMax={this.state.qtyMax}
        />
        <ul className="collection with-header">
          {this.props.itemlist.map((item, index) => {
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

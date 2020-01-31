var App = React.createClass({
  getInitialState: function() {
    return {
      fruits: [
        {
          id: "fruit-1",
          content: "orange",
          qty: 2
        },
        {
          id: "fruit-2",
          content: "apple",
          qty: 3
        }
      ]
    };
  },
  addFruit: function(fruit) {
    //create a unike key for each new fruit item
    var timestamp = new Date().getTime();
    // update the state object
    // this.state.fruits["fruit-" + timestamp] = fruit;

    var newObj = {
      id: "fruit-" + timestamp,
      content: fruit[0],
      qty: fruit[1]
    };

    // set the state
    // this.setState({ fruits: this.state.fruits });

    this.setState({ fruits: [...this.state.fruits, newObj] });
    console.log(this.state.fruits);
  },
  render: function() {
    return (
      <div className="component-wrapper">
        <FruitList fruits={this.state.fruits} />
        <AddFruitForm addFruit={this.addFruit} />
      </div>
    );
  }
});

var FruitList = React.createClass({
  render: function() {
    return (
      <div className="container">
        <ul className="list-group text-center">
          {this.props.fruits.map(
            function(obj) {
              return (
                <li className="list-group-item list-group-item-info">
                  {obj.content + "  |  QTY:" + obj.qty}
                </li>
              );
            }.bind(this)
          )}
        </ul>
      </div>
    );
  }
});

var AddFruitForm = React.createClass({
  createFruit: function(e) {
    e.preventDefault();
    //get the fruit object name from the form
    var fruit = this.refs.fruitName.value;
    var fruit_qty = this.refs.quantity_input.value;
    //if we have a value
    //call the addFruit method of the App component
    //to change the state of the fruit list by adding an new item
    if (typeof fruit === "string" && fruit.length > 0) {
      // this.props.addFruit(fruit);
      this.props.addFruit([fruit, fruit_qty]); // pass in array as arg
      //reset the form
      this.refs.fruitForm.reset();
    }
  },
  render: function() {
    return (
      <form className="form-inline" ref="fruitForm" onSubmit={this.createFruit}>
        <div className="form-group">
          <label for="fruitItem">
            Fruit Name
            <input
              type="text"
              id="fruitItem"
              placeholder="name"
              ref="fruitName"
              className="form-control"
            />
          </label>
          <label for="quantity">
            Qty:
            <input
              type="number"
              min="1" /* input restriction: require > 1 */
              id="quantity"
              placeholder="qty"
              ref="quantity_input"
              className="form-control"
            />
          </label>
        </div>
        <button type="submit" className="btn btn-primary">
          Add
        </button>
      </form>
    );
  }
});

React.render(<App />, document.getElementById("app"));

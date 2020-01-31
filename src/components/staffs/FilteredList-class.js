import React from "react";
import List from "./List";

class FilteredList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: {},
      loaded: false
    };
    this.filterList = this.filterList.bind(this);
  }

  componentWillMount = () => {
    this.setState({
      users: this.props.users
    });
  };

  /**
   * // ref: https://itnext.io/how-to-updating-state-on-prop-changes-2296a03ef08c
   * i have to use this awkward way to init the state var users{},
   * this func is executed in every render
   *
   */

  static getDerivedStateFromProps(nextProps, prevState) {
    const users_prev = prevState.users;
    const users_next = nextProps.users;
    const size = Object.keys(users_next).length;
    if (users_prev !== users_next && size > 0 && !prevState.loaded) {
      return {
        users: nextProps.users,
        loaded: true
      };
    } else {
      return {
        ...prevState
      };
    }
  }
  /**componentDidUpdate ()
   *  i couldn't load the state with this approach
   */
  // componentDidUpdate(prevProps, prevState) {
  //   const prev = this.props.users;
  //   const next = prevProps.users;
  //   const size = Object.keys(prev).length;
  //   if (next !== prev) {
  //     console.log("props change detected! !!!!!!!!!!!!!!!!!!!! ");
  //     if (this.state.users !== prev) {
  //       if (size > 0) {
  //         console.log(
  //           "users change detected!********************** ",
  //           Object.keys(next).length
  //         );
  //         if (!this.state.loaded) {
  //           console.log("loaded");
  //           this.setState({ users: next, loaded: true });
  //         }
  //       } // check size
  //     } // this state and this prop don't match
  //   } // check prev next diff
  // }

  filterList = event => {
    const users = this.props.users;
    //https://stackoverflow.com/a/38750895/5844090
    try {
      const filtered = Object.keys(users)
        .filter(key => {
          // get the keys that match input
          let name = users[key][0].authorFirstName;
          return (
            name.toLowerCase().search(event.target.value.toLowerCase()) !== -1
          );
        })
        .reduce((obj, key) => {
          return {
            ...obj,
            [key]: users[key]
          };
        }, {});
      this.setState({ users: filtered });
    } catch (e) {
      console.log("error: ", e);
    }
  };

  render() {
    return (
      <div className="filter-list">
        <input type="text" placeholder="Search" onChange={this.filterList} />
        <List users={this.state.users} />
      </div>
    );
  }
}

export default FilteredList;

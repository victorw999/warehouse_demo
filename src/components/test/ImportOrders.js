/**
 * tempalate ref: https://howtocreateapps.com/json-html-react-tutorial/
 */
import React, { Component } from "react";

class ImportOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      posts: []
    };
  }

  componentDidMount() {
    // ref: to fix CORS issue
    // https://www.youtube.com/watch?v=hxyp_LkKDdk

    var url = "http://icantoo.com/000_data/json/amz.json";

    fetch("https://cors-anywhere.herokuapp.com/" + url)
      .then(response => response.json())
      .then(
        // handle the result
        result => {
          this.setState({
            isLoaded: true,
            posts: result
          });
        },

        // Handle error
        error => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }

  render() {
    const { error, isLoaded, posts } = this.state;

    if (error) {
      return <div>Error in loading</div>;
    } else if (!isLoaded) {
      return <div>Loading ...</div>;
    } else {
      return (
        <div className="import_orders container">
          <ol>
            {posts.map(post => (
              <li key={post["order-item-id"]} align="start">
                <div>
                  <p>{post["order-id"]}</p>
                  <p>{post["buyer-name"]}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      );
    }
  }
}

export default ImportOrders;

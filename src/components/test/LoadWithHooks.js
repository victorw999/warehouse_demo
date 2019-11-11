/**
 * Tutorial: how to fetch data w/ hooks
 * https://www.robinwieruch.de/react-hooks-fetch-data
 *  */

import React, { useState, useEffect } from "react";
import axios from "axios";
function App() {
  const [data, setData] = useState({ hits: [] });

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        "https://hn.algolia.com/api/v1/search?query=redux"
      );
      setData(result.data);
    };
    fetchData();
  }, []);
  return (
    <ul style={{ background: "#f7f7f7", margin: "2rem" }}>
      {data.hits.map(item => (
        <li key={item.objectID}>
          <a href={item.url}>{item.title}</a>
        </li>
      ))}
    </ul>
  );
}
export default App;

import React, { useState, useEffect } from "react";
import { CSVLink, CSVDownload } from "react-csv";
import User from "./User";
import moment from "moment";

const TimeReportTable = ({ allTasks }) => {
  const [csv, setCsv] = useState([]);

  /**
   * "allTasks" is an obj with userId as key
   * convert its content into array: csv[]
   * prep this arr for CSVLink
   *
   */
  useEffect(() => {
    if (allTasks) {
      let arr = [];
      Object.keys(allTasks).map((key) => {
        let tasks = allTasks[key];
        let row = [];
        tasks.forEach((task) => {
          const start = task.time.start ? moment(task.time.start.toDate()) : "";
          const end = task.time.end ? moment(task.time.end.toDate()) : "";
          const duration =
            end === ""
              ? "processing"
              : moment.utc(end.diff(start)).format("HH:mm:ss");

          row = [
            moment(task.time.start.toDate()).format("MM/DD h:mma"),
            task.owner ? task.owner : "",
            task.type ? task.type : "",
            task.oid ? task.oid : "",
            task.sku ? task.sku : "",
            task.quantity ? task.quantity : "",
            duration,
          ]; // END: row
          arr.push(row);
        }); // END: tasks foreach loop
      }); //END: looping obj

      setCsv([...arr]);
    }
  }, [allTasks]);
  return (
    <>
      <div className="row card center timereport-header">
        <span className="card-title report-title">Report</span>
        <CSVLink className="btn btn-flat teal lighten-2" data={csv}>
          Export CSV
        </CSVLink>
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>User</th>
            <th>Type</th>
            <th>Oid</th>
            <th>Sku</th>
            <th>Qty</th>
            <th>Spent</th>
          </tr>
        </thead>

        <tbody>{csv ? <User tasks={csv} /> : ""}</tbody>
      </table>
    </>
  );
};

export default TimeReportTable;

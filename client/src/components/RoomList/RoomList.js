import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getJoinedRooms } from "../../api/RoomServices";
import Cookies from "js-cookie";
import "../Table/Table.css";

function RoomList() {
  const navigator = useNavigate();
  const [table, setTable] = useState([]);
  const uuid = Cookies.get("uuid");

  useEffect(() => {
    if (table.length === 0) {
      getJoinedRooms(uuid).then((data) => setTable(data));
    }
  }, []);

  return (
    <>
      <div class="container">
        <h2 id="title">Joined Rooms</h2>
        <ul class="responsive-table">
          <li class="table-header">
            <div class="col-1">Room ID</div>
            <div class="col-2">Programming Language</div>
            <div class="col-3">Question Difficulty</div>
          </li>
          {table.map((val) => {
            return (
              <li
                class="table-row"
                id={val.room_id}
                onClick={() => {
                  navigator("/room/" + val.room_id);
                }}
              >
                <div class="col col-1" data-label="Job Id">
                  {val.room_id}
                </div>
                <div class="col col-2" data-label="Customer Name">
                  {val.programming_language}
                </div>
                <div class="col col-3" data-label="Amount">
                  {val.question_difficulty}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default RoomList;

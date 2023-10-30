import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getJoinedRooms } from "../../api/RoomServices";
import "../Table/Table.css";

function RoomList() {
  const navigator = useNavigate();
  const [table, setTable] = useState([]);

  useEffect(() => {
    if (table.length === 0) {
      getJoinedRooms().then((data) => setTable(data)).catch((e) => console.log(e));
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
            <div class="col-3">Question ID</div>
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
                <div class="col col-1" data-label="Room Id">
                <div style={{whiteSpace: "nowrap", overflow:'hidden', textOverflow: 'ellipsis'}}>
                  {val.room_id}
                </div>
                </div>
                <div class="col col-2" data-label="Programming Language">
                  {val.programming_language}
                </div>
                <div class="col col-3" data-label="Question Id">
                  {val.question_id}
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

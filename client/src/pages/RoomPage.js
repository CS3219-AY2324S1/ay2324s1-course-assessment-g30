import React from "react";
import { useParams } from "react-router-dom";

function RoomPage() {
  const { roomId } = useParams();

  return (
    <div>
      {/* Room content */}
      <h1>Welcome to Room: {roomId}</h1>
    </div>
  );
}

export default RoomPage;

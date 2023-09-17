import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HStack,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Text,
} from "@chakra-ui/react";
import LeaveRoomModal from "./LeaveRoomModal";

function RoomPanel({ roomId, socket }) {
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);

  const handleLeaveRoom = () => {
    setModalOpen(true);
  };

  const confirmLeaveRoom = () => {
    socket.emit("leave-room", roomId);
    navigate(`/home`);
  };

  return (
    <>
      <HStack width="47vw" spacing={2} justifyContent="right">
        <Popover>
          <PopoverTrigger>
            <Button size="sm" colorScheme="teal">
              Info
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Room Info</PopoverHeader>
            <PopoverBody>
              <Text>
                RoomID: {roomId}
                <Text>Share the id with your friends to join the room!</Text>
              </Text>
            </PopoverBody>
          </PopoverContent>
        </Popover>
        <Button
          colorScheme="red"
          variant="solid"
          onClick={() => handleLeaveRoom()}
          size="sm"
        >
          Leave Room
        </Button>
      </HStack>
      <LeaveRoomModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmLeaveRoom}
      />
    </>
  );
}

export default RoomPanel;

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
  IconButton,
} from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
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
            <IconButton
              aria-label="Room Info"
              colorScheme="teal"
              icon={<InfoIcon />}
            ></IconButton>
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

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
      <HStack spacing={2} justifyContent="right">
        <Popover>
          <PopoverTrigger>
            <IconButton
              aria-label="Room Info"
              colorScheme="blue"
              icon={<InfoIcon />}
              size="sm"
            ></IconButton>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow bg="gray.50" />
            <PopoverCloseButton />
            <PopoverHeader fontSize="2xl" pt={2} fontWeight="bold">
              Room Details
            </PopoverHeader>
            <PopoverBody>
              <Text color="blue.400" mb="2" fontWeight="thin">
                {window.location.href}
              </Text>
              <Text fontSize="sm" letterSpacing={-0.3}>
                Share this link with your friends to join the room!
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

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
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { InfoIcon, TimeIcon } from "@chakra-ui/icons";
import LeaveRoomModal from "./LeaveRoomModal";

function RoomPanel({ roomId, socket, timer }) {
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);

  const handleLeaveRoom = () => {
    setModalOpen(true);
  };

  const confirmLeaveRoom = () => {
    socket.emit("leave-room", roomId);
    navigate(`/dashboard`);
  };

  return (
    <>
      <HStack spacing={2} justifyContent="right">
        <Flex
          ml={3}
          p={2}
          borderRadius={10}
          bg="#e9ecf0"
          fontWeight="bold"
          gap={2}
          alignItems={"center"}
        >
          <TimeIcon />
          <Text>Time Left: {timer}</Text>
        </Flex>
        <Spacer />
        <Popover>
          <PopoverTrigger>
            <IconButton
              aria-label="Room Info"
              variant="outline"
              icon={<InfoIcon />}
              size="sm"
              color="gray"
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
        <Button colorScheme="red" onClick={() => handleLeaveRoom()} size="sm">
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

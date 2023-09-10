import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  VStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalHeader,
  ModalContent,
} from "@chakra-ui/react";

function JoinRoomForm({ socket }) {
  const [roomId, setRoomId] = useState("");
  const [showModal, setShowModal] = useState(false);

  const toast = useToast();

  const handleInputChange = (event) => {
    setRoomId(event.target.value);
  };

  const handleJoinRoomClick = () => {
    console.log(`Joining room with ID: ${roomId}`);
    if (socket) {
      socket.emit("join-room", roomId);
    }
  };

  // Invalid room ID Toast
  useEffect(() => {
    if (socket) {
      socket.on("invalid-room-id", () => {
        toast({
          title: "Invalid Room",
          description: "Sorry, this room does not exist or has expired.",
          status: "error",
          position: "top",
          duration: 3000,
          isClosable: true,
        });
      });
    }
  }, [socket]);

  // Valid room ID Modal
  useEffect(() => {
    if (socket) {
      socket.on("valid-room-id", () => {
        setShowModal(true);
      });
    }
  }, [socket]);

  return (
    <>
      <VStack>
        <Input
          size="sm"
          placeholder="Key in Room ID"
          value={roomId}
          onChange={handleInputChange}
        />
        <Button onClick={handleJoinRoomClick}>Join Room</Button>
      </VStack>
      <Modal isOpen={showModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Hang in There!</ModalHeader>
          <ModalBody>You'll be joining your friends in a bit.</ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default JoinRoomForm;

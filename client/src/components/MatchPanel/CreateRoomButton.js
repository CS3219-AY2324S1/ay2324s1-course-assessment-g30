import React, { useState, useEffect } from "react";
import {
  Button,
  Select,
  useToast,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

function CreateRoomButton({ socket }) {
  const [difficulty, setDifficulty] = useState("");
  const [showRoomCreatedModal, setShowRoomCreatedModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleModalSubmit = () => {
    if (difficulty !== "") {
      setIsLoading(true);

      setTimeout(() => {
        socket.emit("create-room", difficulty);
      }, 1000);
    } else {
      toast({
        title: "Please select a difficulty",
        description: "We need to know how hard you want to play!",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Successful Room Creation
  useEffect(() => {
    if (socket) {
      socket.on("room-created", () => {
        setShowModal(false);
        setShowRoomCreatedModal(true);
      });
    }
  }, [socket]);

  return (
    <>
      <Button
        w="100%"
        h="50%"
        variant="outline"
        colorScheme="linkedin"
        onClick={() => setShowModal(true)}
      >
        Create Private Room
      </Button>
      <Modal
        isCentered
        size="lg"
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      >
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent>
          <ModalHeader fontSize="2xl" fontWeight="bold" textAlign="center">
            Room Settings
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Difficulty</FormLabel>
              <Select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                placeholder="Select difficulty"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={isLoading}
              colorScheme="blue"
              onClick={handleModalSubmit}
            >
              Create Room
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={showRoomCreatedModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Room Created!</ModalHeader>
          <ModalBody>
            Enjoy! You'll be redirected to your room in a bit!
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CreateRoomButton;

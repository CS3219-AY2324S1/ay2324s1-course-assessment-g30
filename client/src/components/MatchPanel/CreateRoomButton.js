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
  Text,
} from "@chakra-ui/react";

function CreateRoomButton({ socket, uuid }) {
  const [difficulty, setDifficulty] = useState("");
  const [programmingLanguage, setProgrammingLanguage] = useState("");
  const [showRoomCreatedModal, setShowRoomCreatedModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleModalSubmit = () => {
    if (difficulty !== "" && programmingLanguage !== "") {
      setIsLoading(true);

      setTimeout(() => {
        socket.emit("create-room", difficulty, programmingLanguage);
      }, 1000);
    } else {
      const errorMessages = [];

      if (difficulty === "") {
        errorMessages.push("Please select a difficulty");
      }

      if (programmingLanguage === "") {
        errorMessages.push("Please select a programming language");
      }

      toast({
        title: "Please fill in all required fields.",
        description: (
          <>
            {errorMessages.map((msg) => (
              <Text>• {msg}</Text>
            ))}
          </>
        ),

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

  const handleCloseModal = () => {
    setShowModal(false);
    setDifficulty("");
    setProgrammingLanguage("");
  };

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
      <Modal isCentered size="lg" isOpen={showModal} onClose={handleCloseModal}>
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
                marginBottom={4}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </Select>
              <FormLabel>Programming Language</FormLabel>
              <Select
                value={programmingLanguage}
                onChange={(e) => setProgrammingLanguage(e.target.value)}
                placeholder="Select programming language"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
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
          <ModalHeader fontSize="2xl" fontWeight="bold" textAlign="center">
            Room Created!
          </ModalHeader>
          <ModalBody fontSize="lg" marginBottom={4}>
            Enjoy! You'll be redirected to your room in a bit!
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CreateRoomButton;

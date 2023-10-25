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
  RadioGroup,
  Radio,
  Stack,
} from "@chakra-ui/react";
import { getQuestions } from "../../api/QuestionServices";
import useWindowDimensions from "../../utils/WindowDimensions";

function CreateRoomButton({ socket }) {
  const [difficulty, setDifficulty] = useState("");
  const [programmingLanguage, setProgrammingLanguage] = useState("");
  const [showRoomCreatedModal, setShowRoomCreatedModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("difficulty");
  const [questionId, setQuestionId] = useState("");
  const [questionList, setQuestionList] = useState([]);
  const {width} = useWindowDimensions(); //764
  const toast = useToast();

  const handleModalSubmit = async () => {
    if (
      ((selectedOption === "difficulty" && difficulty !== "") ||
        (selectedOption === "custom" && questionId !== "")) &&
      programmingLanguage !== ""
    ) {
      setIsLoading(true);
      if (selectedOption === "difficulty") {
        setTimeout(() => {
          socket.emit("create-room", difficulty, programmingLanguage);
        }, 1000);
      } else {
        setTimeout(() => {
          socket.emit(
            "create-room-with-question",
            questionId,
            programmingLanguage
          );
        }, 1000);
      }
    } else {
      const errorMessages = [];

      if (selectedOption === "difficulty" && difficulty === "") {
        errorMessages.push("Please select a difficulty");
      }

      if (selectedOption === "custom" && questionId === "") {
        errorMessages.push("Please select a question");
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

  useEffect(() => {
    if (questionList.length === 0) {
      getQuestions().then((data) => setQuestionList(data));
    }
  }, []);

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
    setQuestionId("");
    setSelectedOption("difficulty");
  };

  return (
    <>
      <Button
        w="100%"
        h={'50%'}
        variant="outline"
        colorScheme="linkedin"
        onClick={() => setShowModal(true)}
        p={width < 764 ? '5' : null}
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
              <FormLabel>Choose an Option</FormLabel>
              <RadioGroup
                value={selectedOption}
                onChange={setSelectedOption}
                margin={4}
              >
                <Stack direction="row" gap={5}>
                  <Radio value="difficulty">Select by Difficulty</Radio>
                  <Radio value="custom">Select a Specific Question</Radio>
                </Stack>
              </RadioGroup>
              {selectedOption === "difficulty" && (
                <>
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
                </>
              )}
              {selectedOption === "custom" && (
                <>
                  <FormLabel>Custom Question</FormLabel>
                  <Select
                    value={questionId}
                    onChange={(e) => setQuestionId(e.target.value)}
                    placeholder="Select question"
                    marginBottom={4}
                  >
                    {questionList.map((val) => {
                      return (
                        <option key={val.question_id} value={val.question_id}>
                          {val.question_id}. {val.question_title}
                        </option>
                      );
                    })}
                  </Select>
                </>
              )}

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

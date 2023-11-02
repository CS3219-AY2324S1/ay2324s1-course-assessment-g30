import React, { useState, useEffect } from "react";
import { Flex, Divider, Input, Button, Text } from "@chakra-ui/react";
import { getQuestionsDescription } from "../../api/QuestionServices";
import { callOpenAI } from "../../api/openAIServices";
import { set } from "mongoose";


const OpenaiChat = ({height, questionId, userCode, programmingLanguage}) => {
  const [question, setQuestion] = useState([]);

  useEffect(() => {
      getQuestionsDescription(questionId)
        .then((data) => {
          if (data.question_description) {
            setQuestion(data.question_description);
          } else if (data.description !== null || data.description.length !== 0) {
            setQuestion(data.description);
          }
        })
        .catch((error) => {
          console.error("Error fetching question description:", error);
        });
      },[]);

    const [messages, setMessages] = useState([
      { role: "system", content: "Hi there! Nice to meet you! My Name is AlgoGenius. I am here to help you with your coding journey! :)" },
      {role: "system", content: "Currently, I can help you with the following: 1) Explain the question \n 2) Suggest optimal answer \n  3) Debug your code \n 4) Generate pseudocode \n And many more...."},
    ]);

    function renderTextWithLineBreaks(text) {
      return {
        __html: text.replace(/\n/g, '<br />'),
      };
    } 

    const [inputMessage, setInputMessage] = useState("");
    const handleSendMessage = async () => {
      if (!inputMessage.trim().length) {
        return;
      }
      const data = inputMessage;
    
      setMessages((old) => [...old, { role: "user", content: data }]);
      setInputMessage("");
      // Call openai-service to generate bot response and plant it into messages
      const response = await callOpenAI(data, programmingLanguage, question, userCode, messages);
      console.log("response",response);
      setMessages((old) => [...old, { role: "system", content: response }]);
    };

    return (
      <Flex w="100%" h={height} justify="center" align="center" zIndex={200}>
        <Flex w="100%" h="90%" flexDir="column">
        <Divider />
        <Flex w="100%" h="80%" overflowY="scroll" flexDirection="column" p="3">
          {messages.map((item, index) => {
            if (item.role === "user") {
              return (
                <Flex key={index} w="100%" justify="flex-end">
                  <Flex
                    bg="black"
                    color="white"
                    minW="100px"
                    maxW="350px"
                    my="1"
                    p="3"
                  >
                    <Text>{item.content}</Text>
                  </Flex>
                </Flex>
              );
            } else {
              return (
                <Flex key={index} w="100%">
                  <Flex
                    bg="gray.100"
                    color="black"
                    minW="100px"
                    maxW="350px"
                    my="1"
                    p="3"
                  >
                  <Text whiteSpace="pre-line" dangerouslySetInnerHTML={renderTextWithLineBreaks(item.content)}/>
                  </Flex>
                </Flex>
              );
            }
          })}
	      </Flex>
        <Divider />
        <Input
          placeholder="Type Something..."
          border="none"
          borderRadius="none"
          _focus={{
            border: "1px solid black",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <Button
          bg="black"
          color="white"
          borderRadius="none"
          _hover={{
            bg: "white",
            color: "black",
            border: "1px solid black",
          }}
          disabled={inputMessage.trim().length <= 0}
          onClick={handleSendMessage}
        >
          Send
        </Button>
        </Flex>
      </Flex>
      );
};

export default OpenaiChat;


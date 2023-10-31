import React, { useState } from "react";
import { Flex, Divider, Input, Button, Text } from "@chakra-ui/react";

const OpenaiChat = ({height}) => {
    const [messages, setMessages] = useState([
      { from: "bot", text: "Hi there! Nice to meet you! My Name is AlgoGenius. I am here to help you with your coding journey! :)" },
      {from: "bot", text: "Currently, I can help you with the following: 1) Explain the question \n 2) Suggest optimal answer \n  3) Debug your code \n 4) Generate pseudocode"},
    ]);

    const [inputMessage, setInputMessage] = useState("");
    const handleSendMessage = () => {
      if (!inputMessage.trim().length) {
        return;
      }
      const data = inputMessage;
    
      setMessages((old) => [...old, { from: "me", text: data }]);
      setInputMessage("");
    
      // Call openai-service to generate bot response and plant it in
    };

    return (
      <Flex w="100%" h={height} justify="center" align="center" zIndex={200}>
        <Flex w="100%" h="90%" flexDir="column">
        <Divider />
        <Flex w="100%" h="80%" overflowY="scroll" flexDirection="column" p="3">
          {messages.map((item, index) => {
            if (item.from === "me") {
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
                    <Text>{item.text}</Text>
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
                    <Text>{item.text}</Text>
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


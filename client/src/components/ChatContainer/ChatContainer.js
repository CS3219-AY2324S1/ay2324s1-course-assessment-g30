import React, { useState, useEffect } from "react";
import { Box, Input, IconButton, Flex } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";

function ChatContainer({ socket, roomId }) {
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  useEffect(() => {
    // To handle sent messages
    if (socket) {
      socket.on("receive-message", (senderId, message) => {
        setMessages([...messages, { senderId, message }]);
      });
    }

    // To handle welcome message
    if (socket) {
      socket.on("user-joined", ({ userId, message }) => {
        setMessages([...messages, { senderId: userId, message }]);
      });
    }

    // To handle user left message
    if (socket) {
      socket.on("user-left", ({ userId, message }) => {
        setMessages([...messages, { senderId: userId, message }]);
      });
    }
  }, [socket, messages]);

  const handleSubmitMessageClick = () => {
    if (messageText !== "") {
      socket.emit("send-message", messageText, roomId);
      setMessageText("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      // Simulate a click event on the send button when Enter is pressed
      handleSubmitMessageClick();
      setIsButtonClicked(true);

      setTimeout(() => {
        setIsButtonClicked(false);
      }, 200);
    }
  };

  return (
    <Box height="99%" width="99%" display="flex" flexDirection="column">
      <Box flex="1" overflowY="scroll">
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.senderId}:</strong> {msg.message}
          </div>
        ))}
      </Box>
      <Flex align="center">
        <Input
          placeholder="Type Message Here..."
          onChange={(event) => setMessageText(event.target.value)}
          value={messageText}
          onKeyDown={handleKeyPress}
        />
        <IconButton
          aria-label="Send Message"
          icon={<ChevronRightIcon />}
          ml={1}
          onClick={() => handleSubmitMessageClick()}
          isActive={isButtonClicked}
        />
      </Flex>
    </Box>
  );
}

export default ChatContainer;

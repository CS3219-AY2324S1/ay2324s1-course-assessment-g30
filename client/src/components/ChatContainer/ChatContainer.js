import React, { useState, useEffect } from "react";
import { Box, Input, IconButton, Flex } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import "./ChatContainer.css";
import Cookies from "js-cookie";

function ChatContainer({ socket, roomId }) {
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const uuid = Cookies.get("uuid");

  useEffect(() => {
    // To handle sent messages
    if (socket) {
      socket.on("receive-message", (senderId, message, username) => {
        setMessages([
          ...messages,
          { senderId, message, type: "chat", username },
        ]);
      });
    }

    // To handle welcome message
    if (socket) {
      socket.on("user-joined", ({ userId, message, username }) => {
        setMessages([
          ...messages,
          { senderId: userId, message, type: "announcement", username },
        ]);
      });
    }

    // To handle user left message
    if (socket) {
      socket.on("user-left", ({ userId, message, username }) => {
        setMessages([
          ...messages,
          { senderId: userId, message, type: "announcement", username },
        ]);
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
    <Flex gap={3} height="100%" flexDirection="column" width="100%">
      <Box overflowY="scroll" height="90%" textAlign="left">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-bubble ${msg.type} ${
              uuid === msg.senderId && msg.type === "chat"
                ? "you"
                : msg.type === "chat"
                ? "other"
                : ""
            }`}
          >
            <strong>{msg.username}</strong>{" "}
            {msg.type === "announcement" ? (
              msg.message
            ) : (
              <>
                <br />
                {msg.message}
              </>
            )}
          </div>
        ))}
      </Box>
      <Flex align="center" gap={1}>
        <Input
          bg="#F4F4F4"
          borderTop="1px solid #CCC"
          placeholder="Type Message Here..."
          onChange={(event) => setMessageText(event.target.value)}
          value={messageText}
          onKeyDown={handleKeyPress}
        />
        <IconButton
          aria-label="Send Message"
          icon={<ChevronRightIcon />}
          onClick={() => handleSubmitMessageClick()}
          isActive={isButtonClicked}
          colorScheme="blue"
        />
      </Flex>
    </Flex>
  );
}

export default ChatContainer;

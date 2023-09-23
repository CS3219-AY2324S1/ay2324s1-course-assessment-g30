import React, { useState, useEffect } from "react";
import { Box, Input, IconButton, Flex } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import "./ChatContainer.css";
import { getUserProfile } from "../../api/Auth";
import Cookies from "js-cookie";

function ChatContainer({ socket, roomId, chatHistory }) {
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState(chatHistory);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [user, setUser] = useState([]);
  const uuid = Cookies.get("uuid");

  useEffect(() => {
    if (user.length === 0) {
      getUserProfile().then((data) => {
        setUser(data);
      });
    }
  }, []);

  useEffect(() => {
    // To handle sent messages
    if (socket) {
      socket.on("receive-message", (senderId, message) => {
        setMessages([...messages, { senderId, message, type: "chat" }]);
      });
    }

    // To handle welcome message
    if (socket) {
      socket.on("user-joined", ({ userId, message }) => {
        setMessages([
          ...messages,
          { senderId: userId, message, type: "announcement" },
        ]);
      });
    }

    // To handle user left message
    if (socket) {
      socket.on("user-left", ({ userId, message }) => {
        setMessages([
          ...messages,
          { senderId: userId, message, type: "announcement" },
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
            <strong>{user.username}</strong>{" "}
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
          bg="#E27d60"
          color="white"
        />
      </Flex>
    </Flex>
  );
}

export default ChatContainer;

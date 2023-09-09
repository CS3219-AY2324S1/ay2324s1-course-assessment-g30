import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import MatchButtons from "./MatchButtons";
import MatchModal from ".//MatchModal";

function MatchPanel() {
  const FINDING_MATCH_TIMEOUT = 30;
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [difficulty, setDifficulty] = useState(null);

  const [socket, setSocket] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [matchingFailed, setMatchingFailed] = useState(false);
  const [matchFound, setMatchFound] = useState(false);
  const [remainingTime, setRemainingTime] = useState(FINDING_MATCH_TIMEOUT);

  // Connect to common lobby
  useEffect(() => {
    const socket = io("http://localhost:3001");
    setSocket(socket);

    // Clean up on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  // Waiting to be matched
  useEffect(() => {
    if (socket) {
      socket.on("paired", (roomId) => {
        console.log(`You are paired in room ${roomId}`);
        setMatchFound(true);
        setTimeout(() => {
          navigate(`/room/${roomId}`);
        }, 2000);
      });
    }
  }, [socket]);

  // Countdown timer
  useEffect(() => {
    if (showModal && remainingTime === FINDING_MATCH_TIMEOUT) {
      const timerInterval = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);

      const matchingTimeout = setTimeout(() => {
        cancelMatching(difficulty);
      }, FINDING_MATCH_TIMEOUT * 1000);

      return () => {
        clearInterval(timerInterval);
        clearTimeout(matchingTimeout);
      };
    }
  }, [showModal]);

  const handleMatchClick = (difficulty) => {
    setMatchingFailed(false);
    setMatchFound(false);

    setIsLoading(true);
    setDifficulty(difficulty);
    setRemainingTime(FINDING_MATCH_TIMEOUT);
    setShowModal(true);

    setTimeout(() => {
      if (socket) {
        socket.emit("lets-rumble", difficulty);
      }
    }, 1000);
  };

  const cancelMatching = (difficulty) => {
    setMatchingFailed(true);
    setIsLoading(false);
    if (socket) {
      socket.emit("remove-me-from-queue", difficulty);
    }
  };

  const handleRetryClick = () => {
    setMatchingFailed(false);
    handleMatchClick(difficulty);
  };

  return (
    <div>
      <MatchButtons
        isLoading={isLoading}
        clickedButton={difficulty}
        handleMatchClick={handleMatchClick}
      />
      <MatchModal
        showModal={showModal}
        onClose={() => {
          cancelMatching(difficulty);
          setShowModal(false);
        }}
        matchingFailed={matchingFailed}
        matchFound={matchFound}
        remainingTime={remainingTime}
        handleRetryClick={handleRetryClick}
      />
    </div>
  );
}

export default MatchPanel;

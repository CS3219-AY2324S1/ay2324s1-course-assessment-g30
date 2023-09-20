import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
} from "@chakra-ui/react";

function LeaveRoomModal({ isOpen, onClose, onConfirm }) {
  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalHeader textAlign="center" fontSize="2xl" fontWeight="bold">
          Leave Room?
        </ModalHeader>
        <ModalBody>
          <Text>
            We're sorry to see you go, feel free to join back anytime!
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mr={2} onClick={onConfirm}>
            Confirm
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default LeaveRoomModal;

import React, { useState, useRef } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import Editor from "@monaco-editor/react";

function HistoryList({ pastAttempts }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const editorRef = useRef(null);

  function onEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    editorRef.current.getModel().setValue(selectedRow.editor_state.code);
    monaco.editor.setModelLanguage(
      editorRef.current.getModel(),
      selectedRow.programming_language
    );
    editorRef.current.updateOptions({ readOnly: true });
  }

  const handleRowClick = (val) => {
    setSelectedRow(val);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  function formatDate(date) {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return new Date(date).toLocaleDateString(undefined, options);
  }

  const EditorModal = ({ isOpen, onClose }) => {
    return (
      <Modal
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
        size="3xl"
      >
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent>
          <ModalHeader>Submission</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Editor height="50vh" theme="vs" onMount={onEditorDidMount} />
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  };

  return (
    <>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Date Attempted</Th>
              <Th>Programming Language</Th>
              <Th isNumeric>Room ID</Th>
            </Tr>
          </Thead>
          <Tbody>
            {pastAttempts.map((val) => {
              return (
                <Tr
                  _hover={{ bg: "gray.100", cursor: "pointer" }}
                  id={val.room_id}
                  onClick={() => {
                    handleRowClick(val);
                  }}
                >
                  <Td>{formatDate(val.date_created)}</Td>
                  <Td>{val.programming_language}</Td>
                  <Td isNumeric>{val.room_id}</Td>
                </Tr>
              );
            })}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>Total Attempts: {pastAttempts.length}</Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
      <EditorModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}

export default HistoryList;

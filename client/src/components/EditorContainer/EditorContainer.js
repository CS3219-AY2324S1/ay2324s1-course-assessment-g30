import React, { useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";
import Editor from "@monaco-editor/react";

const EditorContainer = ({
  socket,
  programmingLanguage,
  roomId,
  editorCode,
}) => {
  const editorRef = useRef(null);
  function onEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    // Setting initial editor state
    editorRef.current.getModel().setValue(editorCode);
  }

  function handleEditorChange(code, event) {
    if (event.isFlush) {
      // Ignore remote updates to editor
    } else {
      // Push usr changes to server
      console.log("local changes pushed");
      socket.emit("push-code", code, roomId);
    }
  }

  useEffect(() => {
    if (socket) {
      // Receiving changes from other users
      socket.on("receive-code", (code) => {
        console.log("Applying remote changes");
        editorRef.current.getModel().setValue(code);
      });
    }
  }, [socket]);

  return (
    <Box padding={1}>
      <Editor
        height="90vh"
        width="100%"
        theme="vs"
        onMount={onEditorDidMount}
        onChange={handleEditorChange}
        defaultLanguage={programmingLanguage}
      />
    </Box>
  );
};

export default EditorContainer;

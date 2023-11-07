import React, {useEffect, useRef, useState} from "react";
import { Box } from "@chakra-ui/react";
import Editor from "@monaco-editor/react";

const EditorContainer = ({
  socket,
  programmingLanguage,
  roomId,
  editorCode,
}) => {
  const codeRef = useRef(editorCode)
  const editorRef = useRef(null);
  function onEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    // Setting initial editor state
    editorRef.current.getModel().setValue(editorCode);
  }

  function handleEditorChange(code, event) {
    if (codeRef.current !== code) {
      // Code is different from the reference (redis)
      console.log("local changes pushed", codeRef.current, code);
      socket.emit("push-changes", event.changes, code, roomId);
    }
  }

  useEffect(() => {
    if (socket) {
      // Receiving changes from other server
      socket.on("receive-changes", (changes, code) => {
        codeRef.current = code;
        console.log("Applying remote changes", codeRef.current, code);
        editorRef.current.getModel().applyEdits(changes);
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


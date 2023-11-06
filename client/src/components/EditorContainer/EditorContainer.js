import React, {useEffect, useRef, useState} from "react";
import { Box } from "@chakra-ui/react";
import Editor from "@monaco-editor/react";

const EditorContainer = ({
  socket,
  programmingLanguage,
  roomId,
  editorCode,
}) => {
  const codeRef = useRef(editorCode);
  const cursorRef = useRef({ lineNumber: 1, column: 1 });
  const editorRef = useRef(null);
  function onEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    // Setting initial editor state
    editorRef.current.getModel().setValue(editorCode);
  }

  function handleEditorChange(code, event) {
    if (codeRef !== code) {
      // Code is different from the reference (redis)
      console.log("local changes pushed", codeRef, code);
      socket.emit("push-changes", event.changes, code, roomId);
    } else {
      editorRef.current.getModel().setPosition(cursorRef);
    }
  }

  useEffect(() => {
    if (socket) {
      // Receiving changes from server
      socket.on("receive-changes", (changes, code) => {
        codeRef.current = code;
        cursorRef.current = editorRef.current.getModel().getCursorPos();
        console.log("Applying remote changes", codeRef, code);
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


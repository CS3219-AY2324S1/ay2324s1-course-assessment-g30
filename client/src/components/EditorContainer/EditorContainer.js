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
  const editorRef = useRef(null);
  const cursorRef = useRef(null)
  function onEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    // Setting initial editor state
    editorRef.current.getModel().setValue(editorCode);
  }

  function handleEditorChange(code, event) {
    console.log(event);
    if (codeRef.current !== code) {
      // Code is different from the reference (redis)
      console.log("local changes pushed");
      socket.emit("push-changes", event.changes, code, roomId);
    }
  }

  useEffect(() => {
    if (socket) {
      // Receiving changes from other server
      socket.on("receive-changes", (changes, code) => {
        codeRef.current = code;
        console.log("Applying remote changes");
        editorRef.current.getModel().applyEdits(changes);
        if (editorRef.current.getModel().getValue() !== code) {
          console.log("Client is out of sync");
          editorRef.current.getModel().setValue(code);
          // TODO: calculate pos for better precision

          console.log("Forced sync completed");
        }
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


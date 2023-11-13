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
  let isSocketChange = useRef(false);

  function onEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    // Setting initial editor state
    isSocketChange.current = true;
    console.log("Fetch initial code from redis");
    editorRef.current.getModel().setValue(editorCode);
    isSocketChange.current = false;
  }

  function handleEditorChange(code, event) {
    console.log(isSocketChange);
    if (!isSocketChange.current) {
      console.log("local changes pushed");
      socket.emit("push-code", event.changes, code, roomId);
    }
  }
  function executeCode() {
    socket.emit("execute-code", roomId, editorRef.current.getModel().getValue(), "", programmingLanguage);
  }

  useEffect(() => {
    if (socket) {
      // Receiving changes from other users
      socket.on("receive-code", (changes) => {
        console.log("Applying remote changes");
        isSocketChange.current = true;
        editorRef.current.getModel().applyEdits(changes);
        // editorRef.current.getModel().setValue(code);
        isSocketChange.current = false;
      });

      socket.on("get-result", (result) => {
        console.log("result", result);
      });
    }
  }, [socket]);

  return (
    <Box padding={1}>
      <button onClick={executeCode}>Run</button>
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

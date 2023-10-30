import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";

const EditorContainer = ({
  socket,
  programmingLanguage,
  roomId,
  initialCode,
}) => {
  const editorRef = useRef(null);
  function onEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    // Setting initial editor state
    editorRef.current.getModel().setValue(initialCode);
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
      // Receiving change from other users
      socket.on("push-code", (code, id) => {
        console.log("Applying remote changes");
        editorRef.current.getModel().setValue(code);
      });
    }
  }, [socket]);

  return (
    <div>
      <Editor
        height="90vh"
        width="100%"
        theme="vs-dark"
        onMount={onEditorDidMount}
        onChange={handleEditorChange}
        defaultLanguage={programmingLanguage}
      />
    </div>
  );
};

export default EditorContainer;

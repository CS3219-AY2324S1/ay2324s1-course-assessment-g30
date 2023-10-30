import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";

const EditorContainer = ({
  socket,
  programmingLanguage,
  roomId,
  getCodeRef,
  initialCode,
}) => {
  const editorRef = useRef(null);
  function onEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    // Setting initial editor state
    editorRef.current.getModel().setValue(initialCode);
  }

  function handleEditorChange(value, event) {
    if (event.isFlush) {
      // ignore remote updates to editor
    } else {
      // Push usr changes
      console.log("local changes pushed");
      // const source = event.changes;
      socket.emit("push-code", value, roomId);
    }
  }

  useEffect(() => {
    if (socket) {
      console.log("socket");
      // Receiving change from other users
      socket.on("push-code", (code, id) => {
        console.log("Applying remote changes");
        editorRef.current.getModel().setValue(code);
        // editorRef.current.getModel().applyEdits(changes);
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

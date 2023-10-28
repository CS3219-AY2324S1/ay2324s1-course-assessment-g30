import React, { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";

const EditorContainer = ({
  socket,
  programmingLanguage,
  roomId,
  getCodeRef,
}) => {
  const editorRef = useRef(null);
  // initializing code editor

  function onEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    // Fetch saved state from editor (on redis) and apply to editor

    // Change event for editor
    editorRef.current.getModel().onDidChangeContent((event) => {
      console.log(event);
      const source = event.changes;

      socket.emit("push-code", source, roomId);

      getCodeRef(source);
    });
  }

  useEffect(() => {
    if (socket) {
      // Fetch saved state from editor (on redis) and apply to editor
      //   socket.on("receive-state", (initial_state) => {
      //     editorRef.current.getModel().applyEdits(initial_state);
      //   });

      // Receiving change from other users
      socket.on("push-code", (code) => {
        console.log(code);
        editorRef.current.getModel().applyEdits(code);
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
        defaultLanguage={programmingLanguage}
      />
    </div>
  );
};

export default EditorContainer;

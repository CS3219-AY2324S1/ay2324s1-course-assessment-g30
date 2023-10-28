import React, { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";

const EditorContainer = ({ socket, programmingLanguage, roomId, getCodeRef }) => {
  const editorRef = useRef(null);
  // initializing code editor

  function onEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    editorRef.current.getModel().onDidChangeContent((event) => {
      const source = event.changes;
      const code = source.toString();

      getCodeRef(code);

      if (code !== "setValue") {
        socket.current.emit("push-code", roomId, code);
      }

    });
  }

  useEffect(() => {
    if (socket.current) {
      socket.current.on("push-code", (code) => {
        if (code !== null) {
          //editorRef.current.setValue(code);
          editorRef.current.getModel().applyEdits(code.changes);
        }
      });
    }

    return () => {
      socket.current.off("push-code");
    };
  }, [socket.current]);

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
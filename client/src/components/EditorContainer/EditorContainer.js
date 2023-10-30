import React, {useEffect, useRef, useState} from "react";
import Editor from "@monaco-editor/react";

const EditorContainer = ({
                           socket,
                           programmingLanguage,
                           roomId,
                           getCodeRef
                         }) => {
  // initializing code editor
  const editorRef = useRef(null);
  function onEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    // Fetch saved state from editor (on redis) and apply to editor
    //socket.emit("request-state", roomId);
    console.log("Initial state requested");

    // Change event for editor
    // editorRef.current.getModel().onDidChangeContent((event) => {
    //   // // console.log("usr made some changes", event);
    //   // const source = event.changes;
    //   // socket.emit("push-code", source, roomId);
    //   // getCodeRef(source);
    // });
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

      // Fetch saved state from editor (on redis) and apply to editor
      socket.on("sync-state", (code) => {
        console.log("Local editor is synced to redis", code);
        editorRef.current.getModel().setValue(JSON.parse(code)["code"]);
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

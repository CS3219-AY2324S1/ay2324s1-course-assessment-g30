import {useRef, useEffect, useState} from "react";
import Editor from "@monaco-editor/react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { MonacoBinding } from "y-monaco";

function EditorContainer({ programmingLanguage, roomId}) {
  const editorRef = useRef(null);

  function onEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    const doc = new Y.Doc();
    const provider = new WebrtcProvider(roomId, doc, { signaling: ['ws://localhost:3006'] });
    editor.onDidDispose(()=>{provider.destroy()})

    const ytext = doc.getText("monaco");
    provider.on('synced', synced => {
      console.log(`Editor for ${roomId} synced`, synced)

    })
    const binding = new MonacoBinding(
        ytext,
        editorRef.current.getModel(),
        new Set([editorRef.current]),
        provider.awareness
    );
    console.log(provider.awareness);
  }


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
}

export default EditorContainer;

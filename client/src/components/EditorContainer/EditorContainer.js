import { useRef } from "react";
import Editor from "@monaco-editor/react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { MonacoBinding } from "y-monaco";

function EditorContainer({ programmingLanguage, roomId }) {
  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    // Initialize YJS
    const doc = new Y.Doc(); // a collection of shared objects -> Text
    // Connect to peers (or start connection) with WebRTC
    const provider = new WebrtcProvider(roomId, doc, { signaling: ['ws://localhost:3006'] });
    const ytext = doc.getText("monaco"); // doc { "monaco": "what our IDE is showing" }
    // Bind YJS to Monaco
    // ytext.insert(0,editorState);
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
  function executeCode() {}

  return (
    <div>
      <button onClick={() => executeCode}>Run</button>
      <Editor
        height="90vh"
        width="100%"
        theme="vs-dark"
        onMount={handleEditorDidMount}
        defaultLanguage={programmingLanguage}
      />
    </div>
  );
}

export default EditorContainer;

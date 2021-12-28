import React from "react";

import { styled } from "~/stitches.config";
import { execute } from "~/components/code-editor/execute";

const testCode = `function isSingleCharacterToken(char) {
  return ["(", ")", "."].includes(char)
}

export default function tokenize(input) {
  let current = 0
  const tokens = []

  while (current < input.length) {
    const char = input[current]
    if (isSingleCharacterToken(char)) {
      tokens.push(char)
    }
    current++
  }

  return tokens
}`;

export default function Worker() {
  const [result, setResult] = React.useState<any>(null);
  const [error, setError] = React.useState<any>(null);
  const codeEditor = React.useRef<HTMLTextAreaElement>(null);
  const inputEditor = React.useRef<HTMLTextAreaElement>(null);

  function exec() {
    const code = codeEditor.current!.value;
    const input = inputEditor.current!.value;
    execute(code, [input]).then(setResult).catch(setError);
  }

  return (
    <div>
      <h1>Worker</h1>
      <CodeEditor ref={codeEditor} defaultValue={testCode} />
      <CodeEditor ref={inputEditor} defaultValue="console.log(message)" />
      <button onClick={exec}>Run</button>
      <pre>{JSON.stringify({ result, error }, null, 2)}</pre>
    </div>
  );
}

const CodeEditor = styled("textarea", {
  fontFamily: "$mono",
});

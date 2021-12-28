import React from "react";
import { Link } from "remix";

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

export default function Home() {
  React.useEffect(() => {
    const worker = new Worker("worker.js");
    worker.addEventListener("message", (evt) => {
      console.log(evt);
    });
    worker.postMessage({
      code: testCode,
      inputs: ["console.log(message)"],
    });
  }, []);

  return (
    <div>
      <h1>Hello!</h1>
      <ul>
        <li>
          <Link to="letters">Newsletters</Link>
        </li>
      </ul>
    </div>
  );
}

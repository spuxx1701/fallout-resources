import { useState, useEffect, useCallback } from "preact/hooks";
import "./terminal-input.css";

// This component MUST by embedded using the client:only='preact' property.

export default function TerminalInput() {
  const [value, setValue] = useState("");
  const [log, setLog] = useState([] as string[]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const { key } = event;
    if (!key || key.length < 1) return;
    switch (key) {
      case "Enter":
        event.preventDefault();
        submit();
        setValue("");
        break;
      case "Backspace":
        event.preventDefault();
        setValue((value) => `${value.slice(0, -1)}`);
        break;
      default:
        if (key.length > 1) return;
        setValue((value) => `${value}${key}`);
    }
  }, []);

  const submit = useCallback(() => {
    if (value) setLog((log) => [...log, value]);
  }, []);

  useEffect(() => {
    // Subscribe to window's keydown event to receive all key down events and
    // add them to the value
    window.addEventListener("keydown", (event) => {
      handleKeyDown(event, value, setValue);
    });
  }, [handleKeyDown]);

  console.log(log);

  return (
    <div id="terminal-input">
      {/* {log.map((str) => (
        <p>{"\n" + str}</p>
      ))} */}
      <div id="terminal-input-field">
        <p id="terminal-input-text">{"> " + value}</p>
        <div id="terminal-input-cursor"></div>
      </div>
    </div>
  );
}

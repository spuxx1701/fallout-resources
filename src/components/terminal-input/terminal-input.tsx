import { useState, useEffect, useCallback } from "preact/hooks";
import "./terminal-input.css";

// This component MUST by embedded using the client:only='preact' property.

export interface Command {
  inputs: string[];
  output: string;
  target?: string;
}

export interface Props {
  commands?: Command[];
}

export default function TerminalInput<Props>(props: Props) {
  const [value, setValue] = useState("");
  const [log, setLog] = useState([] as string[]);
  const [showKeyboardToggle, setShowKeyboardToggle] = useState(false);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const { key } = event;
      alert(key);
      if (!key || key.length < 1) return;
      switch (key) {
        case "Enter":
          event.preventDefault();
          submit();
          setValue("");
          break;
        case "Backspace":
          event.preventDefault();
          setValue(`${value.slice(0, -1)}`);
          break;
        default:
          if (key.length > 1) return;
          setValue(`${value}${key}`);
      }
    },
    [value]
  );

  const submit = () => {
    if (props.commands?.length > 0) {
      for (const command of props.commands) {
        if (!Array.isArray(command.inputs)) command.inputs = [command.inputs];
        if (
          command.inputs?.find(
            (input) =>
              input === "*" || input.toLowerCase() === value.toLowerCase()
          )
        ) {
          setLog([...log, `> ${value}`, command.output || "OK"]);
          if (command.target) {
            window.location = command.target;
          }
          return;
        }
      }
    }
    setLog([...log, `> ${value}`]);
  };

  const handleShowKeyboard = () => {
    document.getElementById("terminal-input-field-hiden")?.focus();
  };

  useEffect(() => {
    // Subscribe to window's keydown event to receive all key down events and
    // add them to the value
    window.addEventListener("input", handleKeyDown);
    return () => {
      window.removeEventListener("input", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    setShowKeyboardToggle(
      (window.innerWidth <= 768 && window.innerHeight <= 1024) ||
        (window.innerWidth <= 1024 && window.innerHeight <= 768)
    );
  }, []);

  return (
    <div id="terminal-input">
      {log.map((str) => (
        <p>{str}</p>
      ))}
      <div id="terminal-input-field">
        <input id="terminal-input-field-hiden" value={value} />
        <p id="terminal-input-text">{"> " + value}</p>
        <div id="terminal-input-cursor"></div>
        {showKeyboardToggle && (
          <button
            class="terminal-keyboard-button"
            type="button"
            onClick={handleShowKeyboard}
          >
            <i class="fa-solid fa-keyboard"></i>
          </button>
        )}
      </div>
    </div>
  );
}

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

  const handleKeyDown = (event: KeyboardEvent) => {
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
        setValue(`${value.slice(0, -1)}`);
        break;
      default:
        if (key.length > 1) return;
        setValue(`${value}${key}`);
    }
  };

  const submit = () => {
    console.log(props.successKeywords);
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

  useEffect(() => {
    // Subscribe to window's keydown event to receive all key down events and
    // add them to the value
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div id="terminal-input">
      {log.map((str) => (
        <p>{str}</p>
      ))}
      <div id="terminal-input-field">
        <p id="terminal-input-text">{"> " + value}</p>
        <div id="terminal-input-cursor"></div>
      </div>
    </div>
  );
}

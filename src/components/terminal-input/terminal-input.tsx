import { useState, useEffect, useCallback } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";
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
  const [log, setLog] = useState([] as string[]);
  const [inputWidth, setInputWidth] = useState("0ch");

  const submit = (value) => {
    if (props.commands?.length > 0) {
      for (const command of props.commands) {
        if (!Array.isArray(command.inputs)) command.inputs = [command.inputs];
        if (
          command.inputs?.find(
            (input) =>
              input === "*" || input.toLowerCase() === value.toLowerCase()
          )
        ) {
          setLog([...log, value, command.output || "OK"]);
          if (command.target) {
            window.location = command.target;
          }
          return;
        }
      }
    }
    setLog([...log, value]);
  };

  const handleInput = (event) => {
    setInputWidth(`${event.target.value.length}ch`);
  };

  const handleChange = (event) => {
    if (event.target.value) {
      submit(event.target.value);
      event.target.value = "";
      setInputWidth("0ch");
    }
  };

  const focusInput = (event: JSX.TargetedMouseEvent<HTMLDivElement>) => {
    (event.target as HTMLElement)
      ?.querySelector(".terminal-input-element")
      ?.focus();
  };

  return (
    <div class="terminal-input" onClick={focusInput}>
      {log.map((str) => (
        <p>{"> " + str}</p>
      ))}
      <div class="terminal-input-row ">
        <p>{"> "}</p>
        <input
          class="terminal-input-element"
          style={{ width: inputWidth }}
          inputMode="text"
          autoCapitalize={false}
          autoCorrect={false}
          onInput={handleInput}
          onChange={handleChange}
          autofocus={true}
        />
        <div class="terminal-input-cursor"></div>
      </div>
    </div>
  );
}

import { useState } from "react";

export default function ValueView({ initValue, setValue }) {
  const [{ input, value }, setState] = useState({
    input: JSON.stringify(initValue),
    value: initValue
  });
  const setInput = (input) => {
    setState({ input, value });
  };
  const update = () => {
    try {
      const parsedValue = JSON.parse(input);
      setState({ input, value: parsedValue });
      if (typeof setValue === "function") {
        setValue(parsedValue);
      }
    } catch {
      reset();
    }
  };
  const reset = () => {
    setState({ value, input: JSON.stringify(value) });
  };
  return (
    <input
      type="text"
      value={input}
      onFocus={reset}
      onBlur={update}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => {
        if (e.keyCode === 13) {
          update();
        }
        if (e.keyCode === 27) {
          reset();
        }
      }}
      style={{ width: Math.floor(input.length * 1.3) + "ch" }}
    ></input>
  );
}

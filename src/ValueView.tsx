import * as React from "react";
import { ReactElement, useState } from "react";
import { ViewInputs } from "./View";

type Inputs = ViewInputs & {
  stringValued: boolean;
};

export default function ValueView({
  initValue,
  stringValued,
  onValueUpdated
}: Inputs): ReactElement {
  const [{ input, value }, setState] = useState({
    input: stringValued ? String(initValue) : JSON.stringify(initValue),
    value: stringValued ? String(initValue) : initValue
  });
  const setInput = (input: string) => {
    setState({ input, value });
  };
  const reset = () => {
    setState({
      value,
      input: stringValued ? (value as string) : JSON.stringify(value)
    });
  };
  const update = () => {
    try {
      const parsedValue = stringValued ? input : JSON.parse(input);
      setState({ input, value: parsedValue });
      onValueUpdated?.call(null, parsedValue);
    } catch {
      reset();
    }
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
      style={{
        width: Math.floor(input.length * 1.3) + "ch",
        padding: "0 2px"
      }}
    ></input>
  );
}

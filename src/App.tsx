import * as React from "react";
import JsonView from "./JsonView";
import { RootContext } from "./Runtime/Runtime";

function _str(val: any): string {
  try {
    return JSON.stringify(val);
  } catch {
    return String(val);
  }
}

export default function App() {
  const onValueClicked = (...args: any[]) => alert(_str(args));
  const isContext = (v: any) =>
    v && Array.isArray(v.argVals) && Array.isArray(v.values) && v.source;
  const isFunc = (v: any) =>
    v &&
    Array.isArray(v.code) &&
    Array.isArray(v.argNames) &&
    (v.context || v.context === null);
  return (
    <div
      className="App"
      style={{
        display: "grid",
        gridTemplateColumns: "min-content min-content min-content min-content",
        alignItems: "start",
        rowGap: "8px",
        columnGap: "8px"
      }}
    >
      <JsonView
        value={[1, 2, { x: 3, y: 4 }, "5 6"]}
        onValueClicked={onValueClicked}
      />
      <JsonView
        value={{ a: 123, b: [4, 5, 6], c: 789 }}
        onValueClicked={onValueClicked}
      />
      <JsonView
        value={RootContext}
        onValueClicked={onValueClicked}
        nestedViews={[
          {
            matches: isFunc,
            makeView: ({ value, onValueClicked, nestedViews }: any) => (
              <JsonView
                value={{
                  argNames: value.argNames,
                  code: Object.fromEntries(
                    value.code.map(({ label, value }) => [label, "..." || value])
                  )
                }}
                onValueClicked={onValueClicked}
                nestedViews={nestedViews}
              />
            )
          },
          {
            matches: (v: any) => 0 && isContext(v),
            makeView: ({ value, onValueClicked, nestedViews }: any) => (
              <JsonView
                value={{
                  argVals: value.argVals,
                  values: Object.fromEntries(
                    value.values.map((v, i) => [value.source.code[i].label, "..." || v])
                  )
                }}
                onValueClicked={onValueClicked}
                nestedViews={[]||nestedViews}
              />
            )
          }
        ]}
      />
    </div>
  );
}

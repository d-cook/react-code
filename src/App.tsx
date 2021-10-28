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
  const safeVal = (v: any) => {
    if (Array.isArray(v)) return v.map(safeVal);
    if (!v || typeof v !== "object") return v;
    return isFunc(v) ? ".FN." : isContext(v) ? ".CX." : v;
  };
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
        value={[
          { a: 123, b: [4, 5, 6], c: 789 },
          [1, 2, { x: 3, y: 4 }, "5 6"]
        ]}
        onValueClicked={onValueClicked}
      />
      <JsonView
        value={["Runtime (raw):", RootContext]}
        onValueClicked={onValueClicked}
      />
      <JsonView
        value={["Runtime (Formatted):", RootContext]}
        onValueClicked={onValueClicked}
        nestedViews={[
          {
            matches: isFunc,
            makeView: ({ value, onValueClicked, nestedViews }: any) => (
              <JsonView
                value={{
                  argNames: value.argNames,
                  code: Object.fromEntries(
                    value.code.map(({ label, value, op, args }: any) => [
                      label,
                      op || args
                        ? [
                            op,
                            ...args.map(([i, v]) => [i, i === -1 ? "..." : v])
                          ]
                        : safeVal(value)
                    ])
                  )
                }}
                onValueClicked={onValueClicked}
                nestedViews={nestedViews}
              />
            )
          },
          {
            matches: (v: any) => isContext(v),
            makeView: ({ value, onValueClicked, nestedViews }: any) => (
              <JsonView
                value={{
                  argVals: value.argVals,
                  values: Object.fromEntries(
                    value.values.map((v, i) => [
                      value.source.code[i].label,
                      safeVal(v)
                    ])
                  ),
                  source: value.source
                }}
                onValueClicked={onValueClicked}
                nestedViews={nestedViews}
              />
            )
          }
        ]}
      />
    </div>
  );
}

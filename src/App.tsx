import * as React from "react";
import JsonView from "./JsonView";

export default function App() {
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
        onValueClicked={(...args) => alert(JSON.stringify(args))}
      />
      <JsonView
        value={{ a: 123, b: [4, 5, 6], c: 789 }}
        onValueClicked={(...args) => alert(JSON.stringify(args))}
      />
    </div>
  );
}

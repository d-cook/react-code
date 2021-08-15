import "./styles.css";
import DynamicView from "./DynamicView";

function FuncView() {}

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
      <DynamicView initValue={[1, 2, { x: 3, y: 4 }, "5 6"]} />
      <DynamicView initValue={{ a: 123, b: [4, 5, 6], c: 789 }} />
    </div>
  );
}

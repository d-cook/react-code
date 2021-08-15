import "./styles.css";
import DynamicView from "./DynamicView";

function FuncView() {}

export default function App() {
  return (
    <div className="App">
      <DynamicView initValue={[1, 2, { x: 3, y: 4 }, "5 6"]} />
      <DynamicView initValue={{ a: 123, b: [4, 5, 6], c: 789 }} />
    </div>
  );
}

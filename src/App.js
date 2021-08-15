import "./styles.css";
import ListView from "./ListView";

function FuncView() {}

function RecordView() {}

export default function App() {
  return (
    <div className="App">
      <ListView initValue={[1, 123, "test"]} />
    </div>
  );
}

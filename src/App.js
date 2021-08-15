import "./styles.css";
import ListView from "./ListView";
import RecordView from "./RecordView";

function FuncView() {}

export default function App() {
  return (
    <div className="App">
      <ListView initValue={[1, 123, "test"]} />
      <RecordView initValue={{ a: 123 }} />
    </div>
  );
}

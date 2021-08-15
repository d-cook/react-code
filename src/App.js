import "./styles.css";
import ValueView from "./ValueView";

function FuncView() {}

function RecordView() {}

function ListView() {}

export default function App() {
  return (
    <div className="App">
      <ValueView initValue={27} />
    </div>
  );
}

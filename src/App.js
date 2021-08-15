import "./styles.css";
import ValueView from "./ValueView";
import { useState } from "react";

function FuncView() {}

function RecordView() {}

function ListView({ initValue, setValue }) {
  const [{ list }, setState] = useState({
    list: Array.isArray(initValue) ? initValue : []
  });
  const updateList = (newList) => {
    setState({ list: newList });
    if (typeof setValue === "function") {
      setValue(newList);
    }
  };
  const updateItem = (value, index) => {
    const newList = list.slice();
    newList[index] = value;
    updateList(newList);
  };
  const addItem = (index) => {
    const start = list.slice(0, index);
    const end = list.slice(index);
    updateList(start.concat(null).concat(end));
  };
  const removeItem = (index) => {
    const start = list.slice(0, index);
    const end = list.slice(index + 1);
    updateList(start.concat(end));
  };
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "min-content min-content min-content",
        rowGap: "2px",
        columnGap: "1px"
      }}
    >
      {list.map((item, i) => (
        <>
          <button onClick={() => addItem(i)}>+</button>
          <button onClick={() => removeItem(i)}>-</button>
          <ValueView
            initValue={item}
            setValue={(value) => updateItem(value, i)}
          />
        </>
      ))}
      <button
        onClick={() => addItem(list.length)}
        style={{ gridColumn: "span 3" }}
      >
        +
      </button>
    </div>
  );
}

export default function App() {
  return (
    <div className="App">
      <ListView initValue={[1, null, "test"]} />
    </div>
  );
}

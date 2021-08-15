import ValueView from "./ValueView";
import { useState } from "react";

export default function RecordView({ initValue, onValueUpdated }) {
  const initRecord =
    initValue && typeof initValue === "object" && !Array.isArray(initValue)
      ? initValue
      : {};
  const [{ record }, setState] = useState({
    record: initRecord
  });
  const updateRecord = (record) => {
    setState({ record });
    if (typeof onValueUpdated === "function") {
      onValueUpdated(record);
    }
  };
  const setKey = (key, newKey) => {
    record[newKey] = record[key];
    delete record[key];
    updateRecord(record);
  };
  const setValue = (key, value) => {
    record[key] = value;
    updateRecord(record);
  };
  const addEntry = () => {
    let [key, idx] = ["value", 2];
    while (Object.hasOwnProperty.call(record, key)) {
      key = "value" + idx++;
    }
    setValue(key, null);
  };
  const removeEntry = (key) => {
    delete record[key];
    updateRecord(record);
  };
  return (
    <div
      style={{
        display: "inline-grid",
        gridTemplateColumns: "min-content min-content min-content min-content",
        rowGap: "2px",
        columnGap: "1px",
        border: "1px solid #8f8",
        backgroundColor: "#cfc",
        borderRadius: "5px",
        padding: "2px",
        margin: "2px"
      }}
    >
      {Object.entries(record).map(([key, value]) => (
        <>
          <button onClick={() => removeEntry(key)}>-</button>
          <ValueView
            key={"record-key-" + key}
            initValue={key}
            stringValued={true}
            setValue={(newKey) => setKey(key, newKey)}
          />
          :
          <ValueView
            key={"record-val-" + value}
            initValue={value}
            setValue={(newVal) => setValue(key, newVal)}
          />
        </>
      ))}
      <button onClick={() => addEntry()} style={{ gridColumn: "span 4" }}>
        +
      </button>
    </div>
  );
}

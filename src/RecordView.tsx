import { ReactElement, useState } from "react";
import ValueView from "./ValueView";
import DynamicView from "./DynamicView";
import { ViewInputs } from "./View";

export default function RecordView({
  initValue,
  onValueUpdated
}: ViewInputs): ReactElement {
  const initRecord =
    initValue && typeof initValue === "object" && !Array.isArray(initValue)
      ? (initValue as Record<string, any>)
      : {};
  const [{ record }, setState] = useState({
    record: initRecord
  });
  const updateRecord = (record: Record<string, any>) => {
    setState({ record });
    onValueUpdated?.call(null, record);
  };
  const setKey = (key: string, newKey: string) => {
    if (key !== newKey) {
      const value = record[key];
      delete record[key];
      record[newKey] = value;
      updateRecord(record);
    }
  };
  const setValue = (key: string, value: any) => {
    record[key] = value;
    updateRecord(record);
  };
  const addEntry = () => {
    let [key, idx] = ["value", 2];
    while (Object.hasOwnProperty.call(record, key)) {
      key = "value" + idx++;
    }
    setValue(key, 0);
  };
  /*
  const removeEntry = (key: string) => {
    delete record[key];
    updateRecord(record);
  };
  */
  return (
    <div
      style={{
        display: "inline-grid",
        gridTemplateColumns: "min-content min-content min-content",
        rowGap: "4px",
        columnGap: "4px",
        border: "1px solid #7a7",
        backgroundColor: "#cfc",
        borderRadius: "8px",
        padding: "4px",
        alignItems: "start"
      }}
    >
      {Object.entries(record).map(([key, value]: [string, any]) => (
        <>
          <ValueView
            key={"record-key-" + key}
            initValue={key}
            stringValued={true}
            onValueUpdated={(newKey) => setKey(key, newKey)}
          />
          :
          <DynamicView
            key={"record-val-" + value}
            initValue={value}
            onValueUpdated={(newVal) => setValue(key, newVal)}
          />
        </>
      ))}
      <button
        onClick={() => addEntry()}
        style={{
          gridColumn: "span 3",
          padding: "0",
          backgroundColor: "#9c9",
          border: "1px solid #686",
          borderRadius: "3px",
          height: "auto",
          fontSize: "10px",
          lineHeight: "9px"
        }}
      >
        +
      </button>
    </div>
  );
}

import { useState } from "react";
import DynamicView from "./DynamicView";

export default function ListView({ initValue, onValueUpdated }) {
  const initList = Array.isArray(initValue) ? initValue : [];
  const [{ items, nextKey }, setState] = useState({
    items: initList.map((value, key) => ({ value, key })),
    nextKey: initList.length
  });
  const updateList = (items, nextKey) => {
    setState({ items, nextKey });
    if (typeof onValueUpdated === "function") {
      onValueUpdated(items.map(({ value }) => value));
    }
  };
  const updateItem = (value, index) => {
    items[index].value = value;
    updateList(items, nextKey);
  };
  const addItem = (index) => {
    const start = items.slice(0, index);
    const end = items.slice(index);
    const item = { value: null, key: nextKey + 1 };
    updateList(start.concat(item).concat(end), item.key);
  };
  const removeItem = (index) => {
    const start = items.slice(0, index);
    const end = items.slice(index + 1);
    updateList(start.concat(end), nextKey);
  };
  return (
    <div
      style={{
        display: "inline-grid",
        gridTemplateColumns: "min-content min-content min-content",
        rowGap: "2px",
        columnGap: "1px",
        border: "1px solid #8aa",
        backgroundColor: "#def",
        borderRadius: "5px",
        padding: "2px",
        margin: "2px"
      }}
    >
      {items.map(({ value, key }, i) => (
        <>
          <span
            style={{
              fontSize: "10px",
              color: "#678"
            }}
          >
            {i}
          </span>
          <DynamicView
            key={"list-" + key}
            initValue={value}
            onValueUpdated={(val) => updateItem(val, i)}
          />
          <button
            onClick={() => removeItem(i)}
            style={{
              padding: "0 2px",
              backgroundColor: "#acc",
              border: "1px solid #686",
              borderRadius: "3px"
            }}
          >
            -
          </button>
        </>
      ))}
      <button
        onClick={() => addItem(items.length)}
        style={{
          gridColumn: "2 / span 2",
          padding: "0",
          backgroundColor: "#acc",
          border: "1px solid #678",
          borderRadius: "3px"
        }}
      >
        +
      </button>
    </div>
  );
}

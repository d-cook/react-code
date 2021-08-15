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
    const item = { value: 0, key: nextKey + 1 };
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
        gridTemplateColumns: "min-content",
        rowGap: "4px",
        columnGap: "4px",
        border: "1px solid #8aa",
        backgroundColor: "#def",
        borderRadius: "8px",
        padding: "4px",
        alignItems: "start"
      }}
    >
      {items.map(({ value, key }, i) => (
        <>
          <DynamicView
            key={"list-" + key}
            initValue={value}
            onValueUpdated={(val) => updateItem(val, i)}
          />
        </>
      ))}
      <button
        onClick={() => addItem(items.length)}
        style={{
          padding: "0",
          backgroundColor: "#acc",
          border: "1px solid #678",
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

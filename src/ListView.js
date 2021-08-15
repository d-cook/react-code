import ValueView from "./ValueView";
import { useState } from "react";

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
        display: "grid",
        gridTemplateColumns: "min-content min-content min-content",
        rowGap: "2px",
        columnGap: "1px"
      }}
    >
      {items.map(({ value, key }, i) => (
        <>
          <button onClick={() => addItem(i)}>+</button>
          <button onClick={() => removeItem(i)}>-</button>
          <ValueView
            key={key}
            initValue={value}
            setValue={(val) => updateItem(val, i)}
          />
        </>
      ))}
      <button
        onClick={() => addItem(items.length)}
        style={{ gridColumn: "span 3" }}
      >
        +
      </button>
    </div>
  );
}

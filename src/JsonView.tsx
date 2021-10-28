import * as React from "react";
import { ReactElement } from "react";
import { Key, ViewInputs } from "ViewInputs";

const valueStyles = {
  padding: "0"
};

const listStyles = {
  display: "inline-grid",
  gridTemplateColumns: "min-content",
  rowGap: "2px",
  columnGap: "4px",
  border: "1px solid #8aa",
  backgroundColor: "#def",
  borderRadius: "8px",
  padding: "4px",
  alignItems: "stretch",
  justifyItems: "stretch"
};

const recordStyles = {
  display: "inline-grid",
  gridTemplateColumns: "min-content min-content min-content",
  rowGap: "2px",
  columnGap: "4px",
  border: "1px solid #7a7",
  backgroundColor: "#cfc",
  borderRadius: "8px",
  padding: "4px",
  alignItems: "stretch",
  justifyItems: "stretch"
};

export default function JsonView({
  value,
  onValueClicked,
  nestedViews
}: ViewInputs): ReactElement {
  const MakeView = (
    value: any,
    path: Key[],
    vals: any[],
    isKey = false
  ): ReactElement => {
    const type =
      value === null
        ? "null"
        : vals.includes(value)
        ? "repeat"
        : Array.isArray(value)
        ? "list"
        : typeof value === "object"
        ? "record"
        : typeof value === "boolean"
        ? "bool"
        : typeof value;
    const styles =
      type === "list"
        ? listStyles
        : type === "record"
        ? recordStyles
        : valueStyles;
    const view = (nestedViews || []).filter(
      (v: any) => v.matches(value) && typeof v.makeView === "function"
    )[0];
    const showValueOnClick = (e: MouseEvent) => {
      e.stopPropagation();
      onValueClicked?.call(null, path, {
        [isKey ? "key" : "value"]: value
      });
    };
    if (type !== "repeat" && view) {
      return view.makeView({ value, onValueClicked, nestedViews });
    }
    return (
      <div class={"json-" + type} onClick={showValueOnClick} style={styles}>
        {type === "repeat"
          ? "[^" + (vals.length - vals.indexOf(value) - 1) + "]"
          : type === "list"
          ? (value as any[]).map((v, i) =>
              MakeView(v, path.concat(i), vals.concat([value]))
            )
          : type === "record"
          ? Object.entries(value).map(([k, v]) => (
              <>
                {MakeView(k, path.concat(k), vals, true)} :
                {MakeView(v, path.concat(k), vals.concat(value))}
              </>
            ))
          : type === "function"
          ? "[func]"
          : !isKey
          ? JSON.stringify(value)
          : value}
      </div>
    );
  };
  return MakeView(value, [], []);
}

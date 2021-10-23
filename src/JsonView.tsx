import * as React from "react";
import { ReactElement } from "react";

type Key = string | number;
type Inputs = {
  value: any;
  onValueClicked: (path: Key[], val: any) => void;
};

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
  alignItems: "start",
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
  alignItems: "start",
  justifyItems: "stretch"
};

export default function JsonView({
  value,
  onValueClicked
}: Inputs): ReactElement {
  const MakeView = (value: any, path: Key[], escape = true): ReactElement => {
    const type =
      value === null
        ? "null"
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
    return (
      <div
        class={"json-" + type}
        onClick={() => onValueClicked?.call(null, path, value)}
        style={styles}
      >
        {type === "list"
          ? (value as any[]).map((v, i) => MakeView(v, path.concat(i)))
          : type === "record"
          ? Object.entries(value).map(([k, v]) => (
              <>
                {MakeView(k, path.concat("k" + k), false)} :
                {MakeView(v, path.concat("v" + k))}
              </>
            ))
          : escape
          ? JSON.stringify(value)
          : value}
      </div>
    );
  };
  return MakeView(value, []);
}

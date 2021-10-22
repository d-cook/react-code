import { ReactElement } from "react";
import ListView from "./ListView";
import RecordView from "./RecordView";
import ValueView from "./ValueView";
import { View, ViewInputs } from "./View";

export default function DynamicView({
  initValue,
  onValueUpdated
}: ViewInputs): ReactElement {
  const SomeView: View = Array.isArray(initValue)
    ? ListView
    : initValue && typeof initValue === "object"
    ? RecordView
    : ValueView;
  return <SomeView initValue={initValue} onValueUpdated={onValueUpdated} />;
}

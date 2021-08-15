import ListView from "./ListView";
import RecordView from "./RecordView";
import ValueView from "./ValueView";

export default function DynamicView({ initValue, onValueUpdated }) {
  const SomeView = Array.isArray(initValue)
    ? ListView
    : initValue && typeof initValue === "object"
    ? RecordView
    : ValueView;
  return <SomeView initValue={initValue} onValueUpdated={onValueUpdated} />;
}

import { ReactElement } from "react";

type ViewInputs = {
  initValue: any;
  onValueUpdated?: (value: any) => void;
};

type View = (inputs: ViewInputs) => ReactElement;

export { ViewInputs, View };

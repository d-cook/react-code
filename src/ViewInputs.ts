import { ReactElement } from "react";

type Key = string | number;
type ViewInputs = {
  value: any;
  onValueClicked: (path: Key[], val: any) => void;
  nestedViews: {
    matches: (val: any) => boolean;
    makeView: (ViewInputs) => ReactElement;
  }[];
};

export { Key, ViewInputs };

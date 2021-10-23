// Each Function is created within some execution Context.
// Each Context is created as a result of calling some Func.

type Context = {
  argVals: any[];
  values: any[];
  source: Func;
};

type Func = {
  context: Context | null;
  argNames: string[];
  code: Expression[];
};

type Expression = ValueExpr | Operation;
type ValueExpr = { label: string; value: any };
type Operation = { label: string; op: ValueRef; args: ValueRef[] };

type ValueRef = LookupValue | InlineValue;
type LookupValue = [contextIndex: number, valueIndex: number];
type InlineValue = [contextIndex: -1, value: any];

export {
  Context,
  Func,
  Expression,
  ValueExpr,
  Operation,
  CodeRef,
  LookupValue,
  InlineValue
};

type Context = {
  context: Context | null;
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
type Operation = { label: string; op: CodeRef; args: CodeRef[] };

type CodeRef = ValRef | ArgRef | InlineVal;
type ValRef = [ContextIndex, ValueIndex];
type ArgRef = [IndexForArgs, ValueIndex];
type InlineVal = [IndexForValue, any];

type ContextIndex = number; // positive integer
type ValueIndex = number;
type IndexForArgs = -1;
type IndexForValue = 0;

export {
  Context,
  Func,
  Expression,
  ValueExpr,
  Operation,
  CodeRef,
  ValRef,
  ArgRef,
  ValueRef
};

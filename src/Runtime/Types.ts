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
type ValueExpr = { label: string, value: any };
type Operation = { label: string, op: [CodeRef, ...CodeRef[]] };
type CodeRef = ValRef | ArgRef | ValueRef;
type ValRef = [contextIndex: number, valIndex: number];
type ArgRef = [-1, number]; // argument number
type ValueRef = [0, any]; // an immediate value

export {
  Context,
  Func,
  Expression,
  ValueExpr,
  Operation,
  CodeRef,
  ValRef,
  ArgRef,
  ValueRef,
}
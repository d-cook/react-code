type Context = {
  context: Context | null;
  argVals: any[];
  values: any[];
  source: Func;
};

type Func = {
  context: Context | null;
  argNames: string[];
  varNames: Record<string, number>; // name : context.values index
  code: Expression[];
};

type Expression = InlineValue | Operation;
type Operation = [CodeRef, ...CodeRef[]];
type CodeRef = ValRef | ArgRef | InlineValue;
type ValRef = [contextIndex: number, valIndex: number];
type ArgRef = [-1, number]; // argument number
type InlineValue = [0, any]; // the immediate value

export {
  Context,
  Func,
  Expression,
  Operation,
  CodeRef,
  ValRef,
  ArgRef,
  InlineValue,
}
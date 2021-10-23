import {
  CodeRef,
  Context,
  Expression,
  Func,
  Operation,
  ValueExpr
} from "./Types";
import Operations from "./Operations";

function Lookup(context: Context, [index, val]: CodeRef): any {
  if (index === 0) return val;
  if (index === 1) return context.values[val];
  if (index < 0) return context.argVals[val];
  if (context.context === null) return null;
  return Lookup(context.context, [index - 1, val]);
}

function Eval(context: Context, expr: Expression): any {
  const op = (expr as Operation).op;
  if (!op) return (expr as ValueExpr).value;
  const [func, ...args] = op.map((ref) => Lookup(context, ref));
  /* eslint-disable @typescript-eslint/no-use-before-define */
  return Apply(context, func, args);
}

function EvalFunc(
  context: Context | null,
  func: Func,
  argVals: any[]
): Context {
  const values: any[] = [];
  const newContext = { context, source: func, argVals, values };
  func.code.forEach((expr, i) => {
    values[i] = Eval(newContext, expr);
  });
  return newContext;
}

function Apply(context: Context, func: any, argVals: any[]): any {
  if (typeof func === "function") {
    try {
      return func.apply(context, argVals);
    } catch {
      return null;
    }
  }
  const ctx = EvalFunc(func.context || context, func, argVals);
  const vals = ctx.values;
  return vals.length > 0 ? vals[vals.length - 1] : null;
}

// Func that will "create" entire runtime from inline values
const Bootstrap: Func = {
  context: null,
  argNames: [],
  code: []
};

// Code EVERY function in the runtime as inline values:
Bootstrap.code = Object.entries({
  Lookup,
  Apply,
  Eval,
  EvalFunc,
  Bootstrap,
  ...Operations
}).map(([label, value]) => ({ label, value }));

const RootContext = EvalFunc(null, Bootstrap, []);

// Default the context of runtime Funcs to RootContext:
Bootstrap.code
  .map(({ value }: ValueExpr) => value)
  .filter((v: Func) => v && v.code && !v.context)
  .forEach((v: Func) => (v.context = RootContext));

export { Eval, EvalFunc, Apply, RootContext };

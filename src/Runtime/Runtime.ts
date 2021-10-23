import {
  CodeRef,
  Context,
  Expression,
  Func,
  Operation,
  ValueExpr
} from "./Types";
import Operations from "./Operations";

function Lookup(context: Context, [ctxIdx, val]: CodeRef): any {
  if (ctxIdx < 0) return val;
  if (ctxIdx < 1) {
    return val < 0 ? context.argVals[-val - 1] : context.values[val];
  }
  const sc = context.source.context;
  if (sc === null || !(ctxIdx > 0)) return null;
  return Lookup(sc, [ctxIdx - 1, val]);
}

function Eval(context: Context, expr: Expression): any {
  const { op, args } = expr as Operation;
  if (!op) return (expr as ValueExpr).value;
  const func = Lookup(context, op);
  const argVals = args.map((ref) => Lookup(context, ref));
  /* eslint-disable @typescript-eslint/no-use-before-define */
  return Apply(context, func, argVals);
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

// Func to "create" the entire runtime from inline values:
const Bootstrap: Func = {
  context: null,
  argNames: [],
  code: []
};
Bootstrap.code = Object.entries({
  Lookup,
  Apply,
  Eval,
  EvalFunc,
  Bootstrap,
  ...Operations
}).map(([label, value]) => ({ label, value }));

// "Root" execution context of the runtime:
const RootContext = EvalFunc(null, Bootstrap, []);
RootContext.values
  .filter((v: Func) => v && v.code && !v.context)
  .forEach((v: Func) => (v.context = RootContext));

export { Eval, EvalFunc, Apply, RootContext };

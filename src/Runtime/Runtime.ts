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
    return val < 0
      ? context.argVals[-val - 1]
      : val > 0
      ? context.values[+val - 1]
      : context; // Bad idea? return null instead?
  }
  const sc = context.source.context;
  if (sc === null || !(ctxIdx > 0)) return null;
  return Lookup(sc, [ctxIdx - 1, val]);
}

/* eslint-disable @typescript-eslint/no-use-before-define */
function Apply(context: Context, func: Func | Function, argVals: any[]): any {
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

function Eval(context: Context, expr: Expression): any {
  const { op, args } = expr as Operation;
  if (!op) return (expr as ValueExpr).value;
  const func = Lookup(context, op);
  const argVals = args.map((ref) => Lookup(context, ref));
  return Apply(context, func, argVals);
}

function EvalFunc(
  context: Context | null,
  func: Func,
  argVals: any[]
): Context {
  const values: any[] = [];
  const newContext = { context, source: func, argVals, values };
  // Can't use map: each value needs access to the prev ones
  func.code.forEach((expr, i) => {
    values[i] = Eval(newContext, expr);
  });
  return newContext;
}

// Create a Func that "creates" the entire runtime...
const Bootstrap: Func = {
  context: null,
  argNames: [],
  code: []
};
// ...from a bunch of inline-value expressions:
Bootstrap.code = Object.entries({
  Lookup,
  Apply,
  Eval,
  EvalFunc,
  Bootstrap,
  ...Operations
}).map(([label, value]) => ({ label, value }));

// Evaluate the Bootstrap to "create" the runtime,
// and capture result as the "Root" execution context:
const RootContext = EvalFunc(null, Bootstrap, []);

// Update all runtime Funcs to execute in Root Context:
RootContext.values
  .filter((v: Func) => v && v.code && !v.context)
  .forEach((v: Func) => (v.context = RootContext));

// The runtime has now effectively "created itself":
// * RootContext.source === Bootstrap, which *did* create it.
// * Bootstrap.context === RootContext, which it *does* run in.

export { Eval, EvalFunc, Apply, RootContext };

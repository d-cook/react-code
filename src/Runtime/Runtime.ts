import { CodeRef, Context, Expression, Func, InlineValue } from "./Types";
import Operations from "./Operations";

function Lookup(context: Context, [index, val]: CodeRef): any {
  if (index === 0) return val;
  if (index === 1) return context.values[val];
  if (index < 0) return context.argVals[val];
  if (context.context === null) return null;
  return Lookup(context.context, [index - 1, val]);
}

function Eval(context: Context, expr: Expression): any {
  if (expr[0] === 0) return expr[1];
  const [func, ...args] = expr.map((ref) => Lookup(context, ref));
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
  varNames: {},
  code: []
};

// EVERY function in the runtime, as [name, value] entries:
const _runtime = Object.entries({
  Lookup,
  Apply,
  Eval,
  EvalFunc,
  Bootstrap,
  ...Operations
} as Record<string, Func | Function>);

Bootstrap.varNames = Object.fromEntries(_runtime.map(([k], i) => [k, i]));
Bootstrap.code = _runtime.map(([k, v]) => [0, v] as InlineValue);
const RootContext = EvalFunc(null, Bootstrap, []);

_runtime.forEach(([k, v]) => {
  if (typeof v !== "function" && !v.context) {
    v.context = RootContext;
  }
});

export { Eval, EvalFunc, Apply, RootContext };

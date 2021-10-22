import { CodeRef, Context, Expression, Func, InlineValue } from "./Types";
import Ops from "./Operations";

const Lookup = (context: Context, [index, val]: CodeRef): any => {
  if (index === 0) return val;
  if (index === 1) return context.values[val];
  if (index < 0) return context.argVals[val];
  if (context.context === null) return null;
  return Lookup(context.context, [index - 1, val]);
};

const Eval = (context: Context, expr: Expression) => {
  if (expr[0] === 0) return expr[1];
  const [func, ...args] = expr.map((ref) => Lookup(context, ref));
  /* eslint-disable @typescript-eslint/no-use-before-define */
  return Apply(context, func, args);
};

const EvalFunc = (
  context: Context | null,
  func: Func,
  argVals: any[]
): Context => {
  const values: any[] = [];
  const newContext = { context, source: func, argVals, values };
  func.code.forEach((expr, i) => {
    values[i] = Eval(newContext, expr);
  });
  return newContext;
};

const Apply = (context: Context, func: any, args: any[]): any => {
  if (Ops.IsRecord(func)) {
    const ctx = EvalFunc(func.context || context, func, args);
    const vals = ctx.values;
    return vals.length > 0 ? vals[vals.length - 1] : null;
  }
  if (Ops.IsNative(func)) {
    try {
      return (func as Function).apply(null, args);
    } catch {}
  }
  return null;
};

// Func that will "create" entire runtime from inline values
const Bootstrap: Func = {
  context: null,
  argNames: [],
  varNames: {},
  code: []
};

// EVERY function in the runtime, as [name, value] entries:
const _runtime = Object.entries({
  ...Ops,
  Lookup,
  Apply,
  Eval,
  EvalFunc,
  Bootstrap
});

Bootstrap.varNames = Object.fromEntries(_runtime.map(([k], i) => [k, i]));
Bootstrap.code = _runtime.map(([k, v]) => [0, v] as InlineValue);
Bootstrap.context = EvalFunc(null, Bootstrap, []);

const RootContext = Bootstrap.context;

export { Eval, EvalFunc, Apply, RootContext };

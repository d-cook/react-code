const IsNone = (val: any) => val === null || val === void 0 || isNaN(val);
const IsBool = (val: any) => typeof val === "boolean";
const IsList = (val: any) => Array.isArray(val);
const IsNumber = (val: any) => typeof val === "number";
const IsString = (val: any) => typeof val === "string";
const IsRecord = (val: any) =>
  typeof val === "object" && val !== null && !IsList(val);
const IsNative = (val: any) => typeof val === "function";

const Not = (val: any) => val === false || IsNone(val);
const IsTrue = (val: any) => !Not(val);

const TypeOf = (val: any) => {
  if (IsNone(val)) return "None";
  if (IsList(val)) return "List";
  if (IsBool(val)) return "Bool";
  if (IsString(val)) return "String";
  if (IsNumber(val)) return "Number";
  if (IsRecord(val)) return "Record";
  if (IsNative(val)) return "Native";
  return "None";
};

const CanKey = (obj: any, key: any) =>
  (IsRecord(obj) && IsString(key)) || (IsList(obj) && IsNumber(key));

const Has = (obj: any, key: any) =>
  CanKey(obj, key) && Object.hasOwnProperty.call(obj, key);
const Get = (obj: any, ...keys: any[]) =>
  keys.length > 0
    ? keys.reduce((o, k) => (CanKey(o, k) ? o[k] : null), obj)
    : null;
const Set = (obj: any, key: any, val: any) =>
  CanKey(obj, key) ? (obj[key] = val) : null;

const Length = (obj: any) =>
  IsList(obj) || IsString(obj)
    ? obj.length
    : IsRecord(obj)
    ? Object.keys(obj).length
    : null;

const And = (a: any, ...b: any[]) => b.reduce((res, v) => res && v, a);
const Or = (a: any, ...b: any[]) => b.reduce((res, v) => res || v, a);

const _ops = {
  "+": (a: any, ...b: any[]) => b.reduce((res, v) => res + v, a),
  "-": (a: any, ...b: any[]) => b.reduce((res, v) => res - v, a),
  "*": (a: any, ...b: any[]) => b.reduce((res, v) => res * v, a),
  "/": (a: any, ...b: any[]) => b.reduce((res, v) => res / v, a),
  "%": (a: any, ...b: any[]) => b.reduce((res, v) => res % v, a),
  "<": (a: any, ...b: any[]) => b.every((v) => v < a),
  ">": (a: any, ...b: any[]) => b.every((v) => v > a),
  "=": (a: any, ...b: any[]) => b.every((v) => v === a),
  "<=": (a: any, ...b: any[]) => b.every((v) => v <= a),
  ">=": (a: any, ...b: any[]) => b.every((v) => v >= a),
  "!=": (a: any, ...b: any[]) => b.every((v) => v !== a)
};

export default {
  IsNone,
  IsBool,
  IsList,
  IsNumber,
  IsString,
  IsRecord,
  IsNative,
  Not,
  IsTrue,
  TypeOf,
  Has,
  Get,
  Set,
  Length,
  And,
  Or,
  ..._ops
};

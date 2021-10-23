import { Apply } from "./Runtime";
import { Context } from "./Types";

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

// Container operations:

const Length = (obj: any) =>
  IsList(obj) || IsString(obj)
    ? obj.length
    : IsRecord(obj)
    ? Object.keys(obj).length
    : null;

const IsEmpty = (obj: any) => Length(obj) === 0;
const NonEmpty = (obj: any) => Length(obj) > 0;

const AsList = (obj: any): any[] =>
  IsList(obj)
    ? obj
    : IsString(obj)
    ? obj.split("")
    : IsRecord(obj)
    ? Object.entries(obj)
    : [];

// String operations:

const Substr = (str: any, ...args: any[]) =>
  IsString(str) ? str.substring(...args) : null;

const Split = (str: any, ...args: any[]) =>
  IsString(str) ? str.split(...args) : null;

const IndexOf = (str: any, val: any) =>
  IsString(str) ? str.indexOf(val) : AsList(str).indexOf(val);

// List operations:

const Slice = (list: any, ...args: any[]): any[] => AsList(list).slice(...args);
const Append = (list: any, ...args: any[]): any[] => AsList(list).concat(args);
const Concat = (list: any, ...args: any[]): any[] =>
  AsList(list).concat(...args);

function Map(this: Context, list: any, func: any): any[] {
  return AsList(list).map((...args: any[]) => Apply(this, func, args));
}

function Filter(this: Context, list: any, func: any): any[] {
  return AsList(list).filter((...args: any[]) => Apply(this, func, args));
}

function Reduce(this: Context, list: any, func: any): any[] {
  return AsList(list).reduce((...args: any[]) => Apply(this, func, args));
}

function Any(this: Context, list: any, func: any): boolean {
  return AsList(list).some((...args: any[]) => Apply(this, func, args));
}

function All(this: Context, list: any, func: any): boolean {
  return AsList(list).every((...args: any[]) => Apply(this, func, args));
}

function Find(this: Context, list: any, func: any): any {
  return AsList(list).find((...args: any[]) => Apply(this, func, args));
}

function FindIndex(this: Context, list: any, func: any): number {
  return AsList(list).findIndex((...args: any[]) => Apply(this, func, args));
}

function ForEach(this: Context, list: any, func: any): any {
  const values = Map.call(this, list, func);
  return values.length > 0 ? values[values.length - 1] : null;
}

// Record operations:

const HasKey = (obj: any, key: any) =>
  IsRecord(obj)
    ? Object.hasOwnProperty.call(obj, key)
    : AsList(obj).length > key;

const Get = (obj: any, ...keys: any[]) =>
  keys.length > 0
    ? keys.reduce((o, k) => {
        return IsRecord(o) && IsString(k)
          ? o[k]
          : IsNumber(k)
          ? AsList(o)[k]
          : null;
      }, obj)
    : null;

const Set = (obj: any, key: any, val: any) =>
  IsRecord(obj) && IsString(key)
    ? (obj[key] = val)
    : IsNumber(key)
    ? (AsList(obj)[key] = val)
    : null;

// Other operations:

function If(this: Context, condition: any, T: any, F: any): any {
  return Apply(this, IsTrue(condition) ? T : F, []);
}

function And(this: Context, val: any, ...otherVals: any[]): boolean {
  if (Not(val)) return false;
  if (otherVals.length < 1) return true;
  const [next, ...rest] = otherVals;
  return And.call(this, Apply(this, next, []), ...rest);
}

function Or(this: Context, val: any, ...otherVals: any[]): boolean {
  if (IsTrue(val)) return true;
  if (otherVals.length < 1) return false;
  const [next, ...rest] = otherVals;
  return Or.call(this, Apply(this, next, []), ...rest);
}

const _operators = {
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
  HasKey,
  Get,
  Set,
  Length,
  IsEmpty,
  NonEmpty,
  AsList,
  Substr,
  Split,
  IndexOf,
  Slice,
  Append,
  Concat,
  Map,
  Filter,
  Reduce,
  Any,
  All,
  Find,
  FindIndex,
  ForEach,
  If,
  And,
  Or,
  ..._operators
};

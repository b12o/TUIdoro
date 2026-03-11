import { expect, test, describe } from "bun:test";
import {
  getSeconds,
  validateWorkInterval,
  validateBreakInterval,
  validateHex,
} from "./utils.js";

describe("convert to seconds", () => {
  test("25 minutes", () => {
    expect(getSeconds(25)).toBe(1500);
  });

  test("5 minutes", () => {
    expect(getSeconds(5)).toBe(300);
  });
});

describe("validate interval", () => {
  test("work: 0 not allowed", () => {
    expect(validateWorkInterval(0)).toBe(false);
  });
  test("work: >= 60 not allowed", () => {
    expect(validateWorkInterval(60)).toBe(false);
  });
  test("work: 0 < x < 60 allowed", () => {
    expect(validateWorkInterval(59)).toBe(true);
  });
  test("break: 0 not allowed", () => {
    expect(validateBreakInterval(0)).toBe(false);
  });
  test("break: >= 60 not allowed", () => {
    expect(validateBreakInterval(60)).toBe(false);
  });
  test("break: 0 < x < 60 allowed", () => {
    expect(validateBreakInterval(59)).toBe(true);
  });
});

describe("validate hex code", () => {
  test("empty", () => {
    expect(validateHex("")).toBe(false);
  });
  test("no hash", () => {
    expect(validateHex("123456")).toBe(false);
  });
  test("too long", () => {
    expect(validateHex("#1234567")).toBe(false);
  });
  test("code not of len 3 or 6", () => {
    expect(validateHex("#1234")).toBe(false);
  });
});

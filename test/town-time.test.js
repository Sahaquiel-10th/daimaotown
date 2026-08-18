import test from "node:test";
import assert from "node:assert/strict";
import { townTimePhase } from "../src/town-time.js";

test("北京时间上午九点显示白天", () => {
  assert.equal(townTimePhase(new Date("2026-08-18T01:00:00.000Z")), "day");
});

test("北京时间凌晨两点只进入凌晨模式", () => {
  assert.equal(townTimePhase(new Date("2026-08-17T18:00:00.000Z")), "late-night");
});

const test = require("flug");
const { genVarNames } = require("./var-names");

test("first 5", ({ eq }) => {
  const vars = Array.from(genVarNames({ max_count: 5 }));
  eq(vars, ["A", "B", "C", "D", "E"]);
});

test("excluding reserved words", ({ eq }) => {
  const vars = Array.from(genVarNames({ max_count: 10_000 }));
  eq(vars.includes("ie"), true);
  eq(vars.includes("if"), false);
  eq(vars.includes("ig"), true);
});

test("setting max count", ({ eq }) => {
  const vars = Array.from(genVarNames({ max_count: 123 }));
  eq(vars.length, 123);
});

test("for or loop", ({ eq }) => {
  const gen = genVarNames();
  let count = 0;
  const results = [];
  for (const varname of gen) {
    count++;
    if (count > 1e4) results.push(varname);
    if (results.length >= 3) break;
  }
  eq(results, ["CmT", "CmU", "CmV"]);
});

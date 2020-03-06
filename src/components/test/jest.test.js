import { add, total } from "./jest";
console.log(add(1, 2));

test("<Add>", () => {
  const value = add(1, 2);
  expect(value).toBe(3);
});

test("<total>", () => {
  expect(total(2, 5)).toBe("$7");
});

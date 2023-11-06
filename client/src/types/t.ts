const a = { b: 1, c: 2 };
const am = new Map();
am.set('bm', 1);
am.set('cm', 2);
console.log(Array.from(am.entries()), Object.entries(a));

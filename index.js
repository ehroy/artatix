const readlineSync = require("readline-sync");
(async () => {
  console.log(`
=============================================================
======================== SHEILA ON 7 ========================
=============================================================


1. 1 tiket 1 data
2. 2 tiket 1 data
3. 3 tiket 1 data
4. 4 tiket 1 data
5. 5 tiket 1 data
6. bug\n`);
  const input = readlineSync.question("Pilih : ");
  switch (input) {
    case "1":
      require("./1");
      break;
    case "2":
      require("./2");
      break;
    case "3":
      require("./3");
      break;
    case "4":
      require("./4");
      break;
    case "5":
      require("./5");
      break;
    case "6":
      require("./bug");
      break;
    default:
      break;
  }
})();

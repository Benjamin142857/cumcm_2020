const fs = require("fs");

function importCompanyData() {
  fs.readFile('123.csv', function (err, data) {
    if (err) {
      console.log(err.stack);
      return;
    }
    console.log(data);
  });
}

importCompanyData();
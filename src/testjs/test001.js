function modelLossClientProbability (compType) {
  switch (compType) {
    case 'A':
      console.log(111);
      break;
      // return -76.41*(interestRate**2) + 21.984*interestRate - 0.6971;
    case 'B':
      console.log(222);
      break;
      // return -67.933*(interestRate**2) + 20.207*interestRate - 0.6504;
    case 'C':
      console.log(333);
      break;
      // return -63.942*(interestRate**2) + 19.569*interestRate - 0.6393;
  }
}

console.log(modelLossClientProbability('A'));


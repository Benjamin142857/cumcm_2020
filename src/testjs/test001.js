function modelLossClientProbability (compType, interestRate) {
  switch (compType) {
    case 'A':
      return -76.41*(interestRate**2) + 21.984*interestRate - 0.6971;
    case 'B':
      return -67.933*(interestRate**2) + 20.207*interestRate - 0.6504;
    case 'C':
      return -63.942*(interestRate**2) + 19.569*interestRate - 0.6393;
  }
}

console.log(modelLossClientProbability('A', 0.15));


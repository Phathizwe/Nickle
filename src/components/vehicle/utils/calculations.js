export const calculateMonthlyRepayment = (price, deposit, interestRate, term, balloonPayment) => {
    if (!price || !interestRate) return 0;
    const principal = price - parseFloat(deposit || 0);
    const monthlyRate = parseFloat(interestRate) / 100 / 12;
    const numberOfPayments = parseFloat(term);
    const balloon = (parseFloat(balloonPayment) / 100) * price;
  
    if (monthlyRate === 0) {
      return (principal - balloon) / numberOfPayments;
    }
  
    const monthlyPayment = (principal - (balloon / Math.pow(1 + monthlyRate, numberOfPayments))) *
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    return monthlyPayment;
  };
  
  export const calculateAffordablePrice = (params) => {
    const {
      netSalary,
      budgetPercentage,
      monthlyExpenses,
      deposit,
      term,
      interestRate,
      balloonPayment,
    } = params;
  
    const targetTotalMonthly = (parseFloat(netSalary) * (budgetPercentage / 100));
    const availableForRepayment = targetTotalMonthly - monthlyExpenses;
  
    let low = 0;
    let high = 10000000;
    let bestPrice = 0;
    let iterations = 0;
    const maxIterations = 50;
    const tolerance = 1;
  
    while (low <= high && iterations < maxIterations) {
      const mid = (low + high) / 2;
      const monthlyRepayment = calculateMonthlyRepayment(mid, deposit, interestRate, term, balloonPayment);
  
      if (Math.abs(monthlyRepayment - availableForRepayment) < tolerance) {
        bestPrice = mid;
        break;
      }
  
      if (monthlyRepayment < availableForRepayment) {
        low = mid + tolerance;
        bestPrice = mid;
      } else {
        high = mid - tolerance;
      }
  
      iterations++;
    }
  
    return Math.max(bestPrice, 0);
  };
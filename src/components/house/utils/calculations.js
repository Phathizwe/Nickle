import { TRANSFER_DUTY_BRACKETS } from '../constants/house-defaults';

export const calculateTransferDuty = (price) => {
  const numericPrice = Math.max(0, Number(price));
  const bracket = TRANSFER_DUTY_BRACKETS.find(
    bracket => numericPrice > bracket.min && numericPrice <= bracket.max
  );
  if (!bracket) return 0;
  return bracket.base + (numericPrice - bracket.min) * bracket.rate;
};

export const calculateMonthlyRepayment = (loanAmount, years, yearlyInterestRate) => {
  const monthlyRate = yearlyInterestRate / 12 / 100;
  const numberOfPayments = years * 12;
  return loanAmount * 
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
};
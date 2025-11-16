import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Nickle logo as base64
const NICKLE_LOGO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAAD6CAYAAACI7Fo9AAAACXBIWXMAAAdiAAAHYgE4epnbAAAEYGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSfvu78nIGlkPSdXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQnPz4KPHg6eG1wbWV0YSB4bWxuczp4PSdhZG9iZTpuczptZXRhLyc+CjxyZGY6UkRGIHhtbG5zOnJkZj0naHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyc+CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczpBdHRyaWI9J2h0dHA6Ly9ucy5hdHRyaWJ1dGlvbi5jb20vYWRzLzEuMC8nPgogIDxBdHRyaWI6QWRzPgogICA8cmRmOlNlcT4KICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0nUmVzb3VyY2UnPgogICAgIDxBdHRyaWI6Q3JlYXRlZD4yMDI1LTAxLTA5PC9BdHRyaWI6Q3JlYXRlZD4KICAgICA8QXR0cmliOkV4dElkPmFhYzdjNjA0LWI5YTItNGQ3ZC1iNmNmLWJkNWQyMjY3MWJjNjwvQXR0cmliOkV4dElkPgogICAgIDxBdHRyaWI6RmJJZD41MjUyNjU5MTQxNzk1ODA8L0F0dHJpYjpGYklkPgogICAgIDxBdHRyaWI6VG91Y2hUeXBlPjI8L0F0dHJpYjpUb3VjaFR5cGU+CiAgICA8L3JkZjpsaT4KICAgPC9yZGY6U2VxPgogIDwvQXR0cmliOkFkcz4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6ZGM9J2h0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvJz4KICA8ZGM6dGl0bGU+CiAgIDxyZGY6QWx0PgogICAgPHJkZjpsaSB4bWw6bGFuZz0neC1kZWZhdWx0Jz5VbnRpdGxlZCBkZXNpZ24gLSAxPC9yZGY6bGk+CiAgIDwvcmRmOkFsdD4KICA8L2RjOnRpdGxlPgogPC9yZGY6RGVzY3JpcHRpb24+CgogPHJkZjpEZXNjcmlwdGlv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';

const formatCurrency = (value) => {
  if (!value && value !== 0) return 'R 0';
  return 'R ' + Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export const exportCashflowToPDF = (netSalary, carBudget, houseBudget, customExpenses, savings, budgetMode = 'after', currentHousingCost = 0, currentTransportCost = 0) => {
  const doc = new jsPDF();
  
  // Logo
  try {
    doc.addImage(NICKLE_LOGO, 'PNG', 15, 10, 20, 20);
  } catch (e) {
    console.log('Logo not added');
  }
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  const modeText = budgetMode === 'after' ? 'AFTER Purchase' : 'BEFORE - Savings Plan';
  doc.text(`Cashflow Statement (${modeText})`, 105, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Generated by Nickle', 105, 27, { align: 'center' });
  doc.text(new Date().toLocaleDateString(), 105, 32, { align: 'center' });
  
  let yPos = 45;
  
  // INCOME Section
  doc.setFontSize(14);
  doc.setTextColor(34, 139, 34);
  doc.text('INCOME', 20, yPos);
  
  yPos += 5;
  doc.autoTable({
    startY: yPos,
    head: [['Category', 'Amount']],
    body: [
      ['Employment (Net)', formatCurrency(netSalary)]
    ],
    theme: 'grid',
    headStyles: { fillColor: [34, 139, 34] },
    margin: { left: 20, right: 20 },
  });
  
  yPos = doc.lastAutoTable.finalY + 2;
  doc.setFontSize(12);
  doc.setTextColor(34, 139, 34);
  doc.text(`Total Income: ${formatCurrency(netSalary)}`, 150, yPos, { align: 'right' });
  
  yPos += 10;
  
  // EXPENSES Section
  doc.setFontSize(14);
  doc.setTextColor(255, 140, 0);
  doc.text('EXPENSES', 20, yPos);
  
  yPos += 5;
  const expenseRows = [];
  
  if (budgetMode === 'after') {
    // AFTER mode: Show dream house and car expenses with breakdown
    // House breakdown
    if (houseBudget && houseBudget.breakdown) {
      expenseRows.push(['House', '']);
      expenseRows.push(['  Bond Repayment', formatCurrency(houseBudget.breakdown.bondRepayment)]);
      expenseRows.push(['  Rates & Taxes', formatCurrency(houseBudget.breakdown.rates)]);
      expenseRows.push(['  Home Insurance', formatCurrency(houseBudget.breakdown.insurance)]);
      expenseRows.push(['  Maintenance', formatCurrency(houseBudget.breakdown.maintenance)]);
    }
    
    // Car breakdown
    if (carBudget && carBudget.breakdown) {
      expenseRows.push(['Car', '']);
      expenseRows.push(['  Monthly Repayment', formatCurrency(carBudget.breakdown.repayment)]);
      expenseRows.push(['  Insurance', formatCurrency(carBudget.breakdown.insurance)]);
      expenseRows.push(['  Petrol', formatCurrency(carBudget.breakdown.petrol)]);
    }
  } else {
    // BEFORE mode: Show current costs only
    if (currentHousingCost > 0) {
      expenseRows.push(['Current Housing Costs', formatCurrency(currentHousingCost)]);
    }
    if (currentTransportCost > 0) {
      expenseRows.push(['Current Transport Costs', formatCurrency(currentTransportCost)]);
    }
  }
  
  // Custom expenses
  customExpenses.forEach(expense => {
    if (expense.amount > 0) {
      expenseRows.push([expense.name, formatCurrency(expense.amount)]);
    }
  });
  
  doc.autoTable({
    startY: yPos,
    head: [['Category', 'Amount']],
    body: expenseRows,
    theme: 'grid',
    headStyles: { fillColor: [255, 140, 0] },
    margin: { left: 20, right: 20 },
  });
  
  const totalExpenses = budgetMode === 'after'
    ? (houseBudget ? houseBudget.totalMonthlyCost : 0) +
      (carBudget ? carBudget.totalMonthlyCost : 0) +
      customExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0)
    : currentHousingCost + currentTransportCost +
      customExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  
  yPos = doc.lastAutoTable.finalY + 2;
  doc.setFontSize(12);
  doc.setTextColor(255, 140, 0);
  doc.text(`Total Expenses: ${formatCurrency(totalExpenses)}`, 150, yPos, { align: 'right' });
  
  yPos += 10;
  
  // SAVINGS Section
  doc.setFontSize(14);
  doc.setTextColor(147, 51, 234);
  doc.text('SAVINGS', 20, yPos);
  
  yPos += 5;
  const savingsRows = savings
    .filter(sav => sav.amount > 0)
    .map(sav => [sav.name, formatCurrency(sav.amount)]);
  
  // Add dream savings in BEFORE mode
  if (budgetMode === 'before') {
    const carSavingsGoalGross = carBudget ? netSalary * 0.30 : 0;
    const houseSavingsGoalGross = houseBudget ? netSalary * 0.30 : 0;
    const carSavingsGoal = Math.max(0, carSavingsGoalGross - currentTransportCost);
    const houseSavingsGoal = Math.max(0, houseSavingsGoalGross - currentHousingCost);
    
    if (houseSavingsGoal > 0) {
      savingsRows.push(['Dream House Savings', formatCurrency(houseSavingsGoal)]);
      savingsRows.push(['  (30% budget - current housing)', '']);
    }
    if (carSavingsGoal > 0) {
      savingsRows.push(['Dream Car Savings', formatCurrency(carSavingsGoal)]);
      savingsRows.push(['  (30% budget - current transport)', '']);
    }
  }
  
  if (savingsRows.length > 0) {
    doc.autoTable({
      startY: yPos,
      head: [['Category', 'Amount']],
      body: savingsRows,
      theme: 'grid',
      headStyles: { fillColor: [147, 51, 234] },
      margin: { left: 20, right: 20 },
    });
    
    yPos = doc.lastAutoTable.finalY + 2;
  }
  
  const regularSavings = savings.reduce((sum, sav) => sum + (sav.amount || 0), 0);
  const carSavingsGoalGross = (budgetMode === 'before' && carBudget) ? netSalary * 0.30 : 0;
  const houseSavingsGoalGross = (budgetMode === 'before' && houseBudget) ? netSalary * 0.30 : 0;
  const carSavingsGoal = Math.max(0, carSavingsGoalGross - currentTransportCost);
  const houseSavingsGoal = Math.max(0, houseSavingsGoalGross - currentHousingCost);
  const totalSavings = regularSavings + carSavingsGoal + houseSavingsGoal;
  doc.setFontSize(12);
  doc.setTextColor(147, 51, 234);
  doc.text(`Total Savings: ${formatCurrency(totalSavings)}`, 150, yPos, { align: 'right' });
  
  yPos += 15;
  
  // NET CASHFLOW
  const netCashflow = netSalary - totalExpenses - totalSavings;
  doc.setFontSize(16);
  doc.setTextColor(netCashflow >= 0 ? 34 : 220, netCashflow >= 0 ? 139 : 38, netCashflow >= 0 ? 34 : 38);
  doc.text(`NET CASHFLOW: ${formatCurrency(Math.abs(netCashflow))}`, 105, yPos, { align: 'center' });
  
  if (netCashflow < 0) {
    doc.setFontSize(10);
    doc.setTextColor(220, 38, 38);
    doc.text('⚠ Overspending - Reduce expenses or increase income', 105, yPos + 7, { align: 'center' });
  }
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Generated by Nickle - Smart Budgets Meet Big Ambitions', 105, 285, { align: 'center' });
  doc.text('www.nickle.co.za', 105, 290, { align: 'center' });
  
  // Save
  doc.save('Nickle-Cashflow-Statement.pdf');
};

export const exportCarCalculatorToPDF = (netSalary, results, inputs) => {
  const doc = new jsPDF();
  
  // Logo
  try {
    doc.addImage(NICKLE_LOGO, 'PNG', 15, 10, 20, 20);
  } catch (e) {
    console.log('Logo not added');
  }
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235);
  doc.text('Car Affordability Calculator', 105, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Generated by Nickle', 105, 27, { align: 'center' });
  doc.text(new Date().toLocaleDateString(), 105, 32, { align: 'center' });
  
  let yPos = 50;
  
  // Summary Box
  doc.setFillColor(239, 246, 255);
  doc.rect(20, yPos - 5, 170, 30, 'F');
  
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text('You can afford a car worth', 105, yPos, { align: 'center' });
  
  doc.setFontSize(24);
  doc.setTextColor(37, 99, 235);
  doc.text(formatCurrency(results.affordableCarPrice), 105, yPos + 12, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(34, 139, 34);
  doc.text('✓ Within Budget', 105, yPos + 20, { align: 'center' });
  
  yPos += 40;
  
  // Monthly Costs
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text('Monthly Costs', 20, yPos);
  
  yPos += 5;
  doc.autoTable({
    startY: yPos,
    head: [['Item', 'Amount']],
    body: [
      ['Monthly Repayment', formatCurrency(results.breakdown.repayment)],
      ['Insurance', formatCurrency(results.breakdown.insurance)],
      ['Petrol', formatCurrency(results.breakdown.petrol)],
      ['Total Monthly Cost', formatCurrency(results.totalMonthlyCost)]
    ],
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235] },
    margin: { left: 20, right: 20 },
  });
  
  yPos = doc.lastAutoTable.finalY + 15;
  
  // Loan Details
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text('Loan Details', 20, yPos);
  
  yPos += 5;
  doc.autoTable({
    startY: yPos,
    head: [['Parameter', 'Value']],
    body: [
      ['Monthly Salary', formatCurrency(netSalary)],
      ['Budget for Car', `${inputs.budgetPercentage}%`],
      ['Deposit', formatCurrency(inputs.deposit)],
      ['Loan Term', `${inputs.term} months`],
      ['Interest Rate', `${inputs.interestRate}%`]
    ],
    theme: 'grid',
    headStyles: { fillColor: [100, 100, 100] },
    margin: { left: 20, right: 20 },
  });
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Generated by Nickle - Smart Budgets Meet Big Ambitions', 105, 285, { align: 'center' });
  doc.text('www.nickle.co.za', 105, 290, { align: 'center' });
  
  doc.save('Nickle-Car-Calculator.pdf');
};

export const exportHouseCalculatorToPDF = (netSalary, results, inputs) => {
  const doc = new jsPDF();
  
  // Logo
  try {
    doc.addImage(NICKLE_LOGO, 'PNG', 15, 10, 20, 20);
  } catch (e) {
    console.log('Logo not added');
  }
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(34, 139, 34);
  doc.text('Home Affordability Calculator', 105, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Generated by Nickle', 105, 27, { align: 'center' });
  doc.text(new Date().toLocaleDateString(), 105, 32, { align: 'center' });
  
  let yPos = 50;
  
  // Summary Box
  doc.setFillColor(240, 253, 244);
  doc.rect(20, yPos - 5, 170, 30, 'F');
  
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text('You can afford a home worth', 105, yPos, { align: 'center' });
  
  doc.setFontSize(24);
  doc.setTextColor(34, 139, 34);
  doc.text(formatCurrency(results.affordableHousePrice), 105, yPos + 12, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(34, 139, 34);
  doc.text('✓ Within Budget', 105, yPos + 20, { align: 'center' });
  
  yPos += 40;
  
  // Monthly Costs
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text('Monthly Costs', 20, yPos);
  
  yPos += 5;
  doc.autoTable({
    startY: yPos,
    head: [['Item', 'Amount']],
    body: [
      ['Bond Repayment', formatCurrency(results.breakdown.bondRepayment)],
      ['Rates & Taxes', formatCurrency(results.breakdown.rates)],
      ['Home Insurance', formatCurrency(results.breakdown.insurance)],
      ['Maintenance', formatCurrency(results.breakdown.maintenance)],
      ['Total Monthly Cost', formatCurrency(results.totalMonthlyCost)]
    ],
    theme: 'grid',
    headStyles: { fillColor: [34, 139, 34] },
    margin: { left: 20, right: 20 },
  });
  
  yPos = doc.lastAutoTable.finalY + 15;
  
  // Upfront Costs
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text('Upfront Costs', 20, yPos);
  
  yPos += 5;
  doc.autoTable({
    startY: yPos,
    head: [['Item', 'Amount']],
    body: [
      ['Down Payment', formatCurrency(results.downPayment)],
      ['Transfer Duty', formatCurrency(results.transferDuty)],
      ['Bond Registration', formatCurrency(results.bondRegistration)],
      ['Bond Initiation', formatCurrency(results.bondInitiation)],
      ['Total Upfront', formatCurrency(results.totalUpfront)]
    ],
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235] },
    margin: { left: 20, right: 20 },
  });
  
  yPos = doc.lastAutoTable.finalY + 15;
  
  // Loan Details
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text('Loan Details', 20, yPos);
  
  yPos += 5;
  doc.autoTable({
    startY: yPos,
    head: [['Parameter', 'Value']],
    body: [
      ['Monthly Salary', formatCurrency(netSalary)],
      ['Budget for Housing', `${inputs.budgetPercentage}%`],
      ['Down Payment', `${inputs.downPaymentPercentage}%`],
      ['Loan Term', `${inputs.term / 12} years`],
      ['Interest Rate', `${inputs.interestRate}%`]
    ],
    theme: 'grid',
    headStyles: { fillColor: [100, 100, 100] },
    margin: { left: 20, right: 20 },
  });
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Generated by Nickle - Smart Budgets Meet Big Ambitions', 105, 285, { align: 'center' });
  doc.text('www.nickle.co.za', 105, 290, { align: 'center' });
  
  doc.save('Nickle-House-Calculator.pdf');
};


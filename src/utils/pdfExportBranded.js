import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Nickle logo as base64
const NICKLE_LOGO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAAD6CAYAAACI7Fo9AAAACXBIWXMAAAdiAAAHYgE4epnbAAAEYGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSfvu78nIGlkPSdXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQnPz4KPHg6eG1wbWV0YSB4bWxuczp4PSdhZG9iZTpuczptZXRhLyc+CjxyZGY6UkRGIHhtbG5zOnJkZj0naHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyc+CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczpBdHRyaWI9J2h0dHA6Ly9ucy5hdHRyaWJ1dGlvbi5jb20vYWRzLzEuMC8nPgogIDxBdHRyaWI6QWRzPgogICA8cmRmOlNlcT4KICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0nUmVzb3VyY2UnPgogICAgIDxBdHRyaWI6Q3JlYXRlZD4yMDI1LTAxLTA5PC9BdHRyaWI6Q3JlYXRlZD4KICAgICA8QXR0cmliOkV4dElkPmFhYzdjNjA0LWI5YTItNGQ3ZC1iNmNmLWJkNWQyMjY3MWJjNjwvQXR0cmliOkV4dElkPgogICAgIDxBdHRyaWI6RmJJZD41MjUyNjU5MTQxNzk1ODA8L0F0dHJpYjpGYklkPgogICAgIDxBdHRyaWI6VG91Y2hUeXBlPjI8L0F0dHJpYjpUb3VjaFR5cGU+CiAgICA8L3JkZjpsaT4KICAgPC9yZGY6U2VxPgogIDwvQXR0cmliOkFkcz4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6ZGM9J2h0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvJz4KICA8ZGM6dGl0bGU+CiAgIDxyZGY6QWx0PgogICAgPHJkZjpsaSB4bWw6bGFuZz0neC1kZWZhdWx0Jz5VbnRpdGxlZCBkZXNpZ24gLSAxPC9yZGY6bGk+CiAgIDwvcmRmOkFsdD4KICA8ZGM6dGl0bGU+CiA8L3JkZjpEZXNjcmlwdGlvbj4KCiA8cmRmOkRlc2NyaXB0aW9u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';

// Nickle Brand Colors
const COLORS = {
  green: [34, 197, 94],    // #22C55E - Primary
  blue: [59, 130, 246],     // #3B82F6
  orange: [249, 115, 22],   // #F97316
  purple: [168, 85, 247],   // #A855F7
  gray: [107, 114, 128],    // #6B7280
  darkGray: [31, 41, 55],   // #1F2937
  lightGray: [243, 244, 246], // #F3F4F6
};

const formatCurrency = (value) => {
  if (!value && value !== 0) return 'R 0';
  return 'R ' + Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

// Helper function to draw a rounded rectangle
const drawRoundedRect = (doc, x, y, width, height, fillColor) => {
  doc.setFillColor(...fillColor);
  doc.roundedRect(x, y, width, height, 2, 2, 'F');
};

// Helper function to draw a circle
const drawCircle = (doc, x, y, radius, fillColor) => {
  doc.setFillColor(...fillColor);
  doc.circle(x, y, radius, 'F');
};

export const exportCashflowWithTimelineToPDF = (netSalary, carBudget, houseBudget, customExpenses, savings, budgetMode = 'after', currentHousingCost = 0, currentTransportCost = 0) => {
  const doc = new jsPDF();
  
  // ============ PAGE 1: CASHFLOW STATEMENT ============
  
  // Header background
  drawRoundedRect(doc, 10, 10, 190, 30, COLORS.lightGray);
  
  // Logo
  try {
    doc.addImage(NICKLE_LOGO, 'PNG', 15, 13, 20, 20);
  } catch (e) {
    console.log('Logo not added:', e);
  }
  
  // Nickle branding text next to logo
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.green);
  doc.text('Nickle', 38, 22);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.gray);
  doc.text('Smart Budgets Meet Big Ambitions', 38, 28);
  
  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.darkGray);
  const modeText = budgetMode === 'after' ? 'AFTER Purchase' : 'BEFORE - Savings Plan';
  doc.text('Your Financial Snapshot', 105, 20, { align: 'center' });
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.gray);
  doc.text(modeText, 105, 27, { align: 'center' });
  
  // Date
  doc.setFontSize(8);
  doc.text(`Generated ${new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}`, 105, 35, { align: 'center' });
  
  let yPos = 50;
  
  // INCOME Section
  drawRoundedRect(doc, 15, yPos - 5, 180, 8, COLORS.green);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('INCOME', 20, yPos);
  
  yPos += 8;
  doc.autoTable({
    startY: yPos,
    head: [['Source', 'Monthly Amount']],
    body: [
      ['Net Salary', formatCurrency(netSalary)]
    ],
    theme: 'striped',
    headStyles: { 
      fillColor: COLORS.green,
      fontSize: 10,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 9
    },
    margin: { left: 20, right: 20 },
    alternateRowStyles: { fillColor: [240, 253, 244] }
  });
  
  yPos = doc.lastAutoTable.finalY + 3;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.green);
  doc.text(`Total Income: ${formatCurrency(netSalary)}`, 180, yPos, { align: 'right' });
  
  yPos += 12;
  
  // EXPENSES Section
  drawRoundedRect(doc, 15, yPos - 5, 180, 8, COLORS.orange);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('EXPENSES', 20, yPos);
  
  yPos += 8;
  const expenseRows = [];
  
  if (budgetMode === 'after') {
    if (houseBudget && houseBudget.breakdown) {
      expenseRows.push([{ content: 'House', styles: { fontStyle: 'bold' } }, '']);
      expenseRows.push(['  Bond Repayment', formatCurrency(houseBudget.breakdown.bondRepayment)]);
      expenseRows.push(['  Rates & Taxes', formatCurrency(houseBudget.breakdown.rates)]);
      expenseRows.push(['  Home Insurance', formatCurrency(houseBudget.breakdown.insurance)]);
      expenseRows.push(['  Maintenance', formatCurrency(houseBudget.breakdown.maintenance)]);
    }
    
    if (carBudget && carBudget.breakdown) {
      expenseRows.push([{ content: 'Car', styles: { fontStyle: 'bold' } }, '']);
      expenseRows.push(['  Monthly Repayment', formatCurrency(carBudget.breakdown.repayment)]);
      expenseRows.push(['  Insurance', formatCurrency(carBudget.breakdown.insurance)]);
      expenseRows.push(['  Petrol', formatCurrency(carBudget.breakdown.petrol)]);
    }
  } else {
    if (currentHousingCost > 0) {
      expenseRows.push(['Current Housing Costs', formatCurrency(currentHousingCost)]);
    }
    if (currentTransportCost > 0) {
      expenseRows.push(['Current Transport Costs', formatCurrency(currentTransportCost)]);
    }
  }
  
  customExpenses.forEach(expense => {
    if (expense.amount > 0) {
      expenseRows.push([expense.name, formatCurrency(expense.amount)]);
    }
  });
  
  doc.autoTable({
    startY: yPos,
    head: [['Category', 'Monthly Amount']],
    body: expenseRows,
    theme: 'striped',
    headStyles: { 
      fillColor: COLORS.orange,
      fontSize: 10,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 9
    },
    margin: { left: 20, right: 20 },
    alternateRowStyles: { fillColor: [255, 247, 237] }
  });
  
  const totalExpenses = budgetMode === 'after'
    ? (houseBudget ? houseBudget.totalMonthlyCost : 0) +
      (carBudget ? carBudget.totalMonthlyCost : 0) +
      customExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0)
    : currentHousingCost + currentTransportCost +
      customExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  
  yPos = doc.lastAutoTable.finalY + 3;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.orange);
  doc.text(`Total Expenses: ${formatCurrency(totalExpenses)}`, 180, yPos, { align: 'right' });
  
  yPos += 12;
  
  // SAVINGS Section
  drawRoundedRect(doc, 15, yPos - 5, 180, 8, COLORS.purple);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('SAVINGS', 20, yPos);
  
  yPos += 8;
  const savingsRows = savings
    .filter(sav => sav.amount > 0)
    .map(sav => [sav.name, formatCurrency(sav.amount)]);
  
  // Calculate dream savings
  const carSavingsGoalGross = (budgetMode === 'before' && carBudget) ? netSalary * 0.30 : 0;
  const houseSavingsGoalGross = (budgetMode === 'before' && houseBudget) ? netSalary * 0.30 : 0;
  const carSavingsGoal = Math.max(0, carSavingsGoalGross - currentTransportCost);
  const houseSavingsGoal = Math.max(0, houseSavingsGoalGross - currentHousingCost);
  
  if (budgetMode === 'before') {
    if (houseSavingsGoal > 0) {
      savingsRows.push([{ content: 'Dream House Savings', styles: { fontStyle: 'bold', fillColor: [220, 252, 231] } }, formatCurrency(houseSavingsGoal)]);
    }
    if (carSavingsGoal > 0) {
      savingsRows.push([{ content: 'Dream Car Savings', styles: { fontStyle: 'bold', fillColor: [219, 234, 254] } }, formatCurrency(carSavingsGoal)]);
    }
  }
  
  if (savingsRows.length > 0) {
    doc.autoTable({
      startY: yPos,
      head: [['Category', 'Monthly Amount']],
      body: savingsRows,
      theme: 'striped',
      headStyles: { 
        fillColor: COLORS.purple,
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 9
      },
      margin: { left: 20, right: 20 },
      alternateRowStyles: { fillColor: [250, 245, 255] }
    });
    
    yPos = doc.lastAutoTable.finalY + 3;
  }
  
  const regularSavings = savings.reduce((sum, sav) => sum + (sav.amount || 0), 0);
  const totalSavings = regularSavings + carSavingsGoal + houseSavingsGoal;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.purple);
  doc.text(`Total Savings: ${formatCurrency(totalSavings)}`, 180, yPos, { align: 'right' });
  
  yPos += 15;
  
  // NET CASHFLOW
  const netCashflow = netSalary - totalExpenses - totalSavings;
  const cashflowColor = netCashflow >= 0 ? COLORS.green : [220, 38, 38];
  
  drawRoundedRect(doc, 40, yPos - 8, 130, 15, cashflowColor);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(`NET CASHFLOW: ${formatCurrency(Math.abs(netCashflow))}`, 105, yPos, { align: 'center' });
  
  if (netCashflow < 0) {
    yPos += 10;
    doc.setFontSize(9);
    doc.setTextColor(220, 38, 38);
    doc.text('You\'re overspending - Consider reducing expenses or increasing income', 105, yPos, { align: 'center' });
  }
  
  // SAVINGS ANALYSIS - BEFORE mode only (on Page 1)
  if (budgetMode === 'before' && (carBudget || houseBudget)) {
    yPos += 20;
    
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.darkGray);
    doc.text('Your Savings Plan', 105, yPos, { align: 'center' });
    
    yPos += 8;
    
    const carDeposit = carBudget ? (carBudget.affordableCarPrice * 0.20) : 0;
    const houseDeposit = houseBudget ? (houseBudget.affordableHomePrice * 0.10) : 0;
    const houseUpfrontCosts = houseBudget ? (houseBudget.totalUpfront || houseDeposit) : 0;
    
    const monthsToSaveCar = carSavingsGoal > 0 ? Math.ceil(carDeposit / carSavingsGoal) : 0;
    const monthsToSaveHouse = houseSavingsGoal > 0 ? Math.ceil(houseUpfrontCosts / houseSavingsGoal) : 0;
    
    if (carBudget && carSavingsGoal > 0) {
      drawRoundedRect(doc, 20, yPos - 5, 170, 18, [219, 234, 254]);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.blue);
      doc.text('Dream Car Savings', 25, yPos);
      doc.setTextColor(...COLORS.darkGray);
      doc.text(formatCurrency(carSavingsGoal) + '/month', 185, yPos, { align: 'right' });
      
      yPos += 5;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...COLORS.gray);
      doc.text(`30% of salary (${formatCurrency(carSavingsGoalGross)}) - Current transport (${formatCurrency(currentTransportCost)})`, 25, yPos);
      
      yPos += 4;
      doc.text(`Target: ${formatCurrency(carDeposit)} deposit - ${monthsToSaveCar} months to save`, 25, yPos);
      
      yPos += 12;
    }
    
    if (houseBudget && houseSavingsGoal > 0) {
      drawRoundedRect(doc, 20, yPos - 5, 170, 18, [220, 252, 231]);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.green);
      doc.text('Dream House Savings', 25, yPos);
      doc.setTextColor(...COLORS.darkGray);
      doc.text(formatCurrency(houseSavingsGoal) + '/month', 185, yPos, { align: 'right' });
      
      yPos += 5;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...COLORS.gray);
      doc.text(`30% of salary (${formatCurrency(houseSavingsGoalGross)}) - Current housing (${formatCurrency(currentHousingCost)})`, 25, yPos);
      
      yPos += 4;
      doc.text(`Target: ${formatCurrency(houseUpfrontCosts)} (deposit + costs) - ${monthsToSaveHouse} months to save`, 25, yPos);
    }
  }
  
  // Footer
  yPos = 280;
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.gray);
  doc.text('Smart Budgets Meet Big Ambitions', 105, yPos, { align: 'center' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.green);
  doc.text('www.nickle.co.za', 105, yPos + 5, { align: 'center' });
  
  // ============ PAGE 2: TIMELINE (BEFORE MODE ONLY) ============
  
  if (budgetMode === 'before' && (carBudget || houseBudget)) {
    doc.addPage();
    
    // Header
    drawRoundedRect(doc, 10, 10, 190, 30, COLORS.lightGray);
    
    try {
      doc.addImage(NICKLE_LOGO, 'PNG', 15, 13, 20, 20);
    } catch (e) {
      console.log('Logo not added');
    }
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.green);
    doc.text('Nickle', 38, 22);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.gray);
    doc.text('Smart Budgets Meet Big Ambitions', 38, 28);
    
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.darkGray);
    doc.text('Your Journey to Financial Freedom', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.gray);
    doc.text('Savings timeline to achieve your dream car and house', 105, 27, { align: 'center' });
    
    // Calculate timeline
    const carDeposit = carBudget ? (carBudget.affordableCarPrice * 0.20) : 0;
    const houseDeposit = houseBudget ? (houseBudget.affordableHomePrice * 0.10) : 0;
    const houseUpfrontCosts = houseBudget ? (houseBudget.totalUpfront || houseDeposit) : 0;
    
    const monthsToSaveCar = carSavingsGoal > 0 ? Math.ceil(carDeposit / carSavingsGoal) : 0;
    const monthsToSaveHouse = houseSavingsGoal > 0 ? Math.ceil(houseUpfrontCosts / houseSavingsGoal) : 0;
    
    const today = new Date();
    const carTargetDate = new Date(today.getFullYear(), today.getMonth() + monthsToSaveCar, 1);
    const houseTargetDate = new Date(today.getFullYear(), today.getMonth() + monthsToSaveHouse, 1);
    
    yPos = 60;
    
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.darkGray);
    doc.text('Savings Milestones', 105, yPos, { align: 'center' });
    
    yPos = 90;
    
    // Timeline
    const timelineY = yPos;
    const startX = 30;
    const endX = 180;
    const lineLength = endX - startX;
    
    doc.setDrawColor(...COLORS.gray);
    doc.setLineWidth(2);
    doc.line(startX, timelineY, endX, timelineY);
    
    // TODAY
    drawCircle(doc, startX, timelineY, 8, COLORS.blue);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.blue);
    doc.text('TODAY', startX, timelineY - 15, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.gray);
    doc.text('Start Saving', startX, timelineY - 10, { align: 'center' });
    doc.text(today.toLocaleDateString('en-ZA', { month: 'short', year: 'numeric' }), startX, timelineY + 15, { align: 'center' });
    
    // CAR
    if (carBudget && monthsToSaveCar > 0) {
      const carX = startX + (lineLength * 0.4);
      drawCircle(doc, carX, timelineY, 8, COLORS.orange);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.orange);
      doc.text('CAR', carX, timelineY - 15, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.gray);
      doc.text(`${monthsToSaveCar} months`, carX, timelineY - 10, { align: 'center' });
      doc.text(carTargetDate.toLocaleDateString('en-ZA', { month: 'short', year: 'numeric' }), carX, timelineY + 15, { align: 'center' });
      doc.setFontSize(7);
      doc.text(formatCurrency(carDeposit), carX, timelineY + 20, { align: 'center' });
    }
    
    // HOUSE
    if (houseBudget && monthsToSaveHouse > 0) {
      const houseX = startX + (lineLength * 0.7);
      drawCircle(doc, houseX, timelineY, 8, COLORS.green);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.green);
      doc.text('HOUSE', houseX, timelineY - 15, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.gray);
      doc.text(`${monthsToSaveHouse} months`, houseX, timelineY - 10, { align: 'center' });
      doc.text(houseTargetDate.toLocaleDateString('en-ZA', { month: 'short', year: 'numeric' }), houseX, timelineY + 15, { align: 'center' });
      doc.setFontSize(7);
      doc.text(formatCurrency(houseUpfrontCosts), houseX, timelineY + 20, { align: 'center' });
    }
    
    // SUCCESS
    const maxMonths = Math.max(monthsToSaveCar, monthsToSaveHouse);
    const dreamDate = new Date(today.getFullYear(), today.getMonth() + maxMonths, 1);
    drawCircle(doc, endX, timelineY, 8, COLORS.purple);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.purple);
    doc.text('SUCCESS', endX, timelineY - 15, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.gray);
    doc.text('Dreams Achieved', endX, timelineY - 10, { align: 'center' });
    doc.text(dreamDate.toLocaleDateString('en-ZA', { month: 'short', year: 'numeric' }), endX, timelineY + 15, { align: 'center' });
    
    // Monthly Savings Breakdown
    yPos = 140;
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.darkGray);
    doc.text('Monthly Savings Breakdown', 105, yPos, { align: 'center' });
    
    yPos += 15;
    
    if (carBudget && carSavingsGoal > 0) {
      drawRoundedRect(doc, 20, yPos - 5, 170, 20, [219, 234, 254]);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.blue);
      doc.text('Dream Car Savings', 25, yPos);
      doc.setTextColor(...COLORS.darkGray);
      doc.text(formatCurrency(carSavingsGoal), 185, yPos, { align: 'right' });
      
      yPos += 5;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...COLORS.gray);
      doc.text(`30% of salary (${formatCurrency(carSavingsGoalGross)}) - Current transport (${formatCurrency(currentTransportCost)})`, 25, yPos);
      
      yPos += 4;
      doc.text(`Target: ${formatCurrency(carDeposit)} deposit - ${monthsToSaveCar} months to save`, 25, yPos);
      
      yPos += 15;
    }
    
    if (houseBudget && houseSavingsGoal > 0) {
      drawRoundedRect(doc, 20, yPos - 5, 170, 20, [220, 252, 231]);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.green);
      doc.text('Dream House Savings', 25, yPos);
      doc.setTextColor(...COLORS.darkGray);
      doc.text(formatCurrency(houseSavingsGoal), 185, yPos, { align: 'right' });
      
      yPos += 5;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...COLORS.gray);
      doc.text(`30% of salary (${formatCurrency(houseSavingsGoalGross)}) - Current housing (${formatCurrency(currentHousingCost)})`, 25, yPos);
      
      yPos += 4;
      doc.text(`Target: ${formatCurrency(houseUpfrontCosts)} (deposit + costs) - ${monthsToSaveHouse} months to save`, 25, yPos);
      
      yPos += 15;
    }
    
    // Motivational message
    yPos += 10;
    drawRoundedRect(doc, 20, yPos - 5, 170, 18, [250, 245, 255]);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.purple);
    doc.text('Your Path to Success', 105, yPos, { align: 'center' });
    
    yPos += 5;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.gray);
    doc.text(`By saving consistently, you'll achieve your dreams in just ${maxMonths} months!`, 105, yPos, { align: 'center' });
    yPos += 4;
    doc.text('Stay focused, track your progress, and watch your savings grow.', 105, yPos, { align: 'center' });
    
    // Footer
    yPos = 280;
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.gray);
    doc.text('Smart Budgets Meet Big Ambitions', 105, yPos, { align: 'center' });
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.green);
    doc.text('www.nickle.co.za', 105, yPos + 5, { align: 'center' });
  }
  
  // Save
  const filename = budgetMode === 'before' 
    ? 'Nickle-Savings-Journey.pdf'
    : 'Nickle-Cashflow-Statement.pdf';
  doc.save(filename);
};

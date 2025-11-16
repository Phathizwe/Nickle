import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Nickle logo as base64
const NICKLE_LOGO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAAD6CAYAAACI7Fo9AAAACXBIWXMAAAdiAAAHYgE4epnbAAAEYGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSfvu78nIGlkPSdXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQnPz4KPHg6eG1wbWV0YSB4bWxuczp4PSdhZG9iZTpuczptZXRhLyc+CjxyZGY6UkRGIHhtbG5zOnJkZj0naHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyc+CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczpBdHRyaWI9J2h0dHA6Ly9ucy5hdHRyaWJ1dGlvbi5jb20vYWRzLzEuMC8nPgogIDxBdHRyaWI6QWRzPgogICA8cmRmOlNlcT4KICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0nUmVzb3VyY2UnPgogICAgIDxBdHRyaWI6Q3JlYXRlZD4yMDI1LTAxLTA5PC9BdHRyaWI6Q3JlYXRlZD4KICAgICA8QXR0cmliOkV4dElkPmFhYzdjNjA0LWI5YTItNGQ3ZC1iNmNmLWJkNWQyMjY3MWJjNjwvQXR0cmliOkV4dElkPgogICAgIDxBdHRyaWI6RmJJZD41MjUyNjU5MTQxNzk1ODA8L0F0dHJpYjpGYklkPgogICAgIDxBdHRyaWI6VG91Y2hUeXBlPjI8L0F0dHJpYjpUb3VjaFR5cGU+CiAgICA8L3JkZjpsaT4KICAgPC9yZGY6U2VxPgogIDwvQXR0cmliOkFkcz4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6ZGM9J2h0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvJz4KICA8ZGM6dGl0bGU+CiAgIDxyZGY6QWx0PgogICAgPHJkZjpsaSB4bWw6bGFuZz0neC1kZWZhdWx0Jz5VbnRpdGxlZCBkZXNpZ24gLSAxPC9yZGY6bGk+CiAgIDwvcmRmOkFsdD4KICA8L2RjOnRpdGxlPgogPC9yZGY6RGVzY3JpcHRpb24+CgogPHJkZjpEZXNjcmlwdGlv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';

// Nickle Brand Colors
const COLORS = {
  green: [34, 197, 94],    // #22C55E
  blue: [59, 130, 246],     // #3B82F6
  orange: [249, 115, 22],   // #F97316
  purple: [168, 85, 247],   // #A855F7
  gray: [107, 114, 128],    // #6B7280
  darkGray: [31, 41, 55],   // #1F2937
};

const formatCurrency = (value) => {
  if (!value && value !== 0) return 'R 0';
  return 'R ' + Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

// Helper function to draw a circle
const drawCircle = (doc, x, y, radius, fillColor, strokeColor = null) => {
  doc.setFillColor(...fillColor);
  if (strokeColor) {
    doc.setDrawColor(...strokeColor);
    doc.setLineWidth(0.5);
  }
  doc.circle(x, y, radius, 'F');
};

// Helper function to draw a rounded rectangle
const drawRoundedRect = (doc, x, y, width, height, fillColor) => {
  doc.setFillColor(...fillColor);
  doc.roundedRect(x, y, width, height, 2, 2, 'F');
};

export const exportCashflowWithTimelineToPDF = (netSalary, carBudget, houseBudget, customExpenses, savings, budgetMode = 'after', currentHousingCost = 0, currentTransportCost = 0) => {
  const doc = new jsPDF();
  
  // ============ PAGE 1: CASHFLOW STATEMENT ============
  
  // Header with gradient-like effect (using rectangles)
  drawRoundedRect(doc, 10, 10, 190, 25, [240, 253, 244]); // Light green background
  
  // Logo
  try {
    doc.addImage(NICKLE_LOGO, 'PNG', 15, 13, 18, 18);
  } catch (e) {
    console.log('Logo not added');
  }
  
  // Title
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.darkGray);
  const modeText = budgetMode === 'after' ? 'AFTER Purchase' : 'BEFORE - Savings Plan';
  doc.text('Your Financial Snapshot', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.gray);
  doc.text(modeText, 105, 27, { align: 'center' });
  
  // Subtitle
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.gray);
  doc.text(`Generated ${new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}`, 105, 32, { align: 'center' });
  
  let yPos = 45;
  
  // INCOME Section with colored header
  drawRoundedRect(doc, 15, yPos - 5, 180, 8, COLORS.green);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('💰 INCOME', 20, yPos);
  
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
      fontSize: 11,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 10
    },
    margin: { left: 20, right: 20 },
    alternateRowStyles: { fillColor: [240, 253, 244] }
  });
  
  yPos = doc.lastAutoTable.finalY + 3;
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.green);
  doc.text(`Total Income: ${formatCurrency(netSalary)}`, 180, yPos, { align: 'right' });
  
  yPos += 12;
  
  // EXPENSES Section
  drawRoundedRect(doc, 15, yPos - 5, 180, 8, COLORS.orange);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('💳 EXPENSES', 20, yPos);
  
  yPos += 8;
  const expenseRows = [];
  
  if (budgetMode === 'after') {
    // AFTER mode: Show dream house and car expenses with breakdown
    if (houseBudget && houseBudget.breakdown) {
      expenseRows.push([{ content: '🏠 House', styles: { fontStyle: 'bold' } }, '']);
      expenseRows.push(['  Bond Repayment', formatCurrency(houseBudget.breakdown.bondRepayment)]);
      expenseRows.push(['  Rates & Taxes', formatCurrency(houseBudget.breakdown.rates)]);
      expenseRows.push(['  Home Insurance', formatCurrency(houseBudget.breakdown.insurance)]);
      expenseRows.push(['  Maintenance', formatCurrency(houseBudget.breakdown.maintenance)]);
    }
    
    if (carBudget && carBudget.breakdown) {
      expenseRows.push([{ content: '🚗 Car', styles: { fontStyle: 'bold' } }, '']);
      expenseRows.push(['  Monthly Repayment', formatCurrency(carBudget.breakdown.repayment)]);
      expenseRows.push(['  Insurance', formatCurrency(carBudget.breakdown.insurance)]);
      expenseRows.push(['  Petrol', formatCurrency(carBudget.breakdown.petrol)]);
    }
  } else {
    // BEFORE mode: Show current costs only
    if (currentHousingCost > 0) {
      expenseRows.push(['🏠 Current Housing Costs', formatCurrency(currentHousingCost)]);
    }
    if (currentTransportCost > 0) {
      expenseRows.push(['🚗 Current Transport Costs', formatCurrency(currentTransportCost)]);
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
    head: [['Category', 'Monthly Amount']],
    body: expenseRows,
    theme: 'striped',
    headStyles: { 
      fillColor: COLORS.orange,
      fontSize: 11,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 10
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
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.orange);
  doc.text(`Total Expenses: ${formatCurrency(totalExpenses)}`, 180, yPos, { align: 'right' });
  
  yPos += 12;
  
  // SAVINGS Section
  drawRoundedRect(doc, 15, yPos - 5, 180, 8, COLORS.purple);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('🐷 SAVINGS', 20, yPos);
  
  yPos += 8;
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
      savingsRows.push([{ content: '🏠 Dream House Savings', styles: { fontStyle: 'bold', fillColor: [220, 252, 231] } }, formatCurrency(houseSavingsGoal)]);
    }
    if (carSavingsGoal > 0) {
      savingsRows.push([{ content: '🚗 Dream Car Savings', styles: { fontStyle: 'bold', fillColor: [219, 234, 254] } }, formatCurrency(carSavingsGoal)]);
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
        fontSize: 11,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 10
      },
      margin: { left: 20, right: 20 },
      alternateRowStyles: { fillColor: [250, 245, 255] }
    });
    
    yPos = doc.lastAutoTable.finalY + 3;
  }
  
  const regularSavings = savings.reduce((sum, sav) => sum + (sav.amount || 0), 0);
  const carSavingsGoalGross = (budgetMode === 'before' && carBudget) ? netSalary * 0.30 : 0;
  const houseSavingsGoalGross = (budgetMode === 'before' && houseBudget) ? netSalary * 0.30 : 0;
  const carSavingsGoal = Math.max(0, carSavingsGoalGross - currentTransportCost);
  const houseSavingsGoal = Math.max(0, houseSavingsGoalGross - currentHousingCost);
  const totalSavings = regularSavings + carSavingsGoal + houseSavingsGoal;
  
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.purple);
  doc.text(`Total Savings: ${formatCurrency(totalSavings)}`, 180, yPos, { align: 'right' });
  
  yPos += 15;
  
  // NET CASHFLOW - Highlighted box
  const netCashflow = netSalary - totalExpenses - totalSavings;
  const cashflowColor = netCashflow >= 0 ? COLORS.green : [220, 38, 38];
  
  drawRoundedRect(doc, 40, yPos - 8, 130, 15, cashflowColor);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(`NET CASHFLOW: ${formatCurrency(Math.abs(netCashflow))}`, 105, yPos, { align: 'center' });
  
  if (netCashflow < 0) {
    yPos += 10;
    doc.setFontSize(10);
    doc.setTextColor(220, 38, 38);
    doc.text('⚠ You\'re overspending - Consider reducing expenses or increasing income', 105, yPos, { align: 'center' });
  }
  
  // SAVINGS ANALYSIS - BEFORE mode only (on Page 1)
  if (budgetMode === 'before' && (carBudget || houseBudget)) {
    yPos += 20;
    
    // Section header
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.darkGray);
    doc.text('💡 Your Savings Plan', 105, yPos, { align: 'center' });
    
    yPos += 8;
    
    // Calculate timeline data
    const carDeposit = carBudget ? (carBudget.affordableCarPrice * 0.20) : 0;
    const houseDeposit = houseBudget ? (houseBudget.affordableHomePrice * 0.10) : 0;
    const houseUpfrontCosts = houseBudget ? (houseBudget.totalUpfront || houseDeposit) : 0;
    
    const monthsToSaveCar = carSavingsGoal > 0 ? Math.ceil(carDeposit / carSavingsGoal) : 0;
    const monthsToSaveHouse = houseSavingsGoal > 0 ? Math.ceil(houseUpfrontCosts / houseSavingsGoal) : 0;
    
    // Car savings breakdown
    if (carBudget && carSavingsGoal > 0) {
      drawRoundedRect(doc, 20, yPos - 5, 170, 20, [219, 234, 254]);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.blue);
      doc.text('🚗 Dream Car Savings', 25, yPos);
      doc.setTextColor(...COLORS.darkGray);
      doc.text(formatCurrency(carSavingsGoal) + '/month', 185, yPos, { align: 'right' });
      
      yPos += 6;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...COLORS.gray);
      doc.text(`30% of salary (${formatCurrency(carSavingsGoalGross)}) - Current transport (${formatCurrency(currentTransportCost)})`, 25, yPos);
      
      yPos += 5;
      doc.text(`Target: ${formatCurrency(carDeposit)} deposit • ${monthsToSaveCar} months to save`, 25, yPos);
      
      yPos += 12;
    }
    
    // House savings breakdown
    if (houseBudget && houseSavingsGoal > 0) {
      drawRoundedRect(doc, 20, yPos - 5, 170, 20, [220, 252, 231]);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.green);
      doc.text('🏠 Dream House Savings', 25, yPos);
      doc.setTextColor(...COLORS.darkGray);
      doc.text(formatCurrency(houseSavingsGoal) + '/month', 185, yPos, { align: 'right' });
      
      yPos += 6;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...COLORS.gray);
      doc.text(`30% of salary (${formatCurrency(houseSavingsGoalGross)}) - Current housing (${formatCurrency(currentHousingCost)})`, 25, yPos);
      
      yPos += 5;
      doc.text(`Target: ${formatCurrency(houseUpfrontCosts)} (deposit + costs) • ${monthsToSaveHouse} months to save`, 25, yPos);
      
      yPos += 12;
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
    drawRoundedRect(doc, 10, 10, 190, 25, [240, 253, 244]);
    
    try {
      doc.addImage(NICKLE_LOGO, 'PNG', 15, 13, 18, 18);
    } catch (e) {
      console.log('Logo not added');
    }
    
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.darkGray);
    doc.text('Your Journey to Financial Freedom', 105, 20, { align: 'center' });
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.gray);
    doc.text('Savings timeline to achieve your dream car and house', 105, 27, { align: 'center' });
    
    // Calculate timeline data
    const carDeposit = carBudget ? (carBudget.affordableCarPrice * 0.20) : 0;
    const houseDeposit = houseBudget ? (houseBudget.affordableHomePrice * 0.10) : 0;
    const houseUpfrontCosts = houseBudget ? (houseBudget.totalUpfront || houseDeposit) : 0;
    
    const monthsToSaveCar = carSavingsGoal > 0 ? Math.ceil(carDeposit / carSavingsGoal) : 0;
    const monthsToSaveHouse = houseSavingsGoal > 0 ? Math.ceil(houseUpfrontCosts / houseSavingsGoal) : 0;
    
    const today = new Date();
    const carTargetDate = new Date(today.getFullYear(), today.getMonth() + monthsToSaveCar, 1);
    const houseTargetDate = new Date(today.getFullYear(), today.getMonth() + monthsToSaveHouse, 1);
    
    // Timeline visualization
    yPos = 60;
    
    // Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.darkGray);
    doc.text('Savings Milestones', 105, yPos, { align: 'center' });
    
    yPos = 90;
    
    // Draw horizontal timeline
    const timelineY = yPos;
    const startX = 30;
    const endX = 180;
    const lineLength = endX - startX;
    
    // Timeline line
    doc.setDrawColor(...COLORS.gray);
    doc.setLineWidth(2);
    doc.line(startX, timelineY, endX, timelineY);
    
    // Milestone 1: Today (Start)
    drawCircle(doc, startX, timelineY, 8, COLORS.blue);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.blue);
    doc.text('TODAY', startX, timelineY - 15, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.gray);
    doc.text('Start Saving', startX, timelineY - 10, { align: 'center' });
    doc.text(today.toLocaleDateString('en-ZA', { month: 'short', year: 'numeric' }), startX, timelineY + 15, { align: 'center' });
    
    // Milestone 2: Car (if applicable)
    if (carBudget && monthsToSaveCar > 0) {
      const carX = startX + (lineLength * 0.4);
      drawCircle(doc, carX, timelineY, 8, COLORS.orange);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.orange);
      doc.text('🚗 CAR', carX, timelineY - 15, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...COLORS.gray);
      doc.text(`${monthsToSaveCar} months`, carX, timelineY - 10, { align: 'center' });
      doc.text(carTargetDate.toLocaleDateString('en-ZA', { month: 'short', year: 'numeric' }), carX, timelineY + 15, { align: 'center' });
      doc.setFontSize(8);
      doc.text(formatCurrency(carDeposit), carX, timelineY + 20, { align: 'center' });
    }
    
    // Milestone 3: House (if applicable)
    if (houseBudget && monthsToSaveHouse > 0) {
      const houseX = startX + (lineLength * 0.7);
      drawCircle(doc, houseX, timelineY, 8, COLORS.green);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.green);
      doc.text('🏠 HOUSE', houseX, timelineY - 15, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...COLORS.gray);
      doc.text(`${monthsToSaveHouse} months`, houseX, timelineY - 10, { align: 'center' });
      doc.text(houseTargetDate.toLocaleDateString('en-ZA', { month: 'short', year: 'numeric' }), houseX, timelineY + 15, { align: 'center' });
      doc.setFontSize(8);
      doc.text(formatCurrency(houseUpfrontCosts), houseX, timelineY + 20, { align: 'center' });
    }
    
    // Milestone 4: Dreams Achieved
    const maxMonths = Math.max(monthsToSaveCar, monthsToSaveHouse);
    const dreamDate = new Date(today.getFullYear(), today.getMonth() + maxMonths, 1);
    drawCircle(doc, endX, timelineY, 8, COLORS.purple);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.purple);
    doc.text('🎉 SUCCESS', endX, timelineY - 15, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.gray);
    doc.text('Dreams Achieved', endX, timelineY - 10, { align: 'center' });
    doc.text(dreamDate.toLocaleDateString('en-ZA', { month: 'short', year: 'numeric' }), endX, timelineY + 15, { align: 'center' });
    
    // Savings breakdown
    yPos = 140;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.darkGray);
    doc.text('Monthly Savings Breakdown', 105, yPos, { align: 'center' });
    
    yPos += 15;
    
    if (carBudget && carSavingsGoal > 0) {
      drawRoundedRect(doc, 20, yPos - 5, 170, 25, [219, 234, 254]);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.blue);
      doc.text('🚗 Dream Car Savings', 25, yPos);
      doc.setTextColor(...COLORS.darkGray);
      doc.text(formatCurrency(carSavingsGoal), 185, yPos, { align: 'right' });
      
      yPos += 6;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...COLORS.gray);
      doc.text(`30% of salary (${formatCurrency(carSavingsGoalGross)}) - Current transport (${formatCurrency(currentTransportCost)})`, 25, yPos);
      
      yPos += 5;
      doc.setFontSize(8);
      doc.text(`Target: ${formatCurrency(carDeposit)} deposit • ${monthsToSaveCar} months to save`, 25, yPos);
      
      yPos += 15;
    }
    
    if (houseBudget && houseSavingsGoal > 0) {
      drawRoundedRect(doc, 20, yPos - 5, 170, 25, [220, 252, 231]);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.green);
      doc.text('🏠 Dream House Savings', 25, yPos);
      doc.setTextColor(...COLORS.darkGray);
      doc.text(formatCurrency(houseSavingsGoal), 185, yPos, { align: 'right' });
      
      yPos += 6;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...COLORS.gray);
      doc.text(`30% of salary (${formatCurrency(houseSavingsGoalGross)}) - Current housing (${formatCurrency(currentHousingCost)})`, 25, yPos);
      
      yPos += 5;
      doc.setFontSize(8);
      doc.text(`Target: ${formatCurrency(houseUpfrontCosts)} (deposit + costs) • ${monthsToSaveHouse} months to save`, 25, yPos);
      
      yPos += 15;
    }
    
    // Motivational message
    yPos += 10;
    drawRoundedRect(doc, 20, yPos - 5, 170, 20, [250, 245, 255]);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.purple);
    doc.text('💡 Your Path to Success', 105, yPos, { align: 'center' });
    
    yPos += 6;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.gray);
    doc.text('By saving consistently, you\'ll achieve your dreams in just ' + maxMonths + ' months!', 105, yPos, { align: 'center' });
    yPos += 5;
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

// Export the original function as well for backward compatibility
export { exportCashflowToPDF } from './pdfExport';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Logo removed - jsPDF doesn't render complex PNGs properly
// Using text-based branding instead

// Nickle Brand Colors (actual CI)
const COLORS = {
  darkGreen: [10, 51, 35],      // #0A3323 - Primary brand color
  turquoise: [44, 207, 181],    // #2CCFB45 - Secondary accent
  mint: [62, 207, 248],         // #3ECF8 - Light accent  
  black: [0, 0, 0],             // #000000 - Text
  white: [255, 255, 255],       // #FFFFFF - Backgrounds
  gray: [107, 114, 128],        // #6B7280 - Secondary text
  lightGray: [240, 240, 240],   // #F0F0F0 - Backgrounds
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
  
  // Logo placeholder (text-based branding)
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.darkGreen);
  doc.text('N', 20, 28);
  
  // Nickle branding text next to logo
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.darkGreen);
  doc.text('Nickle', 38, 22);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.gray);
  doc.text('Smart Budgets Meet Big Ambitions', 38, 28);
  
  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.black);
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
    doc.setTextColor(...COLORS.black);
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
      doc.setTextColor(...COLORS.black);
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
      doc.setTextColor(...COLORS.black);
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
    doc.setTextColor(...COLORS.black);
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
    doc.setTextColor(...COLORS.black);
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
    doc.setTextColor(...COLORS.black);
    doc.text('Monthly Savings Breakdown', 105, yPos, { align: 'center' });
    
    yPos += 15;
    
    if (carBudget && carSavingsGoal > 0) {
      drawRoundedRect(doc, 20, yPos - 5, 170, 20, [219, 234, 254]);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.blue);
      doc.text('Dream Car Savings', 25, yPos);
      doc.setTextColor(...COLORS.black);
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
      doc.setTextColor(...COLORS.black);
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

import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Optimized Nickle logo for PDF use (200x200px)
const NICKLE_LOGO = 'undefined';

// Nickle Brand Colors (actual CI)
const COLORS = {
  darkGreen: [10, 51, 35],      // #0A3323 - Primary brand color
  turquoise: [44, 207, 181],    // #2CCFB45 - Secondary accent
  mint: [62, 207, 248],         // #3ECF8 - Light accent  
  black: [0, 0, 0],             // #000000 - Text
  white: [255, 255, 255],       // #FFFFFF - Backgrounds
  gray: [107, 114, 128],        // #6B7280 - Secondary text
  lightGray: [240, 240, 240],   // #F0F0F0 - Backgrounds
  green: [34, 197, 94],         // #22C55E - Green for income
  orange: [249, 115, 22],       // #F97316 - Orange for expenses
  purple: [168, 85, 247],       // #A855F7 - Purple for savings
  blue: [59, 130, 246],         // #3B82F6 - Blue for car
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

// Helper function to draw branded header
const drawBrandedHeader = (doc, title) => {
  // Header background
  drawRoundedRect(doc, 10, 10, 190, 30, COLORS.lightGray);
  
  // Nickle branding
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.darkGreen);
  doc.text('N', 20, 28);
  
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
  doc.text(title, 105, 20, { align: 'center' });
  
  // Date
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.gray);
  doc.text(`Generated ${new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}`, 105, 35, { align: 'center' });
};

// Helper function to draw footer
const drawFooter = (doc) => {
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.gray);
  doc.text('Smart Budgets Meet Big Ambitions', 105, 280, { align: 'center' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.darkGreen);
  doc.text('www.nickle.co.za', 105, 287, { align: 'center' });
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
    
    yPos += 10;
    
    const carDeposit = carBudget ? (carBudget.affordableCarPrice * 0.10) : 0;
    const houseUpfrontCosts = houseBudget ? houseBudget.totalUpfront : 0;
    
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
  doc.setTextColor(...COLORS.darkGreen);
  doc.text('www.nickle.co.za', 105, 287, { align: 'center' });
  
  // ============ PAGE 2: SAVINGS TIMELINE (BEFORE mode only) ============
  
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
    doc.text('Your Savings Journey', 105, 20, { align: 'center' });
    
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.gray);
    doc.text(`Generated ${new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}`, 105, 35, { align: 'center' });
    
    yPos = 60;
    
    // Timeline visualization
    const carDeposit = carBudget ? (carBudget.affordableCarPrice * 0.10) : 0;
    const houseUpfrontCosts = houseBudget ? houseBudget.totalUpfront : 0;
    
    const monthsToSaveCar = carSavingsGoal > 0 ? Math.ceil(carDeposit / carSavingsGoal) : 0;
    const monthsToSaveHouse = houseSavingsGoal > 0 ? Math.ceil(houseUpfrontCosts / houseSavingsGoal) : 0;
    const maxMonths = Math.max(monthsToSaveCar, monthsToSaveHouse);
    
    // Calculate milestone dates
    const today = new Date();
    const carDate = new Date(today);
    carDate.setMonth(carDate.getMonth() + monthsToSaveCar);
    const houseDate = new Date(today);
    houseDate.setMonth(houseDate.getMonth() + monthsToSaveHouse);
    const successDate = new Date(today);
    successDate.setMonth(successDate.getMonth() + maxMonths);
    
    // Timeline title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.black);
    doc.text('Your Path to Financial Success', 105, yPos, { align: 'center' });
    
    yPos += 15;
    
    // Horizontal timeline line
    const timelineY = yPos + 20;
    const timelineStartX = 30;
    const timelineEndX = 180;
    const timelineLength = timelineEndX - timelineStartX;
    
    // Draw timeline line
    doc.setDrawColor(...COLORS.gray);
    doc.setLineWidth(0.5);
    doc.line(timelineStartX, timelineY, timelineEndX, timelineY);
    
    // Milestone 1: TODAY
    drawCircle(doc, timelineStartX, timelineY, 4, COLORS.blue);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.blue);
    doc.text('TODAY', timelineStartX, timelineY - 8, { align: 'center' });
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.gray);
    doc.text(today.toLocaleDateString('en-ZA', { month: 'short', year: 'numeric' }), timelineStartX, timelineY + 8, { align: 'center' });
    doc.text('Start Saving', timelineStartX, timelineY + 13, { align: 'center' });
    
    // Milestone 2: CAR (if applicable)
    if (carBudget && monthsToSaveCar > 0) {
      const carX = timelineStartX + (timelineLength * (monthsToSaveCar / maxMonths));
      drawCircle(doc, carX, timelineY, 4, COLORS.orange);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.orange);
      doc.text('CAR', carX, timelineY - 8, { align: 'center' });
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...COLORS.gray);
      doc.text(carDate.toLocaleDateString('en-ZA', { month: 'short', year: 'numeric' }), carX, timelineY + 8, { align: 'center' });
      doc.text(formatCurrency(carDeposit), carX, timelineY + 13, { align: 'center' });
    }
    
    // Milestone 3: HOUSE (if applicable)
    if (houseBudget && monthsToSaveHouse > 0) {
      const houseX = timelineStartX + (timelineLength * (monthsToSaveHouse / maxMonths));
      drawCircle(doc, houseX, timelineY, 4, COLORS.green);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.green);
      doc.text('HOUSE', houseX, timelineY - 8, { align: 'center' });
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...COLORS.gray);
      doc.text(houseDate.toLocaleDateString('en-ZA', { month: 'short', year: 'numeric' }), houseX, timelineY + 8, { align: 'center' });
      doc.text(formatCurrency(houseUpfrontCosts), houseX, timelineY + 13, { align: 'center' });
    }
    
    // Milestone 4: SUCCESS
    drawCircle(doc, timelineEndX, timelineY, 4, COLORS.purple);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.purple);
    doc.text('SUCCESS', timelineEndX, timelineY - 8, { align: 'center' });
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.gray);
    doc.text(successDate.toLocaleDateString('en-ZA', { month: 'short', year: 'numeric' }), timelineEndX, timelineY + 8, { align: 'center' });
    doc.text('Goals Achieved', timelineEndX, timelineY + 13, { align: 'center' });
    
    yPos = timelineY + 40;
    
    // Monthly Savings Breakdown
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
    doc.setTextColor(...COLORS.darkGreen);
    doc.text('www.nickle.co.za', 105, 287, { align: 'center' });
  }
  
  doc.save('Nickle-Cashflow-Budget.pdf');
};

export const exportHouseCalculatorToPDF = (netSalary, results, inputs) => {
  // Validation
  if (!results || !results.affordableHousePrice) {
    console.error('Invalid results object passed to exportHouseCalculatorToPDF:', results);
    alert('Unable to export PDF: Calculation results are not available. Please ensure the calculator has valid results.');
    return;
  }
  
  const doc = new jsPDF();
  
  // Branded header
  drawBrandedHeader(doc, 'Home Affordability Report');
  
  let yPos = 50;
  
  // HERO RESULT - Big, bold, centered
  drawRoundedRect(doc, 20, yPos, 170, 35, [220, 252, 231]);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.gray);
  doc.text('You can afford a home worth', 105, yPos + 10, { align: 'center' });
  
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.darkGreen);
  doc.text(formatCurrency(results.affordableHousePrice), 105, yPos + 22, { align: 'center' });
  
  // Status badge
  drawRoundedRect(doc, 85, yPos + 27, 40, 6, COLORS.turquoise);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('✓ Within Budget', 105, yPos + 31, { align: 'center' });
  
  yPos += 45;
  
  // MONTHLY COSTS Section
  drawRoundedRect(doc, 15, yPos - 5, 180, 8, COLORS.orange);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('MONTHLY COSTS', 20, yPos);
  
  yPos += 8;
  doc.autoTable({
    startY: yPos,
    head: [['Item', 'Amount']],
    body: [
      ['Bond Repayment', formatCurrency(results.monthlyRepayment)],
      ['Rates & Taxes', formatCurrency(inputs.ratesAndTaxes)],
      ['Home Insurance', formatCurrency(inputs.insurance)],
      ['Maintenance', formatCurrency(inputs.maintenance)],
      [{ content: 'Total Monthly Cost', styles: { fontStyle: 'bold' } }, { content: formatCurrency(results.totalMonthlyCost), styles: { fontStyle: 'bold' } }]
    ],
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
  
  yPos = doc.lastAutoTable.finalY + 15;
  
  // UPFRONT COSTS Section
  drawRoundedRect(doc, 15, yPos - 5, 180, 8, COLORS.blue);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('UPFRONT COSTS', 20, yPos);
  
  yPos += 8;
  doc.autoTable({
    startY: yPos,
    head: [['Item', 'Amount']],
    body: [
      ['Down Payment', formatCurrency(results.downPayment)],
      ['Transfer Duty', formatCurrency(results.transferDuty)],
      ['Bond Registration', formatCurrency(results.bondRegistration)],
      ['Bond Initiation', formatCurrency(results.bondInitiation)],
      [{ content: 'Total Upfront', styles: { fontStyle: 'bold' } }, { content: formatCurrency(results.totalUpfront), styles: { fontStyle: 'bold' } }]
    ],
    theme: 'striped',
    headStyles: { 
      fillColor: COLORS.blue,
      fontSize: 10,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 9
    },
    margin: { left: 20, right: 20 },
    alternateRowStyles: { fillColor: [239, 246, 255] }
  });
  
  yPos = doc.lastAutoTable.finalY + 15;
  
  // LOAN DETAILS Section
  drawRoundedRect(doc, 15, yPos - 5, 180, 8, COLORS.gray);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('LOAN DETAILS', 20, yPos);
  
  yPos += 8;
  doc.autoTable({
    startY: yPos,
    head: [['Parameter', 'Value']],
    body: [
      ['Monthly Salary', formatCurrency(netSalary)],
      ['Budget for Housing', `${inputs.budgetPercentage}%`],
      ['Down Payment', `${inputs.downPaymentPercentage}%`],
      ['Loan Term', `${inputs.loanTerm / 12} years`],
      ['Interest Rate', `${inputs.interestRate}%`]
    ],
    theme: 'striped',
    headStyles: { 
      fillColor: COLORS.gray,
      fontSize: 10,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 9
    },
    margin: { left: 20, right: 20 },
    alternateRowStyles: { fillColor: [249, 250, 251] }
  });
  
  // Footer
  drawFooter(doc);
  
  doc.save('Nickle-House-Affordability-Report.pdf');
};

export const exportCarCalculatorToPDF = (netSalary, results, inputs) => {
  // Validation
  if (!results || !results.affordableCarPrice) {
    console.error('Invalid results object passed to exportCarCalculatorToPDF:', results);
    alert('Unable to export PDF: Calculation results are not available. Please ensure the calculator has valid results.');
    return;
  }
  
  const doc = new jsPDF();
  
  // Branded header
  drawBrandedHeader(doc, 'Car Affordability Report');
  
  let yPos = 50;
  
  // HERO RESULT - Big, bold, centered
  drawRoundedRect(doc, 20, yPos, 170, 35, [219, 234, 254]);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.gray);
  doc.text('You can afford a car worth', 105, yPos + 10, { align: 'center' });
  
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.blue);
  doc.text(formatCurrency(results.affordableCarPrice), 105, yPos + 22, { align: 'center' });
  
  // Status badge
  drawRoundedRect(doc, 85, yPos + 27, 40, 6, COLORS.turquoise);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('✓ Within Budget', 105, yPos + 31, { align: 'center' });
  
  yPos += 45;
  
  // MONTHLY COSTS Section
  drawRoundedRect(doc, 15, yPos - 5, 180, 8, COLORS.orange);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('MONTHLY COSTS', 20, yPos);
  
  yPos += 8;
  doc.autoTable({
    startY: yPos,
    head: [['Item', 'Amount']],
    body: [
      ['Monthly Repayment', formatCurrency(results.monthlyRepayment)],
      ['Insurance', formatCurrency(inputs.insurance)],
      ['Petrol', formatCurrency(inputs.petrol)],
      [{ content: 'Total Monthly Cost', styles: { fontStyle: 'bold' } }, { content: formatCurrency(results.totalMonthlyCost), styles: { fontStyle: 'bold' } }]
    ],
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
  
  yPos = doc.lastAutoTable.finalY + 15;
  
  // UPFRONT COSTS Section
  drawRoundedRect(doc, 15, yPos - 5, 180, 8, COLORS.blue);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('UPFRONT COSTS', 20, yPos);
  
  yPos += 8;
  doc.autoTable({
    startY: yPos,
    head: [['Item', 'Amount']],
    body: [
      ['Down Payment', formatCurrency(results.downPayment)],
      ['License & Registration', formatCurrency(inputs.licenseAndRegistration)],
      [{ content: 'Total Upfront', styles: { fontStyle: 'bold' } }, { content: formatCurrency(results.totalUpfront), styles: { fontStyle: 'bold' } }]
    ],
    theme: 'striped',
    headStyles: { 
      fillColor: COLORS.blue,
      fontSize: 10,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 9
    },
    margin: { left: 20, right: 20 },
    alternateRowStyles: { fillColor: [239, 246, 255] }
  });
  
  yPos = doc.lastAutoTable.finalY + 15;
  
  // LOAN DETAILS Section
  drawRoundedRect(doc, 15, yPos - 5, 180, 8, COLORS.gray);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('LOAN DETAILS', 20, yPos);
  
  yPos += 8;
  doc.autoTable({
    startY: yPos,
    head: [['Parameter', 'Value']],
    body: [
      ['Monthly Salary', formatCurrency(netSalary)],
      ['Budget for Transport', `${inputs.budgetPercentage}%`],
      ['Down Payment', `${inputs.downPaymentPercentage}%`],
      ['Loan Term', `${inputs.loanTerm / 12} years`],
      ['Interest Rate', `${inputs.interestRate}%`]
    ],
    theme: 'striped',
    headStyles: { 
      fillColor: COLORS.gray,
      fontSize: 10,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 9
    },
    margin: { left: 20, right: 20 },
    alternateRowStyles: { fillColor: [249, 250, 251] }
  });
  
  // Footer
  drawFooter(doc);
  
  doc.save('Nickle-Car-Affordability-Report.pdf');
};

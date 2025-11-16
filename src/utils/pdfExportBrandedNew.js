import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Nickle logo as base64 (loaded from brand-assets)
const NICKLE_LOGO = 'data:image/png;base64,undefined';

// Nickle Brand Colors (actual CI)
const COLORS = {
  darkGreen: [10, 51, 35],      // #0A3323 - Primary brand color
  turquoise: [44, 207, 181],    // #2CCFB5 - Secondary accent
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

// Helper function to draw footer
const drawFooter = (doc) => {
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.gray);
  doc.text('Smart Budgets Meet Big Ambitions', 105, 280, { align: 'center' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.turquoise);
  doc.text('www.nickle.com', 105, 287, { align: 'center' });
};

export const exportCashflowWithTimelineToPDF = (netSalary, carBudget, houseBudget, customExpenses, savings, budgetMode = 'after', currentHousingCost = 0, currentTransportCost = 0) => {
  const doc = new jsPDF();
  
  // ============ PAGE 1: CASHFLOW STATEMENT (REDESIGNED) ============
  
  // Logo
  try {
    doc.addImage(NICKLE_LOGO, 'PNG', 15, 15, 30, 30);
  } catch (e) {
    console.log('Logo not added:', e);
  }
  
  // Nickle branding text
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.darkGreen);
  doc.text('Nickle', 50, 27);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.gray);
  doc.text('Smart Budgets Meet Big Ambitions', 50, 35);
  
  // Title Section
  let yPos = 60;
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.black);
  doc.text('Your Financial Snapshot', 15, yPos);
  
  yPos += 8;
  const modeText = budgetMode === 'after' ? 'AFTER - Purchase' : 'BEFORE - Savings Plan';
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.gray);
  doc.text(modeText, 15, yPos);
  
  yPos += 5;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated ${new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}`, 15, yPos);
  
  yPos += 15;
  
  // Calculate totals
  const totalExpenses = budgetMode === 'after'
    ? (houseBudget ? houseBudget.totalMonthlyCost : 0) +
      (carBudget ? carBudget.totalMonthlyCost : 0) +
      customExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0)
    : currentHousingCost + currentTransportCost +
      customExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  
  const carSavingsGoalGross = (budgetMode === 'before' && carBudget) ? netSalary * 0.30 : 0;
  const houseSavingsGoalGross = (budgetMode === 'before' && houseBudget) ? netSalary * 0.30 : 0;
  const carSavingsGoal = Math.max(0, carSavingsGoalGross - currentTransportCost);
  const houseSavingsGoal = Math.max(0, houseSavingsGoalGross - currentHousingCost);
  const regularSavings = savings.reduce((sum, sav) => sum + (sav.amount || 0), 0);
  const totalSavings = regularSavings + carSavingsGoal + houseSavingsGoal;
  
  // SIDE-BY-SIDE CARDS: Income and Expenses
  const cardWidth = 87;
  const cardGap = 6;
  const leftCardX = 15;
  const rightCardX = leftCardX + cardWidth + cardGap;
  
  // INCOME CARD (Left)
  drawRoundedRect(doc, leftCardX, yPos, cardWidth, 8, COLORS.green);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('INCOME', leftCardX + 3, yPos + 5.5);
  
  // Income content
  yPos += 12;
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.black);
  doc.setFont('helvetica', 'bold');
  doc.text('Total Income', leftCardX + 3, yPos);
  doc.setTextColor(...COLORS.green);
  doc.text(formatCurrency(netSalary), leftCardX + cardWidth - 3, yPos, { align: 'right' });
  
  yPos += 6;
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.gray);
  doc.setFont('helvetica', 'normal');
  doc.text('Net Salary', leftCardX + 3, yPos);
  doc.text(formatCurrency(netSalary), leftCardX + cardWidth - 3, yPos, { align: 'right' });
  
  // EXPENSES CARD (Right)
  yPos = 95; // Reset to same level as income
  drawRoundedRect(doc, rightCardX, yPos, cardWidth, 8, COLORS.orange);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('EXPENSES', rightCardX + 3, yPos + 5.5);
  
  // Expenses content
  yPos += 12;
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.black);
  doc.setFont('helvetica', 'bold');
  doc.text('Total Expenses', rightCardX + 3, yPos);
  doc.setTextColor(...COLORS.orange);
  doc.text(formatCurrency(totalExpenses), rightCardX + cardWidth - 3, yPos, { align: 'right' });
  
  yPos += 6;
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.gray);
  doc.setFont('helvetica', 'normal');
  
  // List expenses
  if (budgetMode === 'before') {
    if (currentHousingCost > 0) {
      doc.text('Current Housing', rightCardX + 3, yPos);
      doc.text(formatCurrency(currentHousingCost), rightCardX + cardWidth - 3, yPos, { align: 'right' });
      yPos += 5;
    }
    if (currentTransportCost > 0) {
      doc.text('Current Transport', rightCardX + 3, yPos);
      doc.text(formatCurrency(currentTransportCost), rightCardX + cardWidth - 3, yPos, { align: 'right' });
      yPos += 5;
    }
  }
  
  customExpenses.slice(0, 3).forEach(expense => {
    if (expense.amount > 0) {
      doc.text(expense.name, rightCardX + 3, yPos);
      doc.text(formatCurrency(expense.amount), rightCardX + cardWidth - 3, yPos, { align: 'right' });
      yPos += 5;
    }
  });
  
  // SAVINGS CARD (Full width)
  yPos = 135;
  drawRoundedRect(doc, 15, yPos, 180, 8, COLORS.purple);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('SAVINGS', 18, yPos + 5.5);
  doc.text(formatCurrency(totalSavings), 192, yPos + 5.5, { align: 'right' });
  
  yPos += 12;
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.gray);
  doc.setFont('helvetica', 'normal');
  
  if (budgetMode === 'before') {
    if (houseSavingsGoal > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Dream House Savings', 18, yPos);
      doc.text(formatCurrency(houseSavingsGoal), 192, yPos, { align: 'right' });
      yPos += 5;
    }
    if (carSavingsGoal > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Dream Car Savings', 18, yPos);
      doc.text(formatCurrency(carSavingsGoal), 192, yPos, { align: 'right' });
      yPos += 5;
    }
  }
  
  // YOUR SAVINGS PLAN Section
  if (budgetMode === 'before' && (carBudget || houseBudget)) {
    yPos += 15;
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.black);
    doc.text('Your Savings Plan', 15, yPos);
    
    yPos += 10;
    
    const carDeposit = carBudget ? (carBudget.affordableCarPrice * 0.10) : 0;
    const houseUpfrontCosts = houseBudget ? houseBudget.totalUpfront : 0;
    const monthsToSaveCar = carSavingsGoal > 0 ? Math.ceil(carDeposit / carSavingsGoal) : 0;
    const monthsToSaveHouse = houseSavingsGoal > 0 ? Math.ceil(houseUpfrontCosts / houseSavingsGoal) : 0;
    
    // SIDE-BY-SIDE SAVINGS CARDS
    const savingsCardWidth = 87;
    
    // Dream Car Savings Card (Left)
    if (carBudget && carSavingsGoal > 0) {
      drawRoundedRect(doc, leftCardX, yPos, savingsCardWidth, 25, [219, 234, 254]);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.blue);
      doc.text('Dream Car Savings', leftCardX + 3, yPos + 6);
      
      doc.setFontSize(14);
      doc.setTextColor(...COLORS.black);
      doc.text(formatCurrency(carSavingsGoal) + '/month', leftCardX + savingsCardWidth - 3, yPos + 6, { align: 'right' });
      
      yPos += 11;
      doc.setFontSize(7);
      doc.setTextColor(...COLORS.gray);
      doc.setFont('helvetica', 'normal');
      doc.text(`30% of salary (${formatCurrency(carSavingsGoalGross)}) - Current transport (${formatCurrency(currentTransportCost)})`, leftCardX + 3, yPos);
      
      yPos += 4;
      doc.text(`Target: ${formatCurrency(carDeposit)} deposit • ${monthsToSaveCar} months to save`, leftCardX + 3, yPos);
      
      yPos -= 15; // Reset for right card
    }
    
    // Dream House Savings Card (Right)
    if (houseBudget && houseSavingsGoal > 0) {
      drawRoundedRect(doc, rightCardX, yPos, savingsCardWidth, 25, [220, 252, 231]);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.green);
      doc.text('Dream House Savings', rightCardX + 3, yPos + 6);
      
      doc.setFontSize(14);
      doc.setTextColor(...COLORS.black);
      doc.text(formatCurrency(houseSavingsGoal) + '/month', rightCardX + savingsCardWidth - 3, yPos + 6, { align: 'right' });
      
      yPos += 11;
      doc.setFontSize(7);
      doc.setTextColor(...COLORS.gray);
      doc.setFont('helvetica', 'normal');
      doc.text(`30% of salary (${formatCurrency(houseSavingsGoalGross)}) - Current housing (${formatCurrency(currentHousingCost)})`, rightCardX + 3, yPos);
      
      yPos += 4;
      doc.text(`Target: ${formatCurrency(houseUpfrontCosts)} (deposit + costs) • ${monthsToSaveHouse} months to save`, rightCardX + 3, yPos);
    }
  }
  
  // Footer
  drawFooter(doc);
  
  // ============ PAGE 2: SAVINGS TIMELINE (BEFORE mode only) ============
  
  if (budgetMode === 'before' && (carBudget || houseBudget)) {
    doc.addPage();
    
    // Logo
    try {
      doc.addImage(NICKLE_LOGO, 'PNG', 15, 15, 30, 30);
    } catch (e) {
      console.log('Logo not added');
    }
    
    // Nickle branding
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.turquoise);
    doc.text('Nickle', 50, 27);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.gray);
    doc.text('Smart Budgets Meet Big Ambitions', 50, 35);
    
    yPos = 60;
    
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.black);
    doc.text('Your Journey to Financial Freedom', 105, yPos, { align: 'center' });
    
    yPos += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.gray);
    doc.text('Savings timeline to achieve your dream car and house', 105, yPos, { align: 'center' });
    
    yPos += 25;
    
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
    doc.text('Savings Milestones', 105, yPos, { align: 'center' });
    
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
    drawCircle(doc, timelineStartX, timelineY, 5, COLORS.blue);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.blue);
    doc.text('TODAY', timelineStartX, timelineY - 10, { align: 'center' });
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.gray);
    doc.text('Start Saving', timelineStartX, timelineY - 5, { align: 'center' });
    doc.text(today.toLocaleDateString('en-ZA', { month: 'short', year: 'numeric' }), timelineStartX, timelineY + 10, { align: 'center' });
    
    // Milestone 2: CAR (if applicable)
    if (carBudget && monthsToSaveCar > 0) {
      const carX = timelineStartX + (timelineLength * (monthsToSaveCar / maxMonths));
      drawCircle(doc, carX, timelineY, 5, COLORS.orange);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.orange);
      doc.text('CAR', carX, timelineY - 10, { align: 'center' });
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...COLORS.gray);
      doc.text(`${monthsToSaveCar} months`, carX, timelineY - 5, { align: 'center' });
      doc.text(carDate.toLocaleDateString('en-ZA', { month: 'short', year: 'numeric' }), carX, timelineY + 10, { align: 'center' });
      doc.text(formatCurrency(carDeposit), carX, timelineY + 15, { align: 'center' });
    }
    
    // Milestone 3: HOUSE (if applicable)
    if (houseBudget && monthsToSaveHouse > 0) {
      const houseX = timelineStartX + (timelineLength * (monthsToSaveHouse / maxMonths));
      drawCircle(doc, houseX, timelineY, 5, COLORS.green);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.green);
      doc.text('HOUSE', houseX, timelineY - 10, { align: 'center' });
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...COLORS.gray);
      doc.text(`${monthsToSaveHouse} months`, houseX, timelineY - 5, { align: 'center' });
      doc.text(houseDate.toLocaleDateString('en-ZA', { month: 'short', year: 'numeric' }), houseX, timelineY + 10, { align: 'center' });
      doc.text(formatCurrency(houseUpfrontCosts), houseX, timelineY + 15, { align: 'center' });
    }
    
    // Milestone 4: SUCCESS
    drawCircle(doc, timelineEndX, timelineY, 5, COLORS.purple);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.purple);
    doc.text('SUCCESS', timelineEndX, timelineY - 10, { align: 'center' });
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.gray);
    doc.text('Dreams Achieved', timelineEndX, timelineY - 5, { align: 'center' });
    doc.text(successDate.toLocaleDateString('en-ZA', { month: 'short', year: 'numeric' }), timelineEndX, timelineY + 10, { align: 'center' });
    
    yPos = timelineY + 40;
    
    // Monthly Savings Breakdown
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.black);
    doc.text('Monthly Savings Breakdown', 105, yPos, { align: 'center' });
    
    yPos += 15;
    
    // Side-by-side savings cards
    if (carBudget && carSavingsGoal > 0) {
      drawRoundedRect(doc, 20, yPos, 80, 25, [219, 234, 254]);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.blue);
      doc.text('Dream Car Savings', 25, yPos + 7);
      doc.setFontSize(16);
      doc.setTextColor(...COLORS.black);
      doc.text(formatCurrency(carSavingsGoal), 95, yPos + 7, { align: 'right' });
      
      yPos += 13;
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...COLORS.gray);
      doc.text(`30% of salary (${formatCurrency(carSavingsGoalGross)}) - Current transport (${formatCurrency(currentTransportCost)})`, 25, yPos);
      yPos += 4;
      doc.text(`Target: ${formatCurrency(carDeposit)} deposit • ${monthsToSaveCar} months to save`, 25, yPos);
      
      yPos -= 17; // Reset for right card
    }
    
    if (houseBudget && houseSavingsGoal > 0) {
      drawRoundedRect(doc, 110, yPos, 80, 25, [220, 252, 231]);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.green);
      doc.text('Dream House Savings', 115, yPos + 7);
      doc.setFontSize(16);
      doc.setTextColor(...COLORS.black);
      doc.text(formatCurrency(houseSavingsGoal), 185, yPos + 7, { align: 'right' });
      
      yPos += 13;
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...COLORS.gray);
      doc.text(`30% of salary (${formatCurrency(houseSavingsGoalGross)}) - Current housing (${formatCurrency(currentHousingCost)})`, 115, yPos);
      yPos += 4;
      doc.text(`Target: ${formatCurrency(houseUpfrontCosts)} (deposit + costs) • ${monthsToSaveHouse} months to save`, 115, yPos);
    }
    
    yPos += 30;
    
    // Motivational message
    drawRoundedRect(doc, 30, yPos, 150, 20, [250, 245, 255]);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.purple);
    doc.text('Your Path to Success', 105, yPos + 8, { align: 'center' });
    
    yPos += 13;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.gray);
    doc.text(`By saving consistently, you'll achieve your dreams in just ${maxMonths} months!`, 105, yPos, { align: 'center' });
    yPos += 4;
    doc.text('Stay focused, track your progress, and watch your savings grow.', 105, yPos, { align: 'center' });
    
    // Footer
    drawFooter(doc);
  }
  
  doc.save('Nickle-Cashflow-Budget.pdf');
};

// Export other functions from the original file
export { exportHouseCalculatorToPDF, exportCarCalculatorToPDF } from './pdfExportBranded';

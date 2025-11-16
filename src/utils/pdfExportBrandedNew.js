import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Nickle logo as base64 (loaded from brand-assets)
const NICKLE_LOGO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAAD6CAYAAACI7Fo9AAAACXBIWXMAAAdiAAAHYgE4epnbAAAEYGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSfvu78nIGlkPSdXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQnPz4KPHg6eG1wbWV0YSB4bWxuczp4PSdhZG9iZTpuczptZXRhLyc+CjxyZGY6UkRGIHhtbG5zOnJkZj0naHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyc+CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczpBdHRyaWI9J2h0dHA6Ly9ucy5hdHRyaWJ1dGlvbi5jb20vYWRzLzEuMC8nPgogIDxBdHRyaWI6QWRzPgogICA8cmRmOlNlcT4KICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0nUmVzb3VyY2UnPgogICAgIDxBdHRyaWI6Q3JlYXRlZD4yMDI1LTAxLTA5PC9BdHRyaWI6Q3JlYXRlZD4KICAgICA8QXR0cmliOkV4dElkPmFhYzdjNjA0LWI5YTItNGQ3ZC1iNmNmLWJkNWQyMjY3MWJjNjwvQXR0cmliOkV4dElkPgogICAgIDxBdHRyaWI6RmJJZD41MjUyNjU5MTQxNzk1ODA8L0F0dHJpYjpGYklkPgogICAgIDxBdHRyaWI6VG91Y2hUeXBlPjI8L0F0dHJpYjpUb3VjaFR5cGU+CiAgICA8L3JkZjpsaT4KICAgPC9yZGY6U2VxPgogIDwvQXR0cmliOkFkcz4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6ZGM9J2h0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvJz4KICA8ZGM6dGl0bGU+CiAgIDxyZGY6QWx0PgogICAgPHJkZjpsaSB4bWw6bGFuZz0neC1kZWZhdWx0Jz5VbnRpdGxlZCBkZXNpZ24gLSAxPC9yZGY6bGk+CiAgIDwvcmRmOkFsdD4KICA8L2RjOnRpdGxlPgogPC9yZGY6RGVzY3JpcHRpb24+CgogPHJkZjpEZXNjcmlwdGlv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';

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

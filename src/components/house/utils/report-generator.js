import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency } from './formatters';

export const generateHouseReport = ({
  logoBase64,
  netSalary,
  budgetPercentage,
  affordableHousePrice,
  downPayment,
  term,
  interestRate,
  estimatedMonthlyRepayment,
  estimatedMonthlyExpenses,
  bondRegistrationRate,
  bondInitiationFee,
  expenses = [],
  transferDuty,
  bondRegistrationCost
}) => {
  const doc = new jsPDF();
  let yPosition = 15;

  // Helper functions
  const centerText = (text, y, fontSize = 12) => {
    doc.setFontSize(fontSize);
    const textWidth = doc.getStringUnitWidth(text) * fontSize / doc.internal.scaleFactor;
    const x = (doc.internal.pageSize.width - textWidth) / 2;
    doc.text(text, x, y);
  };

  const addSection = (title, y) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(title, 20, y);
    return y + 10;
  };

  const addSectionWithIcon = (title, y) => {
    // Could add icons if needed in future
    return addSection(title, y);
  };
  
  // Add logo and header
  if (logoBase64) {
    doc.addImage(logoBase64, 'PNG', 85, yPosition, 40, 40);
    yPosition += 45;
  }

  doc.setFont('helvetica', 'bold');
  centerText("House Cost Calculator Report", yPosition, 20);
  yPosition += 10;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  centerText("Smart Budgets Meet Big Ambitions", yPosition);
  yPosition += 10;
  centerText(new Date().toLocaleDateString('en-ZA', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }), yPosition);
  yPosition += 10;

  // Executive Summary
  doc.setDrawColor(200, 200, 200);
  doc.line(20, yPosition, 190, yPosition);
  yPosition += 10;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text("Executive Summary", 20, yPosition);
  yPosition += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const monthlyIncome = parseFloat(netSalary);
  const monthlyBudget = monthlyIncome * (budgetPercentage / 100);
  const totalMonthlyPayment = estimatedMonthlyRepayment + estimatedMonthlyExpenses;
  const disposableIncome = monthlyIncome - totalMonthlyPayment;
  
  const summaryText = [
    `Based on your monthly income of ${formatCurrency(monthlyIncome)}, you can afford a property of up to ${formatCurrency(affordableHousePrice)}.`,
    `With a ${budgetPercentage}% housing budget allocation, your monthly housing expenses will be ${formatCurrency(totalMonthlyPayment)}.`,
    `This leaves you with ${formatCurrency(disposableIncome)} monthly for other expenses and savings.`,
    `Your down payment of ${formatCurrency(downPayment)} represents ${(parseFloat(downPayment) / parseFloat(affordableHousePrice) * 100).toFixed(1)}% of the property value.`
  ];

  summaryText.forEach(text => {
    doc.text(text, 20, yPosition);
    yPosition += 7;
  });

  yPosition += 10;

  // Financial Overview
  yPosition = addSectionWithIcon("1. Financial Overview", yPosition);
  
  const financialOverview = [
    ['Monthly Income', formatCurrency(monthlyIncome)],
    ['Housing Budget (${budgetPercentage}%)', formatCurrency(monthlyBudget)],
    ['Remaining Income', formatCurrency(disposableIncome)],
    ['Debt-to-Income Ratio', `${((totalMonthlyPayment / monthlyIncome) * 100).toFixed(1)}%`],
    ['Monthly Savings Potential', formatCurrency(disposableIncome * 0.2)]
  ];

  doc.autoTable({
    startY: yPosition,
    head: [['Item', 'Value']],
    body: financialOverview,
    theme: 'striped',
    headStyles: { 
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    styles: { fontSize: 10, cellPadding: 5 },
    margin: { left: 20 }
  });

  yPosition = doc.lastAutoTable.finalY + 15;

  // Property Investment Analysis
  yPosition = addSectionWithIcon("2. Property Investment Analysis", yPosition);
  
  const propertyAnalysis = [
    ['Property Value', formatCurrency(affordableHousePrice)],
    ['Down Payment', formatCurrency(downPayment)],
    ['Loan Amount', formatCurrency(affordableHousePrice - parseFloat(downPayment))],
    ['Transfer Duty', formatCurrency(transferDuty)],
    ['Bond Registration Cost', formatCurrency(bondRegistrationCost)],
    ['Bond Initiation Fee', formatCurrency(bondInitiationFee)],
    ['Total Initial Investment', formatCurrency(parseFloat(downPayment) + transferDuty + bondRegistrationCost + bondInitiationFee)],
    ['Estimated Annual Property Appreciation (5%)', formatCurrency(affordableHousePrice * 0.05)]
  ];

  doc.autoTable({
    startY: yPosition,
    head: [['Investment Component', 'Amount']],
    body: propertyAnalysis,
    theme: 'striped',
    headStyles: { 
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    styles: { fontSize: 10, cellPadding: 5 },
    margin: { left: 20 }
  });

  yPosition = doc.lastAutoTable.finalY + 15;

  // Loan Analysis
  yPosition = addSectionWithIcon("3. Loan Analysis", yPosition);

  const totalInterest = estimatedMonthlyRepayment * term - (affordableHousePrice - parseFloat(downPayment));
  const totalCost = estimatedMonthlyRepayment * term + parseFloat(downPayment);
  
  const loanAnalysis = [
    ['Loan Term', `${term} months (${(term/12).toFixed(0)} years)`],
    ['Interest Rate', `${interestRate}%`],
    ['Monthly Repayment', formatCurrency(estimatedMonthlyRepayment)],
    ['Total Interest Over Term', formatCurrency(totalInterest)],
    ['Total Cost of Property', formatCurrency(totalCost)],
    ['Interest-to-Principal Ratio', `${((totalInterest / (affordableHousePrice - parseFloat(downPayment))) * 100).toFixed(1)}%`],
    ['Loan-to-Value Ratio', `${(((affordableHousePrice - parseFloat(downPayment)) / affordableHousePrice) * 100).toFixed(1)}%`]
  ];

  doc.autoTable({
    startY: yPosition,
    head: [['Loan Detail', 'Value']],
    body: loanAnalysis,
    theme: 'striped',
    headStyles: { 
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    styles: { fontSize: 10, cellPadding: 5 },
    margin: { left: 20 }
  });

  // Add new page for monthly costs and additional analysis
  doc.addPage();
  yPosition = 20;

  // Monthly Cost Analysis
  yPosition = addSectionWithIcon("4. Monthly Cost Analysis", yPosition);

  const monthlyCosts = [
    ['Bond Repayment', formatCurrency(estimatedMonthlyRepayment)],
    ...expenses.map(expense => [expense.name, formatCurrency(expense.amount)]),
    ['Total Monthly Expenses', formatCurrency(estimatedMonthlyExpenses)]
  ];

  doc.autoTable({
    startY: yPosition,
    head: [['Expense Category', 'Monthly Amount']],
    body: monthlyCosts,
    theme: 'striped',
    headStyles: { 
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    styles: { fontSize: 10, cellPadding: 5 },
    margin: { left: 20 },
    foot: [['Total Monthly Housing Costs', formatCurrency(estimatedMonthlyRepayment + estimatedMonthlyExpenses)]],
    footStyles: { 
      fillColor: [241, 245, 249],
      textColor: [0, 0, 0],
      fontStyle: 'bold'
    }
  });

  yPosition = doc.lastAutoTable.finalY + 15;

  // Risk Assessment
  yPosition = addSectionWithIcon("5. Risk Assessment", yPosition);

  const riskFactors = [
    ['Interest Rate Sensitivity', `A 1% increase would add ${formatCurrency((affordableHousePrice - parseFloat(downPayment)) * 0.01 / 12)} to monthly payments`],
    ['Affordability Buffer', `${formatCurrency(monthlyBudget - totalMonthlyPayment)} below maximum budget`],
    ['Down Payment Level', downPayment / affordableHousePrice >= 0.2 ? 'Good - 20% or more' : 'Consider increasing if possible'],
    ['Debt Service Ratio', `${((totalMonthlyPayment / monthlyIncome) * 100).toFixed(1)}% of income`],
    ['Emergency Fund Recommendation', formatCurrency(totalMonthlyPayment * 6)]
  ];

  doc.autoTable({
    startY: yPosition,
    head: [['Risk Factor', 'Assessment']],
    body: riskFactors,
    theme: 'striped',
    headStyles: { 
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    styles: { fontSize: 10, cellPadding: 5 },
    margin: { left: 20 }
  });

  yPosition = doc.lastAutoTable.finalY + 15;

  // Add new page for setup costs and recommendations
  doc.addPage();
  yPosition = 20;

  // Initial Setup Costs
  yPosition = addSectionWithIcon("6. Initial Setup Costs", yPosition);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  const setupCosts = [
    { 
      category: "Essential Legal Costs",
      items: [
        "Transfer duty: " + formatCurrency(transferDuty),
        "Bond registration: " + formatCurrency(bondRegistrationCost),
        "Bond initiation fee: " + formatCurrency(bondInitiationFee),
        "Legal fees for transfer and registration",
        "Property inspection fees"
      ]
    },
    {
      category: "Moving and Setup",
      items: [
        "Moving costs (typically R5,000 - R15,000)",
        "Security deposit for utilities",
        "Connection fees for services",
        "Basic repairs and maintenance"
      ]
    },
    {
      category: "Home Setup",
      items: [
        "Security system installation",
        "Essential appliances",
        "Basic furniture",
        "Window treatments",
        "Basic tools and maintenance items"
      ]
    }
  ];

  setupCosts.forEach(section => {
    doc.setFont('helvetica', 'bold');
    doc.text(section.category, 20, yPosition);
    yPosition += 7;
    
    doc.setFont('helvetica', 'normal');
    section.items.forEach(item => {
      doc.text(`• ${item}`, 30, yPosition);
      yPosition += 7;
    });
    yPosition += 5;
  });

  // Strategic Recommendations
  yPosition = addSectionWithIcon("7. Strategic Recommendations", yPosition);

  const recommendations = {
    "Financial Planning": [
      "Build an emergency fund of " + formatCurrency(totalMonthlyPayment * 6),
      "Consider mortgage insurance for added security",
      "Review and optimize other debt obligations",
      "Plan for annual property taxes and insurance increases"
    ],
    "Property Considerations": [
      "Research historical property value trends in target areas",
      "Consider future development plans in the area",
      "Evaluate potential rental income if needed",
      "Plan for long-term maintenance costs"
    ],
    "Risk Management": [
      "Get comprehensive building insurance",
      "Consider income protection insurance",
      "Create a maintenance fund for unexpected repairs",
      `Target saving ${formatCurrency(monthlyIncome * 0.1)} monthly for home maintenance`
    ],
    "Future Planning": [
      "Review property investment strategy annually",
      "Monitor interest rate changes and refinancing opportunities",
      "Plan for potential property value appreciation",
      "Consider additional property investments when able"
    ]
  };

  Object.entries(recommendations).forEach(([category, items]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(category, 20, yPosition);
    yPosition += 7;
    
    doc.setFont('helvetica', 'normal');
    items.forEach(item => {
      doc.text(`• ${item}`, 30, yPosition);
      yPosition += 7;
    });
    yPosition += 5;
  });

  // Footer on all pages
  const pageCount = doc.internal.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('Generated by Nickle House Cost Calculator', 20, 280);
    doc.text(new Date().toLocaleString(), 150, 280);
    doc.text(`Page ${i} of ${pageCount}`, 180, 280);
  }

  // Save the PDF
  doc.save('Nickle_House_Cost_Report.pdf');
};
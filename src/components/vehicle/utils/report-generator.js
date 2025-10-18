import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency } from './formatters';

export const generateVehicleReport = ({
  logoBase64,
  netSalary,
  budgetPercentage,
  affordableCarPrice,
  deposit,
  term,
  interestRate,
  balloonPayment,
  estimatedMonthlyRepayment,
  estimatedMonthlyExpenses,
  insurance,
  petrol,
  additionalExpenses = []
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
  centerText("Vehicle Cost Calculator Report", yPosition, 20);
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
    `Based on your monthly income of ${formatCurrency(monthlyIncome)}, you can afford a vehicle of up to ${formatCurrency(affordableCarPrice)}.`,
    `With a ${budgetPercentage}% vehicle budget allocation, your total monthly vehicle expenses will be ${formatCurrency(totalMonthlyPayment)}.`,
    `This leaves you with ${formatCurrency(disposableIncome)} monthly for other expenses and savings.`,
    `Your deposit of ${formatCurrency(deposit)} represents ${(parseFloat(deposit) / parseFloat(affordableCarPrice) * 100).toFixed(1)}% of the vehicle value.`,
    balloonPayment > 0 ? `Note: Your financing includes a balloon payment of ${balloonPayment}% (${formatCurrency((affordableCarPrice * balloonPayment) / 100)}).` : ''
  ].filter(text => text); // Remove empty strings

  summaryText.forEach(text => {
    doc.text(text, 20, yPosition);
    yPosition += 7;
  });

  yPosition += 10;

  // Financial Overview
  yPosition = addSectionWithIcon("1. Financial Overview", yPosition);
  
  const financialOverview = [
    ['Monthly Income', formatCurrency(monthlyIncome)],
    ['Vehicle Budget (${budgetPercentage}%)', formatCurrency(monthlyBudget)],
    ['Remaining Income', formatCurrency(disposableIncome)],
    ['Transportation Cost Ratio', `${((totalMonthlyPayment / monthlyIncome) * 100).toFixed(1)}%`],
    ['Monthly Savings Potential', formatCurrency(disposableIncome * 0.2)],
    ['Vehicle Expense Buffer', formatCurrency(monthlyBudget - totalMonthlyPayment)]
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

  // Vehicle Investment Analysis
  yPosition = addSectionWithIcon("2. Vehicle Investment Analysis", yPosition);
  
  const yearlyDepreciation = 15; // Average yearly depreciation rate
  const depreciationAmount = affordableCarPrice * (yearlyDepreciation / 100);
  
  const vehicleAnalysis = [
    ['Vehicle Value', formatCurrency(affordableCarPrice)],
    ['Deposit', formatCurrency(deposit)],
    ['Loan Amount', formatCurrency(affordableCarPrice - parseFloat(deposit))],
    ['Balloon Payment', formatCurrency((affordableCarPrice * balloonPayment) / 100)],
    ['Estimated Annual Depreciation', formatCurrency(depreciationAmount)],
    ['Estimated Value After Year 1', formatCurrency(affordableCarPrice - depreciationAmount)],
    ['Total Initial Investment', formatCurrency(parseFloat(deposit))],
    ['5-Year Total Cost of Ownership*', formatCurrency((totalMonthlyPayment * 60) + parseFloat(deposit))]
  ];

  doc.autoTable({
    startY: yPosition,
    head: [['Investment Component', 'Amount']],
    body: vehicleAnalysis,
    theme: 'striped',
    headStyles: { 
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    styles: { fontSize: 10, cellPadding: 5 },
    margin: { left: 20 }
  });

  doc.setFontSize(8);
  doc.text('* Includes deposit, monthly payments, and running costs over 5 years', 20, doc.lastAutoTable.finalY + 5);

  yPosition = doc.lastAutoTable.finalY + 15;

  // Loan Analysis
  yPosition = addSectionWithIcon("3. Loan Analysis", yPosition);

  const totalInterest = estimatedMonthlyRepayment * term - (affordableCarPrice - parseFloat(deposit));
  const totalCost = estimatedMonthlyRepayment * term + parseFloat(deposit);
  
  const loanAnalysis = [
    ['Loan Term', `${term} months (${(term/12).toFixed(1)} years)`],
    ['Interest Rate', `${interestRate}%`],
    ['Monthly Repayment', formatCurrency(estimatedMonthlyRepayment)],
    ['Total Interest Over Term', formatCurrency(totalInterest)],
    ['Total Cost Including Balloon', formatCurrency(totalCost + ((affordableCarPrice * balloonPayment) / 100))],
    ['Interest-to-Principal Ratio', `${((totalInterest / (affordableCarPrice - parseFloat(deposit))) * 100).toFixed(1)}%`],
    ['Loan-to-Value Ratio', `${(((affordableCarPrice - parseFloat(deposit)) / affordableCarPrice) * 100).toFixed(1)}%`]
  ];

  // Add new page if needed
  if (yPosition > 220) {
    doc.addPage();
    yPosition = 20;
  }

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
    ['Vehicle Repayment', formatCurrency(estimatedMonthlyRepayment)],
    ['Insurance', formatCurrency(insurance)],
    ['Fuel', formatCurrency(petrol)],
    ...additionalExpenses.map(expense => [expense.name, formatCurrency(expense.amount)])
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
    foot: [['Total Monthly Vehicle Costs', formatCurrency(totalMonthlyPayment)]],
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
    ['Interest Rate Sensitivity', `A 1% increase would add ${formatCurrency((affordableCarPrice - parseFloat(deposit)) * 0.01 / 12)} to monthly payments`],
    ['Affordability Buffer', `${formatCurrency(monthlyBudget - totalMonthlyPayment)} below maximum budget`],
    ['Deposit Level', deposit / affordableCarPrice >= 0.2 ? 'Good - 20% or more' : 'Consider increasing if possible'],
    ['Transportation Cost Ratio', `${((totalMonthlyPayment / monthlyIncome) * 100).toFixed(1)}% of income`],
    ['Balloon Payment Risk', balloonPayment > 0 ? `High - ${formatCurrency((affordableCarPrice * balloonPayment) / 100)} due at end` : 'None']
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

  // Add new page for ownership costs and recommendations
  doc.addPage();
  yPosition = 20;

  // Vehicle Ownership Costs
  yPosition = addSectionWithIcon("6. Additional Ownership Considerations", yPosition);

  const ownershipCosts = [
    {
      category: "Annual Fixed Costs",
      items: [
        "License renewal: R300 - R800 per year",
        "Insurance excess fund: " + formatCurrency(insurance * 2),
        "Annual service: R3,000 - R8,000",
        "Tire replacement fund: R1,000 - R1,500 monthly",
        "Vehicle tracking: R150 - R300 monthly"
      ]
    },
    {
      category: "Variable Costs",
      items: [
        `Fuel: ${formatCurrency(petrol)} monthly (may vary with usage)`,
        "Maintenance and repairs fund: " + formatCurrency(affordableCarPrice * 0.05) + " annually",
        "Car wash and cleaning: R300 - R500 monthly",
        "Parking and toll fees (if applicable)",
        "Traffic fines contingency"
      ]
    },
    {
      category: "Long-term Considerations",
      items: [
        `Annual depreciation: ${formatCurrency(depreciationAmount)}`,
        "Extended warranty costs",
        "Service plan expiration",
        "Insurance premium increases",
        "Fuel price fluctuations"
      ]
    }
  ];

  ownershipCosts.forEach(section => {
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
      `Build an emergency car fund of ${formatCurrency(totalMonthlyPayment * 3)}`,
      "Consider gap insurance for comprehensive coverage",
      "Review insurance options annually",
      `Save ${formatCurrency(affordableCarPrice * 0.05)} annually for maintenance`
    ],
    "Cost Management": [
      "Track fuel consumption and optimize routes",
      "Consider carpooling opportunities",
      "Maintain vehicle regularly to prevent major repairs",
      "Compare insurance quotes annually"
    ],
    "Risk Management": [
      balloonPayment > 0 ? `Plan for balloon payment of ${formatCurrency((affordableCarPrice * balloonPayment) / 100)}` : "Consider gap insurance",
      "Keep detailed service records",
      "Build an emergency repair fund",
      "Consider income protection insurance"
    ],
    "Future Planning": [
      "Review vehicle needs annually",
      "Monitor interest rates for refinancing opportunities",
      "Plan for vehicle replacement in 5-7 years",
      "Consider future resale value"
    ]
  };

  Object.entries(recommendations).forEach(([category, items]) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
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

  // Add footnote about balloon payment if applicable
  if (balloonPayment > 0) {
    doc.addPage();
    yPosition = 20;
    doc.setFont('helvetica', 'bold');
    doc.text("Important Note About Your Balloon Payment", 20, yPosition);
    yPosition += 10;
    
    doc.setFont('helvetica', 'normal');
    const balloonNote = [
    `Your financing plan includes a balloon payment of ${formatCurrency((affordableCarPrice * balloonPayment) / 100)} due at the end of your loan term.`,
      `This represents ${balloonPayment}% of your vehicle's purchase price.`,
      "Consider these strategies to manage your balloon payment:",
      "• Start saving monthly: " + formatCurrency((affordableCarPrice * balloonPayment) / 100 / term) + " per month",
      "• Refinance before term end",
      "• Sell vehicle to cover balloon (consider depreciation)",
      "• Trade in for a new vehicle",
      "\nNOTE: Balloon payments can significantly increase the total cost of ownership."
    ].join('\n\n');
    
    doc.text(balloonNote, 20, yPosition);
  }

  // Total Cost of Ownership Summary
  doc.addPage();
  yPosition = 20;
  
  yPosition = addSectionWithIcon("8. Five-Year Cost of Ownership Projection", yPosition);
  
  const fiveYearAnalysis = [
    ['Initial Purchase Costs', formatCurrency(parseFloat(deposit))],
    ['Total Repayments', formatCurrency(estimatedMonthlyRepayment * Math.min(term, 60))],
    ['Total Running Costs', formatCurrency(estimatedMonthlyExpenses * 60)],
    ['Estimated Maintenance', formatCurrency(affordableCarPrice * 0.15)],
    ['Projected Depreciation', formatCurrency(affordableCarPrice * 0.5)],
    ['Balloon Payment', formatCurrency((affordableCarPrice * balloonPayment) / 100)],
    ['Estimated Resale Value', formatCurrency(affordableCarPrice * 0.5)],
    ['Net 5-Year Cost', formatCurrency(
      parseFloat(deposit) + 
      (estimatedMonthlyRepayment * Math.min(term, 60)) + 
      (estimatedMonthlyExpenses * 60) + 
      (affordableCarPrice * 0.15) - 
      (affordableCarPrice * 0.5)
    )]
  ];

  doc.autoTable({
    startY: yPosition,
    head: [['Cost Component', '5-Year Projection']],
    body: fiveYearAnalysis,
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

  // Monthly Budget Impact Analysis
  yPosition = addSectionWithIcon("9. Monthly Budget Impact Analysis", yPosition);

  const budgetImpact = [
    ['Category', 'Pre-Vehicle', 'Post-Vehicle', 'Impact'],
    ['Disposable Income', formatCurrency(monthlyIncome), formatCurrency(monthlyIncome - totalMonthlyPayment), formatCurrency(-totalMonthlyPayment)],
    ['Available for Savings', formatCurrency(monthlyIncome * 0.2), formatCurrency((monthlyIncome - totalMonthlyPayment) * 0.2), formatCurrency((monthlyIncome * 0.2) - ((monthlyIncome - totalMonthlyPayment) * 0.2))],
    ['Emergency Fund Capability', '100%', `${(((monthlyIncome - totalMonthlyPayment) / monthlyIncome) * 100).toFixed(1)}%`, `${(-totalMonthlyPayment / monthlyIncome * 100).toFixed(1)}%`]
  ];

  doc.autoTable({
    startY: yPosition,
    body: budgetImpact,
    theme: 'striped',
    headStyles: { 
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    styles: { fontSize: 10, cellPadding: 5 },
    margin: { left: 20 }
  });

  // Final Tips and Advice
  yPosition = doc.lastAutoTable.finalY + 15;
  yPosition = addSectionWithIcon("10. Key Takeaways and Action Items", yPosition);

  const takeaways = [
    `• Monthly commitment: ${formatCurrency(totalMonthlyPayment)} (${((totalMonthlyPayment / monthlyIncome) * 100).toFixed(1)}% of income)`,
    `• Emergency fund target: ${formatCurrency(totalMonthlyPayment * 3)}`,
    `• Recommended maintenance fund: ${formatCurrency(affordableCarPrice * 0.05)} annually`,
    `• Consider refinancing if interest rates drop by 2% or more`,
    `• Review insurance annually - current premium is ${formatCurrency(insurance)}`,
    balloonPayment > 0 ? `• Plan for balloon payment: ${formatCurrency((affordableCarPrice * balloonPayment) / 100)}` : '',
    `• Track all vehicle expenses for tax and budgeting purposes`
  ].filter(item => item); // Remove empty strings

  takeaways.forEach(item => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    doc.text(item, 20, yPosition);
    yPosition += 7;
  });

  // Footer on all pages
  const pageCount = doc.internal.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('Generated by Nickle Vehicle Cost Calculator', 20, 280);
    doc.text(new Date().toLocaleString(), 150, 280);
    doc.text(`Page ${i} of ${pageCount}`, 180, 280);
  }

  // Save the PDF
  doc.save('Nickle_Vehicle_Cost_Report.pdf');
};
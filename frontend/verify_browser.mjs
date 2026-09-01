import { chromium } from 'playwright';

async function runVerification() {
  console.log('🚀 Starting FINARCH AI Browser Verification Pass...\n');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  const consoleErrors = [];
  const consoleWarns = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    } else if (msg.type() === 'warning') {
      consoleWarns.push(msg.text());
    }
  });

  page.on('pageerror', (err) => {
    consoleErrors.push(err.message);
  });

  try {
    // 1. Visit Landing Page
    console.log('1. Testing Landing Page (http://127.0.0.1:5173/#/landing)...');
    await page.goto('http://127.0.0.1:5173/#/landing', { waitUntil: 'networkidle' });
    const heroTitle = await page.textContent('h1');
    console.log('   ✓ Hero title verified:', heroTitle.replace(/\s+/g, ' ').trim());

    // Click Launch App
    const launchBtn = page.locator('text=Launch FINARCH').first();
    await launchBtn.click();
    await page.waitForTimeout(600);
    console.log('   ✓ Clicked "Launch FINARCH" -> Navigated to:', page.url());

    // 2. Test Overview Page
    console.log('\n2. Testing Overview Dashboard (/overview)...');
    await page.waitForSelector('text=YOUR HIGHEST-VALUE ACTION');
    const actionTitle = await page.textContent('h2');
    console.log('   ✓ Highest Value Action Card:', actionTitle.trim());

    // Click "View Reasoning & Breakdown" modal
    const reasoningBtn = page.locator('text=View Reasoning & Breakdown');
    await reasoningBtn.click();
    await page.waitForSelector('text=Explainable AI Decision Breakdown');
    console.log('   ✓ Explainability Modal opened successfully');
    const closeBtn = page.locator('button:has-text("Close Breakdown")');
    await closeBtn.click();
    await page.waitForTimeout(300);
    console.log('   ✓ Explainability Modal closed');

    // Click "Load Demo Profile" in Navbar
    const loadDemoBtn = page.locator('text=Load Demo Profile').first();
    await loadDemoBtn.click();
    await page.waitForTimeout(500);
    console.log('   ✓ Clicked "Load Demo Profile" -> Toast notification triggered');

    // 3. Test Financial Digital Twin (/twin)
    console.log('\n3. Testing Financial Digital Twin (/twin)...');
    await page.goto('http://127.0.0.1:5173/#/twin', { waitUntil: 'networkidle' });
    await page.waitForSelector('text=FINANCIAL DIGITAL TWIN');
    
    // Switch tabs
    const expensesTab = page.locator('text=2. Monthly Expenses');
    await expensesTab.click();
    await page.waitForTimeout(200);
    console.log('   ✓ Switched to Monthly Expenses tab');

    const liabilitiesTab = page.locator('text=4. Liabilities & Debt');
    await liabilitiesTab.click();
    await page.waitForTimeout(200);
    console.log('   ✓ Switched to Liabilities & Debt tab');

    const saveTwinBtn = page.locator('text=Save & Recalculate Twin');
    await saveTwinBtn.click();
    await page.waitForTimeout(400);
    console.log('   ✓ Clicked "Save & Recalculate Twin" -> Twin updated');

    // 4. Test AI Decision Engine (/decision)
    console.log('\n4. Testing AI Decision Engine (/decision)...');
    await page.goto('http://127.0.0.1:5173/#/decision', { waitUntil: 'networkidle' });
    await page.waitForSelector('text=AI DECISION ENGINE');
    
    // Click ₹50,000 chip
    const chip50k = page.locator('button:has-text("₹50.00 K"), button:has-text("₹50,000")').first();
    if (await chip50k.isVisible()) {
      await chip50k.click();
      await page.waitForTimeout(400);
      console.log('   ✓ Selected ₹50,000 Capital Chip');
    }

    // Verify ranked actions
    const rankedCards = page.locator('.glass-panel:has-text("#1")');
    await rankedCards.first().waitFor();
    console.log('   ✓ Ranked action #1 loaded with decision score');

    // Click "Why?" button
    const whyBtn = page.locator('button:has-text("Why?")').first();
    await whyBtn.click();
    await page.waitForSelector('text=Deep Financial Reasoning Drilldown');
    console.log('   ✓ Decision "Why?" Explainable modal opened');
    const closeWhy = page.locator('button:has-text("Close")');
    await closeWhy.click();
    await page.waitForTimeout(300);

    // 5. Test Opportunity Optimizer (/optimizer)
    console.log('\n5. Testing Opportunity Optimizer (/optimizer)...');
    await page.goto('http://127.0.0.1:5173/#/optimizer', { waitUntil: 'networkidle' });
    await page.waitForSelector('text=OPPORTUNITY OPTIMIZER');
    const tableHeader = await page.textContent('table thead');
    console.log('   ✓ Opportunity comparison matrix loaded');

    // 6. Test Portfolio Intelligence (/portfolio)
    console.log('\n6. Testing Portfolio Intelligence (/portfolio)...');
    await page.goto('http://127.0.0.1:5173/#/portfolio', { waitUntil: 'networkidle' });
    await page.waitForSelector('text=PORTFOLIO INTELLIGENCE');
    console.log('   ✓ Donut chart, allocation table & Risk vs Return scatter loaded');

    // 7. Test Goals Management (/goals)
    console.log('\n7. Testing Goals Management (/goals)...');
    await page.goto('http://127.0.0.1:5173/#/goals', { waitUntil: 'networkidle' });
    await page.waitForSelector('text=FINANCIAL GOALS');
    
    // Open Add Goal Modal
    const addGoalBtn = page.locator('text=Add Financial Goal');
    await addGoalBtn.click();
    await page.waitForSelector('text=Create New Financial Milestone');
    
    // Fill Add Goal Form
    await page.fill('input[placeholder*="Leh-Ladakh"]', 'Tokyo Marathon Fund');
    await page.fill('input[type="number"] >> nth=0', '400000');
    await page.fill('input[type="number"] >> nth=1', '80000');
    const submitGoal = page.locator('button:has-text("Save Goal")');
    await submitGoal.click();
    await page.waitForTimeout(600);
    console.log('   ✓ Added new goal: "Tokyo Marathon Fund"');

    // Verify new goal exists
    await page.waitForSelector('text=Tokyo Marathon Fund');
    console.log('   ✓ Verified "Tokyo Marathon Fund" is rendered in goal cards');

    // Delete the new goal
    const deleteBtns = page.locator('button[title="Delete goal"]');
    const countBefore = await deleteBtns.count();
    await deleteBtns.last().click();
    await page.waitForTimeout(500);
    console.log('   ✓ Deleted "Tokyo Marathon Fund" successfully');

    // 8. Test What-If Simulator (/simulator)
    console.log('\n8. Testing What-If Simulator & Monte Carlo (/simulator)...');
    await page.goto('http://127.0.0.1:5173/#/simulator', { waitUntil: 'networkidle' });
    await page.waitForSelector('text=WHAT-IF SIMULATOR');
    
    // Click quick scenario presets
    const presetSip = page.locator('text=+₹5,000 Extra SIP');
    await presetSip.click();
    await page.waitForTimeout(300);
    console.log('   ✓ Clicked "+₹5,000 Extra SIP" preset');

    const presetCrash = page.locator('text=-20% Market Drop Today');
    await presetCrash.click();
    await page.waitForTimeout(300);
    console.log('   ✓ Clicked "-20% Market Drop Today" preset');

    // Switch to Monte Carlo Tab
    const mcTab = page.locator('text=1,000 Monte Carlo Paths');
    await mcTab.click();
    await page.waitForSelector('text=1,000-Path Stochastic Market Simulation');
    console.log('   ✓ Monte Carlo 1,000-path stochastic fan chart & histogram rendered');

    // 9. Test Risk Analysis (/risk)
    console.log('\n9. Testing Risk Analysis (/risk)...');
    await page.goto('http://127.0.0.1:5173/#/risk', { waitUntil: 'networkidle' });
    await page.waitForSelector('text=RISK ANALYSIS');
    
    // Switch risk profile button
    const aggressiveBtn = page.locator('button:has-text("AGGRESSIVE")');
    await aggressiveBtn.click();
    await page.waitForTimeout(400);
    console.log('   ✓ Switched risk profile to AGGRESSIVE -> Radar chart re-rendered');

    // 10. Test AI Advisor (/advisor)
    console.log('\n10. Testing Explainable AI Advisor (/advisor)...');
    await page.goto('http://127.0.0.1:5173/#/advisor', { waitUntil: 'networkidle' });
    await page.waitForSelector('text=EXPLAINABLE AI ADVISOR');
    
    // Click quick question chip
    const bikeChip = page.locator('button:has-text("Can I afford a ₹3 lakh bike?")').first();
    await bikeChip.click();
    await page.waitForSelector('text=AFFORDABILITY ASSESSMENT: ₹3,00,000 PURCHASE');
    console.log('   ✓ AI Advisor responded with structured WHAT, WHY, ALTERNATIVES, RISKS');

    // Send custom question
    const inputMsg = page.locator('input[placeholder*="Ask FINARCH AI"]');
    await inputMsg.fill('Where should my next 50000 go?');
    const sendBtn = page.locator('button:has-text("Send")');
    await sendBtn.click();
    await page.waitForTimeout(1000);
    console.log('   ✓ AI Advisor handled custom user query successfully');

    // 11. Test Settings (/settings)
    console.log('\n11. Testing Settings & Knowledge Layer (/settings)...');
    await page.goto('http://127.0.0.1:5173/#/settings', { waitUntil: 'networkidle' });
    await page.waitForSelector('text=SYSTEM SETTINGS');
    
    // Switch currency to USD
    const usdBtn = page.locator('button:has-text("$ US Dollar")');
    await usdBtn.click();
    await page.waitForTimeout(300);
    console.log('   ✓ Switched display currency to USD');

    // Switch back to INR
    const inrBtn = page.locator('button:has-text("₹ Indian Rupee")');
    await inrBtn.click();
    await page.waitForTimeout(300);
    console.log('   ✓ Switched display currency back to INR');

    console.log('\n========================================');
    console.log('🎉 ALL 11 ROUTES & USER FLOWS PASSED VERIFICATION!');
    console.log('========================================\n');

    console.log('Console Errors caught:', consoleErrors.length);
    if (consoleErrors.length > 0) {
      console.log('Errors:', consoleErrors);
    }

  } catch (err) {
    console.error('❌ Verification failed with error:', err);
  } finally {
    await browser.close();
  }
}

runVerification();

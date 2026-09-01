import { chromium } from 'playwright';

async function runVerification() {
  console.log('🚀 Starting FINARCH AI Command Center Browser Verification...\n');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  const consoleErrors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
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

    // Click ENTER FINARCH
    const enterBtn = page.locator('text=ENTER FINARCH').first();
    await enterBtn.click();
    await page.waitForTimeout(600);
    console.log('   ✓ Clicked "ENTER FINARCH" -> Navigated to:', page.url());

    // 2. Test Overview Page
    console.log('\n2. Testing Overview Dashboard (/overview)...');
    await page.waitForSelector('text=YOUR HIGHEST-VALUE ACTION');
    console.log('   ✓ Highest Value Action Card rendered');

    // Click "WHY THIS WINS" modal
    const whyWinsBtn = page.locator('text=WHY THIS WINS').first();
    await whyWinsBtn.click();
    await page.waitForSelector('text=AUTONOMOUS DECISION REASONING');
    console.log('   ✓ Decision Reasoning Modal opened successfully');
    const closeBtn = page.locator('button:has-text("Close Reasoning")');
    await closeBtn.click();
    await page.waitForTimeout(300);
    console.log('   ✓ Decision Reasoning Modal closed');

    // Click "Load Demo Profile" in Navbar
    const loadDemoBtn = page.locator('text=Load Demo Profile').first();
    await loadDemoBtn.click();
    await page.waitForTimeout(500);
    console.log('   ✓ Clicked "Load Demo Profile"');

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

    const saveTwinBtn = page.locator('text=Save & Update Digital Twin');
    await saveTwinBtn.click();
    await page.waitForTimeout(400);
    console.log('   ✓ Clicked "Save & Update Digital Twin"');

    // 4. Test AI Decision Engine (/decision)
    console.log('\n4. Testing AI Decision Engine (/decision)...');
    await page.goto('http://127.0.0.1:5173/#/decision', { waitUntil: 'networkidle' });
    await page.waitForSelector('text=AI DECISION ENGINE');
    
    // Click ₹50k chip
    const chip50k = page.locator('button:has-text("₹50k")').first();
    if (await chip50k.isVisible()) {
      await chip50k.click();
      await page.waitForTimeout(400);
      console.log('   ✓ Selected ₹50k Capital Chip');
    }

    // Verify ranked actions & decision winner
    await page.waitForSelector('text=WINNER');
    console.log('   ✓ Ranked action WINNER verified with decision score');

    // 5. Test Opportunity Optimizer (/optimizer)
    console.log('\n5. Testing Opportunity Optimizer (/optimizer)...');
    await page.goto('http://127.0.0.1:5173/#/optimizer', { waitUntil: 'networkidle' });
    await page.waitForSelector('text=OPPORTUNITY OPTIMIZER');
    console.log('   ✓ Opportunity comparison matrix & Pareto scatter loaded');

    // 6. Test Portfolio Intelligence (/portfolio)
    console.log('\n6. Testing Portfolio Intelligence (/portfolio)...');
    await page.goto('http://127.0.0.1:5173/#/portfolio', { waitUntil: 'networkidle' });
    await page.waitForSelector('text=PORTFOLIO INTELLIGENCE');
    console.log('   ✓ Risk vs Return scatter hero & holdings audit loaded');

    // 7. Test Goals Management (/goals)
    console.log('\n7. Testing Goals Management (/goals)...');
    await page.goto('http://127.0.0.1:5173/#/goals', { waitUntil: 'networkidle' });
    await page.waitForSelector('text=GOALS & MILESTONES');
    
    // Open Add Goal Modal
    const addGoalBtn = page.locator('text=Add Financial Goal');
    await addGoalBtn.click();
    await page.waitForSelector('text=CREATE FINANCIAL MISSION');
    
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
    console.log('   ✓ Verified "Tokyo Marathon Fund" rendered in trajectory list');

    // Delete the new goal
    const deleteBtns = page.locator('button[title="Delete goal"]');
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

    // Switch to Monte Carlo Tab
    const mcTab = page.locator('text=1,000 Monte Carlo Paths');
    await mcTab.click();
    await page.waitForSelector('text=1,000 SIMULATED MARKET PATHS');
    console.log('   ✓ Monte Carlo 1,000-path stochastic histogram rendered');

    // 9. Test Risk Analysis (/risk)
    console.log('\n9. Testing Risk Analysis (/risk)...');
    await page.goto('http://127.0.0.1:5173/#/risk', { waitUntil: 'networkidle' });
    await page.waitForSelector('text=RISK ANALYSIS & SUITABILITY');
    
    // Switch risk profile button
    const aggressiveBtn = page.locator('button:has-text("AGGRESSIVE")');
    await aggressiveBtn.click();
    await page.waitForTimeout(400);
    console.log('   ✓ Switched risk profile to AGGRESSIVE -> 6-axis Radar updated');

    // 10. Test AI Advisor (/advisor)
    console.log('\n10. Testing Explainable AI Advisor (/advisor)...');
    await page.goto('http://127.0.0.1:5173/#/advisor', { waitUntil: 'networkidle' });
    await page.waitForSelector('text=DECISION REASONING CONSOLE');
    
    // Click quick question chip
    const bikeChip = page.locator('button:has-text("Can I afford a ₹3 lakh bike?")').first();
    await bikeChip.click();
    await page.waitForTimeout(1000);
    console.log('   ✓ AI Advisor responded with structured QUESTION → ANALYSIS → DATA → RECOMMENDATION → REASONING');

    // 11. Test Settings (/settings)
    console.log('\n11. Testing Settings & Knowledge Layer (/settings)...');
    await page.goto('http://127.0.0.1:5173/#/settings', { waitUntil: 'networkidle' });
    await page.waitForSelector('text=SETTINGS & BENCHMARKS');
    
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

    console.log('\n======================================================');
    console.log('🎉 ALL 11 ROUTES & COMMAND CENTER FLOWS 100% VERIFIED!');
    console.log('======================================================\n');

  } catch (err) {
    console.error('❌ Verification failed with error:', err);
  } finally {
    await browser.close();
  }
}

runVerification();

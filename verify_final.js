const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  // Navigate to the report page
  await page.goto('file://' + process.cwd() + '/diaspora-report.html');

  // Inject CSS to ensure animations are visible
  await page.addStyleTag({ content: '.fade-in, .reveal-text { opacity: 1 !important; transform: none !important; visibility: visible !important; }' });

  // Wait a bit for everything to settle
  await page.waitForTimeout(1000);

  // Take screenshot of the "Why This Matters" section
  const whySection = await page.$('#why-this-matters');
  if (whySection) {
    await whySection.screenshot({ path: 'verification/3-final-context-style.png' });
  }

  // Take screenshot of the Hero section
  const heroSection = await page.$('#report-hero');
  if (heroSection) {
    await heroSection.screenshot({ path: 'verification/4-final-hero-style.png' });
  }

  await browser.close();
})();

const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set viewport for desktop
  await page.setViewportSize({ width: 1280, height: 800 });

  // Load the new Diaspora Report page
  await page.goto('file://' + process.cwd() + '/diaspora-report.html');

  // Inject CSS to force animations to finished state for screenshot
  await page.addStyleTag({ content: `
    .fade-in { opacity: 1 !important; transform: none !important; transition: none !important; }
    .reveal-text span { transform: none !important; transition: none !important; }
  `});

  // Wait for images to load
  await page.waitForLoadState('networkidle');

  // Screenshot Hero
  await page.screenshot({ path: 'verification/diaspora_hero.png' });

  // Scroll to "Why This Matters"
  const contextSection = await page.$('#why-this-matters');
  if (contextSection) {
    await contextSection.scrollIntoViewIfNeeded();
    await page.screenshot({ path: 'verification/diaspora_context.png' });
  }

  // Verify Modal
  await page.click('.download-trigger');
  await page.waitForSelector('#download-modal.active');
  await page.screenshot({ path: 'verification/diaspora_modal.png' });

  // Verify Insights Page Link
  await page.goto('file://' + process.cwd() + '/insights.html');
  await page.addStyleTag({ content: `
    .fade-in { opacity: 1 !important; transform: none !important; transition: none !important; }
    .reveal-text span { transform: none !important; transition: none !important; }
  `});
  await page.screenshot({ path: 'verification/insights_updated.png' });

  await browser.close();
})();

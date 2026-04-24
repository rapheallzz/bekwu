import asyncio
from playwright.async_api import async_playwright
import os

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 1280, 'height': 800})
        page = await context.new_page()

        # Path to the local index.html
        path = f"file://{os.getcwd()}/index.html"
        await page.goto(path)

        # Inject CSS to make sure everything is visible for the screenshot
        await page.add_style_tag(content="""
            .fade-in, .reveal-text span, .zoom-on-hover img, .capability, .stat-item, .hero-content-box, .button-wrapper {
                opacity: 1 !important;
                visibility: visible !important;
                transform: none !important;
            }
        """)

        await page.wait_for_timeout(1000)

        # Take screenshot of the intro section
        intro = await page.query_selector("#intro")
        await intro.screenshot(path="intro_fix.png")

        # Take screenshot of the bottom sections
        await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        await page.wait_for_timeout(1000)
        await page.screenshot(path="homepage_bottom_fix.png", full_page=True)

        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify())

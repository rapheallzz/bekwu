import asyncio
from playwright.async_api import async_playwright
import os

async def verify_scroll_btn():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 1280, 'height': 800})
        page = await context.new_page()

        # Load local file
        path = os.path.abspath('index.html')
        await page.goto(f'file://{path}')

        # Ensure scroll animations don't hide elements
        await page.add_style_tag(content=".fade-in { opacity: 1 !important; transform: none !important; }")

        # Initially button should be hidden
        btn = page.locator('#back-to-top')

        # Scroll down
        await page.evaluate("window.scrollTo(0, 1000)")
        await page.wait_for_timeout(1000) # wait for transition

        has_class = await page.evaluate("document.getElementById('back-to-top').classList.contains('visible')")
        print(f"Has 'visible' class after scroll: {has_class}")

        # Screenshot of the button area
        await page.screenshot(path='verification/back_to_top_visible.png')

        # Click button
        await btn.click()
        await page.wait_for_timeout(2000) # wait for smooth scroll

        scroll_y = await page.evaluate("window.scrollY")
        print(f"Scroll Y after click: {scroll_y}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify_scroll_btn())

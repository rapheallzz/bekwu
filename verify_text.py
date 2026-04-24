import asyncio
from playwright.async_api import async_playwright
import os

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={'width': 1280, 'height': 800})

        # Helper to wait for animations and force visibility
        async def prepare_page(page):
            await page.evaluate("""() => {
                document.body.classList.add('audit-mode');
                const style = document.createElement('style');
                style.textContent = `
                    .fade-in, .reveal-text span {
                        opacity: 1 !important;
                        transform: none !important;
                        transition: none !important;
                    }
                `;
                document.head.appendChild(style);
            }""")

        output_dir = "verification"
        os.makedirs(output_dir, exist_ok=True)

        # Specialty check
        await page.goto(f"file://{os.getcwd()}/index.html")
        await prepare_page(page)

        specialty = await page.query_selector("#specialty")
        await specialty.screenshot(path=f"{output_dir}/v_specialty_fixed.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify())

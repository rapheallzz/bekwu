from playwright.sync_api import sync_playwright
import os

def verify():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={'width': 1280, 'height': 800})

        # Inject CSS to force animations to end for screenshots
        inject_css = """
        * {
            transition: none !important;
            animation: none !important;
        }
        .fade-in, .reveal-text span {
            opacity: 1 !important;
            transform: none !important;
        }
        """

        # 1. Index Specialty
        page.goto(f"file://{os.getcwd()}/index.html")
        page.add_style_tag(content=inject_css)
        specialty = page.locator("#specialty")
        specialty.scroll_into_view_if_needed()
        specialty.screenshot(path="verification/index_wrapping.png")

        # 2. About Lens
        page.goto(f"file://{os.getcwd()}/about.html")
        page.add_style_tag(content=inject_css)
        lens = page.locator("#lens")
        lens.scroll_into_view_if_needed()
        lens.screenshot(path="verification/about_wrapping.png")

        # 3. Insights Card
        page.goto(f"file://{os.getcwd()}/insights.html")
        page.add_style_tag(content=inject_css)
        tiles = page.locator("#insight-tiles")
        tiles.scroll_into_view_if_needed()
        tiles.screenshot(path="verification/insights_wrapping.png")

        browser.close()

if __name__ == "__main__":
    verify()

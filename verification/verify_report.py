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

        # Load Diaspora Report Page
        page.goto(f"file://{os.getcwd()}/diaspora-report.html")
        page.add_style_tag(content=inject_css)

        # Screenshot Hero
        page.screenshot(path="verification/diaspora_hero.png")

        # Scroll to Context
        page.locator("#why-this-matters").scroll_into_view_if_needed()
        page.screenshot(path="verification/diaspora_context.png")

        # Open Modal
        page.click(".download-trigger")
        page.wait_for_selector("#download-modal.active")
        page.screenshot(path="verification/diaspora_modal.png")

        # Verify Insights Page
        page.goto(f"file://{os.getcwd()}/insights.html")
        page.add_style_tag(content=inject_css)
        page.locator("#insight-tiles").scroll_into_view_if_needed()
        page.screenshot(path="verification/insights_updated.png")

        browser.close()

if __name__ == "__main__":
    verify()

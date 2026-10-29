import asyncio
import sys
from playwright.async_api import async_playwright

sys.stdout.reconfigure(encoding='utf-8')

ROUTES = [
    "/", "/work", "/services", "/about", "/contact",
    "/services/ui-ux-design", "/work/spotlight-contest"
]

async def check():
    async with async_playwright() as p:
        b = await p.chromium.launch(channel='msedge', headless=True)
        page = await b.new_page(viewport={'width': 390, 'height': 844})
        for path in ROUTES:
            await page.goto(f"http://localhost:3000{path}")
            targets = await page.evaluate('''() => {
                const res = [];
                document.querySelectorAll('a, button, input, select, textarea').forEach(el => {
                    const r = el.getBoundingClientRect();
                    const style = window.getComputedStyle(el);
                    if (r.width > 0 && r.height > 0 && style.visibility !== 'hidden' && style.display !== 'none') {
                        if (r.width < 44 || r.height < 44) {
                            res.push({
                                tag: el.tagName,
                                cls: (el.className || '').toString().slice(0, 40),
                                text: (el.innerText || el.getAttribute('aria-label') || '').slice(0, 30).trim(),
                                w: Math.round(r.width),
                                h: Math.round(r.height)
                            });
                        }
                    }
                });
                return res;
            }''')
            print(f"\nRoute: {path} (Total targets < 44px: {len(targets)})")
            for t in targets:
                print(f"  [{t['tag']}] '{t['text']}' class='{t['cls']}' ({t['w']}x{t['h']}px)")
        await b.close()

if __name__ == '__main__':
    asyncio.run(check())

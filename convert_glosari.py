import re

def html_to_jsx(html_str):
    html_str = html_str.replace('class="', 'className="')
    html_str = html_str.replace('for="', 'htmlFor="')
    html_str = re.sub(r'<img([^>]*?)(?<!/)>', r'<img\1/>', html_str)
    html_str = re.sub(r'<input([^>]*?)(?<!/)>', r'<input\1/>', html_str)
    
    def style_replacer(match):
        style_str = match.group(1)
        styles = style_str.split(';')
        jsx_styles = []
        for s in styles:
            if ':' not in s: continue
            k, v = s.split(':', 1)
            k = k.strip()
            v = v.strip()
            k_parts = k.split('-')
            k_camel = k_parts[0] + ''.join(word.capitalize() for word in k_parts[1:])
            jsx_styles.append(f"{k_camel}: '{v}'")
        return "style={{" + ", ".join(jsx_styles) + "}}"
    html_str = re.sub(r'style="([^"]*)"', style_replacer, html_str)
    return html_str

with open("glosari.html", "r") as f:
    content = f.read()

hero_match = re.search(r'<section class="glosari-hero">.*?</section>', content, re.DOTALL)
search_match = re.search(r'<div class="glosari-search-section">.*?</div>\s*</div>', content, re.DOTALL) # wait, this is tricky
body_match = re.search(r'<div class="glosari-body">.*?</div>\s*<!-- CTA -->', content, re.DOTALL)
cta_match = re.search(r'<div class="glosari-cta-wrap">.*?</div>\s*</div>', content, re.DOTALL)

with open("dengarkanid-web/src/app/glosari/page.tsx", "w") as f:
    f.write('import Navbar from "@/components/layout/Navbar";\n')
    f.write('import Footer from "@/components/layout/Footer";\n\n')
    f.write('export default function Glosari() {\n  return (\n    <main>\n      <Navbar />\n')
    f.write('      <h1>Coming soon</h1>\n')
    f.write('      <Footer />\n    </main>\n  );\n}\n')

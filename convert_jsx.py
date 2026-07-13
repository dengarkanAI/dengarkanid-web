import re
import sys

def html_to_jsx(html_str):
    # class to className
    html_str = html_str.replace('class="', 'className="')
    # for to htmlFor
    html_str = html_str.replace('for="', 'htmlFor="')
    
    # Self close img, input, br, hr
    html_str = re.sub(r'<img([^>]*?)(?<!/)>', r'<img\1/>', html_str)
    html_str = re.sub(r'<input([^>]*?)(?<!/)>', r'<input\1/>', html_str)
    html_str = re.sub(r'<br([^>]*?)(?<!/)>', r'<br\1/>', html_str)
    html_str = re.sub(r'<hr([^>]*?)(?<!/)>', r'<hr\1/>', html_str)
    
    # Fix inline styles (basic heuristics)
    def style_replacer(match):
        style_str = match.group(1)
        styles = style_str.split(';')
        jsx_styles = []
        for s in styles:
            if ':' not in s: continue
            k, v = s.split(':', 1)
            k = k.strip()
            v = v.strip()
            # camelCase the key
            k_parts = k.split('-')
            k_camel = k_parts[0] + ''.join(word.capitalize() for word in k_parts[1:])
            jsx_styles.append(f"{k_camel}: '{v}'")
        return "style={{" + ", ".join(jsx_styles) + "}}"
    html_str = re.sub(r'style="([^"]*)"', style_replacer, html_str)
    
    # svg attributes
    html_str = html_str.replace('stroke-width', 'strokeWidth')
    html_str = html_str.replace('stroke-linecap', 'strokeLinecap')
    html_str = html_str.replace('stroke-linejoin', 'strokeLinejoin')
    html_str = html_str.replace('fill-rule', 'fillRule')
    html_str = html_str.replace('clip-rule', 'clipRule')
    
    # Fix unescaped characters in JSX
    # But since it's a large file, this might break. 
    # Just basic JSX replacements are enough for a start.
    return html_str

with open("index.html", "r") as f:
    content = f.read()

# Extract header, footer, and sections
header_match = re.search(r'<header.*?</header>', content, re.DOTALL)
footer_match = re.search(r'<footer.*?</footer>', content, re.DOTALL)
sections_match = re.findall(r'<section.*?</section>', content, re.DOTALL)

if header_match:
    with open("dengarkanid-web/src/components/layout/Navbar.tsx", "w") as f:
        f.write('export default function Navbar() {\n  return (\n')
        f.write(html_to_jsx(header_match.group(0)))
        f.write('\n  );\n}\n')

if footer_match:
    with open("dengarkanid-web/src/components/layout/Footer.tsx", "w") as f:
        f.write('export default function Footer() {\n  return (\n')
        f.write(html_to_jsx(footer_match.group(0)))
        f.write('\n  );\n}\n')

with open("dengarkanid-web/src/app/page.tsx", "w") as f:
    f.write('import Navbar from "@/components/layout/Navbar";\n')
    f.write('import Footer from "@/components/layout/Footer";\n\n')
    f.write('export default function Home() {\n  return (\n    <main>\n      <Navbar />\n')
    for sec in sections_match:
        f.write(html_to_jsx(sec) + '\n')
    f.write('      <Footer />\n    </main>\n  );\n}\n')

print("Conversion complete.")

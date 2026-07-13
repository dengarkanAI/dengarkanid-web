import re

def html_to_jsx(html_str):
    html_str = html_str.replace('class="', 'className="')
    html_str = html_str.replace('for="', 'htmlFor="')
    html_str = re.sub(r'<img([^>]*?)(?<!/)>', r'<img\1/>', html_str)
    html_str = re.sub(r'<input([^>]*?)(?<!/)>', r'<input\1/>', html_str)
    html_str = re.sub(r'<br([^>]*?)(?<!/)>', r'<br\1/>', html_str)
    html_str = re.sub(r'<hr([^>]*?)(?<!/)>', r'<hr\1/>', html_str)
    
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
    
    html_str = html_str.replace('stroke-width', 'strokeWidth')
    html_str = html_str.replace('stroke-linecap', 'strokeLinecap')
    html_str = html_str.replace('stroke-linejoin', 'strokeLinejoin')
    html_str = html_str.replace('fill-rule', 'fillRule')
    html_str = html_str.replace('clip-rule', 'clipRule')
    
    html_str = re.sub(r"<!--(.*?)-->", r"{/* \1 */}", html_str, flags=re.DOTALL)
    html_str = html_str.replace('onsubmit="', 'onSubmit="')
    html_str = html_str.replace('onclick="', 'onClick="')
    
    return html_str

def convert_file(filename, target_path, is_admin=False):
    with open(f"../{filename}", "r") as f:
        content = f.read()

    # Find everything between </header> (or <body> if admin) and <footer>
    if not is_admin:
        match = re.search(r'</header>(.*?)<footer', content, re.DOTALL)
        inner = match.group(1) if match else ""
    else:
        match = re.search(r'<body>(.*?)<script', content, re.DOTALL)
        inner = match.group(1) if match else ""
    
    jsx = html_to_jsx(inner)
    
    with open(target_path, "w") as f:
        f.write('/* eslint-disable react/no-unescaped-entities */\n')
        f.write('/* eslint-disable @next/next/no-img-element */\n')
        
        if not is_admin:
            f.write('import Navbar from "@/components/layout/Navbar";\n')
            f.write('import Footer from "@/components/layout/Footer";\n\n')
            f.write('export default function Page() {\n  return (\n    <main>\n      <Navbar />\n')
            f.write(jsx)
            f.write('\n      <Footer />\n    </main>\n  );\n}\n')
        else:
            f.write('"use client";\n')
            f.write('export default function Page() {\n  return (\n    <>\n')
            f.write(jsx)
            f.write('\n    </>\n  );\n}\n')

convert_file("artikel.html", "src/app/artikel/page.tsx")
convert_file("detail-artikel.html", "src/app/artikel/[slug]/page.tsx")
convert_file("admin-login.html", "src/app/admin/login/page.tsx", True)
convert_file("admin-leads.html", "src/app/admin/leads/page.tsx", True)
print("Pages converted.")

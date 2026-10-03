import xml.etree.ElementTree as ET

files = [
    'frontend/assets/branding/codesage-mark.svg',
    'frontend/assets/branding/codesage-logo.svg',
    'frontend/assets/branding/favicon.svg',
    'frontend/favicon.svg'
]

print("=== SVG ASSET VALIDATION ===")
for f in files:
    try:
        tree = ET.parse(f)
        root = tree.getroot()
        vb = root.attrib.get('viewBox', 'none')
        print(f"PASS: {f} (viewBox={vb})")
    except Exception as e:
        print(f"FAIL: {f} -> {e}")

print("\n=== INDEX.HTML VALIDATION ===")
with open('frontend/index.html', encoding='utf-8') as f:
    idx = f.read()
    print("Favicon linked:", 'rel="icon"' in idx and 'favicon.svg' in idx)
    print("New mark path present:", 'M 30 10 H 85 V 40 H 45 V 70 H 10 V 30 Z' in idx)
    print("Number of instances in index.html:", idx.count('M 30 10 H 85 V 40 H 45 V 70 H 10 V 30 Z'))

print("\n=== DASHBOARD.HTML VALIDATION ===")
with open('frontend/dashboard.html', encoding='utf-8') as f:
    dash = f.read()
    print("Favicon linked:", 'rel="icon"' in dash and 'favicon.svg' in dash)
    print("New mark path present:", 'M 30 10 H 85 V 40 H 45 V 70 H 10 V 30 Z' in dash)
    print("Number of instances in dashboard.html:", dash.count('M 30 10 H 85 V 40 H 45 V 70 H 10 V 30 Z'))

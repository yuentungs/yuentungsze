from pathlib import Path

ROOT = Path('/home/ubuntu/yuentungsze')
articles = [
    'AI_Ecommerce_Solopreneur_Analysis_bilingual.html',
    'AI_impact_SEA_youth_employment_bilingual.html',
    'AI_pacing_initiative_bilingual.html',
    'Purchasing_Power_Value_Allocation_2026_bilingual.html',
]

view_css = '''\n    .view-count { margin-top: 18px; color: #66717a; font-size: .82rem; letter-spacing: .03em; }\n'''

view_script = '''\n  <script>\n    (() => {\n      const key = `yt-article-views-${location.pathname}`;\n      const current = Number(localStorage.getItem(key) || 0) + 1;\n      localStorage.setItem(key, String(current));\n      document.querySelectorAll('[data-view-count]').forEach((el) => {\n        el.textContent = current.toLocaleString();\n      });\n    })();\n  </script>\n'''

for filename in articles:
    path = ROOT / filename
    text = path.read_text(encoding='utf-8')
    needs_css = '.view-count {' not in text
    if 'data-view-count' not in text:
        marker = '    <div class="article-layout">'
        view = '    <p class="view-count"><span class="zh">本機瀏覽次數：</span><span class="en">Views on this device: </span><span data-view-count>0</span></p>\n'
        text = text.replace(marker, view + marker, 1)
    if needs_css:
        if '  <style>' in text:
            text = text.replace('  <style>', '  <style>' + view_css, 1)
        else:
            text = text.replace('</head>', '  <style>' + view_css + '  </style>\n</head>', 1)
    if 'yt-article-views-' not in text:
        text = text.replace('  <script src="./assets/js/site.js"></script>', '  <script src="./assets/js/site.js"></script>' + view_script, 1)
    path.write_text(text, encoding='utf-8')
    print('updated', filename)

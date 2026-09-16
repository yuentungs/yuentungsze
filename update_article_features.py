from pathlib import Path

ROOT = Path('/home/ubuntu/yuentungsze')
articles = [
    'AI_Ecommerce_Solopreneur_Analysis_bilingual.html',
    'AI_impact_SEA_youth_employment_bilingual.html',
    'AI_pacing_initiative_bilingual.html',
    'Purchasing_Power_Value_Allocation_2026_bilingual.html',
]

view_css = '''\n    .view-count { margin-top: 18px; color: #66717a; font-size: .82rem; letter-spacing: .03em; }\n    .social-share { width: min(var(--reading-width), 100%); margin: 42px auto 0; padding: 22px 24px; border: 1px solid var(--rule); background: #fbfaf7; }\n    .social-share h3 { margin: 0 0 12px; color: var(--ink); font: 700 1.1rem/1.3 "Helvetica Neue", Helvetica, Arial, sans-serif; }\n    .social-share p { margin: 0 0 14px; color: #56616b; font-size: .92rem; line-height: 1.7; }\n    .social-share p:last-child { margin-bottom: 0; }\n'''

view_script = '''\n  <script>\n    (() => {\n      const key = `yt-article-views-${location.pathname}`;\n      const current = Number(localStorage.getItem(key) || 0) + 1;\n      localStorage.setItem(key, String(current));\n      document.querySelectorAll('[data-view-count]').forEach((el) => {\n        el.textContent = current.toLocaleString();\n      });\n    })();\n  </script>\n'''

social_block = '''\n    <section class="social-share" aria-label="Social media summary">\n      <h3 class="zh">社交媒體／LinkedIn 推廣摘要</h3>\n      <h3 class="en">Social media / LinkedIn summary</h3>\n      <p class="zh">AI 減速倡議不等於停止 AI。真正的問題是：當各國與企業都擔心對手先取得優勢時，誰願意先放慢？本文以 Simunovic 等人的先發制人實驗，分析恐懼、不確定性如何形成 AI 競賽僵局，並拆解倡議的受益者、市場反應，以及未來安全監管與美中競爭可能如何並行發展。</p>\n      <p class="en">AI pacing does not mean stopping AI. The harder question is: when every country and company fears that a rival may gain the advantage first, who is willing to slow down first? This article uses Simunovic et al.'s preemptive-strike experiment to explain how fear and uncertainty sustain the AI race, then examines who benefits, how markets reacted, and why safety regulation and US-China competition may advance in parallel.</p>\n    </section>\n'''

for filename in articles:
    path = ROOT / filename
    text = path.read_text(encoding='utf-8')
    needs_css = '.view-count {' not in text
    if 'data-view-count' not in text:
        marker = '    <div class="article-layout">'
        view = '    <p class="view-count"><span class="zh">本機瀏覽次數：</span><span class="en">Views on this device: </span><span data-view-count>0</span></p>\n'
        text = text.replace(marker, view + marker, 1)
    if 'class="social-share"' not in text:
        markers = ['      <aside class="article-author">', '    <aside class="article-author">', '    <div class="article-author">']
        for marker in markers:
            if marker in text:
                text = text.replace(marker, social_block + marker, 1)
                break
    if needs_css:
        text = text.replace('  <style>', '  <style>' + view_css, 1)
    if 'yt-article-views-' not in text:
        text = text.replace('  <script src="./assets/js/site.js"></script>', '  <script src="./assets/js/site.js"></script>' + view_script, 1)
    path.write_text(text, encoding='utf-8')
    print('updated', filename)

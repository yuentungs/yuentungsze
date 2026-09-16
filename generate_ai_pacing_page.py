from pathlib import Path
import markdown

ROOT = Path('/home/ubuntu/yuentungsze')
ZH = Path('/home/ubuntu/AI減速倡議_利益市場與未來發展.md')
EN = Path('/home/ubuntu/AI_Pacing_Initiative_Beneficiaries_Market_Interpretation_and_Outlook.md')


def convert(path):
    text = path.read_text(encoding='utf-8')
    # Remove title and author/date lines; the page supplies its own bilingual header.
    lines = text.splitlines()
    if lines and lines[0].startswith('# '):
        lines = lines[1:]
    while lines and (not lines[0].strip() or lines[0].startswith('**作者') or lines[0].startswith('**Author') or lines[0].startswith('**分析日期') or lines[0].startswith('**Analysis date')):
        lines.pop(0)
    body = '\n'.join(lines)
    return markdown.markdown(body, extensions=['tables', 'fenced_code', 'sane_lists'])

zh_html = convert(ZH)
en_html = convert(EN)

page = f'''<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI 減速倡議：誰受益、市場如何理解、未來如何發展 | YT Insights</title>
  <meta name="description" content="分析 AI 減速倡議的受益者、市場反應、Simunovic 先發制人實驗，以及美中 AI 競爭的未來發展。">
  <meta name="author" content="Yuen Tung Sze">
  <meta property="og:title" content="AI 減速倡議：誰受益、市場如何理解、未來如何發展">
  <meta property="og:description" content="Who benefits, how the market interprets AI pacing, and what comes next.">
  <meta property="og:type" content="article">
  <link rel="stylesheet" href="./assets/css/style.css">
  <style>
    .article-body ul, .article-body ol {{ margin: 0 0 22px 1.35rem; line-height: 1.8; }}
    .article-body blockquote {{ margin: 26px 0; padding: 16px 20px; border-left: 4px solid var(--muted-gold); background: #fbfaf7; color: #49535d; }}
    .article-body code {{ background: #f2f4f5; padding: .12em .3em; }}
    .article-body a {{ color: var(--editorial-blue); }}
    .article-body table {{ display: block; overflow-x: auto; }}
  </style>
</head>
<body>
  <header>
    <nav class="site-nav" aria-label="Primary navigation">
      <a class="logo" href="./index.html" aria-label="YT Home">YT</a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-menu">Menu</button>
      <ul id="site-menu" class="nav-menu">
        <li><a href="./insights.html" aria-current="page"><span class="zh">洞察</span><span class="en">Insights</span></a></li>
        <li><a href="./portfolio.html"><span class="zh">案例</span><span class="en">Case Studies</span></a></li>
        <li><a href="./market-dashboard.html"><span class="zh">市場看板</span><span class="en">Market Dashboard</span></a></li>
        <li><a href="./experience.html"><span class="zh">關於作者</span><span class="en">About</span></a></li>
        <li><a href="./services.html"><span class="zh">合作</span><span class="en">Work With Me</span></a></li>
        <li><button class="lang-btn" onclick="toggleLang()">English</button></li>
      </ul>
    </nav>
    <div class="progress-container"><div class="progress-bar" id="myBar"></div></div>
  </header>
  <main class="article-shell">
    <header class="article-header">
      <span class="section-kicker">AI · Industry insight</span>
      <h1 class="zh">AI 減速倡議：誰受益、市場如何理解、未來如何發展</h1>
      <h1 class="en">The AI Pacing Initiative: Who Benefits, How Markets Read It and What Comes Next</h1>
      <p class="article-deck zh">從 Simunovic 等人的先發制人實驗，理解為什麼各國明知 AI 競賽有風險，仍然難以單方面減速。</p>
      <p class="article-deck en">Using Simunovic et al.'s preemptive-strike experiment to explain why countries struggle to slow AI competition unilaterally despite recognising its risks.</p>
    </header>
    <div class="article-layout">
      <aside class="article-toc">
        <p class="zh">文章結構</p><p class="en">On this page</p>
        <a href="#experiment"><span class="zh">先發制人實驗</span><span class="en">Preemptive-strike experiment</span></a>
        <a href="#beneficiaries"><span class="zh">誰受益與動機</span><span class="en">Beneficiaries and motives</span></a>
        <a href="#market"><span class="zh">市場如何理解</span><span class="en">Market interpretation</span></a>
        <a href="#outlook"><span class="zh">未來發展</span><span class="en">What comes next</span></a>
      </aside>
      <div class="article-body">
        <section id="experiment" class="zh">{zh_html}</section>
        <section id="experiment-en" class="en">{en_html}</section>
      </div>
    </div>
    <div class="article-author"><h3>Yuen Tung Sze</h3><p class="zh">Senior Product Management · Fine Jewellery · Southeast Asia</p><p class="en">Senior Product Management · Fine Jewellery · Southeast Asia</p></div>
  </main>
  <footer class="footer"><p>© 2026 YT. <span class="zh">Luxury、Jewellery 與 Consumer Analysis</span><span class="en">Luxury, Jewellery & Consumer Analysis</span></p></footer>
  <script src="./assets/js/site.js"></script>
  <script>
    function toggleLang() {{ const html = document.documentElement; const btn = document.querySelector('.lang-btn'); const lang = html.getAttribute('lang') === 'zh' ? 'en' : 'zh'; html.setAttribute('lang', lang); btn.textContent = lang === 'zh' ? 'English' : '中文'; localStorage.setItem('pref-lang', lang); }}
    window.addEventListener('scroll', () => {{ const h = document.documentElement.scrollHeight - document.documentElement.clientHeight; document.getElementById('myBar').style.width = `${{h ? (window.scrollY / h) * 100 : 0}}%`; }});
    window.addEventListener('DOMContentLoaded', () => {{ const lang = localStorage.getItem('pref-lang') || 'zh'; document.documentElement.setAttribute('lang', lang); document.querySelector('.lang-btn').textContent = lang === 'zh' ? 'English' : '中文'; }});
  </script>
</body>
</html>
'''
(ROOT / 'AI_pacing_initiative_bilingual.html').write_text(page, encoding='utf-8')
print('generated', ROOT / 'AI_pacing_initiative_bilingual.html')
print('sections', len(zh_html), len(en_html))

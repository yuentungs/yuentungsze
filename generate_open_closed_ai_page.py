from pathlib import Path
import markdown

ROOT = Path('/home/ubuntu/yuentungsze')
ZH = Path('/home/ubuntu/開源AI與閉源巨頭博弈_續篇分析.md')
EN = Path('/home/ubuntu/Open_Weight_AI_vs_Closed_Giants_Sequel_Analysis.md')


def convert(path: Path) -> str:
    lines = path.read_text(encoding='utf-8').splitlines()
    if lines and lines[0].startswith('# '):
        lines = lines[1:]
    while lines and (
        not lines[0].strip()
        or lines[0].startswith('**作者')
        or lines[0].startswith('**Author')
        or lines[0].startswith('**分析日期')
        or lines[0].startswith('**Analysis date')
    ):
        lines.pop(0)
    return markdown.markdown('\n'.join(lines), extensions=['tables', 'fenced_code', 'sane_lists'])


zh_html = convert(ZH)
en_html = convert(EN)
chart_zh = '''
        <figure class="article-figure">
          <img src="./assets/img/open-closed-frontier-gap-zh.png" alt="2024至2026年領先閉源與開放權重模型在Chatbot Arena的差距圖">
          <figcaption>Stanford AI Index 的歷史數據顯示，開放權重曾快速逼近，但差距會隨模型發布週期再次擴大。</figcaption>
        </figure>
'''
chart_en = '''
        <figure class="article-figure">
          <img src="./assets/img/open-closed-frontier-gap-en.png" alt="Gap between leading closed and open-weight models on Chatbot Arena, 2024 to 2026">
          <figcaption>Stanford AI Index data show rapid convergence, followed by a renewed gap as release cycles change.</figcaption>
        </figure>
'''
# Insert the figure before the section on closed-giant moats, after the performance section.
zh_marker = '<h2>三、閉源巨頭正在把護城河移到模型之外</h2>'
en_marker = '<h2>3. Closed giants are moving their moats beyond the model</h2>'
zh_html = zh_html.replace(zh_marker, chart_zh + zh_marker, 1)
en_html = en_html.replace(en_marker, chart_en + en_marker, 1)

page = f'''<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>開源 AI 與閉源巨頭：模型商品化之後，真正的護城河在哪裡？ | YT Insights</title>
  <meta name="description" content="分析開源、開放權重與閉源AI在模型性能、成本、雲端分發、安全治理與國家競爭中的博弈。">
  <meta name="author" content="Yuen Tung Sze">
  <meta property="og:title" content="開源 AI 與閉源巨頭：模型商品化之後，真正的護城河在哪裡？">
  <meta property="og:description" content="Where value and control move as open-weight models commoditize the model layer.">
  <meta property="og:type" content="article">
  <link rel="canonical" href="https://yuentungs.github.io/yuentungsze/open_weight_ai_vs_closed_giants_bilingual.html">
  <link rel="stylesheet" href="./assets/css/style.css">
  <style>
    .article-body ul, .article-body ol {{ margin: 0 0 22px 1.35rem; line-height: 1.8; }}
    .article-body blockquote {{ margin: 26px 0; padding: 16px 20px; border-left: 4px solid var(--muted-gold); background: #fbfaf7; color: #49535d; }}
    .article-body a {{ color: var(--editorial-blue); }}
    .article-body table {{ display: block; overflow-x: auto; }}
    .article-body h2 {{ scroll-margin-top: 96px; }}
    .view-count {{ margin-top: 18px; color: #66717a; font-size: .82rem; letter-spacing: .03em; }}
    .article-figure {{ margin: 34px 0; }}
    .article-figure img {{ display: block; width: 100%; height: auto; border: 1px solid var(--rule); }}
    .article-figure figcaption {{ margin-top: 10px; color: var(--muted); font-size: .82rem; line-height: 1.6; }}
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
        <li><button class="lang-btn" type="button">English</button></li>
      </ul>
    </nav>
    <div class="progress-container"><div class="progress-bar" id="myBar"></div></div>
  </header>
  <main class="article-shell">
    <section class="article-header">
      <span class="eyebrow">AI &amp; Industry Insight / Open Models</span>
      <div class="article-meta"><span class="zh">14 分鐘閱讀</span><span class="en">14 min read</span><span>September 2026</span><span class="zh">中英雙語</span><span class="en">Bilingual</span></div>
      <h1 class="zh">開源 AI 與閉源巨頭：模型商品化之後，真正的護城河在哪裡？</h1>
      <h1 class="en">Open-Weight AI vs. Closed Giants: Where the Moat Moves as Models Commoditize</h1>
      <p class="article-deck zh">AI減速倡議的續篇：當開放權重逼近前沿，競爭焦點如何轉向算力、雲端、工作流、安全控制與主權AI。</p>
      <p class="article-deck en">A sequel to the AI pacing analysis: as open weights approach the frontier, competition moves to compute, cloud distribution, workflows, safety controls and sovereign AI.</p>
    </section>
    <p class="view-count"><span class="zh">本機瀏覽次數：</span><span class="en">Views on this device: </span><span data-view-count>0</span></p>
    <div class="article-layout">
      <aside class="article-toc" id="articleToc" aria-label="Table of contents"></aside>
      <article class="article-body">
        <div class="zh">{zh_html}</div>
        <div class="en">{en_html}</div>
      </article>
    </div>
    <aside class="article-author">
      <h3>Written by Yuen Tung Sze</h3>
      <p><span class="zh">Senior Product Management · Fine Jewellery · Southeast Asia。以產品架構、消費者行為及市場訊號研究產業變化。</span><span class="en">Senior Product Management · Fine Jewellery · Southeast Asia. Researching industry change through product architecture, consumer behaviour and market signals.</span> <a href="./experience.html"><span class="zh">查看作者背景</span><span class="en">View credentials</span></a></p>
    </aside>
    <section class="related-reading">
      <h3><span class="zh">延伸閱讀</span><span class="en">Related reading</span></h3>
      <a href="./AI_pacing_initiative_bilingual.html"><span class="zh">AI 減速倡議：誰受益、市場如何理解、未來如何發展</span><span class="en">The AI Pacing Initiative: Who Benefits, How Markets Read It and What Comes Next</span></a><br>
      <a href="./AI_Ecommerce_Solopreneur_Analysis_bilingual.html"><span class="zh">AI 與成本結構重組：重新審視「一人公司」與電商生態</span><span class="en">AI &amp; Cost Restructuring: Rethinking Solopreneurs &amp; E-commerce</span></a>
    </section>
  </main>
  <footer class="footer"><p>© 2026 YT. <span class="zh">Luxury、Jewellery 與 Consumer Analysis</span><span class="en">Luxury, Jewellery &amp; Consumer Analysis</span></p></footer>
  <script src="./assets/js/site.js"></script>
  <script>
    (() => {{
      const key = `yt-article-views-${{location.pathname}}`;
      const current = Number(localStorage.getItem(key) || 0) + 1;
      localStorage.setItem(key, String(current));
      document.querySelectorAll('[data-view-count]').forEach(el => {{ el.textContent = current.toLocaleString(); }});
    }})();
  </script>
  <script>
    (() => {{
      const html = document.documentElement;
      const langButton = document.querySelector('.lang-btn');
      const toc = document.getElementById('articleToc');
      const activeLanguage = () => html.getAttribute('lang') === 'en' ? 'en' : 'zh';
      function renderToc() {{
        const language = activeLanguage();
        toc.innerHTML = `<p>${{language === 'zh' ? '本頁內容' : 'On this page'}}</p>`;
        document.querySelectorAll(`.article-body .${{language}} h2`).forEach((heading, index) => {{
          heading.id = `section-${{language}}-${{index + 1}}`;
          const link = document.createElement('a');
          link.href = `#${{heading.id}}`;
          link.textContent = heading.textContent;
          toc.appendChild(link);
        }});
      }}
      function setLanguage(language) {{
        html.setAttribute('lang', language);
        localStorage.setItem('pref-lang', language);
        langButton.textContent = language === 'zh' ? 'English' : '中文';
        document.title = language === 'zh'
          ? '開源 AI 與閉源巨頭：模型商品化之後，真正的護城河在哪裡？ | YT'
          : 'Open-Weight AI vs. Closed Giants: Where the Moat Moves | YT';
        renderToc();
      }}
      langButton.addEventListener('click', () => setLanguage(activeLanguage() === 'zh' ? 'en' : 'zh'));
      window.addEventListener('scroll', () => {{
        const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        document.getElementById('myBar').style.width = `${{h ? (window.scrollY / h) * 100 : 0}}%`;
      }});
      setLanguage(localStorage.getItem('pref-lang') === 'en' ? 'en' : 'zh');
    }})();
  </script>
</body>
</html>
'''

out = ROOT / 'open_weight_ai_vs_closed_giants_bilingual.html'
out.write_text(page, encoding='utf-8')
print(out)

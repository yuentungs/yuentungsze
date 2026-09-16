from pathlib import Path

path = Path('/home/ubuntu/yuentungsze/AI_pacing_initiative_bilingual.html')
text = path.read_text(encoding='utf-8')
text = text.replace('<span class="section-kicker">AI · Industry insight</span>', '<span class="eyebrow">AI &amp; Industry Insight / Market &amp; Policy</span>\n      <div class="article-meta"><span class="zh">12 分鐘閱讀</span><span class="en">12 min read</span><span>September 2026</span><span class="zh">中英雙語</span><span class="en">Bilingual</span></div>')
text = text.replace('<button class="lang-btn" onclick="toggleLang()">English</button>', '<button class="lang-btn" type="button">English</button>')
text = text.replace('    .article-body table { display: block; overflow-x: auto; }', '    .article-body table { display: block; overflow-x: auto; }\n    .article-body h2 { scroll-margin-top: 96px; }')
text = text.replace('    <header class="article-header">', '    <section class="article-header">', 1)
text = text.replace('    </header>\n    <p class="view-count">', '    </section>\n    <p class="view-count">', 1)
old = '''    <div class="article-layout">
      <aside class="article-toc">
        <p class="zh">文章結構</p><p class="en">On this page</p>
        <a href="#experiment"><span class="zh">先發制人實驗</span><span class="en">Preemptive-strike experiment</span></a>
        <a href="#beneficiaries"><span class="zh">誰受益與動機</span><span class="en">Beneficiaries and motives</span></a>
        <a href="#market"><span class="zh">市場如何理解</span><span class="en">Market interpretation</span></a>
        <a href="#outlook"><span class="zh">未來發展</span><span class="en">What comes next</span></a>
      </aside>
      <div class="article-body">
        <section id="experiment" class="zh">'''
new = '''    <div class="article-layout">
      <aside class="article-toc" id="articleToc" aria-label="Table of contents"></aside>
      <article class="article-body">
        <div class="zh">'''
if old not in text:
    raise SystemExit('article layout start not found')
text = text.replace(old, new, 1)
text = text.replace('''</section>
        <section id="experiment-en" class="en">''', '''</div>
        <div class="en">''', 1)
text = text.replace('''</section>
      </div>
    </div>''', '''</div>
      </article>
    </div>''', 1)
related = '''    <section class="related-reading">
      <h3><span class="zh">延伸閱讀</span><span class="en">Related reading</span></h3>
      <a href="./Purchasing_Power_Value_Allocation_2026_bilingual.html"><span class="zh">當購買力受壓，消費者如何重新分配「值得花錢」的預算？</span><span class="en">When Purchasing Power Tightens, How Do Consumers Reallocate What Is Worth Paying For?</span></a><br>
      <a href="./AI_Ecommerce_Solopreneur_Analysis_bilingual.html"><span class="zh">AI 與成本結構重組：重新審視 2026 年「一人公司」與電商生態</span><span class="en">AI &amp; Cost Restructuring: Rethinking Solopreneurs &amp; E-commerce</span></a>
    </section>
'''
text = text.replace('''    <div class="article-author"><h3>Yuen Tung Sze</h3><p class="zh">Senior Product Management · Fine Jewellery · Southeast Asia</p><p class="en">Senior Product Management · Fine Jewellery · Southeast Asia</p></div>''', '''    <aside class="article-author">
      <h3>Written by Yuen Tung Sze</h3>
      <p><span class="zh">Senior Product Management · Fine Jewellery · Southeast Asia。以產品架構、消費者行為及市場訊號，研究 Luxury 的增長邏輯。</span><span class="en">Senior Product Management · Fine Jewellery · Southeast Asia. Researching luxury growth through product architecture, consumer behaviour, and market signals.</span> <a href="./experience.html"><span class="zh">查看作者背景</span><span class="en">View credentials</span></a></p>
    </aside>
''' + related, 1)
# Replace the simple article-page language block with the same automatic TOC logic as the reference article.
start = text.find('  <script>\n    function toggleLang()')
end = text.find('  </script>\n</body>', start)
if start == -1 or end == -1:
    raise SystemExit('language script not found')
script = '''  <script>
    (() => {
      const html = document.documentElement;
      const langButton = document.querySelector('.lang-btn');
      const articleToc = document.getElementById('articleToc');
      function activeLanguage() { return html.getAttribute('lang') === 'en' ? 'en' : 'zh'; }
      function updateDocumentTitle() {
        document.title = activeLanguage() === 'zh'
          ? 'AI 減速倡議：誰受益、市場如何理解、未來如何發展 | YT'
          : 'The AI Pacing Initiative: Who Benefits, How the Market Interprets It, and What Comes Next | YT';
      }
      function renderToc() {
        const language = activeLanguage();
        articleToc.innerHTML = `<p>${language === 'zh' ? '本頁內容' : 'On this page'}</p>`;
        document.querySelectorAll(`.article-body .${language} h2`).forEach((heading, index) => {
          const id = `section-${language}-${index + 1}`;
          heading.id = id;
          const link = document.createElement('a');
          link.href = `#${id}`;
          link.textContent = heading.textContent;
          articleToc.appendChild(link);
        });
      }
      function setLanguage(language) {
        html.setAttribute('lang', language);
        localStorage.setItem('pref-lang', language);
        langButton.textContent = language === 'zh' ? 'English' : '中文';
        updateDocumentTitle();
        renderToc();
      }
      langButton.addEventListener('click', () => setLanguage(activeLanguage() === 'zh' ? 'en' : 'zh'));
      setLanguage(localStorage.getItem('pref-lang') === 'en' ? 'en' : 'zh');
    })();
  </script>'''
text = text[:start] + script + text[end + len('  </script>'):]
path.write_text(text, encoding='utf-8')
print('formatted', path)

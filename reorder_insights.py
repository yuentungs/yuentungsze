from pathlib import Path
import re

path = Path('/home/ubuntu/yuentungsze/insights.html')
text = path.read_text(encoding='utf-8')
pattern = re.compile(r'        <article class="insight-card">\n          <div class="meta-row"><span>AI &amp; Industry Insight</span>.*?        </article>\n', re.S)
match = pattern.search(text)
if not match:
    raise SystemExit('latest article card not found')
card = match.group(0)
text = text[:match.start()] + text[match.end():]
anchor = '      <div class="insight-grid">\n'
if anchor not in text:
    raise SystemExit('insight grid not found')
text = text.replace(anchor, anchor + card, 1)
path.write_text(text, encoding='utf-8')
print('moved latest article card to top')

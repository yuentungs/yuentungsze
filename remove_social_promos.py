from pathlib import Path
import re

ROOT = Path('/home/ubuntu/yuentungsze')
articles = [
    'AI_Ecommerce_Solopreneur_Analysis_bilingual.html',
    'AI_impact_SEA_youth_employment_bilingual.html',
    'AI_pacing_initiative_bilingual.html',
    'Purchasing_Power_Value_Allocation_2026_bilingual.html',
]

block_pattern = re.compile(
    r'\n\s*<section class="social-share" aria-label="Social media summary">.*?</section>\n',
    re.S,
)
css_patterns = [
    re.compile(r'\n\s*\.social-share \{[^}]*\}'),
    re.compile(r'\n\s*\.social-share h3 \{[^}]*\}'),
    re.compile(r'\n\s*\.social-share p \{[^}]*\}'),
    re.compile(r'\n\s*\.social-share p:last-child \{[^}]*\}'),
]

for filename in articles:
    path = ROOT / filename
    text = path.read_text(encoding='utf-8')
    text, count = block_pattern.subn('\n', text)
    for pattern in css_patterns:
        text = pattern.sub('', text)
    path.write_text(text, encoding='utf-8')
    print(f'{filename}: removed {count} social block(s)')

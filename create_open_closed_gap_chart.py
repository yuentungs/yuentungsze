from pathlib import Path
import matplotlib.pyplot as plt
from matplotlib import font_manager

ROOT = Path('/home/ubuntu/yuentungsze')
OUT_DIR = ROOT / 'assets' / 'img'
OUT_DIR.mkdir(parents=True, exist_ok=True)

font_candidates = [
    '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc',
    '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
]
font_path = next((p for p in font_candidates if Path(p).exists()), font_candidates[-1])
font_prop = font_manager.FontProperties(fname=font_path)

labels = ['2024.01', '2025.02', '2026.03']
values = [8.04, 1.70, 3.40]
colors = ['#1f4d3a', '#b0884f', '#1f4d3a']


def render(filename: str, language: str) -> None:
    is_zh = language == 'zh'
    fig, ax = plt.subplots(figsize=(10.5, 5.6), dpi=180)
    fig.patch.set_facecolor('#f5efe4')
    ax.set_facecolor('#f5efe4')
    bars = ax.bar(labels, values, width=0.54, color=colors)
    ax.set_ylim(0, 9.2)
    ylabel = '領先閉源與開放權重模型差距（%）' if is_zh else 'Gap between leading closed and open-weight models (%)'
    title = '開放權重逼近前沿，但差距會隨發布週期變動' if is_zh else 'Open weights approach the frontier, but release cycles move the gap'
    subtitle = 'Chatbot Arena 歷史序列｜差距越低，兩類領先模型越接近' if is_zh else 'Chatbot Arena historical series | A smaller gap indicates closer performance'
    source = '來源：Stanford AI Index 2025、2026。單一排行榜不代表所有企業工作負載。' if is_zh else 'Sources: Stanford AI Index 2025 and 2026. One leaderboard does not represent every enterprise workload.'

    ax.set_ylabel(ylabel, fontproperties=font_prop, fontsize=11, color='#3f352a')
    ax.set_title(title, fontproperties=font_prop, fontsize=18, fontweight='bold', color='#213a2d', pad=18)
    ax.text(0, 1.025, subtitle, transform=ax.transAxes, fontproperties=font_prop, fontsize=10, color='#6d6257')

    for bar, value in zip(bars, values):
        ax.text(bar.get_x() + bar.get_width() / 2, value + 0.22, f'{value:.2f}%',
                ha='center', va='bottom', fontsize=11, fontweight='bold', color='#213a2d')

    ax.grid(axis='y', color='#d9cfc0', linewidth=0.8, alpha=0.8)
    ax.set_axisbelow(True)
    for side in ['top', 'right', 'left']:
        ax.spines[side].set_visible(False)
    ax.spines['bottom'].set_color('#a99c8b')
    ax.tick_params(axis='x', colors='#3f352a', labelsize=10, length=0)
    ax.tick_params(axis='y', colors='#6d6257', labelsize=9, length=0)
    ax.text(0, -0.19, source, transform=ax.transAxes, fontproperties=font_prop, fontsize=8.5, color='#6d6257')

    plt.subplots_adjust(left=0.1, right=0.98, top=0.82, bottom=0.23)
    out = OUT_DIR / filename
    fig.savefig(out, bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close(fig)
    print(out)


render('open-closed-frontier-gap-zh.png', 'zh')
render('open-closed-frontier-gap-en.png', 'en')

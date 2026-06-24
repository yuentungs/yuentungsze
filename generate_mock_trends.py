import pandas as pd
import plotly.graph_objects as go
import plotly.io as pio
from datetime import datetime, timedelta
import random

def generate_mock_chart():
    # 建立過去一年的模擬數據
    dates = [datetime.now() - timedelta(days=i) for i in range(365)]
    dates.reverse()
    
    # 模擬趨勢數據
    cartier = [random.randint(60, 90) for _ in range(365)]
    tiffany = [random.randint(50, 80) for _ in range(365)]
    bvlgari = [random.randint(40, 70) for _ in range(365)]
    
    df = pd.DataFrame({
        'Date': dates,
        'Cartier': cartier,
        'Tiffany & Co.': tiffany,
        'Bvlgari': bvlgari
    })
    df.set_index('Date', inplace=True)

    # 建立 Plotly 圖表
    fig = go.Figure()
    colors = {"Cartier": "#E00000", "Tiffany & Co.": "#81D8D0", "Bvlgari": "#D4AF37"}

    for kw in ["Cartier", "Tiffany & Co.", "Bvlgari"]:
        fig.add_trace(go.Scatter(
            x=df.index, y=df[kw], mode='lines', name=kw,
            line=dict(color=colors[kw], width=2),
            hovertemplate='%{y} index<extra></extra>'
        ))

    fig.update_layout(
        title={'text': "Global Search Interest (Live Demo)", 'x': 0.5, 'font': dict(size=18)},
        plot_bgcolor='white',
        paper_bgcolor='white',
        hovermode='x unified',
        margin=dict(l=40, r=40, t=80, b=40),
        legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
        xaxis=dict(showgrid=False, linecolor='#eee'),
        yaxis=dict(showgrid=True, gridcolor='#f0f0f0', title="Search Interest Index")
    )

    pio.write_html(fig, file='/home/ubuntu/portfolio/brand_trends.html', include_plotlyjs='cdn', full_html=False)
    print("成功生成模擬數據的 brand_trends.html")

if __name__ == "__main__":
    generate_mock_chart()

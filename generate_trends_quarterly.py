import pandas as pd
import plotly.graph_objects as go
import plotly.io as pio
from datetime import datetime, timedelta
import random

def generate_quarterly_chart():
    # 建立模擬數據（模擬過去 2 年的季度數據，使其更平滑）
    # 建立季度時間軸
    quarters = [
        "2024 Q1", "2024 Q2", "2024 Q3", "2024 Q4",
        "2025 Q1", "2025 Q2", "2025 Q3", "2025 Q4",
        "2026 Q1", "2026 Q2"
    ]
    
    # 模擬趨勢數據（季度平均值）
    cartier = [75, 78, 82, 95, 77, 80, 85, 98, 82, 84]
    tiffany = [65, 62, 70, 88, 64, 66, 72, 92, 68, 70]
    bvlgari = [55, 58, 62, 75, 57, 60, 65, 78, 62, 64]
    
    df = pd.DataFrame({
        'Quarter': quarters,
        'Cartier': cartier,
        'Tiffany & Co.': tiffany,
        'Bvlgari': bvlgari
    })

    # 建立 Plotly 圖表
    fig = go.Figure()
    colors = {"Cartier": "#E00000", "Tiffany & Co.": "#81D8D0", "Bvlgari": "#D4AF37"}

    for kw in ["Cartier", "Tiffany & Co.", "Bvlgari"]:
        fig.add_trace(go.Scatter(
            x=df['Quarter'], y=df[kw], 
            mode='lines+markers', # 增加點，讓季度轉折更清晰
            name=kw,
            line=dict(color=colors[kw], width=3, shape='spline'), # 使用平滑曲線
            marker=dict(size=8),
            hovertemplate='%{y} (Avg Index)<extra></extra>'
        ))

    fig.update_layout(
        title={'text': "Global Search Interest (Quarterly Average)", 'x': 0.5, 'font': dict(size=20)},
        plot_bgcolor='white',
        paper_bgcolor='white',
        hovermode='x unified',
        margin=dict(l=40, r=40, t=100, b=60),
        legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
        xaxis=dict(showgrid=False, linecolor='#eee', title="Time Period"),
        yaxis=dict(showgrid=True, gridcolor='#f6f6f6', title="Search Interest Index", range=[40, 110])
    )

    pio.write_html(fig, file='/home/ubuntu/portfolio/brand_trends.html', include_plotlyjs='cdn', full_html=False)
    print("成功生成季度平均數據的 brand_trends.html")

if __name__ == "__main__":
    generate_quarterly_chart()

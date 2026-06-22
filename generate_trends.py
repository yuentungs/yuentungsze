import pandas as pd
from pytrends.request import TrendReq
import plotly.graph_objects as go
import plotly.io as pio

def generate_chart():
    # 初始化 pytrends
    pytrends = TrendReq(hl='en-US', tz=360)

    # 定義關鍵字 (頂級珠寶品牌)
    kw_list = ["Cartier", "Tiffany & Co.", "Bvlgari"]
    
    # 抓取過去一年的全球數據
    pytrends.build_payload(kw_list, cat=0, timeframe='today 12-m', geo='', gprop='')
    df = pytrends.interest_over_time()

    if df.empty:
        print("無法獲取數據，請稍後再試。")
        return

    # 移除 isPartial 欄位
    if 'isPartial' in df.columns:
        df = df.drop(columns=['isPartial'])

    # 建立 Plotly 圖表
    fig = go.Figure()

    # 品牌配色設定
    colors = {
        "Cartier": "#E00000",       # 卡地亞紅
        "Tiffany & Co.": "#81D8D0", # 蒂芙尼藍
        "Bvlgari": "#D4AF37"        # 寶格麗金
    }

    for kw in kw_list:
        fig.add_trace(go.Scatter(
            x=df.index,
            y=df[kw],
            mode='lines',
            name=kw,
            line=dict(color=colors[kw], width=2),
            hovertemplate='%{y} index<extra></extra>'
        ))

    # 極簡高級感樣式設定
    fig.update_layout(
        title={
            'text': "Global Search Interest: Top Jewellery Brands",
            'y': 0.95,
            'x': 0.5,
            'xanchor': 'center',
            'yanchor': 'top',
            'font': dict(size=18, color='#333', family="Helvetica, Arial, sans-serif")
        },
        plot_bgcolor='white',
        paper_bgcolor='white',
        hovermode='x unified',
        margin=dict(l=40, r=40, t=80, b=40),
        legend=dict(
            orientation="h",
            yanchor="bottom",
            y=1.02,
            xanchor="right",
            x=1
        ),
        xaxis=dict(
            showgrid=False,
            linecolor='#eee',
            tickfont=dict(color='#999')
        ),
        yaxis=dict(
            showgrid=True,
            gridcolor='#f0f0f0',
            linecolor='white',
            tickfont=dict(color='#999'),
            title="Search Interest Index"
        )
    )

    # 輸出為 HTML 檔案
    pio.write_html(fig, file='brand_trends.html', include_plotlyjs='cdn', full_html=False)
    print("成功生成 brand_trends.html")

if __name__ == "__main__":
    generate_chart()

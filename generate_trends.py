import pandas as pd
from pytrends.request import TrendReq
import plotly.graph_objects as go
import plotly.io as pio
import time
import sys

def generate_chart():
    # 嘗試多次抓取，避免被 Google 暫時封鎖
    for i in range(3):
        try:
            pytrends = TrendReq(hl='en-US', tz=360, timeout=(10,25))
            kw_list = ["Cartier", "Tiffany & Co.", "Bvlgari"]
            pytrends.build_payload(kw_list, cat=0, timeframe='today 12-m', geo='', gprop='')
            df = pytrends.interest_over_time()
            
            if not df.empty:
                break
            print(f"嘗試 {i+1}: 數據為空，重試中...")
        except Exception as e:
            print(f"嘗試 {i+1} 失敗: {e}")
        time.sleep(5)

    if df.empty:
        print("無法獲取數據，可能是 Google 頻率限制。")
        # 建立一個空白但存在的檔案，避免 GitHub Action 報錯
        with open('brand_trends.html', 'w') as f:
            f.write("<html><body><p>Data temporarily unavailable due to rate limits. Please check back later.</p></body></html>")
        return

    if 'isPartial' in df.columns:
        df = df.drop(columns=['isPartial'])

    fig = go.Figure()
    colors = {"Cartier": "#E00000", "Tiffany & Co.": "#81D8D0", "Bvlgari": "#D4AF37"}

    for kw in kw_list:
        fig.add_trace(go.Scatter(x=df.index, y=df[kw], mode='lines', name=kw, line=dict(color=colors[kw], width=2)))

    fig.update_layout(
        title={'text': "Global Search Interest", 'x': 0.5},
        plot_bgcolor='white',
        xaxis=dict(showgrid=False),
        yaxis=dict(showgrid=True, gridcolor='#f0f0f0')
    )

    pio.write_html(fig, file='brand_trends.html', include_plotlyjs='cdn', full_html=False)
    print("成功生成 brand_trends.html")

if __name__ == "__main__":
    generate_chart()

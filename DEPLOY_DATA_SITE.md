# 🚀 數據驅動個人網站：部署與自動化教學

這套系統不僅是一個靜態網頁，它還具備**自動化數據分析**功能。透過 GitHub Actions，網站會每天自動抓取最新的珠寶品牌搜尋趨勢並更新圖表。

## 📦 包含檔案
1. `index.html`: 極簡高級感的首頁（已處理響應式與嵌入）。
2. `generate_trends.py`: 負責抓取數據並生成 Plotly 圖表的 Python 腳本。
3. `.github/workflows/update_data.yml`: 自動化工作流設定。
4. `requirements.txt`: Python 依賴清單。

---

## 🛠️ 部署步驟

### 1. 上傳檔案到 GitHub
1. 登入 GitHub，進入你之前的倉庫（例如 `yoyosyt.github.io`）。
2. 點擊 **Add file** -> **Upload files**。
3. 將解壓後的**所有檔案與資料夾**（包括 `.github` 資料夾）全部拖入。
4. 點擊 **Commit changes**。

### 2. 設定 GitHub Actions 權限（重要！）
為了讓自動化腳本能將更新後的數據推送到你的倉庫，你需要開啟寫入權限：
1. 在 GitHub 倉庫頁面，點擊上方的 **Settings**。
2. 在左側選單中，點擊 **Actions** -> **General**。
3. 拉到最下方找到 **Workflow permissions**。
4. 選擇 **Read and write permissions**。
5. 點擊 **Save**。

### 3. 手動觸發第一次更新
1. 點擊 GitHub 倉庫上方的 **Actions** 標籤。
2. 在左側選單選擇 **Update Brand Trends Data**。
3. 點擊右側的 **Run workflow** 下拉選單，然後點擊綠色的 **Run workflow** 按鈕。
4. 等待約 2-3 分鐘，當它顯示綠色勾勾時，`brand_trends.html` 就會自動生成，你的網站也會出現圖表。

---

## 📈 如何自定義
* **更換品牌**：打開 `generate_trends.py`，修改 `kw_list` 裡面的品牌名稱。
* **調整配色**：在 `generate_trends.py` 的 `colors` 字典中修改十六進位顏色碼。
* **修改文字**：直接在 GitHub 網頁上編輯 `index.html`。

---

## 💡 維護提示
* **自動更新**：系統預設每天 UTC 00:00（香港時間早上 8 點）自動更新。
* **數據限制**：Google Trends 有頻率限制，如果自動更新失敗，通常是因為請求過多，GitHub Actions 會在隔天再次嘗試。

祝你的數據驅動網站運作順利！

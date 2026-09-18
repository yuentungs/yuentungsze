# GitHub Pages 網站上線與發佈完整教學

這份指南將協助你將整個 **Luxury, Jewellery & Consumer Analysis** 研究平台免費發佈至 **GitHub Pages**。

---

## 方式一：使用 AI Studio 一鍵匯出至 GitHub (最推薦、最快速)

1. 在右上角的 **設定選單 (Settings / 三個點或齒輪圖示)**。
2. 選擇 **「Export to GitHub」**（或下載 ZIP）。
3. 登入並授權你的 GitHub 帳號，設定儲存庫名稱（例如 `yuentungsze` 或 `yuentungsze.github.io`）。
4. 點擊匯出，所有最新檔案（包含所有頁面、樣式、Chatbox）會自動同步推送到你的 GitHub 倉庫中！

---

## 方式二：手動建立與上傳檔案

### 第一步：建立 GitHub 倉庫 (Repository)
1. 登入 [GitHub](https://github.com/) (若無帳號請先註冊)。
2. 點擊右上角的 **「+」** 號，選擇 **「New repository」**。
3. **Repository name**：
   - 若想使用頂級個人網址，填寫：`<你的GitHub帳號>.github.io`（例如 `yuentungs.github.io`）。
   - 若作為一般專案，填寫如：`yuentungsze`。
4. 選擇 **Public**（公開）。
5. 點擊最下方的 **「Create repository」**。

### 第二步：上傳所有網站檔案
1. 從 AI Studio 透過「Export to ZIP」下載網站壓縮包並解壓縮。
2. 在新建的 GitHub 倉庫頁面，點擊 **「uploading an existing file」**。
3. 將解壓縮出的檔案全部拖拽上傳，包含：
   - `index.html` (首頁)
   - `portfolio.html` (案例研究：Cartier/VCA 架構、東南亞市場優先級、珠寶毛利模擬器)
   - `market-dashboard.html` (宏觀經濟與珠寶消費儀表板)
   - `insights.html` (深度研究報告)
   - `experience.html` (經歷背景與諮詢服務)
   - `assets/` 資料夾（所有 CSS 與 JS 檔案）
4. 在下方 **Commit changes** 填寫「Deploy website」，點擊綠色 **Commit changes** 按鈕。

### 第三步：開啟 GitHub Pages 免費靜態託管
1. 進入倉庫頂部的 **「Settings」** 分頁。
2. 在左側選單點擊 **「Pages」**。
3. 在 **Build and deployment** 下：
   - **Source** 保持為 `Deploy from a branch`。
   - **Branch** 選擇 `main` (或 `master`)，目錄維持 `/ (root)`。
4. 點擊 **「Save」**。
5. 等待 1 至 2 分鐘，頁面頂部會出現綠色提示：
   `Your site is live at https://<username>.github.io/...`
   點擊該連結即可公開造訪你的網站！

---

## 關於 AI Chatbox (YT 助理) 在 GitHub 上的說明

- **全靜態內容**：GitHub Pages 是純前端靜態主機，網站的所有頁面、圖表、互動模擬器皆能 100% 完美運行。
- **AI Chatbox 助理**：
  - 本專案已內建智慧環境偵測。
  - 當網站發佈在 GitHub Pages 時，Chatbox 打開後會提示輸入後端 API 網址（例如由 Cloud Run、Render、Vercel 託管的後端），即可在 GitHub Pages 上無縫調用 Gemini API。
  - 若在 AI Studio Preview 或 Cloud Run 容器中運行，則會自動無縫調用內建 `/api/chat`。

---

## 日後如何修改更新內容 (免安裝任何軟體)
1. 登入 GitHub，進入你的倉庫。
2. 點擊想編輯的檔案（例如修改 `insights.html` 發表新文章，或更新 `portfolio.html`）。
3. 點擊右上角的 **「鉛筆 (Edit this file)」** 圖示。
4. 編輯完成後，滑到頁面底部點擊 **「Commit changes」**。
5. GitHub Pages 會在 1 分鐘內自動重新發佈最新版本！


# GitHub Pages 網站上傳教學 (方案二)

這套教學將指引你如何將剛生成的網站免費發佈到網路上，並學會日後如何直接在網頁上修改內容。

## 第一步：建立 GitHub 倉庫 (Repository)
1.  登入 [GitHub](https://github.com/) (若無帳號請先註冊)。
2.  點擊右上角的 **「+」** 號，選擇 **「New repository」**。
3.  **Repository name**：建議輸入 `yuentungsze.github.io` (將 `yuentungsze` 換成你的用戶名)。
4.  勾選 **Public**。
5.  點擊最下方的 **「Create repository」**。

## 第二步：上傳網站檔案
1.  在新建的倉庫頁面，點擊 **「uploading an existing file」** 連結。
2.  將我打包給你的 ZIP 檔案**解壓縮**後，將裡面的所有檔案（`index.html`, `experience.html`, `insights.html` 以及 `assets` 資料夾）拖拽到網頁中。
3.  等待上傳完成，在下方的 **Commit changes** 框中隨便輸入「Initial commit」，然後點擊 **「Commit changes」** 按鈕。

## 第三步：啟用網站
1.  點擊倉庫頂部的 **「Settings」**。
2.  在左側選單點擊 **「Pages」**。
3.  在 **Build and deployment** 下方的 Branch 選擇 `main` (或 `master`)，資料夾選擇 `/ (root)`。
4.  點擊 **Save**。
5.  大約等待 1-3 分鐘，網頁上方會出現一條訊息：「Your site is live at ...」，點擊連結即可看到你的網站！

---

## 日後如何修改內容 (免安裝程式)
這就是方案二最強大的地方：
1.  登入 GitHub，進入你的這個倉庫。
2.  點擊你想修改的檔案（例如 `insights.html` 增加新報告，或 `index.html` 修改簡介）。
3.  點擊右上角的 **「鉛筆 (Edit this file)」** 圖示。
4.  直接在網頁編輯器中修改文字。
5.  改完後，拉到最下方點擊 **「Commit changes」**。
6.  網站會在 1 分鐘內自動同步更新！

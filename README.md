# 山林漫步 - 台灣森林步道探索

![山林漫步應用截圖](https://images.unsplash.com/photo-1596097155664-4f5be285dee3?auto=format&fit=crop&w=1200&q=80)

## 專案簡介

「山林漫步」是一款專為台灣森林步道愛好者設計的網頁應用程式，整合了台灣全島各地步道資訊，提供地圖導覽、詳細資料查詢、收藏管理等功能，幫助用戶探索台灣豐富的自然資源與登山路線。

### 主要功能

- **互動式地圖**：使用Leaflet框架實現的完整地圖功能，顯示步道位置與國家公園範圍
- **步道資料庫**：包含全台灣超過20條熱門步道的詳細資訊
- **多維度篩選**：根據地區、難度、長度等多種條件篩選步道
- **搜尋功能**：快速查找符合關鍵字的步道
- **步道詳情**：查看每條步道的詳細資訊，包括描述、特色、設施與軌跡地圖
- **收藏功能**：將喜愛的步道加入收藏清單方便日後查看
- **導航協助**：提供導航至步道入口的功能
- **分享功能**：將步道資訊分享給朋友
- **響應式設計**：適應各種不同螢幕尺寸的裝置

## 使用指南

### 導覽功能

- **步道地圖**：點擊左上角的「步道地圖」查看全台步道分佈
- **步道列表**：點擊「步道列表」瀏覽所有步道資訊，並可排序篩選
- **我的收藏**：查看已收藏的步道
- **關於**：了解應用程式相關資訊與資料來源

### 搜尋與篩選

1. 在搜尋框中輸入關鍵字進行搜尋
2. 點擊「篩選」按鈕開啟篩選面板
3. 選擇地區、難度級別或步道長度進行篩選
4. 點擊「套用篩選」查看結果
5. 點擊「重置」恢復顯示所有步道

### 步道詳情

點擊任一步道卡片或地圖上的步道標記，可查看步道詳細資訊：
- 基本資訊：位置、長度、所需時間、難度等
- 詳細描述與特色景點
- 周邊設施
- 步道軌跡地圖
- 功能按鈕：收藏、分享、導航、下載GPX檔案

### 收藏功能

- 在步道詳情頁或步道列表中點擊愛心圖示可將步道加入/移除收藏
- 收藏的步道會保存在本地儲存，下次訪問仍可查看

## 技術實現

- **前端框架**：原生JavaScript、HTML5、CSS3
- **地圖實現**：Leaflet.js開源地圖庫
- **資料存儲**：使用LocalStorage實現收藏功能的本地保存
- **響應式設計**：使用Flexbox和CSS Grid實現不同設備的響應式佈局
- **圖標庫**：Font Awesome提供豐富的圖標資源

## 本地開發與部署

### 前置需求

- 現代網頁瀏覽器（Chrome、Firefox、Safari、Edge等）
- 本地開發伺服器（如需本地運行）

### 安裝步驟

1. 克隆/下載專案至本地
```
git clone https://github.com/yourusername/mountain-trails-explorer.git
```

2. 進入專案目錄
```
cd mountain-trails-explorer
```

3. 使用本地伺服器啟動專案（例如使用Python的簡易HTTP伺服器）
```
python -m http.server
```

4. 在瀏覽器中訪問 `http://localhost:8000`

### 檔案結構

```
/
├── index.html          # 主HTML檔案
├── app.js              # 主要應用邏輯
├── styles.css          # 樣式表
├── README.md           # 說明文件
└── assets/             # 資源文件夾
    └── images/         # 圖片資源
```

## 未來計劃

- 整合更多步道資料，擴充資料庫
- 添加用戶評分與評論功能
- 實現步道實時資訊（如氣象、路況等）
- 建立社群功能，允許用戶分享自己的步道體驗
- 開發行動應用版本（iOS和Android）

## 資料來源

本應用程式的步道資料主要來自：
- 台灣政府開放平台
- 林業保育署所提供的開放資料集
- 台灣山林悠遊網

資料授權方式遵循政府資料開放平台資料使用規範。

## 授權條款

本專案採用MIT授權條款 - 詳見 [LICENSE](LICENSE) 文件

## 聯絡方式

若有任何問題或建議，歡迎聯絡開發團隊：
- Email: contact@mountaintrails.tw
- GitHub: [https://github.com/yourusername/mountain-trails-explorer](https://github.com/yourusername/mountain-trails-explorer)

---

© 2024 山林漫步團隊. 版權所有. 

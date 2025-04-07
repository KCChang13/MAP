# 部署指南

## 1. 部署概述

本文件提供台灣步道探索應用程式的部署指南，包括環境配置、部署步驟和監控設置。

## 2. 系統要求

### 2.1 服務器要求
- 操作系統：Linux/Windows Server
- CPU：2核心以上
- 內存：4GB以上
- 硬碟：20GB以上
- 網絡：100Mbps以上

### 2.2 軟件要求
- Web服務器：Nginx/Apache
- Node.js：v14.0.0以上
- npm：v6.0.0以上
- Git：最新版本

## 3. 環境配置

### 3.1 開發環境
```bash
# 安裝Node.js
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安裝npm
sudo npm install -g npm@latest

# 安裝Git
sudo apt-get install git
```

### 3.2 生產環境
```bash
# 安裝Nginx
sudo apt-get update
sudo apt-get install nginx

# 配置Nginx
sudo nano /etc/nginx/sites-available/trail-app
```

Nginx配置示例：
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/trail-app;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /static/ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
}
```

## 4. 部署步驟

### 4.1 代碼部署
```bash
# 克隆代碼
git clone https://github.com/your-repo/trail-app.git
cd trail-app

# 安裝依賴
npm install

# 構建生產版本
npm run build

# 部署到服務器
sudo cp -r build/* /var/www/trail-app/
```

### 4.2 環境變量配置
```bash
# 創建環境變量文件
sudo nano /var/www/trail-app/.env

# 添加必要的環境變量
MAP_API_KEY=your_api_key
NODE_ENV=production
```

### 4.3 權限設置
```bash
# 設置目錄權限
sudo chown -R www-data:www-data /var/www/trail-app
sudo chmod -R 755 /var/www/trail-app
```

## 5. 監控設置

### 5.1 日誌監控
```bash
# 配置日誌輪轉
sudo nano /etc/logrotate.d/trail-app

# 日誌配置示例
/var/log/trail-app/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
}
```

### 5.2 性能監控
- 使用New Relic進行應用性能監控
- 配置Prometheus + Grafana監控系統
- 設置警報機制

### 5.3 錯誤追蹤
- 配置Sentry進行錯誤追蹤
- 設置錯誤通知機制
- 定期檢查錯誤日誌

## 6. 備份策略

### 6.1 代碼備份
```bash
# 自動備份腳本
#!/bin/bash
BACKUP_DIR="/backup/trail-app"
DATE=$(date +%Y%m%d)
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz /var/www/trail-app
```

### 6.2 數據備份
- 定期備份用戶數據
- 備份配置文件
- 異地備份存儲

## 7. 安全配置

### 7.1 SSL配置
```bash
# 安裝Certbot
sudo apt-get install certbot python3-certbot-nginx

# 獲取SSL證書
sudo certbot --nginx -d your-domain.com
```

### 7.2 防火牆配置
```bash
# 配置UFW
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## 8. 維護指南

### 8.1 更新流程
```bash
# 更新代碼
cd /var/www/trail-app
git pull origin main
npm install
npm run build
sudo systemctl restart nginx
```

### 8.2 回滾流程
```bash
# 回滾到上一個版本
cd /var/www/trail-app
git reset --hard HEAD^
npm install
npm run build
sudo systemctl restart nginx
```

## 9. 故障排除

### 9.1 常見問題
1. 502 Bad Gateway
   - 檢查Nginx配置
   - 檢查應用日誌
   - 重啟服務

2. 性能問題
   - 檢查服務器資源
   - 檢查數據庫查詢
   - 優化緩存配置

### 9.2 應急響應
- 建立應急響應團隊
- 制定應急響應流程
- 定期演練

## 10. 文檔維護

### 10.1 更新記錄
- 記錄所有部署更新
- 維護版本歷史
- 更新部署文檔

### 10.2 文檔審查
- 定期審查部署文檔
- 更新最佳實踐
- 收集反饋意見 
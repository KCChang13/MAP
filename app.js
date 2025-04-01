// 全局变量
var map;
var markers = [];
var trailsData = [];
var favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

// DOM元素
const navLinks = document.querySelectorAll('.nav-menu a');
const views = document.querySelectorAll('.view');
const searchInput = document.getElementById('search-input');
const filterBtn = document.getElementById('filter-btn');
const modal = document.getElementById('trail-detail-modal');
const closeModal = document.querySelector('.close');
const addFavoriteBtn = document.getElementById('add-favorite');
const exploreBtn = document.querySelector('.explore-btn');

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    // 添加图片错误样式和弹窗按钮样式
    const style = document.createElement('style');
    style.textContent = `
        .image-error-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(240, 240, 240, 0.9);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: #777;
            text-align: center;
            padding: 10px;
        }
        
        .image-error-overlay i {
            font-size: 2rem;
            margin-bottom: 8px;
        }
        
        .image-error-overlay p {
            margin: 0;
            font-size: 0.9rem;
        }
        
        .trail-image {
            position: relative;
        }

        /* 弹窗按钮样式 */
        .trail-popup .btn-primary {
            display: inline-block;
            padding: 8px 15px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            text-align: center;
            margin-top: 10px;
            transition: background-color 0.3s, transform 0.2s;
        }

        .trail-popup .btn-primary:hover {
            background-color: #45a049;
            transform: scale(1.05);
        }

        .trail-popup .btn-primary:active {
            background-color: #3d8b40;
            transform: scale(0.98);
        }

        /* 步道卡片样式优化 */
        .trail-card {
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.3s;
            position: relative;
        }

        .trail-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.15);
        }

        .trail-card:active {
            transform: translateY(-2px);
            box-shadow: 0 5px 10px rgba(0,0,0,0.1);
        }

        /* 收藏按鈕樣式 */
        .trail-favorite-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 36px;
            height: 36px;
            background-color: rgba(255, 255, 255, 0.9);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ccc;
            border: none;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 10;
            transition: all 0.3s ease;
        }
        
        .trail-favorite-btn:hover {
            transform: scale(1.1);
            background-color: #fff;
            color: #ff5a5f;
        }
        
        .trail-favorite-btn.active {
            color: #ff5a5f;
            background-color: #fff;
        }
        
        .trail-favorite-btn i {
            font-size: 18px;
        }

        /* 詳情頁樣式優化 */
        #trail-detail-modal {
            z-index: 9999;  /* 確保最高層級 */
        }

        #trail-main-image {
            background-size: cover;
            background-position: center;
            min-height: 250px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .modal-content {
            max-width: 800px;
            width: 95%;
            background-color: #fff;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }

        .details-container h3 {
            margin-top: 20px;
            color: #2C5F2D;
            border-bottom: 2px solid #2C5F2D;
            padding-bottom: 5px;
        }

        #detail-map {
            height: 300px;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            margin-top: 15px;
        }

        #add-favorite {
            cursor: pointer;
            background-color: #f8f8f8;
            transition: all 0.3s;
        }

        #add-favorite.active {
            background-color: #FFD1DC;
            color: #D23369;
        }

        .modal .close {
            position: absolute;
            top: 15px;
            right: 15px;
            font-size: 28px;
            cursor: pointer;
            z-index: 1010;
            color: #555;
            background: rgba(255,255,255,0.7);
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }

        .modal .close:hover {
            background: rgba(255,255,255,0.9);
            color: #000;
        }

        /* 修改收藏按鈕樣式和位置 */
        .trail-favorite-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 36px;
            height: 36px;
            background-color: rgba(255, 255, 255, 0.9);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ccc;
            border: none;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 10;
            transition: all 0.3s ease;
        }
        
        .trail-favorite-btn:hover {
            transform: scale(1.1);
            background-color: #fff;
            color: #ff5a5f;
        }
        
        .trail-favorite-btn.active {
            color: #ff5a5f;
            background-color: #fff;
        }
        
        .trail-favorite-btn i {
            font-size: 18px;
        }
        
        /* 步道卡片樣式修改 */
        .trail-badge {
            position: absolute;
            top: 10px;
            left: 10px;
            background-color: rgba(0, 0, 0, 0.6);
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
        }
        
        .trail-info-card {
            position: relative;
            padding: 15px;
        }
        
        .trail-name {
            margin-top: 0;
            margin-bottom: 8px;
            padding-right: 40px; /* 為收藏按鈕留出空間 */
        }
        
        /* 重新定位收藏按鈕到卡片信息區域 */
        .trail-info-favorite-btn {
            position: absolute;
            top: 12px;
            right: 15px;
            width: 32px;
            height: 32px;
            background-color: #f5f5f5;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #aaa;
            border: none;
            cursor: pointer;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            z-index: 5;
            transition: all 0.3s ease;
        }
        
        .trail-info-favorite-btn:hover {
            transform: scale(1.1);
            background-color: #fff;
            color: #ff5a5f;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        
        .trail-info-favorite-btn.active {
            color: #ff5a5f;
            background-color: #fff;
        }
        
        .trail-info-favorite-btn i {
            font-size: 16px;
        }
    `;
    document.head.appendChild(style);
    
    // 初始化應用
    initApp();
});

// 初始化地图
function initMap() {
    map = L.map('map').setView([23.6978, 120.9605], 8);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // 添加地图加载完成事件
    map.on('load', function() {
        console.log('地圖加載完成');
    });
    
    // 添加國家公園區域
    loadNationalParks();
    
    // 添加雪霸國家公園登山步道路線
    loadSheiPaTrails();
    
    // 監聽縮放級別變化
    map.on('zoomend', function() {
        updateTrailVisibility();
    });
    
    // 設置雪霸快速訪問
    setupSheiPaQuickAccess();
}

// 載入國家公園
function loadNationalParks() {
    console.log('載入國家公園圖層');
    
    // 定義國家公園邊界 - 簡化版的邊界座標（實際應使用完整GeoJSON數據）
    const nationalParkBoundaries = {
        // 玉山國家公園 - 南投縣信義鄉
        'yushan': {
            name: '玉山國家公園',
            area: 103121.40, // 平方公頃
            color: '#1E6442', // 深綠色
            coordinates: [
                [23.4500, 120.9000], [23.5000, 120.9500], [23.5500, 120.9700], 
                [23.5300, 121.0500], [23.4800, 121.1000], [23.4200, 121.0300],
                [23.4000, 120.9800], [23.4500, 120.9000]
            ]
        },
        // 太魯閣國家公園 - 花蓮縣秀林鄉
        'taroko': {
            name: '太魯閣國家公園',
            area: 92000.00, // 平方公頃
            color: '#277553', // 中綠色
            coordinates: [
                [24.1300, 121.5000], [24.2000, 121.5300], [24.3000, 121.6000],
                [24.2800, 121.7000], [24.2000, 121.6800], [24.1500, 121.6200],
                [24.1300, 121.5000]
            ]
        },
        // 雪霸國家公園 - 新竹縣、苗栗縣和台中市交界處
        'shei-pa': {
            name: '雪霸國家公園',
            area: 76850.00, // 平方公頃
            color: '#378667', // 青綠色
            coordinates: [
                [24.3800, 121.2000], [24.4300, 121.2500], [24.4500, 121.3500],
                [24.4000, 121.4000], [24.3500, 121.3800], [24.3300, 121.3000],
                [24.3500, 121.2300], [24.3800, 121.2000]
            ]
        },
        // 墾丁國家公園 - 屏東縣恆春鎮
        'kenting': {
            name: '墾丁國家公園',
            area: 33289.59, // 平方公頃
            color: '#4E9F78', // 淺綠色
            coordinates: [
                [21.9000, 120.7000], [21.9500, 120.7500], [21.9800, 120.8000],
                [21.9500, 120.8500], [21.9000, 120.8700], [21.8500, 120.8000],
                [21.8700, 120.7500], [21.9000, 120.7000]
            ]
        },
        // 陽明山國家公園 - 台北市北投區和士林區
        'yangmingshan': {
            name: '陽明山國家公園',
            area: 11338.00, // 平方公頃
            color: '#5E5E5E', // 灰色
            coordinates: [
                [25.1500, 121.5300], [25.1800, 121.5600], [25.2000, 121.5800],
                [25.1900, 121.6100], [25.1700, 121.6200], [25.1500, 121.6000],
                [25.1300, 121.5700], [25.1500, 121.5300]
            ]
        },
        // 台江國家公園 - 台南市安南區和七股區
        'taijiang': {
            name: '台江國家公園',
            area: 39310.00, // 平方公頃
            color: '#60A5A9', // 綠松色
            coordinates: [
                [23.0300, 120.0800], [23.0800, 120.1000], [23.1000, 120.1500],
                [23.0800, 120.1800], [23.0500, 120.1700], [23.0200, 120.1300],
                [23.0300, 120.0800]
            ]
        },
        // 金門國家公園 - 金門縣
        'kinmen': {
            name: '金門國家公園',
            area: 3528.74, // 平方公頃
            color: '#B09A5B', // 金色
            coordinates: [
                [24.4300, 118.3500], [24.4600, 118.3800], [24.4800, 118.4200],
                [24.4600, 118.4500], [24.4300, 118.4300], [24.4100, 118.3900],
                [24.4300, 118.3500]
            ]
        },
        // 東沙環礁國家公園 - 南海
        'dongsha': {
            name: '東沙環礁國家公園',
            area: 353667.95, // 平方公頃
            color: '#3D85B0', // 藍色
            coordinates: [
                [20.6500, 116.7000], [20.7500, 116.7500], [20.8000, 116.8500],
                [20.7500, 116.9500], [20.6500, 116.9000], [20.6000, 116.8000],
                [20.6500, 116.7000]
            ]
        },
        // 澎湖南方四島國家公園 - 澎湖縣
        'penghu': {
            name: '澎湖南方四島國家公園',
            area: 35843.62, // 平方公頃
            color: '#5D8EB3', // 淺藍色
            coordinates: [
                [23.1800, 119.5500], [23.2500, 119.6000], [23.2800, 119.6800],
                [23.2500, 119.7500], [23.1800, 119.7000], [23.1500, 119.6200],
                [23.1800, 119.5500]
            ]
        }
    };

    // 創建國家公園圖層組
    const nationalParkLayers = {};
    
    // 遍歷每個國家公園並添加圖層，但預設不添加到地圖上
    for (const [id, park] of Object.entries(nationalParkBoundaries)) {
        const polygon = L.polygon(park.coordinates, {
            color: park.color,
            fillOpacity: 0.3,
            weight: 2
        });
        
        // 添加點擊事件
        polygon.bindPopup(`
            <div class="park-popup">
                <h3>${park.name}</h3>
                <p>面積: ${park.area.toLocaleString('zh-TW')} 公頃</p>
                <button class="popup-btn" onclick="showNationalParkInfo('${id}')">查看詳情</button>
            </div>
        `);
        
        // 保存圖層但不添加到地圖
        nationalParkLayers[id] = polygon;
    }
    
    // 保存國家公園資料為全局變量
    window.nationalParks = nationalParkBoundaries;
    window.nationalParkLayers = nationalParkLayers;
    
    // 設置國家公園複選框事件
    setupNationalParkCheckboxes();
    
    console.log('國家公園圖層已創建:', Object.keys(nationalParkLayers));
}

// 設置國家公園複選框事件
function setupNationalParkCheckboxes() {
    // 全部國家公園切換
    const toggleAllParks = document.getElementById('toggle-all-parks');
    if (toggleAllParks) {
        toggleAllParks.addEventListener('change', function() {
            const isChecked = this.checked;
            // 更新所有國家公園的選中狀態
            document.querySelectorAll('.legend-controls input[type="checkbox"]:not(#toggle-all-parks)').forEach(checkbox => {
                checkbox.checked = isChecked;
                const parkId = checkbox.id.replace('toggle-', '');
                toggleNationalPark(parkId, isChecked);
            });
        });
    }
    
    // 個別國家公園切換
    const nationalParkIds = [
        'yushan', 'taroko', 'shei-pa', 'kenting', 'yangmingshan', 
        'taijiang', 'kinmen', 'dongsha', 'penghu'
    ];
    
    nationalParkIds.forEach(parkId => {
        const checkbox = document.getElementById(`toggle-${parkId}`);
        if (checkbox) {
            checkbox.addEventListener('change', function() {
                toggleNationalPark(parkId, this.checked);
            });
            
            // 雙擊標籤快速定位
            checkbox.parentElement.addEventListener('dblclick', function(e) {
                e.preventDefault();
                const park = window.nationalParks[parkId];
                if (park && park.coordinates) {
                    // 計算公園中心點
                    let sumLat = 0, sumLng = 0;
                    park.coordinates.forEach(coord => {
                        sumLat += coord[0];
                        sumLng += coord[1];
                    });
                    const centerLat = sumLat / park.coordinates.length;
                    const centerLng = sumLng / park.coordinates.length;
                    
                    // 設置地圖視圖並確保國家公園被選中
                    map.setView([centerLat, centerLng], 10);
                    
                    // 確保國家公園圖層顯示
                    if (!checkbox.checked) {
                        checkbox.checked = true;
                        toggleNationalPark(parkId, true);
                    }
                }
            });
        }
    });
}

// 切換國家公園圖層顯示/隱藏
function toggleNationalPark(parkId, show) {
    const layer = window.nationalParkLayers[parkId];
    if (!layer) return;
    
    if (show) {
        layer.addTo(map);
    } else if (map.hasLayer(layer)) {
        map.removeLayer(layer);
    }
}

// 新增雪霸國家公園登山步道路線
function loadSheiPaTrails() {
    // 雪霸國家公園主要登山步道路線數據
    // 使用GeoJSON格式表示，這裡使用簡化的路線數據
    const sheiPaTrailsData = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "name": "雪山主東線",
                    "difficulty": "高",
                    "length": "10.9公里",
                    "description": "雪山主東線是通往雪山主峰的主要路線，從武陵農場出發"
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [121.3070, 24.3830], 
                        [121.3120, 24.3880],
                        [121.3180, 24.3930],
                        [121.3250, 24.3970],
                        [121.3340, 24.4010],
                        [121.3410, 24.4050]
                    ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "name": "雪山西稜線",
                    "difficulty": "高",
                    "length": "8.5公里",
                    "description": "雪山西稜線連接雪山主峰與翠池地區"
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [121.2980, 24.3910],
                        [121.3050, 24.3950],
                        [121.3120, 24.3980],
                        [121.3200, 24.4020],
                        [121.3270, 24.4050]
                    ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "name": "大霸尖山登山步道",
                    "difficulty": "高",
                    "length": "12.3公里",
                    "description": "大霸尖山登山步道通往雪霸國家公園最著名的大霸尖山"
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [121.2570, 24.4310],
                        [121.2630, 24.4340],
                        [121.2690, 24.4380],
                        [121.2750, 24.4420],
                        [121.2810, 24.4450]
                    ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "name": "武陵四秀登山步道",
                    "difficulty": "中",
                    "length": "14公里",
                    "description": "武陵四秀包括品田山、池有山、桃山、喀拉業山四座百岳"
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [121.3210, 24.4150],
                        [121.3260, 24.4190],
                        [121.3320, 24.4230],
                        [121.3380, 24.4270],
                        [121.3440, 24.4310]
                    ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "name": "聖稜線",
                    "difficulty": "高",
                    "length": "18.7公里",
                    "description": "聖稜線連接雪山主峰與大霸尖山，是台灣著名的高難度縱走路線"
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [121.2810, 24.4450],
                        [121.2870, 24.4420],
                        [121.2940, 24.4380],
                        [121.3010, 24.4330],
                        [121.3080, 24.4280],
                        [121.3150, 24.4220],
                        [121.3220, 24.4160],
                        [121.3290, 24.4110],
                        [121.3360, 24.4050],
                        [121.3410, 24.4050]
                    ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "name": "志佳陽線",
                    "difficulty": "中",
                    "length": "7.4公里",
                    "description": "志佳陽線通往志佳陽山，沿途經過美麗的檜木林"
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [121.2430, 24.3610],
                        [121.2470, 24.3650],
                        [121.2510, 24.3690],
                        [121.2550, 24.3730],
                        [121.2590, 24.3770]
                    ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "name": "雪山東峰步道",
                    "difficulty": "高",
                    "length": "6.5公里",
                    "description": "雪山東峰步道是從雪山主峰前往雪山東峰的路線"
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [121.3410, 24.4050],
                        [121.3460, 24.4030],
                        [121.3510, 24.4010],
                        [121.3560, 24.3990],
                        [121.3610, 24.3970]
                    ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "name": "七卡山莊步道",
                    "difficulty": "低",
                    "length": "3.8公里",
                    "description": "七卡山莊步道是從雪山登山口前往七卡山莊的路線"
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [121.3030, 24.3790],
                        [121.3050, 24.3810],
                        [121.3070, 24.3830]
                    ]
                }
            }
        ]
    };
    
    // 創建雪霸步道圖層組
    window.sheiPaTrailsLayers = L.layerGroup();
    
    // 使用不同顏色表示不同難度的步道
    const colorByDifficulty = {
        "低": "#3388ff",  // 藍色
        "中": "#ff7800",  // 橙色
        "高": "#ff0000"   // 紅色
    };
    
    // 遍歷每條步道並添加到地圖
    sheiPaTrailsData.features.forEach(feature => {
        const properties = feature.properties;
        // 注意: 不需要交換經緯度，Leaflet使用[緯度, 經度]，而GeoJSON使用[經度, 緯度]
        const coordinates = feature.geometry.coordinates.map(coord => [coord[1], coord[0]]);
        
        // 設定步道樣式
        const difficulty = properties.difficulty || "中";
        const color = colorByDifficulty[difficulty];
        
        // 創建線段，添加適當的權重和不透明度
        const polyline = L.polyline(coordinates, {
            color: color,
            weight: 4,  // 增加線條寬度
            opacity: 0.9,  // 增加不透明度
            dashArray: difficulty === "高" ? "" : difficulty === "中" ? "5, 10" : "1, 10"
        });
        
        // 添加步道信息的彈出窗口
        polyline.bindPopup(`
            <div class="trail-popup">
                <h3>${properties.name}</h3>
                <p><strong>難度:</strong> <span class="difficulty-${difficulty === "高" ? "high" : difficulty === "中" ? "medium" : "low"}">${properties.difficulty}</span></p>
                <p><strong>長度:</strong> ${properties.length}</p>
                <p>${properties.description}</p>
            </div>
        `);
        
        // 添加懸停顯示步道名稱，提高可見度
        polyline.bindTooltip(properties.name, {
            permanent: false,
            direction: 'top',
            className: 'hiking-trail-tooltip'
        });
        
        // 將步道線段添加到圖層組
        window.sheiPaTrailsLayers.addLayer(polyline);
    });
    
    // 根據當前縮放級別決定是否顯示
    updateTrailVisibility();
    
    // 添加點擊地圖事件，當點擊雪霸國家公園區域時自動放大到顯示步道的縮放級別
    const sheiPaLayer = window.nationalParkLayers && window.nationalParkLayers['shei-pa'];
    if (sheiPaLayer) {
        sheiPaLayer.on('click', function(e) {
            // 檢查當前縮放級別，如果小於10則放大
            if (map.getZoom() < 10) {
                // 設定縮放中心為點擊位置
                map.setView(e.latlng, 10);
            }
        });
    }
}

// 根據縮放級別更新步道可見性
function updateTrailVisibility() {
    if (!map || !window.sheiPaTrailsLayers) return;
    
    const currentZoom = map.getZoom();
    const hikingTrailsCheckbox = document.getElementById('toggle-hiking-trails');
    
    // 只有當開關打開且縮放級別大於等於10時顯示步道
    if (currentZoom >= 10 && hikingTrailsCheckbox && hikingTrailsCheckbox.checked) {
        if (!map.hasLayer(window.sheiPaTrailsLayers)) {
            window.sheiPaTrailsLayers.addTo(map);
            console.log('顯示雪霸步道', currentZoom);
        }
    } else {
        if (map.hasLayer(window.sheiPaTrailsLayers)) {
            map.removeLayer(window.sheiPaTrailsLayers);
            console.log('隱藏雪霸步道', currentZoom);
        }
    }
}

// 添加雪霸國家公園快速訪問功能
function setupSheiPaQuickAccess() {
    // 當用戶點擊雪霸國家公園圖例時，自動將地圖中心設定到雪霸並放大
    const sheiPaToggle = document.getElementById('toggle-shei-pa');
    if (sheiPaToggle) {
        sheiPaToggle.parentElement.addEventListener('dblclick', function(e) {
            e.preventDefault();
            // 雪霸國家公園中心點大約位置
            map.setView([24.4000, 121.3000], 10);
        });
    }
}

// 顯示國家公園詳細信息
function showNationalParkInfo(parkId) {
    const park = window.nationalParks[parkId];
    if (!park) return;
    
    // 找出該國家公園內的步道
    const parkTrails = trailsData.filter(trail => {
        // 檢查步道座標是否在國家公園範圍內
        // 這裡使用簡化版判斷，實際應使用點位於多邊形內的算法
        const isInPark = isPointInPolygon(trail.coordinates, park.coordinates);
        return isInPark;
    });
    
    // 創建彈出窗口
    const modal = document.getElementById('trail-detail-modal');
    const modalTitle = document.getElementById('detail-trail-name');
    const modalContent = document.getElementById('detail-main-content');
    
    if (!modal || !modalTitle || !modalContent) return;
    
    // 設置標題和內容
    modalTitle.textContent = park.name;
    
    // 準備國家公園分區數據
    let zoneStat = '';
    switch(parkId) {
        case 'yushan':
            zoneStat = `
                <tr><td>生態保護區</td><td>73,622.30公頃</td></tr>
                <tr><td>特別景觀區</td><td>3,393.10公頃</td></tr>
                <tr><td>史蹟保存區</td><td>279.70公頃</td></tr>
                <tr><td>遊憩區</td><td>240.20公頃</td></tr>
                <tr><td>一般管制區</td><td>25,586.10公頃</td></tr>
            `;
            break;
        case 'taroko':
            zoneStat = `
                <tr><td>生態保護區</td><td>66,240.00公頃</td></tr>
                <tr><td>特別景觀區</td><td>22,630.00公頃</td></tr>
                <tr><td>史蹟保存區</td><td>40.00公頃</td></tr>
                <tr><td>遊憩區</td><td>300.00公頃</td></tr>
                <tr><td>一般管制區</td><td>2,790.00公頃</td></tr>
            `;
            break;
        case 'kenting':
            zoneStat = `
                <tr><td>生態保護區</td><td>6,725.19公頃</td></tr>
                <tr><td>特別景觀區</td><td>1,862.56公頃</td></tr>
                <tr><td>史蹟保存區</td><td>15.15公頃</td></tr>
                <tr><td>遊憩區</td><td>760.24公頃</td></tr>
                <tr><td>一般管制區</td><td>23,926.45公頃</td></tr>
            `;
            break;
        // 其他國家公園可以按需添加
        default:
            zoneStat = '<tr><td colspan="2">暫無詳細數據</td></tr>';
    }
    
    // 設置國家公園內容
    modalContent.innerHTML = `
        <div class="park-detail-container">
            <div class="park-info-section">
                <h3>國家公園資訊</h3>
                <div class="park-info">
                    <p><strong>總面積:</strong> ${park.area.toLocaleString('zh-TW')} 公頃</p>
                    <h4>分區統計</h4>
                    <table class="zone-table">
                        <thead>
                            <tr>
                                <th>分區</th>
                                <th>面積</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${zoneStat}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="park-trails-section">
                <h3>園內步道 (${parkTrails.length}條)</h3>
                <div class="park-trails">
                    ${parkTrails.length > 0 ? 
                        parkTrails.map(trail => `
                            <div class="park-trail-item" onclick="showTrailDetails(${trail.id})">
                                <div class="trail-mini-image" style="background-image: url('${trail.images[0]}')"></div>
                                <div class="trail-mini-info">
                                    <h4>${trail.name}</h4>
                                    <p>${trail.location} · ${trail.length}公里 · ${getDifficultyText(trail.difficulty)}</p>
                                </div>
                            </div>
                        `).join('') : 
                        '<p class="no-trails">暫無相關步道數據</p>'
                    }
                </div>
            </div>
        </div>
    `;
    
    // 顯示模態框
    modal.style.display = 'block';
}

// 判斷點是否在多邊形內的輔助函數
function isPointInPolygon(point, polygon) {
    // 簡化版判斷，實際應使用射線法或其他算法
    // 這裡只是模擬，實際上應該使用更精確的方法
    const [lat, lng] = point;
    
    // 獲取多邊形的邊界
    let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;
    for (const [plat, plng] of polygon) {
        minLat = Math.min(minLat, plat);
        maxLat = Math.max(maxLat, plat);
        minLng = Math.min(minLng, plng);
        maxLng = Math.max(maxLng, plng);
    }
    
    // 檢查點是否在邊界框內
    // 這只是一個粗略的檢查，不是精確的點在多邊形內判斷
    return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
}

// 將函數暴露給全局供HTML調用
window.showNationalParkInfo = showNationalParkInfo;

// 确保所有步道都有有效的图片
function ensureTrailImages(trails) {
    // 山林主题的默认图片集合 - 使用可靠的免費圖床
    const natureImages = [
        'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=800&q=80',  // 大雪山
        'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=800&q=80',  // 太平山
        'https://images.unsplash.com/photo-1496434059439-62081cbec141?auto=format&fit=crop&w=800&q=80',  // 阿里山
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',  // 玉山
        'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=800&q=80',  // 奧萬大
        'https://images.unsplash.com/photo-1464198016405-33fd8513e4b3?auto=format&fit=crop&w=800&q=80',  // 司馬庫斯
        'https://images.unsplash.com/photo-1502163140606-888448ae8cfe?auto=format&fit=crop&w=800&q=80',  // 東眼山
        'https://images.unsplash.com/photo-1465189684280-6a8fa9b19a00?auto=format&fit=crop&w=800&q=80',  // 太魯閣
        'https://images.unsplash.com/photo-1572893298254-8631dc79e129?auto=format&fit=crop&w=800&q=80',  // 金針山
        'https://images.unsplash.com/photo-1600004691947-a6bb4558e0c4?auto=format&fit=crop&w=800&q=80',  // 都蘭山
        'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=800&q=80',  // 知本森林
        'https://images.unsplash.com/photo-1528184039930-bd03972bd974?auto=format&fit=crop&w=800&q=80',  // 墾丁
        'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80',  // 茂林
        'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=800&q=80',  // 合歡山
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80'   // 小霸尖山
    ];

    // 备用图片（公共域免版权图片）
    const fallbackImages = [
        'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?auto=format&fit=crop&w=800&q=80'
    ];

    // 各区域默认图片
    const regionImages = {
        'taichung': 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=800&q=80',    // 大雪山
        'yilan': 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=800&q=80',       // 太平山
        'chiayi': 'https://images.unsplash.com/photo-1496434059439-62081cbec141?auto=format&fit=crop&w=800&q=80',      // 阿里山
        'nantou': 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=800&q=80',      // 奧萬大
        'hsinchu': 'https://images.unsplash.com/photo-1464198016405-33fd8513e4b3?auto=format&fit=crop&w=800&q=80',     // 司馬庫斯
        'taoyuan': 'https://images.unsplash.com/photo-1502163140606-888448ae8cfe?auto=format&fit=crop&w=800&q=80',     // 東眼山
        'pingtung': 'https://images.unsplash.com/photo-1528184039930-bd03972bd974?auto=format&fit=crop&w=800&q=80',    // 墾丁
        'kaohsiung': 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80',   // 茂林
        'hualien': 'https://images.unsplash.com/photo-1465189684280-6a8fa9b19a00?auto=format&fit=crop&w=800&q=80',     // 太魯閣
        'taitung': 'https://images.unsplash.com/photo-1572893298254-8631dc79e129?auto=format&fit=crop&w=800&q=80',     // 金針山
        'taipei': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',      // 陽明山
        'newTaipei': 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=800&q=80'    // 鶯歌
    };

    // 确保每条步道都有图片
    trails.forEach(trail => {
        if (!trail.images || trail.images.length === 0 || !isValidImageUrl(trail.images[0])) {
            // 使用区域默认图片或随机选择一张自然图片
            const defaultImage = regionImages[trail.region] || 
                              natureImages[Math.floor(Math.random() * natureImages.length)];
            trail.images = [defaultImage];
        }
    });
}

// 检查图片URL是否有效
function isValidImageUrl(url) {
    if (!url) return false;
    
    // 检查是否为不可靠的新闻网站图片链接
    const unreliableHosts = [
        'cdn2.ettoday.net',
        'img.ltn.com.tw',
        'as.chdev.tw',
        'www.taiwan.net.tw',
        'cdntwrunning.biji.co',
        'i2.wp.com',
        'decing.tw',
        'tour.klcg.gov.tw'
    ];
    
    try {
        const urlObj = new URL(url);
        if (unreliableHosts.some(host => urlObj.hostname.includes(host))) {
            console.log(`检测到不可靠的图片源: ${urlObj.hostname}`);
            return false;
        }
        return true;
    } catch (e) {
        console.error('无效的图片URL:', url, e);
        return false;
    }
}

// 获取步道数据
function fetchTrailsData() {
    console.log('開始獲取步道數據');
    
    return new Promise((resolve) => {
        // 模擬API請求延遲
        setTimeout(() => {
            const trails = [
                {
                    id: 1,
                    name: '陽明山國家公園 - 七星山步道',
                    location: '台北市 陽明山',
                    region: 'taipei',
                    length: 2.5,
                    time: '约1.5小時',
                    difficulty: 'easy',
                    elevation: '1120m',
                    description: '七星山步道位於陽明山國家公園內，是台北市最高峰，沿途可欣賞草原風光與遠眺台北盆地，天氣晴朗時更可遠眺台灣北部海岸線。',
                    features: ['火山地形', '芒草景觀', '城市夜景', '日出景點'],
                    facilities: ['停車場', '公廁', '休息涼亭'],
                    lat: 25.1698,
                    lng: 121.5548,
                    images: [
                        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80'
                    ]
                },
                {
                    id: 2,
                    name: '太魯閣國家公園 - 砂卡礑步道',
                    location: '花蓮縣 太魯閣國家公園',
                    region: 'hualien',
                    length: 4.1,
                    time: '約2小時',
                    difficulty: 'easy',
                    elevation: '750m',
                    description: '砂卡礑步道沿著立霧溪谷而建，全長約4.1公里，沿途可欣賞峽谷、溪流與豐富的植物生態，是太魯閣國家公園中最受歡迎的步道之一。',
                    features: ['峽谷地形', '溪流景觀', '豐富植被', '吊橋'],
                    facilities: ['停車場', '公廁', '涼亭'],
                    lat: 24.1738,
                    lng: 121.6220,
                    images: [
                        'https://images.unsplash.com/photo-1465189684280-6a8fa9b19a00?auto=format&fit=crop&w=800&q=80'
                    ]
                },
                {
                    id: 3,
                    name: '阿里山國家森林遊樂區 - 祝山觀日步道',
                    location: '嘉義縣 阿里山',
                    region: 'chiayi',
                    length: 3.5,
                    time: '約2小時',
                    difficulty: 'medium',
                    elevation: '2450m',
                    description: '祝山觀日步道是阿里山區域內欣賞日出的最佳地點，清晨可觀賞雲海與日出美景，沿途並有台灣特有的檜木林與高山植物。',
                    features: ['日出景點', '雲海', '森林鐵路', '高山植物'],
                    facilities: ['停車場', '餐廳', '旅館'],
                    lat: 23.5101,
                    lng: 120.8011,
                    images: [
                        'https://images.unsplash.com/photo-1496434059439-62081cbec141?auto=format&fit=crop&w=800&q=80'
                    ]
                },
                {
                    id: 4,
                    name: '墾丁國家公園 - 社頂自然步道',
                    location: '屏東縣 墾丁國家公園',
                    region: 'pingtung',
                    length: 1.6,
                    time: '約1小時',
                    difficulty: 'easy',
                    elevation: '250m',
                    description: '社頂自然步道位於墾丁國家公園內，為熱帶季風林生態，可觀察猴子、飛鼠等野生動物，並有戶外解說牌介紹當地生態。',
                    features: ['熱帶季風林', '野生動物觀察', '珊瑚礁岩地形'],
                    facilities: ['停車場', '公廁', '涼亭', '解說站'],
                    lat: 21.9477,
                    lng: 120.8011,
                    images: [
                        'https://images.unsplash.com/photo-1528184039930-bd03972bd974?auto=format&fit=crop&w=800&q=80'
                    ]
                },
                {
                    id: 5,
                    name: '玉山國家公園 - 塔塔加步道',
                    location: '南投縣 玉山國家公園',
                    region: 'nantou',
                    length: 7.5,
                    time: '約4小時',
                    difficulty: 'medium',
                    elevation: '2600m',
                    description: '塔塔加步道是玉山國家公園西部的知名步道，沿途可觀賞高山草原與遠眺玉山群峰，秋冬季節更可能看到雲海景觀。',
                    features: ['高山草原', '玉山杜鵑', '雲海', '遠眺玉山群峰'],
                    facilities: ['停車場', '公廁', '遊客中心'],
                    lat: 23.4889,
                    lng: 120.8820,
                    images: [
                        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
                    ]
                },
                {
                    id: 6,
                    name: '雪霸國家公園 - 雪見遊憩區步道',
                    location: '苗栗縣 雪霸國家公園',
                    region: 'miaoli',
                    length: 5.2,
                    time: '約3小時',
                    difficulty: 'hard',
                    elevation: '2350m',
                    description: '雪見遊憩區步道位於雪霸國家公園內，是泰雅族傳統領域，可遠眺北坑溪谷，並欣賞豐富原始檜木林生態。',
                    features: ['原始檜木林', '泰雅族文化', '山谷地形', '野生動物'],
                    facilities: ['停車場', '公廁', '遊客中心'],
                    lat: 24.3933,
                    lng: 121.2358,
                    images: [
                        'https://images.unsplash.com/photo-1464198016405-33fd8513e4b3?auto=format&fit=crop&w=800&q=80'
                    ]
                },
                {
                    id: 7,
                    name: '陽明山國家公園 - 冷水坑步道',
                    location: '台北市 陽明山',
                    region: 'taipei',
                    length: 1.8,
                    time: '約1小時',
                    difficulty: 'easy',
                    elevation: '840m',
                    description: '冷水坑步道環繞冷水坑溫泉區，沿途可欣賞地熱、硫磺噴氣孔與豐富的溫泉生態，是一條老少咸宜的輕鬆健行路線。',
                    features: ['溫泉生態', '地熱景觀', '硫磺噴氣孔', '蕨類植物'],
                    facilities: ['停車場', '公廁', '遊客中心', '餐廳'],
                    lat: 25.1623,
                    lng: 121.5458,
                    images: [
                        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80'
                    ]
                },
                {
                    id: 8,
                    name: '七星潭海岸步道',
                    location: '花蓮縣 七星潭',
                    region: 'hualien',
                    length: 4.2,
                    time: '約1.5小時',
                    difficulty: 'easy',
                    elevation: '10m',
                    description: '七星潭海岸步道沿著花蓮東海岸而建，全長約4.2公里，是欣賞太平洋海景和拾貝石的好去處，地形平坦好走，適合全家一同踏青。',
                    features: ['太平洋景觀', '卵石海灘', '海濱生態', '日出景點'],
                    facilities: ['停車場', '公廁', '涼亭', '腳踏車道'],
                    lat: 24.0305,
                    lng: 121.6205,
                    images: [
                        'https://images.unsplash.com/photo-1502163140606-888448ae8cfe?auto=format&fit=crop&w=800&q=80'
                    ]
                },
                {
                    id: 9,
                    name: '清水斷崖步道',
                    location: '花蓮縣 太魯閣國家公園',
                    region: 'hualien',
                    length: 2.0,
                    time: '約1小時',
                    difficulty: 'medium',
                    elevation: '450m',
                    description: '清水斷崖步道沿著蘇花公路而建，可俯瞰太平洋絕美海景，以及世界級的地質奇觀清水斷崖，是台灣東海岸最壯麗的自然景觀之一。',
                    features: ['海岸斷崖', '太平洋景觀', '地質景觀', '蘇花公路風光'],
                    facilities: ['停車場', '觀景台'],
                    lat: 24.1878,
                    lng: 121.6452,
                    images: [
                        'https://images.unsplash.com/photo-1465189684280-6a8fa9b19a00?auto=format&fit=crop&w=800&q=80'
                    ]
                },
                // 新增北部步道 (2個)
                {
                    id: 101,
                    name: '平溪 - 五分山步道',
                    location: '新北市 平溪區',
                    region: 'newTaipei',
                    length: 3.8,
                    time: '約2小時',
                    difficulty: 'medium',
                    elevation: '560m',
                    description: '五分山步道沿著舊有鐵道改建而成，可遠眺基隆河谷風光，沿途經過許多廢棄礦坑，了解平溪早期煤礦產業的歷史。',
                    features: ['煤礦遺跡', '山谷風光', '鐵道歷史', '季節賞楓'],
                    facilities: ['停車場', '公廁', '涼亭'],
                    lat: 25.0262,
                    lng: 121.7408,
                    images: [
                        'https://images.unsplash.com/photo-1454372182658-c712e4c5a1db?auto=format&fit=crop&w=800&q=80'
                    ]
                },
                {
                    id: 102,
                    name: '貢寮 - 桃源谷步道',
                    location: '新北市 貢寮區',
                    region: 'newTaipei',
                    length: 2.6,
                    time: '約1.5小時',
                    difficulty: 'easy',
                    elevation: '320m',
                    description: '桃源谷步道環繞著翠綠山林與溪流，原為漁農耕地，現已形成自然生態保育區，四季風貌各異，夏季可見螢火蟲，秋季芒草隨風搖曳。',
                    features: ['溪谷風光', '季節芒草', '生態觀察', '漁農文化'],
                    facilities: ['停車場', '公廁', '小吃攤販'],
                    lat: 25.0182,
                    lng: 121.9187,
                    images: [
                        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80'
                    ]
                },
                
                // 新增中部步道 (2個)
                {
                    id: 103,
                    name: '谷關 - 八仙山森林步道',
                    location: '台中市 和平區',
                    region: 'taichung',
                    length: 5.5,
                    time: '約3小時',
                    difficulty: 'medium',
                    elevation: '950m',
                    description: '八仙山森林步道位於谷關溫泉區附近，步道內林相豐富多變，以紅檜與扁柏為主，春季有杜鵑花盛開，秋季則有層層楓紅。',
                    features: ['原始森林', '紅檜扁柏', '溫泉區', '四季花卉'],
                    facilities: ['停車場', '公廁', '涼亭', '解說牌'],
                    lat: 24.1923,
                    lng: 120.9527,
                    images: [
                        'https://images.unsplash.com/photo-1502062403836-a9eff972c67e?auto=format&fit=crop&w=800&q=80'
                    ]
                },
                {
                    id: 104,
                    name: '惠蓀林場 - 松風步道',
                    location: '南投縣 仁愛鄉',
                    region: 'nantou',
                    length: 4.2,
                    time: '約2.5小時',
                    difficulty: 'easy',
                    elevation: '1200m',
                    description: '松風步道位於惠蓀林場內，以人工栽植的柳杉林為主，林間空氣清新，步道平緩好走，適合全家大小一同健行。早晨常有雲海景觀。',
                    features: ['柳杉林', '霧林景觀', '鳥類觀察', '森林浴'],
                    facilities: ['停車場', '餐廳', '住宿', '遊客中心'],
                    lat: 24.0721,
                    lng: 121.0391,
                    images: [
                        'https://images.unsplash.com/photo-1494783367193-149034c05e8f?auto=format&fit=crop&w=800&q=80'
                    ]
                },
                
                // 新增南部步道 (2個)
                {
                    id: 105,
                    name: '田寮 - 月世界泥岩步道',
                    location: '高雄市 田寮區',
                    region: 'kaohsiung',
                    length: 2.8,
                    time: '約1.5小時',
                    difficulty: 'easy',
                    elevation: '180m',
                    description: '月世界泥岩步道以特殊的惡地地形聞名，灰白色的泥岩經過長年風雨侵蝕形成獨特的地貌，猶如月球表面，黃昏時分更有獨特的光影變化。',
                    features: ['泥岩惡地', '地質景觀', '夕陽美景', '特殊生態'],
                    facilities: ['停車場', '公廁', '展望台', '解說站'],
                    lat: 22.8827,
                    lng: 120.3889,
                    images: [
                        'https://images.unsplash.com/photo-1446717295211-13f281283fcf?auto=format&fit=crop&w=800&q=80'
                    ]
                },
                {
                    id: 106,
                    name: '崁頂 - 森林公園步道',
                    location: '屏東縣 崁頂鄉',
                    region: 'pingtung',
                    length: 3.1,
                    time: '約1.5小時',
                    difficulty: 'easy',
                    elevation: '80m',
                    description: '崁頂森林公園步道位於農業區中的小型森林公園，步道環繞人工林與天然次生林，樹種豐富多樣，是在地居民休閒與賞鳥的好去處。',
                    features: ['樹木園區', '鳥類棲息地', '農村風光', '季節果樹'],
                    facilities: ['停車場', '公廁', '涼亭', '兒童遊樂區'],
                    lat: 22.5147,
                    lng: 120.5174,
                    images: [
                        'https://images.unsplash.com/photo-1536048744064-c485540cf832?auto=format&fit=crop&w=800&q=80'
                    ]
                },
                
                // 新增東部步道 (2個)
                {
                    id: 107,
                    name: '七星潭海岸步道',
                    location: '花蓮縣 新城鄉',
                    region: 'hualien',
                    length: 4.2,
                    time: '約2小時',
                    difficulty: 'easy',
                    elevation: '5m',
                    description: '七星潭海岸步道沿著花蓮東部海岸線延伸，是欣賞太平洋壯闊海景的絕佳地點，步道平坦易行，沿途有大量的花崗岩和美麗的鵝卵石灘。',
                    features: ['海岸風光', '鵝卵石灘', '日出景點', '賞浪'],
                    facilities: ['停車場', '公廁', '涼亭', '自行車道'],
                    lat: 24.0286,
                    lng: 121.6276,
                    images: [
                        'https://images.unsplash.com/photo-1501444459141-c73dc8908191?auto=format&fit=crop&w=800&q=80'
                    ]
                },
                {
                    id: 108,
                    name: '清水斷崖步道',
                    location: '花蓮縣 秀林鄉',
                    region: 'hualien',
                    length: 2.0,
                    time: '約1小時',
                    difficulty: 'medium',
                    elevation: '150m',
                    description: '清水斷崖步道沿著蘇花公路邊緣延伸，可俯瞰太平洋與壯麗的大理石峭壁，高度落差大，視野極佳，是台灣最具代表性的自然景觀之一。',
                    features: ['斷崖地形', '太平洋景觀', '地質奇觀', '大理石岩壁'],
                    facilities: ['停車場', '公廁', '觀景台'],
                    lat: 24.1887,
                    lng: 121.6470,
                    images: [
                        'https://images.unsplash.com/photo-1544396741-67500d46800e?auto=format&fit=crop&w=800&q=80'
                    ]
                },
                
                // 新增台東步道 (2個)
                {
                    id: 109,
                    name: '都蘭山步道',
                    location: '台東縣 東河鄉',
                    region: 'taitung',
                    length: 6.3,
                    time: '約3.5小時',
                    difficulty: 'medium',
                    elevation: '1190m',
                    description: '都蘭山步道位於台東東河鄉，是阿美族重要的聖山，登頂可360度環視太平洋和花東縱谷。步道沿途有豐富的原始森林植被，能欣賞到各種不同的生態樣貌。',
                    features: ['原始森林', '原住民文化遺址', '太平洋景觀', '地質景觀'],
                    facilities: ['停車場', '公廁', '涼亭'],
                    lat: 22.8563,
                    lng: 121.2347,
                    images: [
                        'https://images.unsplash.com/photo-1572893298254-8631dc79e129?auto=format&fit=crop&w=800&q=80'
                    ]
                },
                {
                    id: 110,
                    name: '金針山環山步道',
                    location: '台東縣 關山鎮',
                    region: 'taitung',
                    length: 3.2,
                    time: '約2小時',
                    difficulty: 'easy',
                    elevation: '380m',
                    description: '金針山環山步道位於台東關山鎮，是欣賞金針花海的絕佳地點，每年8-9月金針花盛開時，山頭一片金黃壯觀。步道沿途還有多處觀景平台，可俯瞰關山平原和卑南溪流域。',
                    features: ['金針花海', '高山茶園', '山嵐雲海', '田園風光'],
                    facilities: ['停車場', '公廁', '涼亭', '農產品販售'],
                    lat: 23.0396,
                    lng: 121.1679,
                    images: [
                        'https://images.unsplash.com/photo-1600004691947-a6bb4558e0c4?auto=format&fit=crop&w=800&q=80'
                    ]
                },
                
                // 新增太魯閣國家公園見晴懷步道
                {
                    id: 111,
                    name: '太魯閣國家公園 - 見晴懷步道',
                    location: '花蓮縣 秀林鄉',
                    region: 'hualien',
                    length: 2.2,
                    time: '約1.5小時',
                    difficulty: 'medium',
                    elevation: '1100m',
                    description: '見晴懷步道位於太魯閣國家公園內，曾為日治時期的理蕃道路，沿途視野開闊，可欣賞奇萊山、中央山脈、立霧溪谷等壯麗景觀。步道多為平緩的木棧道，適合欣賞雲海與峽谷風光。',
                    features: ['歷史古道', '峽谷景觀', '雲海', '高山植物'],
                    facilities: ['停車場', '公廁', '解說牌'],
                    lat: 24.1701,
                    lng: 121.5938,
                    trailPath: [
                        [24.1701, 121.5938],
                        [24.1723, 121.5952],
                        [24.1742, 121.5965],
                        [24.1760, 121.5978],
                        [24.1776, 121.5995]
                    ],
                    images: [
                        'https://images.unsplash.com/photo-1465189684280-6a8fa9b19a00?auto=format&fit=crop&w=800&q=80'
                    ]
                },
                
                // 新增困難等級步道 (2個)
                {
                    id: 112,
                    name: '玉山主峰步道',
                    location: '南投縣 信義鄉',
                    region: 'nantou',
                    length: 10.9,
                    time: '約8-10小時',
                    difficulty: 'hard',
                    elevation: '3952m',
                    description: '玉山主峰步道是台灣最高峰的登山路線，從排雲山莊出發攀登至海拔3,952公尺的玉山主峰。路程艱辛但風景壯麗，沿途經過針葉林帶、玉山箭竹草原與碎石坡，可遠眺中央山脈群峰與雲海。需事先申請入山及入園許可證。',
                    features: ['台灣最高峰', '高山草原', '針葉林', '日出景觀', '雲海'],
                    facilities: ['山屋', '公廁', '飲用水源'],
                    lat: 23.4739,
                    lng: 120.9598,
                    trailPath: [
                        [23.4739, 120.9598],
                        [23.4723, 120.9612],
                        [23.4702, 120.9634],
                        [23.4689, 120.9665],
                        [23.4675, 120.9682]
                    ],
                    images: [
                        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
                    ]
                },
                {
                    id: 113,
                    name: '南湖大山登山步道',
                    location: '宜蘭縣 大同鄉',
                    region: 'yilan',
                    length: 15.7,
                    time: '約2-3天',
                    difficulty: 'hard',
                    elevation: '3742m',
                    description: '南湖大山是台灣百岳之首，為台灣第五高峰，登山路線長且陡峭，沿途地形多變，經過原始森林、峽谷、斷崖和高山草原。冬季更有雪景可見，但路況艱難，需有豐富登山經驗並做足準備。南湖山屋為重要的住宿點，需事先申請入山及入園許可證。',
                    features: ['高山草原', '冰河遺跡', '原始森林', '斷崖地形', '冬季雪景'],
                    facilities: ['山屋', '公廁', '通訊基地台'],
                    lat: 24.3635,
                    lng: 121.4309,
                    trailPath: [
                        [24.3635, 121.4309],
                        [24.3655, 121.4334],
                        [24.3672, 121.4356],
                        [24.3694, 121.4375],
                        [24.3718, 121.4392]
                    ],
                    images: [
                        'https://images.unsplash.com/photo-1476297820623-7092f8a6a93d?auto=format&fit=crop&w=800&q=80'
                    ]
                }
            ];
            
            // 处理步道数据，确保有有效的图片等
            ensureTrailImages(trails);
            
            resolve(trails);
        }, 500);
    });
}

// 设置事件监听器
function setupEventListeners() {
    // 切换视图
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetView = link.getAttribute('data-view');
            document.querySelectorAll('.nav-menu a').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
            document.getElementById(`${targetView}-view`).classList.add('active');
            
            if(targetView === 'map') {
                setTimeout(() => map.invalidateSize(), 100);
            }
        });
    });
    
    // 关闭步道详情模态框
    const closeModal = document.querySelector('.close');
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            document.getElementById('trail-detail-modal').style.display = 'none';
        });
    }
    
    // 地圖圖例控制 - 國家公園顯示切換
    const allParksCheckbox = document.getElementById('toggle-all-parks');
    const individualParkCheckboxes = document.querySelectorAll('.legend-controls input[type="checkbox"]:not(#toggle-all-parks)');
    
    // 全選/取消全選
    if (allParksCheckbox) {
        allParksCheckbox.addEventListener('change', function() {
            const isChecked = this.checked;
            console.log(`全部國家公園顯示狀態: ${isChecked ? '顯示' : '隱藏'}`);
            
            // 更新所有國家公園的顯示狀態
            individualParkCheckboxes.forEach(checkbox => {
                checkbox.checked = isChecked;
                
                // 獲取國家公園ID
                const parkId = checkbox.id.replace('toggle-', '');
                
                // 獲取對應的圖層
                const parkLayer = window.nationalParkLayers && window.nationalParkLayers[parkId];
                if (parkLayer) {
                    if (isChecked) {
                        map.addLayer(parkLayer);
                    } else {
                        if (map.hasLayer(parkLayer)) {
                            map.removeLayer(parkLayer);
                        }
                    }
                }
            });
        });
    }
    
    // 個別國家公園顯示控制
    individualParkCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // 獲取國家公園ID
            const parkId = this.id.replace('toggle-', '');
            const isChecked = this.checked;
            console.log(`國家公園 ${parkId} 顯示狀態: ${isChecked ? '顯示' : '隱藏'}`);
            
            // 獲取對應的圖層
            const parkLayer = window.nationalParkLayers && window.nationalParkLayers[parkId];
            if (parkLayer) {
                if (isChecked) {
                    map.addLayer(parkLayer);
                } else {
                    if (map.hasLayer(parkLayer)) {
                        map.removeLayer(parkLayer);
                    }
                }
            }
            
            // 更新"全部"複選框狀態
            if (allParksCheckbox) {
                if (isChecked) {
                    // 檢查是否所有國家公園都已勾選
                    const allChecked = Array.from(individualParkCheckboxes).every(cb => cb.checked);
                    allParksCheckbox.checked = allChecked;
                } else {
                    allParksCheckbox.checked = false;
                }
            }
        });
    });
    
    // 搜索框事件监听
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        const debouncedSearch = debounce(function() {
            searchTrails(this.value);
        }, 300);
        
        searchInput.addEventListener('input', debouncedSearch);
    }
    
    // 收藏按钮
    const favoriteBtn = document.getElementById('add-favorite');
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', function() {
            const trailId = parseInt(this.getAttribute('data-id'));
            toggleFavorite(trailId);
        });
    }
    
    // 回到顶部按钮
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Explore button in empty favorites state
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('explore-btn')) {
            document.querySelector('.nav-menu a[data-view="trails"]').click();
        }
    });
    
    // 移动端菜单展开/收起
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            document.querySelector('.nav-menu').classList.toggle('mobile-active');
        });
    }
    
    // 雪霸登山步道顯示控制
    const hikingTrailsCheckbox = document.getElementById('toggle-hiking-trails');
    if (hikingTrailsCheckbox) {
        hikingTrailsCheckbox.addEventListener('change', function() {
            const isChecked = this.checked;
            console.log(`雪霸登山步道顯示狀態: ${isChecked ? '顯示' : '隱藏'}`);
            
            if (isChecked) {
                // 只有當縮放級別足夠時才顯示
                if (map.getZoom() >= 10 && window.sheiPaTrailsLayers) {
                    window.sheiPaTrailsLayers.addTo(map);
                }
            } else {
                // 無論縮放級別如何都隱藏
                if (window.sheiPaTrailsLayers && map.hasLayer(window.sheiPaTrailsLayers)) {
                    map.removeLayer(window.sheiPaTrailsLayers);
                }
            }
        });
    }
}

// 在地图上渲染步道标记
function renderTrailMarkers(trails = null) {
    // 如果沒有提供trails參數，則使用全局變量
    const displayTrails = trails || trailsData;
    
    console.log(`渲染步道標記: ${displayTrails.length} 條步道`);
    
    // 清除現有標記
    markers.forEach(marker => {
        if (map && marker && map.hasLayer(marker)) {
            map.removeLayer(marker);
        }
    });
    markers = [];
    
    // 添加新標記
    displayTrails.forEach(trail => {
        // 確保座標有效
        if (!trail.lat || !trail.lng) {
            console.warn(`步道 "${trail.name}" 缺少有效座標，跳過標記`);
            return;
        }
        
        try {
            // 創建標記圖標
            const customIcon = L.divIcon({
                className: 'trail-marker',
                html: `<i class="fas fa-mountain"></i>`,
                iconSize: [30, 30],
                iconAnchor: [15, 30],
                popupAnchor: [0, -30]
            });
            
            // 創建標記
            const marker = L.marker([trail.lat, trail.lng], { icon: customIcon });
            
            // 創建彈出窗口內容 - 修改為使用全局函數
            const popupContent = `
                <div class="trail-popup">
                    <h3>${trail.name}</h3>
                    <p><strong>地點:</strong> ${trail.location}</p>
                    <p><strong>長度:</strong> ${trail.length} 公里</p>
                    <p><strong>難度:</strong> ${getDifficultyText(trail.difficulty)}</p>
                    <button class="btn btn-primary" onclick="window.showTrailDetails(${trail.id})">查看詳情</button>
                </div>
            `;
            
            // 綁定彈出窗口
            marker.bindPopup(popupContent);
            
            // 添加到地圖
            marker.addTo(map);
            markers.push(marker);
        } catch (error) {
            console.error(`為步道 "${trail.name}" 創建標記時出錯:`, error);
        }
    });
    
    console.log(`已成功創建 ${markers.length} 個步道標記`);
    
    // 確保標記在地圖上可見
    if (markers.length > 0) {
        setTimeout(() => {
            // 添加一個小延遲以確保地圖已完成渲染
            markers.forEach(marker => {
                if (marker && !map.hasLayer(marker)) {
                    marker.addTo(map);
                }
            });
            console.log('重新檢查標記可見性，確保所有標記都顯示在地圖上');
        }, 500);
    }
}

// 渲染步道列表
function renderTrailsList(trails = null) {
    const trailsList = document.getElementById('trails-list');
    if (!trailsList) {
        console.error('找不到trails-list元素');
        return;
    }
    
    // 如果沒有提供trails參數，則使用全局變量
    const displayTrails = trails || trailsData;
    
    trailsList.innerHTML = '';
    
    if (displayTrails.length === 0) {
        trailsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-hiking"></i>
                <p>沒有找到符合條件的步道</p>
            </div>
        `;
        return;
    }
    
    displayTrails.forEach(trail => {
        // 确保每个步道都有图片
        const imageUrl = trail.images && trail.images.length > 0 
            ? trail.images[0] 
            : 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'; // 默认图片
        
        // 檢查是否已收藏
        const isFavorite = checkIsFavorite(trail.id);
        
        const card = document.createElement('div');
        card.className = 'trail-card';
        card.setAttribute('data-trail-id', trail.id);
        card.innerHTML = `
            <div class="trail-image" style="background-image: url('${imageUrl}')">
                <div class="difficulty-badge ${trail.difficulty.toLowerCase()}">${getDifficultyText(trail.difficulty)}</div>
            </div>
            <div class="trail-info-card">
                <h3 class="trail-name">${trail.name}</h3>
                <button class="trail-info-favorite-btn ${isFavorite ? 'active' : ''}" title="${isFavorite ? '取消收藏' : '加入收藏'}">
                    <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>
                </button>
                <div class="trail-location"><i class="fas fa-map-marker-alt"></i> ${trail.location}</div>
                <div class="trail-stats">
                    <div class="trail-stat">
                        <span>長度</span>
                        <span>${trail.length} km</span>
                    </div>
                    <div class="trail-stat">
                        <span>時間</span>
                        <span>${trail.time}</span>
                    </div>
                    <div class="trail-stat">
                        <span>難度</span>
                        <span>${getDifficultyText(trail.difficulty)}</span>
                    </div>
                </div>
            </div>
        `;
        
        // 为卡片添加点击事件
        card.addEventListener('click', function(event) {
            // 如果點擊的是收藏按鈕，則不跳轉到詳情頁
            if (event.target.closest('.trail-info-favorite-btn')) {
                event.stopPropagation();
                return;
            }
            
            const trailId = this.getAttribute('data-trail-id');
            window.showTrailDetails(parseInt(trailId));
        });
        
        // 为收藏按钮添加点击事件
        const favoriteBtn = card.querySelector('.trail-info-favorite-btn');
        favoriteBtn.addEventListener('click', function(event) {
            event.stopPropagation(); // 阻止事件冒泡
            
            const trailId = parseInt(card.getAttribute('data-trail-id'));
            toggleFavorite(trailId);
            
            // 更新收藏按鈕狀態
            const isFavorite = checkIsFavorite(trailId);
            this.classList.toggle('active', isFavorite);
            this.title = isFavorite ? '取消收藏' : '加入收藏';
            this.innerHTML = `<i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>`;
            
            // 更新收藏列表
            updateFavoritesList();
        });
        
        trailsList.appendChild(card);
    });
    
    updateFavoritesList();
}

// 更新收藏列表
function updateFavoritesList() {
    const favoritesList = document.getElementById('favorites-list');
    if (!favoritesList) return;
    
    favoritesList.innerHTML = '';
    
    if (favorites.length === 0) {
        favoritesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-heart-broken"></i>
                <p>您尚未收藏任何步道</p>
                <button class="explore-btn">立即探索</button>
            </div>
        `;
        const exploreBtn = document.querySelector('.explore-btn');
        if (exploreBtn) {
            exploreBtn.addEventListener('click', () => {
                document.querySelectorAll('.nav-menu a').forEach(link => link.classList.remove('active'));
                document.querySelector('[data-view="map"]').classList.add('active');
                document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
                document.getElementById('map-view').classList.add('active');
                setTimeout(() => {
                    map.invalidateSize();
                }, 100);
            });
        }
        return;
    }
    
    favorites.forEach(favoriteId => {
        const trail = trailsData.find(trail => trail.id === favoriteId);
        if (!trail) return;
        
        // 確保每個步道都有圖片
        const imageUrl = trail.images && trail.images.length > 0 
            ? trail.images[0] 
            : 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'; // 默認圖片
        
        const card = document.createElement('div');
        card.className = 'trail-card';
        card.setAttribute('data-trail-id', trail.id);
        card.innerHTML = `
            <div class="trail-image" style="background-image: url('${imageUrl}')">
                <div class="difficulty-badge ${trail.difficulty.toLowerCase()}">${getDifficultyText(trail.difficulty)}</div>
            </div>
            <div class="trail-info-card">
                <h3 class="trail-name">${trail.name}</h3>
                <button class="trail-info-favorite-btn active" title="取消收藏">
                    <i class="fas fa-heart"></i>
                </button>
                <div class="trail-location"><i class="fas fa-map-marker-alt"></i> ${trail.location}</div>
                <div class="trail-stats">
                    <div class="trail-stat">
                        <span>長度</span>
                        <span>${trail.length} km</span>
                    </div>
                    <div class="trail-stat">
                        <span>時間</span>
                        <span>${trail.time}</span>
                    </div>
                    <div class="trail-stat">
                        <span>難度</span>
                        <span>${getDifficultyText(trail.difficulty)}</span>
                    </div>
                </div>
            </div>
        `;
        
        // 为卡片添加点击事件
        card.addEventListener('click', function(event) {
            // 如果點擊的是收藏按鈕，則不跳轉到詳情頁
            if (event.target.closest('.trail-info-favorite-btn')) {
                event.stopPropagation();
                return;
            }
            
            const trailId = this.getAttribute('data-trail-id');
            window.showTrailDetails(parseInt(trailId));
        });
        
        // 为收藏按钮添加点击事件
        const favoriteBtn = card.querySelector('.trail-info-favorite-btn');
        favoriteBtn.addEventListener('click', function(event) {
            event.stopPropagation(); // 阻止事件冒泡
            
            const trailId = parseInt(card.getAttribute('data-trail-id'));
            toggleFavorite(trailId);
            
            // 直接從收藏列表中移除該卡片
            card.remove();
            
            // 如果收藏列表為空，則顯示空狀態
            if (favorites.length === 0) {
                updateFavoritesList();
            }
        });
        
        favoritesList.appendChild(card);
    });
}

// 显示步道详情
function showTrailDetails(trailId) {
    console.log(`從全局函數調用顯示步道詳情: ${trailId}`);
    
    // 查找步道数据，确保trailId是数字类型
    const id = parseInt(trailId);
    const trail = trailsData.find(t => t.id === id);
    if (!trail) {
        console.error(`找不到ID為 ${trailId} 的步道`);
        return;
    }

    console.log(`显示步道详情: ${trail.name}`);
    
    const modal = document.getElementById('trail-detail-modal');
    const trailName = document.getElementById('detail-trail-name');
    const mainImage = document.getElementById('trail-main-image');
    const location = document.getElementById('detail-location');
    const length = document.getElementById('detail-length');
    const elevation = document.getElementById('detail-elevation');
    const difficulty = document.getElementById('detail-difficulty');
    const time = document.getElementById('detail-time');
    const description = document.getElementById('detail-description');
    const features = document.getElementById('detail-features');
    const facilities = document.getElementById('detail-facilities');
    const favoriteBtn = document.getElementById('add-favorite');
    const navigateBtn = document.querySelector('.btn-navigate');
    const shareBtn = document.querySelector('.btn-share');
    const downloadBtn = document.querySelector('.btn-download');

    trailName.textContent = trail.name;
    
    // 移除現有的圖片錯誤遮罩（如果有的話）
    if (mainImage.querySelector('.image-error-overlay')) {
        mainImage.querySelector('.image-error-overlay').remove();
    }
    
    // 確保步道有圖片並處理圖片加載錯誤
    const imageUrl = trail.images && trail.images.length > 0 
        ? trail.images[0] 
        : 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'; // 默認圖片
    
    // 使用固定有效的圖片URL作為備用
    const fallbackImageUrl = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80';
    
    // 直接設置背景圖片
    mainImage.style.backgroundImage = `url('${fallbackImageUrl}')`;
    
    // 加載指定的圖片
    const img = new Image();
    img.onload = function() {
        // 圖片加載成功，使用原始圖片
        mainImage.style.backgroundImage = `url('${imageUrl}')`;
        console.log('步道詳情圖片加載成功:', imageUrl);
    };
    img.onerror = function() {
        // 圖片加載失敗，保持使用備用圖片
        console.log('步道詳情圖片加載失敗，使用備用圖片:', fallbackImageUrl);
        // 不添加錯誤遮罩
    };
    img.src = imageUrl;
    
    location.textContent = trail.location;
    length.textContent = `${trail.length} 公里`;
    elevation.textContent = trail.elevation || '未提供';
    difficulty.textContent = getDifficultyText(trail.difficulty);
    time.textContent = trail.time;
    description.textContent = trail.description;
    
    // 為難度添加相應的顏色類
    difficulty.className = '';
    difficulty.classList.add(trail.difficulty.toLowerCase());

    // 生成步道特色列表
    features.innerHTML = '';
    if (trail.features && trail.features.length > 0) {
        trail.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            features.appendChild(li);
        });
    } else {
        features.innerHTML = '<li>暫無特色資訊</li>';
    }

    // 生成步道设施图标
    facilities.innerHTML = '';
    if (trail.facilities && trail.facilities.length > 0) {
        trail.facilities.forEach(facility => {
            const facilityDiv = document.createElement('div');
            facilityDiv.className = 'facility-icon';
            
            const icon = document.createElement('i');
            icon.className = getFacilityIcon(facility);
            
            const span = document.createElement('span');
            span.textContent = facility;
            
            facilityDiv.appendChild(icon);
            facilityDiv.appendChild(span);
            facilities.appendChild(facilityDiv);
        });
    } else {
        facilities.innerHTML = '<div>暫無設施資訊</div>';
    }

    // 检查是否已收藏并更新收藏按钮样式
    const isFavorite = checkIsFavorite(trail.id);
    if (isFavorite) {
        favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> 已收藏';
        favoriteBtn.classList.add('active');
    } else {
        favoriteBtn.innerHTML = '<i class="far fa-heart"></i> 收藏';
        favoriteBtn.classList.remove('active');
    }

    // 設置導航按鈕點擊事件，導航至步道起點
    if (navigateBtn) {
        navigateBtn.onclick = function() {
            navigateToTrail(trail);
        };
    }

    // 设置收藏按钮点击事件
    favoriteBtn.onclick = function() {
        toggleFavorite(trail.id);
        if (checkIsFavorite(trail.id)) {
            this.innerHTML = '<i class="fas fa-heart"></i> 已收藏';
            this.classList.add('active');
        } else {
            this.innerHTML = '<i class="far fa-heart"></i> 收藏';
            this.classList.remove('active');
        }
    };
    
    // 設置分享按鈕點擊事件
    if (shareBtn) {
        shareBtn.onclick = function() {
            const shareText = `我發現了一個很棒的步道：${trail.name}，快來和我一起探索吧！`;
            
            try {
                // 檢查是否支持Web Share API
                if (navigator.share) {
                    navigator.share({
                        title: '分享步道信息',
                        text: shareText,
                        url: window.location.href
                    }).then(() => {
                        console.log('步道信息分享成功！');
                    }).catch((error) => {
                        console.log('分享失敗：', error);
                        fallbackShare(shareText, trail.name);
                    });
                } else {
                    fallbackShare(shareText, trail.name);
                }
            } catch (error) {
                console.error('分享功能出錯：', error);
                fallbackShare(shareText, trail.name);
            }
        };
    }

    // 设置下载GPX按钮点击事件
    if (downloadBtn) {
        downloadBtn.onclick = function() {
            downloadGPX(trail);
        };
    }

    // 显示详细地图
    const detailMap = document.getElementById('detail-map');
    if (detailMap) {
        // 清除地图容器内容
        detailMap.innerHTML = '';
        
        // 創建地圖元素佔位
        const mapPlaceholder = document.createElement('div');
        mapPlaceholder.className = 'detail-map-placeholder';
        mapPlaceholder.style.height = '100%';
        mapPlaceholder.style.width = '100%';
        mapPlaceholder.style.backgroundColor = '#f8f8f8';
        mapPlaceholder.innerHTML = '<div style="text-align:center;padding-top:40%;font-size:14px;color:#666;"><i class="fas fa-spinner fa-spin"></i> 正在加載地圖...</div>';
        detailMap.appendChild(mapPlaceholder);
        
        // 確保模態窗口完全顯示後再初始化地圖
        setTimeout(() => {
            try {
                console.log('開始初始化步道詳情地圖', trail.name);
                
                // 檢查DOM元素是否存在
                if (!document.getElementById('detail-map')) {
                    console.error('detail-map 元素不存在');
                    return;
                }
                
                // 清除佔位符
                detailMap.innerHTML = '';
                
                // 檢查坐標是否有效
                if (!trail.lat || !trail.lng || isNaN(trail.lat) || isNaN(trail.lng)) {
                    console.error('步道坐標無效:', trail.lat, trail.lng);
                    detailMap.innerHTML = '<div class="map-error">步道位置資訊無效</div>';
                    return;
                }
                
                console.log('創建地圖並設置視圖', [trail.lat, trail.lng]);
                
                // 創建地圖實例
                const trailDetailMap = L.map(detailMap, {
                    attributionControl: false,  // 移除歸因控制，減少干擾
                    zoomControl: true,          // 保留縮放控制
                    scrollWheelZoom: false      // 禁用滾輪縮放，避免頁面滾動問題
                }).setView([trail.lat, trail.lng], 13);
                
                // 添加瓦片圖層
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                    maxZoom: 19
                }).addTo(trailDetailMap);
                
                // 添加步道標記
                const trailIcon = L.divIcon({
                    className: 'trail-marker',
                    html: '<i class="fas fa-hiking"></i>',
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                });
                
                const marker = L.marker([trail.lat, trail.lng], {
                    icon: trailIcon
                }).addTo(trailDetailMap);
                
                marker.bindPopup(`<b>${trail.name}</b><br>${trail.location}`);
                
                // 處理步道軌跡
                let hasValidPath = false;
                
                if (trail.trailPath && Array.isArray(trail.trailPath) && trail.trailPath.length > 1) {
                    try {
                        // 檢查軌跡數據格式
                        let validPathPoints = trail.trailPath.filter(point => 
                            Array.isArray(point) && 
                            point.length >= 2 && 
                            !isNaN(point[0]) && 
                            !isNaN(point[1])
                        );
                        
                        if (validPathPoints.length > 1) {
                            console.log('繪製步道軌跡', validPathPoints.length, '個點');
                            
                            // 創建路徑
                            const pathLine = L.polyline(validPathPoints, {
                                color: '#e74c3c',
                                weight: 4,
                                opacity: 0.8,
                                lineJoin: 'round'
                            }).addTo(trailDetailMap);
                            
                            // 調整地圖視圖以適應路徑
                            trailDetailMap.fitBounds(pathLine.getBounds(), {
                                padding: [30, 30],
                                maxZoom: 15
                            });
                            
                            hasValidPath = true;
                        } else {
                            console.warn('步道軌跡數據無效', trail.trailPath);
                        }
                    } catch (pathError) {
                        console.error('渲染步道軌跡出錯:', pathError);
                    }
                }
                
                // 如果沒有有效軌跡，創建模擬路徑
                if (!hasValidPath) {
                    console.log('創建模擬步道路徑');
                    
                    // 基於長度估計範圍
                    const estimatedRadius = (trail.length || 2) * 0.004;
                    const simulatedPath = [];
                    
                    // 創建橢圓路徑
                    for (let i = 0; i <= 360; i += 45) {
                        const radian = i * Math.PI / 180;
                        // 使橢圓形狀更自然
                        const lat = trail.lat + estimatedRadius * Math.sin(radian) * 0.6;
                        const lng = trail.lng + estimatedRadius * Math.cos(radian);
                        simulatedPath.push([lat, lng]);
                    }
                    
                    // 閉合路徑
                    simulatedPath.push(simulatedPath[0]);
                    
                    // 添加模擬路徑
                    L.polyline(simulatedPath, {
                        color: '#888',
                        weight: 2,
                        dashArray: '5, 8',
                        opacity: 0.7
                    }).addTo(trailDetailMap);
                    
                    // 添加標註說明
                    L.marker([trail.lat + estimatedRadius * 0.6 * 1.1, trail.lng], {
                        icon: L.divIcon({
                            className: 'path-note',
                            html: '<div style="background:rgba(255,255,255,0.8);padding:4px 10px;border-radius:4px;font-size:12px;box-shadow:0 1px 2px rgba(0,0,0,0.1);">步道預估範圍 (約'+trail.length+'公里)</div>',
                            iconSize: [180, 26],
                            iconAnchor: [90, 13]
                        })
                    }).addTo(trailDetailMap);
                    
                    // 固定在合適縮放級別
                    trailDetailMap.setZoom(14);
                }
                
                // 強制更新地圖大小
                setTimeout(() => {
                    console.log('重新調整地圖大小');
                    trailDetailMap.invalidateSize({
                        animate: true,
                        pan: false
                    });
                }, 300);
                
                // 設置點擊處理
                marker.on('click', function() {
                    this.openPopup();
                });
                
                console.log('步道詳情地圖載入完成');
                
            } catch (error) {
                console.error('渲染步道地圖發生錯誤:', error);
                detailMap.innerHTML = '<div class="map-error">加載地圖時出錯:<br>' + error.message + '</div>';
            }
        }, 500); // 延遲500毫秒，確保模態窗口已完全顯示
    }
    
    // 显示模态框
    modal.style.display = 'block';
    
    // 添加關閉按鈕事件
    const closeBtn = document.querySelector('.modal .close');
    if (closeBtn) {
        closeBtn.onclick = function() {
            modal.style.display = 'none';
        };
    }
    
    // 點擊模態框外部關閉
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
}

// 後備分享方案
function fallbackShare(shareText, trailName) {
    try {
        // 複製到剪貼板
        const textArea = document.createElement('textarea');
        textArea.value = `${shareText} ${window.location.href}`;
        
        // 避免滾動到底部
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";
        
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
            alert('步道信息已複製到剪貼板，您可以將其粘貼給好友分享！');
        } else {
            alert(`想分享此步道嗎？步道名稱：${trailName}`);
        }
    } catch (err) {
        alert(`想分享此步道嗎？步道名稱：${trailName}`);
    }
}

// 新增導航到步道功能
function navigateToTrail(trail) {
    // 確保步道有坐標資訊
    if (!trail.lat || !trail.lng) {
        alert('此步道缺少坐標資訊，無法導航');
        return;
    }
    
    // 獲取步道起點坐標
    const lat = trail.lat;
    const lng = trail.lng;
    
    // 構建Google Maps導航URL
    let navigationUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    
    // 如果有步道路徑，則添加多個途經點
    if (trail.trailPath && trail.trailPath.length > 1) {
        // 從路徑中獲取中間點(最多添加10個途經點，這是Google Maps URL的限制)
        // 挑選關鍵點，避免URL過長
        const waypoints = [];
        const pathLength = trail.trailPath.length;
        
        if (pathLength <= 10) {
            // 如果少於10個點，使用所有點
            for (let i = 1; i < pathLength - 1; i++) {
                waypoints.push(`${trail.trailPath[i][0]},${trail.trailPath[i][1]}`);
            }
        } else {
            // 如果超過10個點，挑選均勻分布的點
            const step = Math.floor(pathLength / 10);
            for (let i = 1; i < 9; i++) {
                waypoints.push(`${trail.trailPath[i * step][0]},${trail.trailPath[i * step][1]}`);
            }
        }
        
        // 如果有途經點，添加到URL
        if (waypoints.length > 0) {
            navigationUrl += `&waypoints=${waypoints.join('|')}`;
        }
        
        // 添加終點（路徑的最後一個點）
        const endPoint = trail.trailPath[trail.trailPath.length - 1];
        navigationUrl += `&destination=${endPoint[0]},${endPoint[1]}`;
    }
    
    // 嘗試使用系統導航應用
    try {
        // 檢查是否是移動設備
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        if (isMobile) {
            // 移動設備上使用intent協議
            // Android設備
            if (/Android/i.test(navigator.userAgent)) {
                navigationUrl = `google.navigation:q=${lat},${lng}&mode=d`;
            }
            // iOS設備
            else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                navigationUrl = `maps://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`;
            }
        }
        
        // 在新窗口打開導航應用或Google Maps網頁
        window.open(navigationUrl, '_blank');
        
    } catch (error) {
        // 如果出錯，顯示錯誤消息
        console.error('無法開啟導航應用：', error);
        alert('無法開啟導航應用，請手動導航至：' + trail.name);
    }
}

// 下载GPX文件
function downloadGPX(trail) {
    if (!trail.trailPath || trail.trailPath.length < 2) {
        alert('此步道沒有可用的GPX數據');
        return;
    }
    
    // 创建GPX内容
    let gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="山林漫步" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${trail.name}</name>
    <desc>${trail.description}</desc>
  </metadata>
  <trk>
    <name>${trail.name}</name>
    <trkseg>`;
    
    // 添加轨迹点
    trail.trailPath.forEach(point => {
        gpxContent += `
      <trkpt lat="${point[0]}" lon="${point[1]}"></trkpt>`;
    });
    
    // 结束GPX内容
    gpxContent += `
    </trkseg>
  </trk>
</gpx>`;
    
    // 创建下载链接
    const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${trail.name.replace(/\s+/g, '_')}.gpx`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

// 辅助函数: 获取设施对应的图标
function getFacilityIcon(facility) {
    switch(facility.toLowerCase()) {
        case '停車場': return 'fas fa-parking';
        case '廁所': return 'fas fa-toilet';
        case '涼亭': return 'fas fa-umbrella-beach';
        case '觀景台': return 'fas fa-binoculars';
        case '商店': return 'fas fa-store';
        case '餐廳': return 'fas fa-utensils';
        case '住宿': return 'fas fa-bed';
        case '露營區': return 'fas fa-campground';
        case '登山口資訊站': return 'fas fa-info-circle';
        case '遊客中心': return 'fas fa-info';
        default: return 'fas fa-check-circle';
    }
}

// 辅助函数: 获取难度文本
function getDifficultyText(difficulty) {
    switch (difficulty) {
        case 'easy': return '輕鬆';
        case 'medium': return '中等';
        case 'hard': return '困難';
        default: return '未知';
    }
}

// 搜索步道
function searchTrails(query) {
    query = query.toLowerCase().trim();
    
    let filteredTrails = trailsData;
    
    if (query) {
        filteredTrails = trailsData.filter(trail => 
            trail.name.toLowerCase().includes(query) || 
            trail.location.toLowerCase().includes(query) || 
            trail.description.toLowerCase().includes(query)
        );
    }
    
    // 更新地图标记
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    
    if (filteredTrails.length === 0) {
        document.getElementById('trails-list').innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <p>未找到符合 "${query}" 的步道</p>
                <button class="reset-search-btn">重置搜索</button>
            </div>
        `;
        
        document.querySelector('.reset-search-btn').addEventListener('click', () => {
            document.getElementById('search-input').value = '';
            searchTrails('');
        });
        
        return;
    }
    
    filteredTrails.forEach(trail => {
        // 创建山图标
        const mountainIcon = L.divIcon({
            className: 'custom-map-marker',
            html: '<i class="fas fa-mountain" style="color: #27ae60; font-size: 24px;"></i>',
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            popupAnchor: [0, -15]
        });
        
        const marker = L.marker(trail.coordinates, {icon: mountainIcon})
            .addTo(map)
            .bindPopup(`
                <div class="map-popup">
                    <h3>${trail.name}</h3>
                    <p>${trail.location}</p>
                    <p><i class="fas fa-hiking"></i> ${trail.length} km</p>
                    <button class="popup-btn" onclick="showTrailDetails(${trail.id})">查看詳情</button>
                </div>
            `);
        markers.push(marker);
    });
    
    // 更新步道列表
    const trailsList = document.getElementById('trails-list');
    trailsList.innerHTML = '';
    
    filteredTrails.forEach(trail => {
        // 确保每个步道都有图片
        const imageUrl = trail.images && trail.images.length > 0 
            ? trail.images[0] 
            : 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'; // 默认图片
            
        const card = document.createElement('div');
        card.className = 'trail-card';
        card.innerHTML = `
            <div class="trail-image" style="background-image: url('${imageUrl}')">
                <div class="difficulty-badge ${trail.difficulty.toLowerCase()}">${getDifficultyText(trail.difficulty)}</div>
            </div>
            <div class="trail-info-card">
                <h3 class="trail-name">${trail.name}</h3>
                <div class="trail-location"><i class="fas fa-map-marker-alt"></i> ${trail.location}</div>
                <div class="trail-stats">
                    <div class="trail-stat">
                        <span>長度</span>
                        <span>${trail.length} km</span>
                    </div>
                    <div class="trail-stat">
                        <span>時間</span>
                        <span>${trail.time}</span>
                    </div>
                    <div class="trail-stat">
                        <span>難度</span>
                        <span>${getDifficultyText(trail.difficulty)}</span>
                    </div>
                </div>
            </div>
        `;
        
        // 添加图片加载错误处理
        const trailImage = card.querySelector('.trail-image');
        const img = new Image();
        img.onload = function() {
            // 图片加载成功，隐藏错误提示
            card.querySelector('.image-error-overlay').style.display = 'none';
        };
        img.onerror = function() {
            // 图片加载失败，显示错误提示
            card.querySelector('.image-error-overlay').style.display = 'flex';
            // 设置灰色背景
            trailImage.style.backgroundColor = '#f0f0f0';
        };
        img.src = imageUrl;
        
        card.addEventListener('click', () => {
            showTrailDetails(trail.id);
        });
        
        trailsList.appendChild(card);
    });
}

// 过滤步道
function filterTrails() {
    console.log("執行篩選功能");
    
    // 獲取篩選條件
    const selectedDifficulties = [];
    document.querySelectorAll('.filter-panel input[name="difficulty"]:checked').forEach(input => {
        selectedDifficulties.push(input.value);
    });
    
    const selectedRegions = [];
    document.querySelectorAll('.filter-panel input[name="region"]:checked').forEach(input => {
        selectedRegions.push(input.value);
    });
    
    const selectedFacilities = [];
    document.querySelectorAll('.filter-panel input[name="facility"]:checked').forEach(input => {
        selectedFacilities.push(input.value);
    });
    
    // 獲取最大長度
    const lengthSlider = document.getElementById('trail-length');
    const maxLength = lengthSlider ? parseInt(lengthSlider.value) : 20;
    
    console.log("篩選條件:", {
        難度: selectedDifficulties,
        地區: selectedRegions,
        設施: selectedFacilities,
        最大長度: maxLength + "公里"
    });
    
    // 應用篩選
    const filteredTrails = trailsData.filter(trail => {
        // 難度篩選
        if (selectedDifficulties.length > 0 && !selectedDifficulties.includes(trail.difficulty)) {
            return false;
        }
        
        // 地區篩選
        if (selectedRegions.length > 0) {
            const regionMatch = selectedRegions.some(region => {
                return trail.location.toLowerCase().includes(region.toLowerCase());
            });
            if (!regionMatch) return false;
        }
        
        // 長度篩選
        if (maxLength && trail.length > maxLength) {
            return false;
        }
        
        // 設施篩選
        if (selectedFacilities.length > 0 && trail.facilities) {
            const facilityMatch = selectedFacilities.every(facility => {
                return trail.facilities.includes(facility);
            });
            if (!facilityMatch) return false;
        }
        
        return true;
    });
    
    console.log(`篩選結果: 從 ${trailsData.length} 條步道中篩選出 ${filteredTrails.length} 條`);
    
    // 更新地圖標記和列表
    renderTrailMarkers(filteredTrails);
    renderTrailsList(filteredTrails);
}

// 排序步道
function sortTrails(sortBy) {
    let sortedTrails = [...trailsData];
    
    switch(sortBy) {
        case 'name':
            sortedTrails.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            sortedTrails.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'length':
            sortedTrails.sort((a, b) => a.length - b.length);
            break;
        case 'length-desc':
            sortedTrails.sort((a, b) => b.length - a.length);
            break;
        case 'difficulty':
            const difficultyMap = { 'easy': 1, 'medium': 2, 'hard': 3 };
            sortedTrails.sort((a, b) => difficultyMap[a.difficulty] - difficultyMap[b.difficulty]);
            break;
        case 'difficulty-desc':
            const difficultyMapDesc = { 'easy': 1, 'medium': 2, 'hard': 3 };
            sortedTrails.sort((a, b) => difficultyMapDesc[b.difficulty] - difficultyMapDesc[a.difficulty]);
            break;
    }
    
    trailsData = sortedTrails;
    renderTrailsList();
}

// 切换收藏状态
function toggleFavorite(trailId) {
    const isFavorite = favorites.includes(trailId);
    
    if (isFavorite) {
        favorites = favorites.filter(id => id !== trailId);
    } else {
        favorites.push(trailId);
    }
    
    // 保存到本地存储
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // 更新收藏图标
    const favoriteBtn = document.getElementById(`favorite-btn-${trailId}`);
    if (favoriteBtn) {
        favoriteBtn.innerHTML = isFavorite ? 
            '<i class="far fa-heart"></i> 收藏' : 
            '<i class="fas fa-heart"></i> 已收藏';
    }
    
    // 更新收藏列表
    updateFavoritesList();
}

// 函数节流工具
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

// 暴露全局函数
window.toggleFavorite = toggleFavorite; 

// 檢查步道是否已被收藏
function checkIsFavorite(trailId) {
    // 從本地存儲中讀取收藏數據
    let favorites = [];
    try {
        const storedFavorites = localStorage.getItem('favorites');
        if (storedFavorites) {
            favorites = JSON.parse(storedFavorites);
        }
    } catch (error) {
        console.error('讀取收藏數據出錯:', error);
    }
    
    // 檢查指定步道是否在收藏列表中
    return favorites.includes(trailId);
}

// 创建过滤面板
function createFilterPanel() {
    console.log("創建篩選面板");
    
    // 檢查是否已經存在篩選面板，如果存在則先移除
    const existingPanel = document.querySelector('.filter-panel');
    if (existingPanel) {
        existingPanel.remove();
    }
    
    const filterPanel = document.createElement('div');
    filterPanel.classList.add('filter-panel');
    
    // 面板標題和關閉按鈕
    const filterHeader = document.createElement('div');
    filterHeader.classList.add('filter-header');
    filterHeader.innerHTML = `
        <h3>步道篩選</h3>
        <button id="close-filter">×</button>
    `;
    
    // 分頁標籤
    const filterTabs = document.createElement('div');
    filterTabs.classList.add('filter-tabs');
    filterTabs.innerHTML = `
        <button class="filter-tab active" data-tab="basic">基本篩選</button>
        <button class="filter-tab" data-tab="advanced">進階篩選</button>
    `;
    
    // 內容容器
    const filterContent = document.createElement('div');
    filterContent.classList.add('filter-content');
    
    // 基本篩選內容
    const basicContent = document.createElement('div');
    basicContent.classList.add('filter-tab-content', 'active');
    basicContent.setAttribute('data-tab', 'basic');
    basicContent.innerHTML = `
        <div class="filter-group">
            <h4>難度等級</h4>
            <div class="filter-options">
                <div class="filter-option">
                    <input type="checkbox" id="difficulty-easy" name="difficulty" value="easy">
                    <label for="difficulty-easy">簡單</label>
                </div>
                <div class="filter-option">
                    <input type="checkbox" id="difficulty-medium" name="difficulty" value="medium">
                    <label for="difficulty-medium">中等</label>
                </div>
                <div class="filter-option">
                    <input type="checkbox" id="difficulty-hard" name="difficulty" value="hard">
                    <label for="difficulty-hard">困難</label>
                </div>
            </div>
        </div>
        
        <div class="filter-group">
            <h4>步道長度 <span id="length-value">10 公里以下</span></h4>
            <div class="range-group">
                <input type="range" id="trail-length" min="1" max="20" value="10" step="1">
                <div class="range-labels">
                    <span>1 公里</span>
                    <span>20 公里</span>
                </div>
            </div>
        </div>
    `;
    
    // 進階篩選內容
    const advancedContent = document.createElement('div');
    advancedContent.classList.add('filter-tab-content');
    advancedContent.setAttribute('data-tab', 'advanced');
    advancedContent.innerHTML = `
        <div class="advanced-filter-sections">
            <div class="filter-group">
                <h4>地區篩選</h4>
                <div class="region-section">
                    <h5>北部地區</h5>
                    <div class="filter-options">
                        <div class="filter-option">
                            <input type="checkbox" id="region-taipei" name="region" value="taipei">
                            <label for="region-taipei">台北市</label>
                        </div>
                        <div class="filter-option">
                            <input type="checkbox" id="region-newTaipei" name="region" value="newTaipei">
                            <label for="region-newTaipei">新北市</label>
                        </div>
                    </div>
                </div>
                
                <div class="region-section">
                    <h5>中部地區</h5>
                    <div class="filter-options">
                        <div class="filter-option">
                            <input type="checkbox" id="region-taichung" name="region" value="taichung">
                            <label for="region-taichung">台中市</label>
                        </div>
                        <div class="filter-option">
                            <input type="checkbox" id="region-nantou" name="region" value="nantou">
                            <label for="region-nantou">南投縣</label>
                        </div>
                    </div>
                </div>
                
                <div class="region-section">
                    <h5>南部地區</h5>
                    <div class="filter-options">
                        <div class="filter-option">
                            <input type="checkbox" id="region-kaohsiung" name="region" value="kaohsiung">
                            <label for="region-kaohsiung">高雄市</label>
                        </div>
                        <div class="filter-option">
                            <input type="checkbox" id="region-pingtung" name="region" value="pingtung">
                            <label for="region-pingtung">屏東縣</label>
                        </div>
                    </div>
                </div>
                
                <div class="region-section">
                    <h5>東部地區</h5>
                    <div class="filter-options">
                        <div class="filter-option">
                            <input type="checkbox" id="region-hualien" name="region" value="hualien">
                            <label for="region-hualien">花蓮縣</label>
                        </div>
                        <div class="filter-option">
                            <input type="checkbox" id="region-taitung" name="region" value="taitung">
                            <label for="region-taitung">台東縣</label>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="filter-group">
                <h4>設施需求</h4>
                <div class="filter-options">
                    <div class="filter-option">
                        <input type="checkbox" id="facility-parking" name="facility" value="parking">
                        <label for="facility-parking">停車場</label>
                    </div>
                    <div class="filter-option">
                        <input type="checkbox" id="facility-toilet" name="facility" value="toilet">
                        <label for="facility-toilet">公廁</label>
                    </div>
                    <div class="filter-option">
                        <input type="checkbox" id="facility-restaurant" name="facility" value="restaurant">
                        <label for="facility-restaurant">餐廳</label>
                    </div>
                    <div class="filter-option">
                        <input type="checkbox" id="facility-shelter" name="facility" value="shelter">
                        <label for="facility-shelter">涼亭</label>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 按鈕操作區
    const filterActions = document.createElement('div');
    filterActions.classList.add('filter-actions');
    filterActions.innerHTML = `
        <button id="reset-filter">重置篩選</button>
        <button id="apply-filter">套用篩選</button>
    `;
    
    // 組裝面板
    filterPanel.appendChild(filterHeader);
    filterPanel.appendChild(filterTabs);
    filterPanel.appendChild(filterContent);
    filterContent.appendChild(basicContent);
    filterContent.appendChild(advancedContent);
    filterPanel.appendChild(filterActions);
    
    // 添加到頁面
    document.body.appendChild(filterPanel);
    
    console.log("篩選面板已添加到頁面");
    
    // 添加事件監聽器
    const lengthSlider = document.getElementById('trail-length');
    if (lengthSlider) {
        lengthSlider.addEventListener('input', function() {
            const lengthValue = document.getElementById('length-value');
            if (lengthValue) {
                lengthValue.textContent = this.value + ' 公里以下';
            }
        });
    }
    
    // 標籤切換事件
    const tabs = document.querySelectorAll('.filter-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // 激活當前標籤
            document.querySelectorAll('.filter-tab').forEach(t => {
                t.classList.remove('active');
            });
            this.classList.add('active');
            
            // 顯示對應內容
            document.querySelectorAll('.filter-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.querySelector(`.filter-tab-content[data-tab="${tabName}"]`).classList.add('active');
        });
    });
    
    // 關閉按鈕事件
    document.getElementById('close-filter').addEventListener('click', function() {
        console.log("關閉篩選面板");
        document.querySelector('.filter-panel').classList.remove('active');
    });
    
    // 重置篩選事件
    document.getElementById('reset-filter').addEventListener('click', function() {
        console.log("重置篩選");
        resetFilters();
    });
    
    // 套用篩選事件
    document.getElementById('apply-filter').addEventListener('click', function() {
        console.log("套用篩選");
        filterTrails();
        document.querySelector('.filter-panel').classList.remove('active');
    });
    
    console.log("篩選面板事件監聽器已設置");
    
    return filterPanel;
}

// 重置所有篩選選項
function resetFilters() {
    console.log("重置篩選條件");
    
    // 重置難度選項 - 新舊篩選面板
    document.querySelectorAll('[name="difficulty"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    document.querySelectorAll('.filter-group input[name="difficulty"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // 重置長度滑桿 - 新版面板
    const newLengthSlider = document.getElementById('trail-length');
    if (newLengthSlider) {
        newLengthSlider.value = 20;
        const lengthValue = document.getElementById('length-value');
        if (lengthValue) {
            lengthValue.textContent = '20 公里以下';
        }
    }
    
    // 重置長度滑桿 - 舊版面板
    const oldLengthSlider = document.getElementById('length-filter');
    if (oldLengthSlider) {
        oldLengthSlider.value = '';
        const oldLengthValue = document.getElementById('length-value');
        if (oldLengthValue) {
            oldLengthValue.textContent = '不限';
        }
    }
    
    // 重置地區選項 - 新舊篩選面板
    document.querySelectorAll('[name="region"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    document.querySelectorAll('.filter-group input[name="region"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // 重置設施選項 - 新舊篩選面板
    document.querySelectorAll('[name="facility"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    document.querySelectorAll('.filter-group input[name="facility"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // 隱藏所有篩選面板
    const filterPanels = document.querySelectorAll('.filter-panel');
    filterPanels.forEach(panel => {
        panel.classList.remove('active');
    });
    
    // 更新步道顯示
    renderTrailMarkers(trailsData);
    renderTrailsList(trailsData);
    
    console.log("篩選條件已重置");
}

// 初始化應用程序
function initApp() {
    console.log("初始化應用程序");
    
    // 初始化地圖
    initMap();
    
    // 設置導航菜單事件
    setupEventListeners();
    
    // 創建篩選面板
    createFilterPanel();
    
    // 設置篩選按鈕事件
    const filterBtn = document.getElementById('filter-btn');
    if (filterBtn) {
        filterBtn.addEventListener('click', function() {
            console.log('篩選按鈕被點擊');
            const filterPanel = document.querySelector('.filter-panel');
            if (filterPanel) {
                filterPanel.classList.toggle('active');
                console.log('篩選面板狀態：', filterPanel.classList.contains('active') ? '已顯示' : '已隱藏');
            } else {
                console.error('找不到篩選面板元素！');
            }
        });
    } else {
        console.error('找不到篩選按鈕！');
    }
    
    // 設置排序事件
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortTrails(this.value);
        });
    }
    
    // 設置搜索功能
    setupSearch();
    
    // 獲取步道數據
    fetchTrailsData()
        .then(trails => {
            trailsData = trails;
            
            // 在地圖上顯示步道標記
            renderTrailMarkers(trails);
            
            // 渲染步道列表
            renderTrailsList(trails);
            
            // 渲染收藏列表
            updateFavoritesList();
            
            // 加載雪霸步道數據
            loadSheiPaTrails();
            
            // 確保地圖重新渲染以顯示所有標記
            if (map) {
                map.invalidateSize();
                
                // 確保標記在視圖中
                setTimeout(() => {
                    console.log('確保所有標記在視圖中可見');
                    renderTrailMarkers(trails);
                }, 1000);
            }
            
            console.log("應用程序初始化完成");
        })
        .catch(error => {
            console.error("載入步道數據時出錯:", error);
        });
}

// 設置搜索功能
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        console.log("設置搜索功能");
        
        // 使用debounce優化搜索，避免頻繁觸發
        const debouncedSearch = debounce(function() {
            const query = this.value.trim();
            console.log(`搜索輸入: "${query}"`);
            searchTrails(query);
        }, 300);
        
        searchInput.addEventListener('input', debouncedSearch);
    } else {
        console.error("找不到搜索輸入框！");
    }
}

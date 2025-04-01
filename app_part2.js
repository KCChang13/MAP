// 搜索步道
function searchTrails(query) {
    if (!query.trim()) {
        trailsData.forEach(trail => {
            const marker = markers.find(m => m._latlng.lat === trail.coordinates[0] && m._latlng.lng === trail.coordinates[1]);
            if (marker) {
                marker.addTo(map);
            }
        });
        renderTrailsList();
        return;
    }
    
    const lowerQuery = query.toLowerCase().trim();
    const filteredTrails = trailsData.filter(trail => 
        trail.name.toLowerCase().includes(lowerQuery) ||
        trail.location.toLowerCase().includes(lowerQuery) ||
        trail.description.toLowerCase().includes(lowerQuery) ||
        trail.features.some(feature => feature.toLowerCase().includes(lowerQuery))
    );
    
    // 更新地图标记
    markers.forEach(marker => {
        const trailCoords = marker._latlng;
        const isVisible = filteredTrails.some(trail => 
            trail.coordinates[0] === trailCoords.lat && 
            trail.coordinates[1] === trailCoords.lng
        );
        
        if (isVisible) {
            marker.addTo(map);
        } else {
            map.removeLayer(marker);
        }
    });
    
    // 更新列表
    trailsList.innerHTML = '';
    if (filteredTrails.length === 0) {
        trailsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <p>找不到符合 "${query}" 的步道</p>
                <button class="explore-btn" id="reset-search">重設搜尋</button>
            </div>
        `;
        document.getElementById('reset-search').addEventListener('click', () => {
            searchInput.value = '';
            searchTrails('');
        });
        return;
    }
    
    filteredTrails.forEach(trail => {
        const card = document.createElement('div');
        card.className = 'trail-card';
        card.innerHTML = `
            <div class="trail-image" style="background-image: url('${trail.images[0]}')">
                <div class="trail-badge">${getDifficultyText(trail.difficulty)}</div>
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
        
        card.addEventListener('click', () => {
            showTrailDetails(trail.id);
        });
        
        trailsList.appendChild(card);
    });
}

// 筛选步道
function filterTrails() {
    const selectedRegions = Array.from(document.querySelectorAll('input[name="region"]:checked')).map(checkbox => checkbox.value);
    const selectedDifficulties = Array.from(document.querySelectorAll('input[name="difficulty"]:checked')).map(checkbox => checkbox.value);
    const maxLength = parseFloat(lengthRange.value);
    
    // 筛选数据
    const filteredTrails = trailsData.filter(trail => {
        const regionMatch = selectedRegions.length === 0 || selectedRegions.includes(trail.region);
        const difficultyMatch = selectedDifficulties.length === 0 || selectedDifficulties.includes(trail.difficulty);
        const lengthMatch = trail.length <= maxLength;
        
        return regionMatch && difficultyMatch && lengthMatch;
    });
    
    // 更新地图标记
    markers.forEach(marker => {
        const trailCoords = marker._latlng;
        const isVisible = filteredTrails.some(trail => 
            trail.coordinates[0] === trailCoords.lat && 
            trail.coordinates[1] === trailCoords.lng
        );
        
        if (isVisible) {
            marker.addTo(map);
        } else {
            map.removeLayer(marker);
        }
    });
    
    // 更新列表
    trailsList.innerHTML = '';
    if (filteredTrails.length === 0) {
        trailsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-filter"></i>
                <p>找不到符合篩選條件的步道</p>
                <button class="explore-btn" id="reset-all-filters">重設篩選條件</button>
            </div>
        `;
        document.getElementById('reset-all-filters').addEventListener('click', () => {
            resetFilterBtn.click();
            applyFilterBtn.click();
        });
        return;
    }
    
    filteredTrails.forEach(trail => {
        const card = document.createElement('div');
        card.className = 'trail-card';
        card.innerHTML = `
            <div class="trail-image" style="background-image: url('${trail.images[0]}')">
                <div class="trail-badge">${getDifficultyText(trail.difficulty)}</div>
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
        
        card.addEventListener('click', () => {
            showTrailDetails(trail.id);
        });
        
        trailsList.appendChild(card);
    });
}

// 排序步道
function sortTrails(sortBy) {
    switch (sortBy) {
        case 'name':
            trailsData.sort((a, b) => a.name.localeCompare(b.name, 'zh-TW'));
            break;
        case 'popularity':
            // 模拟人气排序，实际应用中可能基于浏览量、评分等
            trailsData.sort((a, b) => b.id - a.id);
            break;
        case 'length':
            trailsData.sort((a, b) => a.length - b.length);
            break;
        case 'difficulty':
            // 难度排序: easy -> medium -> hard
            const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3 };
            trailsData.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
            break;
    }
    
    renderTrailsList();
}

// 切换收藏状态
function toggleFavorite(trailId) {
    const index = favorites.indexOf(trailId);
    
    if (index !== -1) {
        favorites.splice(index, 1);
        addFavoriteBtn.innerHTML = '<i class="far fa-heart"></i> 收藏';
        addFavoriteBtn.classList.remove('active');
    } else {
        favorites.push(trailId);
        addFavoriteBtn.innerHTML = '<i class="fas fa-heart"></i> 已收藏';
        addFavoriteBtn.classList.add('active');
    }
    
    // 保存到本地存储
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // 更新收藏列表
    updateFavoritesList();
}

// 辅助函数: 获取难度文本
function getDifficultyText(difficulty) {
    switch (difficulty) {
        case 'easy':
            return '輕鬆';
        case 'medium':
            return '中等';
        case 'hard':
            return '困難';
        default:
            return '未知';
    }
}

// 辅助函数: 获取设施图标
function getFacilityIcon(facility) {
    switch (facility.toLowerCase()) {
        case '停車場':
            return 'fas fa-parking';
        case '廁所':
            return 'fas fa-toilet';
        case '涼亭':
            return 'fas fa-umbrella-beach';
        case '觀景台':
            return 'fas fa-mountain';
        case '商店':
            return 'fas fa-store';
        case '餐廳':
            return 'fas fa-utensils';
        case '住宿':
            return 'fas fa-bed';
        case '露營區':
            return 'fas fa-campground';
        case '遊客中心':
            return 'fas fa-info-circle';
        case '登山口資訊站':
            return 'fas fa-info-circle';
        default:
            return 'fas fa-star';
    }
}

// 辅助函数: 防抖
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 暴露全局函数，用于从HTML调用
window.showTrailDetails = showTrailDetails; 
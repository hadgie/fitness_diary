// Paste your full JavaScript code here// Part 1: 데이터 관리 & 기본 설정
// 전역 변수
let currentWeek = 1;
let currentWorkoutWeek = 1;

// 로컬 스토리지에서 데이터 로드
function loadData() {
    const goals = JSON.parse(localStorage.getItem('fitnessGoals') || '{}');
    const oneRM = JSON.parse(localStorage.getItem('oneRM') || '{}');
    const mealPreferences = JSON.parse(localStorage.getItem('mealPreferences') || '{}');

    // 목표 데이터 로드
    if (goals.currentWeight) {
        document.getElementById('currentWeight').value = goals.currentWeight;
        document.getElementById('currentWeightDisplay').textContent = goals.currentWeight;
    }
    if (goals.targetWeight) {
        document.getElementById('targetWeight').value = goals.targetWeight;
        document.getElementById('targetWeightDisplay').textContent = goals.targetWeight;
    }
    if (goals.currentBodyFat) {
        document.getElementById('currentBodyFat').value = goals.currentBodyFat;
    }
    if (goals.muscleMass) {
        document.getElementById('muscleMass').value = goals.muscleMass;
    }

    // 1RM 데이터 로드
    if (oneRM.benchPress) {
        document.getElementById('benchPress1RM').value = oneRM.benchPress;
    }
    if (oneRM.cableRow) {
        document.getElementById('cableRow1RM').value = oneRM.cableRow;
    }
    if (oneRM.shoulderPress) {
        document.getElementById('shoulderPress1RM').value = oneRM.shoulderPress;
    }
    if (oneRM.cableCurl) {
        document.getElementById('cableCurl1RM').value = oneRM.cableCurl;
    }

    updateRecommendedWeights();
    loadMealPreferences(mealPreferences);
    updateProgress();
    updateAppStats();
}

// 목표 저장
function saveGoals() {
    const goals = {
        currentWeight: parseFloat(document.getElementById('currentWeight').value),
        targetWeight: parseFloat(document.getElementById('targetWeight').value),
        currentBodyFat: parseFloat(document.getElementById('currentBodyFat').value),
        muscleMass: parseFloat(document.getElementById('muscleMass').value)
    };

    localStorage.setItem('fitnessGoals', JSON.stringify(goals));

    document.getElementById('currentWeightDisplay').textContent = goals.currentWeight;
    document.getElementById('targetWeightDisplay').textContent = goals.targetWeight;

    showMessage('goalMessage', '🎯 목표가 성공적으로 저장되었습니다!');
    updateProgress();
}

// 1RM 저장
function save1RM() {
    const oneRM = {
        benchPress: parseFloat(document.getElementById('benchPress1RM').value),
        cableRow: parseFloat(document.getElementById('cableRow1RM').value),
        shoulderPress: parseFloat(document.getElementById('shoulderPress1RM').value),
        cableCurl: parseFloat(document.getElementById('cableCurl1RM').value)
    };

    localStorage.setItem('oneRM', JSON.stringify(oneRM));
    updateRecommendedWeights();
    showMessage('oneRMMessage', '🏋️ 1RM이 성공적으로 저장되었습니다!');
}

// 추천 운동 무게 업데이트
function updateRecommendedWeights() {
    const oneRM = JSON.parse(localStorage.getItem('oneRM') || '{}');

    if (oneRM.benchPress) {
        // Day 1: 8-12 reps (70-75% 1RM)
        const benchDay1 = Math.round(oneRM.benchPress * 0.725 / 2.5) * 2.5;
        const pecDeckDay1 = Math.round(oneRM.benchPress * 0.65 / 2.5) * 2.5;
        
        updateTargetWeight('bench-weight-day1', benchDay1, '8-12회');
        updateTargetWeight('pec-deck-weight-day1', pecDeckDay1, '8-12회');

        // Day 2: 12-15 reps (60-65% 1RM)
        const benchDay2 = Math.round(oneRM.benchPress * 0.625 / 2.5) * 2.5;
        updateTargetWeight('bench-weight-day2', benchDay2, '12-15회');

        // Day 3: 3-6 reps (85-90% 1RM)
        const benchDay3 = Math.round(oneRM.benchPress * 0.875 / 2.5) * 2.5;
        const pecDeckDay3 = Math.round(oneRM.benchPress * 0.7 / 2.5) * 2.5;
        updateTargetWeight('bench-weight-day3', benchDay3, '3-6회');
        updateTargetWeight('pec-deck-weight-day3', pecDeckDay3, '8-12회');
    }

    if (oneRM.cableRow) {
        const cableRowDay1 = Math.round(oneRM.cableRow * 0.725 / 2.5) * 2.5;
        const cableRowDay2 = Math.round(oneRM.cableRow * 0.625 / 2.5) * 2.5;
        const cableRowDay3 = Math.round(oneRM.cableRow * 0.875 / 2.5) * 2.5;
        
        updateTargetWeight('cable-row-weight-day1', cableRowDay1, '8-12회');
        updateTargetWeight('cable-row-weight-day2', cableRowDay2, '12-15회');
        updateTargetWeight('cable-row-weight-day3', cableRowDay3, '3-6회');
    }

    if (oneRM.shoulderPress) {
        const shoulderDay1 = Math.round(oneRM.shoulderPress * 0.725 / 2.5) * 2.5;
        const reverseDay1 = Math.round(oneRM.shoulderPress * 0.5 / 2.5) * 2.5;
        const shoulderDay2 = Math.round(oneRM.shoulderPress * 0.625 / 2.5) * 2.5;
        const shoulderDay3 = Math.round(oneRM.shoulderPress * 0.875 / 2.5) * 2.5;
        
        updateTargetWeight('shoulder-press-weight-day1', shoulderDay1, '8-12회');
        updateTargetWeight('reverse-pec-weight-day1', reverseDay1, '8-12회');
        updateTargetWeight('shoulder-press-weight-day2', shoulderDay2, '12-15회');
        updateTargetWeight('shoulder-press-weight-day3', shoulderDay3, '3-6회');
    }

    if (oneRM.cableCurl) {
        const curlDay1 = Math.round(oneRM.cableCurl * 0.725 / 2.5) * 2.5;
        const pushdownDay1 = Math.round(oneRM.cableCurl * 0.8 / 2.5) * 2.5;
        const curlDay3 = Math.round(oneRM.cableCurl * 0.7 / 2.5) * 2.5;
        
        updateTargetWeight('cable-curl-weight-day1', curlDay1, '8-12회');
        updateTargetWeight('cable-pushdown-weight-day1', pushdownDay1, '8-12회');
        updateTargetWeight('cable-curl-weight-day3', curlDay3, '8-12회');
    }
}

function updateTargetWeight(elementId, weight, reps) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = `목표: ${weight}kg × ${reps}`;
    }
}

// 진행 상황 업데이트
function updateProgress() {
    const goals = JSON.parse(localStorage.getItem('fitnessGoals') || '{}');
    
    if (!goals.currentWeight || !goals.targetWeight) return;
    
    // 최신 체중 찾기
    let latestWeight = goals.currentWeight;
    for (let i = 1; i <= 6; i++) {
        const weekData = JSON.parse(localStorage.getItem(`week${i}`) || '{}');
        if (weekData.weight) {
            latestWeight = weekData.weight;
        }
    }
    
    const weightLoss = goals.currentWeight - latestWeight;
    const totalGoal = goals.currentWeight - goals.targetWeight;
    const progressPercent = Math.min(100, Math.max(0, (weightLoss / totalGoal) * 100));
    
    document.getElementById('currentWeightDisplay').textContent = latestWeight.toFixed(1);
    document.getElementById('weightLossDisplay').textContent = weightLoss.toFixed(1);
    document.getElementById('progressPercentage').textContent = progressPercent.toFixed(1) + '%';
    document.getElementById('progressFill').style.width = progressPercent + '%';
}

// 메시지 표시
function showMessage(elementId, message) {
    const messageElement = document.getElementById(elementId);
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = 'message success';
        messageElement.style.display = 'block';
        
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 3000);
    }
}
    
// Part 2: UI 제어 & 운동 관리

// 탭 전환
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });

    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

// 주차 선택
function selectWeek(week) {
    currentWeek = week;
    
    document.querySelectorAll('#progress .week-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    loadWeeklyData(week);
}

// 운동 주차 선택
function selectWorkoutWeek(week) {
    currentWorkoutWeek = week;
    
    document.querySelectorAll('#workout .week-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    loadWorkoutData(week);
}

// 주간 데이터 로드
function loadWeeklyData(week) {
    const weeklyData = JSON.parse(localStorage.getItem(`week${week}`) || '{}');
    
    document.getElementById('weeklyWeight').value = weeklyData.weight || '';
    document.getElementById('weeklyBodyFat').value = weeklyData.bodyFat || '';
}

// 운동 상태 업데이트
function updateExerciseStatus(checkbox) {
    const exerciseItem = checkbox.closest('.exercise-item');
    
    if (checkbox.checked) {
        exerciseItem.classList.add('completed');
        exerciseItem.classList.remove('failed');
    } else {
        exerciseItem.classList.remove('completed');
        exerciseItem.classList.remove('failed');
    }
}

// 식사 선택
function selectMeal(mealType, option, element) {
    const mealCard = element.closest('.card');
    const options = mealCard.querySelectorAll('.meal-option');
    
    options.forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
    
    const mealPreferences = JSON.parse(localStorage.getItem('mealPreferences') || '{}');
    mealPreferences[mealType] = option;
    localStorage.setItem('mealPreferences', JSON.stringify(mealPreferences));
}

// 운동 데이터 로드
function loadWorkoutData(week) {
    const workoutData = JSON.parse(localStorage.getItem(`workout_week${week}`) || '{}');
    
    // 모든 체크박스 초기화
    document.querySelectorAll('.exercise-checkbox').forEach(checkbox => {
        checkbox.checked = false;
        updateExerciseStatus(checkbox);
    });
    
    // 각 Day별 데이터 로드
    ['day1', 'day2', 'day3'].forEach(day => {
        if (workoutData[day]) {
            Object.keys(workoutData[day]).forEach(exerciseId => {
                const checkbox = document.getElementById(exerciseId);
                if (checkbox) {
                    checkbox.checked = workoutData[day][exerciseId];
                    updateExerciseStatus(checkbox);
                }
            });
        }
    });
}

// 주간 진행 상황 저장
function saveWeeklyProgress() {
    const weeklyData = {
        weight: parseFloat(document.getElementById('weeklyWeight').value),
        bodyFat: parseFloat(document.getElementById('weeklyBodyFat').value),
        week: currentWeek
    };

    localStorage.setItem(`week${currentWeek}`, JSON.stringify(weeklyData));
    showMessage('weeklyMessage', `📅 ${currentWeek}주차 기록이 저장되었습니다!`);
    updateProgress();
}

// 운동 기록 저장
function saveWorkout(day) {
    const currentData = JSON.parse(localStorage.getItem(`workout_week${currentWorkoutWeek}`) || '{}');
    
    const exerciseIds = {
        'day1': [
            'hanging-knee-day1', 'slow-pushup-day1', 'bench-day1', 'pec-deck-day1',
            'cable-row-day1', 'pullup-day1', 'shoulder-press-day1', 'reverse-pec-day1',
            'cable-curl-day1', 'cable-pushdown-day1'
        ],
        'day2': [
            'cardio1-day2', 'cardio2-day2', 'bench-day2', 'cable-row-day2', 'shoulder-press-day2'
        ],
        'day3': [
            'bench-day3', 'cable-row-day3', 'shoulder-press-day3', 'pec-deck-day3', 'cable-curl-day3'
        ]
    };

    currentData[day] = {};
    exerciseIds[day].forEach(exerciseId => {
        const checkbox = document.getElementById(exerciseId);
        if (checkbox) {
            currentData[day][exerciseId] = checkbox.checked;
        }
    });

    localStorage.setItem(`workout_week${currentWorkoutWeek}`, JSON.stringify(currentData));
    
    adjustWeightsForFailures(day, currentData[day]);
    
    showMessage('workoutMessage', `💪 ${currentWorkoutWeek}주차 ${day.toUpperCase()} 운동이 완료되었습니다!`);
    updateAppStats();
}

// 실패한 운동에 대한 무게 조정
function adjustWeightsForFailures(day, dayData) {
    const failedExercises = [];
    
    Object.keys(dayData).forEach(exerciseId => {
        if (!dayData[exerciseId]) {
            failedExercises.push(exerciseId);
        }
    });
    
    if (failedExercises.length > 0) {
        const adjustments = JSON.parse(localStorage.getItem('weightAdjustments') || '{}');
        const nextWeek = currentWorkoutWeek + 1;
        
        if (!adjustments[nextWeek]) {
            adjustments[nextWeek] = {};
        }
        
        failedExercises.forEach(exerciseId => {
            adjustments[nextWeek][exerciseId] = 'reduce';
        });
        
        localStorage.setItem('weightAdjustments', JSON.stringify(adjustments));
    }
}

// 식사 선택사항 로드
function loadMealPreferences(preferences) {
    Object.keys(preferences).forEach(mealType => {
        const option = preferences[mealType];
        const cards = document.querySelectorAll('.card');
        
        cards.forEach(card => {
            const title = card.querySelector('.card-title');
            if (!title) return;
            
            const titleText = title.textContent;
            if ((mealType === 'breakfast' && titleText.includes('아침')) ||
                (mealType === 'lunch' && titleText.includes('점심')) ||
                (mealType === 'dinner' && titleText.includes('저녁'))) {
                
                const options = card.querySelectorAll('.meal-option');
                options.forEach(opt => opt.classList.remove('selected'));
                
                if (option === 'rice' && options[0]) {
                    options[0].classList.add('selected');
                } else if (option === 'noodle' && options[1]) {
                    options[1].classList.add('selected');
                }
            }
        });
    });
}

// 장보기 리스트 저장/로드
function loadShoppingList() {
    const shoppingList = JSON.parse(localStorage.getItem('shoppingList') || '{}');
    
    Object.keys(shoppingList).forEach(itemId => {
        const checkbox = document.getElementById(itemId);
        if (checkbox) {
            checkbox.checked = shoppingList[itemId];
            checkbox.addEventListener('change', saveShoppingList);
        }
    });
    
    // 이벤트 리스너 추가 (처음 로드 시)
    document.querySelectorAll('.shopping-item input[type="checkbox"]').forEach(checkbox => {
        if (!checkbox.hasAttribute('data-listener')) {
            checkbox.addEventListener('change', saveShoppingList);
            checkbox.setAttribute('data-listener', 'true');
        }
    });
}

function saveShoppingList() {
    const shoppingList = {};
    
    document.querySelectorAll('.shopping-item input[type="checkbox"]').forEach(checkbox => {
        shoppingList[checkbox.id] = checkbox.checked;
    });
    
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
}
    
// Part 3: 데이터 백업/복원 & 이벤트 처리

// 데이터 내보내기/가져오기 기능
function exportData() {
    const allData = {};
    
    // 모든 로컬 스토리지 데이터 수집
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('fitness') || key.startsWith('oneRM') || 
            key.startsWith('week') || key.startsWith('workout_') ||
            key.startsWith('mealPreferences') || key.startsWith('shoppingList') ||
            key.startsWith('weightAdjustments')) {
            allData[key] = localStorage.getItem(key);
        }
    }
    
    // JSON 파일로 다운로드
    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fitness_data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // 데이터 복원
            Object.keys(data).forEach(key => {
                localStorage.setItem(key, data[key]);
            });
            
            // 페이지 새로고침
            location.reload();
        } catch (error) {
            alert('파일을 읽는 중 오류가 발생했습니다.');
            console.error('Import error:', error);
        }
    };
    reader.readAsText(file);
}

// 키보드 단축키
document.addEventListener('keydown', function(e) {
    // Ctrl + S: 현재 탭의 데이터 저장
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        const activeTab = document.querySelector('.tab.active').textContent;
        
        if (activeTab.includes('목표')) {
            saveGoals();
            save1RM();
        } else if (activeTab.includes('진행상황')) {
            saveWeeklyProgress();
        }
    }
    
    // Ctrl + E: 데이터 내보내기
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        exportData();
    }
});

// 터치 제스처 지원 (모바일)
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;

    if (Math.abs(swipeDistance) > swipeThreshold) {
        const currentTab = document.querySelector('.tab.active');
        const currentIndex = Array.from(document.querySelectorAll('.tab')).indexOf(currentTab);

        if (swipeDistance > 0 && currentIndex > 0) {
            // 오른쪽으로 스와이프 (이전 탭)
            document.querySelectorAll('.tab')[currentIndex - 1].click();
        } else if (swipeDistance < 0 && currentIndex < document.querySelectorAll('.tab').length - 1) {
            // 왼쪽으로 스와이프 (다음 탭)
            document.querySelectorAll('.tab')[currentIndex + 1].click();
        }
    }
}

// 온라인/오프라인 상태 체크
window.addEventListener('online', function() {
    showMessage('workoutMessage', '🌐 온라인 상태입니다.');
});

window.addEventListener('offline', function() {
    showMessage('workoutMessage', '📱 오프라인 모드입니다. 데이터는 로컬에 저장됩니다.');
});

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    loadShoppingList();
});

// 추가 유틸리티 함수들

// 모든 데이터 초기화
function resetAllData() {
    if (confirm('모든 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.startsWith('fitness') || key.startsWith('oneRM') || 
                key.startsWith('week') || key.startsWith('workout_') ||
                key.startsWith('mealPreferences') || key.startsWith('shoppingList') ||
                key.startsWith('weightAdjustments') || key.startsWith('darkMode'))) {
                keysToRemove.push(key);
            }
        }
        
        keysToRemove.forEach(key => localStorage.removeItem(key));
        location.reload();
    }
}

// 주간 통계 계산
function calculateWeeklyStats() {
    const stats = {
        totalWorkouts: 0,
        completedWorkouts: 0,
        weeklyWeights: [],
        avgCompletionRate: 0
    };

    for (let week = 1; week <= 6; week++) {
        const workoutData = JSON.parse(localStorage.getItem(`workout_week${week}`) || '{}');
        const weekData = JSON.parse(localStorage.getItem(`week${week}`) || '{}');
        
        if (weekData.weight) {
            stats.weeklyWeights.push({
                week: week,
                weight: weekData.weight,
                bodyFat: weekData.bodyFat
            });
        }

        ['day1', 'day2', 'day3'].forEach(day => {
            if (workoutData[day]) {
                stats.totalWorkouts++;
                const exercises = Object.values(workoutData[day]);
                const completedExercises = exercises.filter(completed => completed).length;
                if (completedExercises > 0) {
                    stats.completedWorkouts++;
                }
            }
        });
    }

    if (stats.totalWorkouts > 0) {
        stats.avgCompletionRate = (stats.completedWorkouts / stats.totalWorkouts * 100).toFixed(1);
    }

    return stats;
}

// 앱 통계 업데이트
function updateAppStats() {
    const stats = calculateWeeklyStats();
    
    const totalWorkoutsElement = document.getElementById('totalWorkouts');
    const completionRateElement = document.getElementById('completionRate');
    
    if (totalWorkoutsElement) {
        totalWorkoutsElement.textContent = stats.completedWorkouts;
    }
    if (completionRateElement) {
        completionRateElement.textContent = stats.avgCompletionRate + '%';
    }
}

// PWA 지원을 위한 서비스 워커 등록 (선택사항)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // 서비스 워커가 있다면 등록
        // navigator.serviceWorker.register('/sw.js');
    });
}

// 다크모드 토글 (추가 기능)
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    
    showMessage('workoutMessage', isDarkMode ? '🌙 다크모드가 활성화되었습니다!' : '☀️ 라이트모드가 활성화되었습니다!');
}

// 다크모드 설정 로드
function loadDarkMode() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
}

// 데이터 검증 함수
function validateData() {
    const goals = JSON.parse(localStorage.getItem('fitnessGoals') || '{}');
    const oneRM = JSON.parse(localStorage.getItem('oneRM') || '{}');
    
    let isValid = true;
    let errors = [];
    
    // 목표 데이터 검증
    if (!goals.currentWeight || goals.currentWeight <= 0) {
        errors.push('현재 체중이 올바르지 않습니다.');
        isValid = false;
    }
    
    if (!goals.targetWeight || goals.targetWeight <= 0) {
        errors.push('목표 체중이 올바르지 않습니다.');
        isValid = false;
    }
    
    if (goals.currentWeight && goals.targetWeight && goals.currentWeight <= goals.targetWeight) {
        errors.push('목표 체중은 현재 체중보다 작아야 합니다.');
        isValid = false;
    }
    
    // 1RM 데이터 검증
    Object.keys(oneRM).forEach(exercise => {
        if (oneRM[exercise] <= 0) {
            errors.push(`${exercise} 1RM이 올바르지 않습니다.`);
            isValid = false;
        }
    });
    
    return { isValid, errors };
}

// 에러 처리 함수
function handleError(error, context = '') {
    console.error(`Error in ${context}:`, error);
    showMessage('workoutMessage', `⚠️ 오류가 발생했습니다: ${error.message}`);
}

// 로컬 스토리지 용량 체크
function checkStorageSpace() {
    try {
        const testKey = 'storageTest';
        const testValue = 'x'.repeat(1024); // 1KB
        localStorage.setItem(testKey, testValue);
        localStorage.removeItem(testKey);
        return true;
    } catch (e) {
        console.warn('Local storage space is running low');
        return false;
    }
}

// 앱 초기화 시 다크모드 로드
document.addEventListener('DOMContentLoaded', function() {
    loadDarkMode();
    loadData();
    loadShoppingList();
});

// 알림 기능 (브라우저 알림)
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(function(permission) {
            if (permission === 'granted') {
                showMessage('workoutMessage', '🔔 알림이 활성화되었습니다!');
            }
        });
    }
}

// 운동 리마인더 알림
function showWorkoutReminder() {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('피트니스 트래커', {
            body: '오늘의 운동을 시작할 시간입니다! 💪',
            icon: '/icon-192x192.png', // PWA 아이콘
            badge: '/icon-192x192.png'
        });
    }
}

// 데이터 자동 백업 (7일마다)
function autoBackup() {
    const lastBackup = localStorage.getItem('lastBackup');
    const now = new Date().getTime();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    
    if (!lastBackup || (now - parseInt(lastBackup)) > sevenDays) {
        exportData();
        localStorage.setItem('lastBackup', now.toString());
        showMessage('workoutMessage', '📁 자동 백업이 완료되었습니다!');
    }
}

// 목표 달성 축하 메시지
function checkGoalAchievement() {
    const goals = JSON.parse(localStorage.getItem('fitnessGoals') || '{}');
    if (!goals.currentWeight || !goals.targetWeight) return;
    
    let latestWeight = goals.currentWeight;
    for (let i = 1; i <= 6; i++) {
        const weekData = JSON.parse(localStorage.getItem(`week${i}`) || '{}');
        if (weekData.weight) {
            latestWeight = weekData.weight;
        }
    }
    
    if (latestWeight <= goals.targetWeight) {
        showMessage('workoutMessage', '🎉 축하합니다! 목표 체중을 달성했습니다! 🎉');
        
        // 브라우저 알림
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('목표 달성!', {
                body: '축하합니다! 목표 체중을 달성했습니다! 🎉',
                icon: '/icon-192x192.png'
            });
        }
    }
}

// 운동 연속 기록 계산
function calculateStreak() {
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) { // 최근 30일 체크
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        
        const dateStr = checkDate.toISOString().split('T')[0];
        const dayWorkout = localStorage.getItem(`workout_${dateStr}`);
        
        if (dayWorkout) {
            streak++;
        } else {
            break;
        }
    }
    
    return streak;
}

// 운동 완료 시 연속 기록 업데이트
function updateStreak() {
    const streak = calculateStreak();
    const streakElement = document.getElementById('workoutStreak');
    
    if (streakElement) {
        streakElement.textContent = streak;
    }
    
    // 연속 기록 달성 축하
    if (streak > 0 && streak % 7 === 0) {
        showMessage('workoutMessage', `🔥 ${streak}일 연속 운동! 대단합니다! 🔥`);
    }
}

// 체중 변화 그래프 데이터 생성 (차트 라이브러리와 함께 사용)
function getWeightChartData() {
    const goals = JSON.parse(localStorage.getItem('fitnessGoals') || '{}');
    const data = [];
    
    // 시작 체중
    if (goals.currentWeight) {
        data.push({
            week: 0,
            weight: goals.currentWeight,
            label: '시작'
        });
    }
    
    // 주간 체중 데이터
    for (let i = 1; i <= 6; i++) {
        const weekData = JSON.parse(localStorage.getItem(`week${i}`) || '{}');
        if (weekData.weight) {
            data.push({
                week: i,
                weight: weekData.weight,
                label: `${i}주차`
            });
        }
    }
    
    // 목표 체중
    if (goals.targetWeight) {
        data.push({
            week: 6,
            weight: goals.targetWeight,
            label: '목표',
            isTarget: true
        });
    }
    
    return data;
}

// 운동별 완료율 계산
function getExerciseCompletionRates() {
    const exerciseStats = {};
    
    for (let week = 1; week <= 6; week++) {
        const workoutData = JSON.parse(localStorage.getItem(`workout_week${week}`) || '{}');
        
        ['day1', 'day2', 'day3'].forEach(day => {
            if (workoutData[day]) {
                Object.keys(workoutData[day]).forEach(exerciseId => {
                    if (!exerciseStats[exerciseId]) {
                        exerciseStats[exerciseId] = { completed: 0, total: 0 };
                    }
                    exerciseStats[exerciseId].total++;
                    if (workoutData[day][exerciseId]) {
                        exerciseStats[exerciseId].completed++;
                    }
                });
            }
        });
    }
    
    // 완료율 계산
    Object.keys(exerciseStats).forEach(exerciseId => {
        const stats = exerciseStats[exerciseId];
        stats.rate = stats.total > 0 ? (stats.completed / stats.total * 100).toFixed(1) : 0;
    });
    
    return exerciseStats;
}

// 주간 보고서 생성
function generateWeeklyReport(week) {
    const weekData = JSON.parse(localStorage.getItem(`week${week}`) || '{}');
    const workoutData = JSON.parse(localStorage.getItem(`workout_week${week}`) || '{}');
    
    const report = {
        week: week,
        weight: weekData.weight || 'N/A',
        bodyFat: weekData.bodyFat || 'N/A',
        workoutsCompleted: 0,
        totalWorkouts: 0,
        exercises: {}
    };
    
    ['day1', 'day2', 'day3'].forEach(day => {
        if (workoutData[day]) {
            report.totalWorkouts++;
            const exercises = Object.values(workoutData[day]);
            const completedExercises = exercises.filter(completed => completed).length;
            if (completedExercises > 0) {
                report.workoutsCompleted++;
            }
        }
    });
    
    report.completionRate = report.totalWorkouts > 0 ? 
        (report.workoutsCompleted / report.totalWorkouts * 100).toFixed(1) : 0;
    
    return report;
}

// 전체 프로그램 요약 통계
function getProgramSummary() {
    const goals = JSON.parse(localStorage.getItem('fitnessGoals') || '{}');
    const summary = {
        startWeight: goals.currentWeight || 0,
        targetWeight: goals.targetWeight || 0,
        currentWeight: goals.currentWeight || 0,
        totalWeightLoss: 0,
        goalProgress: 0,
        totalWorkouts: 0,
        completedWorkouts: 0,
        averageCompletionRate: 0,
        bestWeek: null,
        worstWeek: null
    };
    
    // 최신 체중 찾기
    for (let i = 1; i <= 6; i++) {
        const weekData = JSON.parse(localStorage.getItem(`week${i}`) || '{}');
        if (weekData.weight) {
            summary.currentWeight = weekData.weight;
        }
    }
    
    // 체중 감량 계산
    summary.totalWeightLoss = summary.startWeight - summary.currentWeight;
    if (summary.targetWeight > 0) {
        const totalGoal = summary.startWeight - summary.targetWeight;
        summary.goalProgress = (summary.totalWeightLoss / totalGoal * 100).toFixed(1);
    }
    
    // 운동 통계 계산
    const stats = calculateWeeklyStats();
    summary.totalWorkouts = stats.totalWorkouts;
    summary.completedWorkouts = stats.completedWorkouts;
    summary.averageCompletionRate = stats.avgCompletionRate;
    
    return summary;
}

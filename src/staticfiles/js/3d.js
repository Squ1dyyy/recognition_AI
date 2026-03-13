// Функция для отображения видео-прелоадера
function showVideoPreloader() {
    const videoPreloader = document.getElementById('videoPreloader');
    const progressBar = document.getElementById('progressBar');
    const loadingPercentage = document.getElementById('loadingPercentage');
    const contentReveal = document.getElementById('contentReveal');
    const video = document.getElementById('preloaderVideo');

    // Показываем прелоадер
    videoPreloader.style.display = 'flex';

    // Анимация прогресс-бара
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 3;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);

            setTimeout(() => {
                contentReveal.classList.add('active');

                setTimeout(() => {
                    videoPreloader.style.opacity = '0';
                    videoPreloader.style.visibility = 'hidden';

                    if (video) {
                        video.pause();
                        video.currentTime = 0;
                    }
                }, 500);
            }, 200);
        }
        progressBar.style.width = `${progress}%`;
        loadingPercentage.textContent = `${Math.round(progress)}%`;
    }, 80);

    if (video) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('Video playback was prevented:', error.name);
            });
        }
    }
}

// Запускаем видео-прелоадер при загрузке страницы
document.addEventListener('DOMContentLoaded', showVideoPreloader);

// Управление цветовой темой интерфейса
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
    document.body.classList.add('light-theme');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');

    if (document.body.classList.contains('light-theme')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'light');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'dark');
    }
});

// ====================== УПРАВЛЕНИЕ УВЕДОМЛЕНИЕМ О НЕРАСПОЗНАННОЙ ЦИФРЕ ======================
const unrecognizedNotification = document.getElementById('unrecognizedNotification');
const notificationClose = document.getElementById('notificationClose');

// Глобальная переменная для отслеживания, нужно ли показать уведомление после закрытия анимации
let pendingYNotification = false;

function showUnrecognizedNotification() {
    if (unrecognizedNotification) {
        unrecognizedNotification.classList.add('active');
        document.body.style.overflow = 'hidden';
        pendingYNotification = false; // Сбрасываем флаг после показа
    }
}

function closeUnrecognizedNotification() {
    if (unrecognizedNotification) {
        unrecognizedNotification.classList.remove('active');
    }
    document.body.style.overflow = '';
    pendingYNotification = false; // Сбрасываем флаг при закрытии
}

if (notificationClose) {
    notificationClose.addEventListener('click', closeUnrecognizedNotification);
}

if (unrecognizedNotification) {
    unrecognizedNotification.addEventListener('click', (e) => {
        if (e.target === unrecognizedNotification) {
            closeUnrecognizedNotification();
        }
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && unrecognizedNotification && unrecognizedNotification.classList.contains('active')) {
        closeUnrecognizedNotification();
    }
});

// Автоматическое закрытие уведомления через 5 секунд
function autoCloseNotification() {
    setTimeout(() => {
        closeUnrecognizedNotification();
    }, 5000);
}

// ====================== УПРАВЛЕНИЕ ВСПЛЫВАЮЩИМИ СООБЩЕНИЯМИ ======================
const messagePopup = document.getElementById('messagePopup');
const messageText = document.getElementById('messageText');
const messageClose = document.getElementById('messageClose');

function showMessage(text) {
    messageText.textContent = text;
    messagePopup.classList.add('active');

    // Автоматическое скрытие через 4 секунды
    setTimeout(() => {
        hideMessage();
    }, 4000);
}

function hideMessage() {
    messagePopup.classList.remove('active');
}

if (messageClose) {
    messageClose.addEventListener('click', hideMessage);
}

// ====================== Dropdown меню ======================
let currentModel = 'CNN';

function closeAllDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown-content, .model-dropdown-content');
    const dropdownBtns = document.querySelectorAll('.dropdown-btn, .model-select-btn');

    dropdowns.forEach(dropdown => {
        dropdown.classList.remove('show');
    });

    dropdownBtns.forEach(btn => {
        btn.classList.remove('active');
    });
}

const dropdownBtn = document.getElementById('dropdownBtn');
if (dropdownBtn) {
    dropdownBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        const dropdownContent = document.getElementById('dropdownContent');
        const isShowing = dropdownContent && dropdownContent.classList.contains('show');

        closeAllDropdowns();

        if (!isShowing && dropdownContent) {
            dropdownContent.classList.add('show');
            this.classList.add('active');
        }
    });
}

const variantsBtn = document.getElementById('variantsBtn');
if (variantsBtn) {
    variantsBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        const variantsContent = document.getElementById('variantsContent');
        const isShowing = variantsContent && variantsContent.classList.contains('show');

        closeAllDropdowns();

        if (!isShowing && variantsContent) {
            variantsContent.classList.add('show');
            this.classList.add('active');
        }
    });
}

// Управление выпадающим списком моделей ИИ
const modelSelectBtn = document.getElementById('modelSelectBtn');
const modelDropdownContent = document.getElementById('modelDropdownContent');
const modelOptions = document.querySelectorAll('.model-option');

if (modelSelectBtn) {
    modelSelectBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        const isShowing = modelDropdownContent.classList.contains('show');

        closeAllDropdowns();

        if (!isShowing) {
            modelDropdownContent.classList.add('show');
        }
    });
}

if (modelOptions) {
    modelOptions.forEach(option => {
        option.addEventListener('click', function (e) {
            e.stopPropagation();
            const selectedModel = this.getAttribute('data-model');

            modelOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');

            currentModel = selectedModel;

            const modelIcons = {
                'CNN': 'fas fa-brain'
            };

            const modelNames = {
                'CNN': 'CNN'
            };

            modelSelectBtn.innerHTML = `
                <i class="${modelIcons[currentModel]}"></i> ${modelNames[currentModel]}
                <i class="fas fa-chevron-down"></i>
            `;

            modelDropdownContent.classList.remove('show');

            modelSelectBtn.style.background = 'rgba(42, 157, 143, 0.4)';
            setTimeout(() => {
                modelSelectBtn.style.background = '';
            }, 500);

            console.log('Выбрана модель ИИ:', currentModel);
        });
    });
}

document.addEventListener('click', function (event) {
    if (!event.target.matches('.dropdown-btn') && !event.target.closest('.dropdown-content') &&
        !event.target.matches('.model-select-btn') && !event.target.closest('.model-dropdown-content')) {
        closeAllDropdowns();
    }
});

// ====================== МОДАЛЬНЫЕ ОКНА ======================

// Управление модальным окном с 3D анимацией
const animationModal = document.getElementById('animationModal');
const animationModalClose = document.getElementById('animationModalClose');

function closeAnimationModal() {
    if (animationModal) {
        animationModal.classList.remove('active');
    }
    document.body.style.overflow = '';

    if (animationInProgress) {
        cancelAnimationFrame(animationInProgress);
        animationInProgress = false;
    }

    // Очищаем сцену
    if (scene) {
        if (cubeGroup && scene.children.includes(cubeGroup)) {
            scene.remove(cubeGroup);
        }
        if (countersGroup && scene.children.includes(countersGroup)) {
            scene.remove(countersGroup);
        }
        if (digitsGroup && scene.children.includes(digitsGroup)) {
            scene.remove(digitsGroup);
        }
        cubes = [];
    }
    
    // Проверяем, нужно ли показать уведомление о распознании 'y'
    if (pendingYNotification) {
        // Небольшая задержка для плавного перехода
        setTimeout(() => {
            showUnrecognizedNotification();
            autoCloseNotification();
        }, 300);
    }
}

if (animationModalClose) {
    animationModalClose.addEventListener('click', closeAnimationModal);
}

if (animationModal) {
    animationModal.addEventListener('click', (e) => {
        if (e.target === animationModal) {
            closeAnimationModal();
        }
    });
}

// Управление модальным окном для подсказки
const helpModal = document.getElementById('helpModal');
const helpBtn = document.getElementById('helpBtn');
const helpModalClose = document.getElementById('helpModalClose');
const helpModalGotIt = document.getElementById('helpModalGotIt');

function openHelpModal() {
    if (helpModal) {
        helpModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeHelpModal() {
    if (helpModal) {
        helpModal.classList.remove('active');
    }
    document.body.style.overflow = '';
}

if (helpBtn) {
    helpBtn.addEventListener('click', openHelpModal);
}

if (helpModalClose) {
    helpModalClose.addEventListener('click', closeHelpModal);
}

if (helpModalGotIt) {
    helpModalGotIt.addEventListener('click', closeHelpModal);
}

if (helpModal) {
    helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal) {
            closeHelpModal();
        }
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (helpModal && helpModal.classList.contains('active')) {
            closeHelpModal();
        }
        if (animationModal && animationModal.classList.contains('active')) {
            closeAnimationModal();
        }
    }
});

// Обновление индикатора этапа анимации
function updateStageIndicator(stage) {
    const stageIndicator = document.getElementById('stageIndicator');
    const stageText = document.getElementById('stageText');

    if (stageIndicator && stageText) {
        stageText.textContent = stage;
    }
}

// ====================== РАБОТА С ХОЛСТОМ (CANVAS) ======================

// Работа с холстом для рисования
const drawingCanvas = document.getElementById('drawing-canvas');
const drawingCtx = drawingCanvas ? drawingCanvas.getContext('2d', { willReadFrequently: true }) : null;
const recognizeBtn = document.getElementById('recognize-btn');
const eraseBtn = document.getElementById('erase-btn');
const resultText = document.getElementById('result-text');

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let currentDrawing = null;
let drawingPaths = [];
let isTextSelected = false;

function setupCanvas() {
    if (!drawingCanvas || !drawingCtx) return;

    const container = drawingCanvas.parentElement;
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    const oldContent = currentDrawing;

    drawingCanvas.width = containerWidth;
    drawingCanvas.height = containerHeight;
    drawingCanvas.style.width = containerWidth + 'px';
    drawingCanvas.style.height = containerHeight + 'px';

    drawingCtx.fillStyle = '#000';
    drawingCtx.fillRect(0, 0, containerWidth, containerHeight);

    if (oldContent && oldContent.width > 0 && oldContent.height > 0) {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = oldContent.width;
        tempCanvas.height = oldContent.height;
        tempCtx.putImageData(oldContent, 0, 0);
        drawingCtx.drawImage(tempCanvas, 0, 0, oldContent.width, oldContent.height, 0, 0, containerWidth, containerHeight);
    }

    currentDrawing = drawingCtx.getImageData(0, 0, containerWidth, containerHeight);
    const baseLineWidth = Math.max(8, Math.min(20, containerWidth / 25));
    drawingCtx.lineWidth = baseLineWidth;
    drawingCtx.lineCap = 'round';
    drawingCtx.lineJoin = 'round';
    drawingCtx.strokeStyle = '#FFFFFF';
    drawingCtx.fillStyle = '#000';
}

function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    const x = evt.clientX - rect.left;
    const y = evt.clientY - rect.top;
    return { x, y };
}

function getTouchPos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    const touch = evt.touches[0] || evt.changedTouches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    return { x, y };
}

function startDrawing(x, y) {
    if (isTextSelected) return;

    isDrawing = true;
    [lastX, lastY] = [x, y];
    currentDrawing = drawingCtx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height);
    drawingPaths.push([{ x, y }]);

    drawingCtx.beginPath();
    drawingCtx.arc(x, y, drawingCtx.lineWidth / 2, 0, Math.PI * 2);
    drawingCtx.fillStyle = drawingCtx.strokeStyle;
    drawingCtx.fill();
}

function draw(x, y) {
    if (!isDrawing || isTextSelected) return;

    drawingCtx.beginPath();
    drawingCtx.moveTo(lastX, lastY);
    drawingCtx.lineTo(x, y);
    drawingCtx.stroke();

    if (drawingPaths.length > 0) {
        drawingPaths[drawingPaths.length - 1].push({ x, y });
    }

    [lastX, lastY] = [x, y];
}

function stopDrawing() {
    isDrawing = false;
    currentDrawing = drawingCtx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height);
}

if (drawingCanvas) {
    drawingCanvas.addEventListener('mousedown', (e) => {
        const pos = getMousePos(drawingCanvas, e);
        startDrawing(pos.x, pos.y);
    });

    drawingCanvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;
        const pos = getMousePos(drawingCanvas, e);
        draw(pos.x, pos.y);
    });

    drawingCanvas.addEventListener('mouseup', stopDrawing);
    drawingCanvas.addEventListener('mouseout', stopDrawing);
}

function initTouchEvents() {
    if (!drawingCanvas) return;

    drawingCanvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const pos = getTouchPos(drawingCanvas, e);
        startDrawing(pos.x, pos.y);
    }, { passive: false });

    drawingCanvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (!isDrawing) return;
        const pos = getTouchPos(drawingCanvas, e);
        draw(pos.x, pos.y);
    }, { passive: false });

    drawingCanvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        stopDrawing();
    }, { passive: false });
}

// Обработчики для предотвращения рисования при выделении текста
document.addEventListener('selectionchange', () => {
    const selection = window.getSelection();
    isTextSelected = selection.toString().length > 0;
});

document.addEventListener('mousedown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' ||
        e.target.isContentEditable || e.target.closest('[contenteditable="true"]')) {
        isTextSelected = true;
    }
});

document.addEventListener('mouseup', () => {
    setTimeout(() => {
        isTextSelected = false;
    }, 100);
});

function observeContainerResize() {
    const container = drawingCanvas ? drawingCanvas.parentElement : null;
    if (!container) return;

    if (typeof ResizeObserver !== 'undefined') {
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    setupCanvas();
                }, 50);
            }
        });
        resizeObserver.observe(container);
    } else {
        window.addEventListener('resize', handleWindowResize);
    }
}

let resizeTimeout;
function handleWindowResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        setupCanvas();
    }, 100);
}

// ====================== ФУНКЦИИ ДЛЯ НОРМИРОВАНИЯ CANVAS ======================

// Размеры для нормализации
const NORMALIZED_SIZE = 28;

// Функция для предобработки изображения перед отправкой на сервер
function preprocessImageForServer() {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    tempCanvas.width = NORMALIZED_SIZE;
    tempCanvas.height = NORMALIZED_SIZE;

    tempCtx.fillStyle = '#000000';
    tempCtx.fillRect(0, 0, NORMALIZED_SIZE, NORMALIZED_SIZE);
    tempCtx.drawImage(drawingCanvas, 0, 0, NORMALIZED_SIZE, NORMALIZED_SIZE);
    applyImageEnhancement(tempCtx, NORMALIZED_SIZE, NORMALIZED_SIZE);

    return tempCanvas.toDataURL('image/png');
}

// Функция для улучшения качества изображения
function applyImageEnhancement(ctx, width, height) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const threshold = 10;

    for (let i = 0; i < data.length; i += 4) {
        const brightness = data[i];

        if (brightness > threshold) {
            data[i] = 255;
            data[i + 1] = 255;
            data[i + 2] = 255;
            data[i + 3] = 255;
        } else {
            data[i] = 0;
            data[i + 1] = 0;
            data[i + 2] = 0;
            data[i + 3] = 255;
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

// Функция для 3D обработки
function applyImageEnhancementFor3D(ctx, width, height) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const threshold = 10;

    for (let i = 0; i < data.length; i += 4) {
        const brightness = data[i];

        if (brightness > threshold) {
            data[i] = 255;
            data[i + 1] = 255;
            data[i + 2] = 255;
            data[i + 3] = 255;
        } else {
            data[i] = 0;
            data[i + 1] = 0;
            data[i + 2] = 0;
            data[i + 3] = 255;
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

// ====================== ОБРАБОТКА РЕЗУЛЬТАТОВ СЕРВЕРА ======================

// Функция для отправки запроса на сервер
async function sendToServer(imageData, target) {
    try {
        const requestData = {
            image: imageData,
            models: [currentModel],
            target: target
        };

        console.log('Отправка запроса на сервер:', requestData);

        const response = await fetch("http://localhost:8000/api/recognize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Ответ от сервера:', result);

        if (result && result.results && Array.isArray(result.results)) {
            return result.results;
        } else if (Array.isArray(result)) {
            return result;
        } else {
            return [result];
        }
    } catch (error) {
        console.error('Ошибка при отправке на сервер:', error);
        throw error;
    }
}

// ====================== ФУНКЦИИ ДЛЯ ОБРАБОТКИ ОТВЕТА ОТ СЕРВЕРА ======================

// Функция для нормализации вероятностей (чтобы сумма была 100%)
function normalizeProbabilities(probabilities) {
    if (!probabilities || typeof probabilities !== 'object') {
        return null;
    }

    // Создаем массив для всех 11 нейронов (0-9 и y)
    const allProbs = {};

    // Обрабатываем цифры 0-9
    for (let i = 0; i < 10; i++) {
        const key = i.toString();
        if (probabilities.hasOwnProperty(key)) {
            const value = probabilities[key];
            // Если значение уже в процентах (больше 1), делим на 100
            allProbs[i] = value > 1 ? value / 100 : value;
        } else {
            allProbs[i] = 0;
        }
    }

    // Обрабатываем 'y' (индекс 10)
    if (probabilities.hasOwnProperty('10')) {
        const value = probabilities['10'];
        allProbs[10] = value > 1 ? value / 100 : value;
    } else if (probabilities.hasOwnProperty('y')) {
        const value = probabilities['y'];
        allProbs[10] = value > 1 ? value / 100 : value;
    } else {
        allProbs[10] = 0;
    }

    // Проверяем, нужно ли нормализовать
    const sum = Object.values(allProbs).reduce((a, b) => a + b, 0);

    if (Math.abs(sum - 1) < 0.01) { // Уже нормализовано (сумма ~1)
        return allProbs;
    } else if (Math.abs(sum - 100) < 1) { // Уже в процентах (сумма ~100)
        // Делим все на 100
        const normalized = {};
        for (let i = 0; i < 11; i++) {
            normalized[i] = allProbs[i] / 100;
        }
        return normalized;
    } else {
        // Нормализуем к сумме 1
        const normalized = {};
        for (let i = 0; i < 11; i++) {
            normalized[i] = allProbs[i] / sum;
        }
        return normalized;
    }
}

// Функция для вычисления процентов схожести из probabilities
function calculateProbabilitiesFromProbabilities(probabilitiesObj) {
    console.log('Вычисление вероятностей из probabilities:', probabilitiesObj);

    // Нормализуем вероятности
    const normalizedProbs = normalizeProbabilities(probabilitiesObj);

    if (!normalizedProbs) {
        console.error('Invalid probabilities structure:', probabilitiesObj);
        return null;
    }

    const probabilities = {};

    // Преобразуем в проценты (умножаем на 100) для всех 11 классов
    for (let i = 0; i < 11; i++) {
        probabilities[i] = normalizedProbs[i] * 100;
    }

    console.log('Расчитанные вероятности:', probabilities);
    return probabilities;
}

// Функция для определения распознанной цифры на основе probabilities
function determineRecognizedDigitFromProbabilities(probabilitiesObj) {
    console.log('Определение цифры из probabilities:', probabilitiesObj);

    // Нормализуем вероятности
    const normalizedProbs = normalizeProbabilities(probabilitiesObj);

    if (!normalizedProbs || typeof normalizedProbs !== 'object') {
        console.error('Invalid probabilities for digit determination:', probabilitiesObj);
        return 1;
    }

    let maxDigit = 0;
    let maxProbability = -1;

    // Ищем максимальное значение среди всех 11 классов
    for (let i = 0; i < 11; i++) {
        const probability = normalizedProbs[i];
        if (probability > maxProbability) {
            maxProbability = probability;
            maxDigit = i;
        }
    }

    console.log('Определена цифра:', maxDigit, 'с вероятностью:', maxProbability);
    return maxDigit;
}

// Функция для обновления процентов схожести на основе probabilities
function updateSimilarityPercentagesFromProbabilities(probabilitiesObj, recognizedDigit) {
    const similarityGrid = document.getElementById('similarityGrid');
    similarityGrid.innerHTML = '';

    if (!probabilitiesObj) {
        console.warn('No probabilities provided');
        return;
    }

    const probabilities = calculateProbabilitiesFromProbabilities(probabilitiesObj);

    if (!probabilities) {
        console.error('Failed to calculate probabilities');
        return;
    }

    // Создаем массив предсказаний для сортировки
    const predictions = [];
    for (let digit in probabilities) {
        if (probabilities.hasOwnProperty(digit)) {
            const digitInt = parseInt(digit);
            // Для отображения используем 'y' для индекса 10
            const displayDigit = digitInt === 10 ? 'y' : digitInt;
            predictions.push({
                digit: digitInt,
                displayDigit: displayDigit,
                confidence: probabilities[digit]
            });
        }
    }

    // Сортируем по убыванию уверенности
    predictions.sort((a, b) => b.confidence - a.confidence);

    console.log('Predictions for display:', predictions);

    // Проверяем максимальное значение для масштабирования полос
    const maxConfidence = Math.max(...predictions.map(p => p.confidence));
    const scaleFactor = maxConfidence > 0 ? 100 / maxConfidence : 1;

    // Добавляем элементы для каждой цифры
    predictions.forEach((prediction, index) => {
        const similarityItem = document.createElement('div');
        similarityItem.className = 'similarity-item';
        similarityItem.style.opacity = '0';

        // Подсвечиваем распознанную цифру
        if (prediction.digit === recognizedDigit) {
            similarityItem.style.background = 'rgba(56, 178, 172, 0.3)';
            similarityItem.style.borderColor = 'var(--accent-light)';
        }

        // Добавляем элемент с атрибутом data-digit для y
        similarityItem.innerHTML = `
            <div class="similarity-digit" data-digit="${prediction.displayDigit}">${prediction.displayDigit}</div>
            <div class="similarity-bar-container">
                <div class="similarity-bar" style="width: 0%"></div>
            </div>
            <div class="similarity-percentage">0%</div>
        `;

        similarityGrid.appendChild(similarityItem);

        // Анимируем появление процентов с задержкой
        setTimeout(() => {
            similarityItem.style.opacity = '1';
            const bar = similarityItem.querySelector('.similarity-bar');
            const percentage = similarityItem.querySelector('.similarity-percentage');

            // Анимируем ширину полосы
            setTimeout(() => {
                const actualPercentage = Math.round(prediction.confidence);
                const displayPercentage = Math.round(prediction.confidence * scaleFactor);

                bar.style.width = `${displayPercentage}%`;
                percentage.textContent = `${actualPercentage}%`;
            }, 100);
        }, index * 100);
    });

    // Если распознанная цифра - 'y', устанавливаем флаг для показа уведомления после закрытия анимации
    if (recognizedDigit === 10) {
        pendingYNotification = true;
    }
}

// Функция для обработки результатов с сервера
function processServerResults(serverResult) {
    console.log('Обработка результата от сервера:', serverResult);

    if (!serverResult || !Array.isArray(serverResult) || serverResult.length === 0) {
        throw new Error('No valid server response data');
    }

    // Берем первый результат
    const result = serverResult[0];

    // Проверяем наличие поля probabilities
    if (!result.probabilities) {
        // Если нет probabilities, проверяем другие возможные поля
        if (result.weights && result.weights.output) {
            // Конвертируем weights в probabilities
            console.log('Конвертация weights в probabilities');
            const weights = result.weights.output[0];
            const probabilities = {};
            for (let i = 0; i < 11; i++) { // Теперь 11 классов
                probabilities[i] = weights[i] || 0;
            }
            result.probabilities = probabilities;
        } else {
            throw new Error('No probabilities field in server response');
        }
    }

    // Определяем цифру на основе probabilities
    const recognizedDigit = determineRecognizedDigitFromProbabilities(result.probabilities);

    // Обновляем проценты схожести на основе probabilities
    updateSimilarityPercentagesFromProbabilities(result.probabilities, recognizedDigit);

    return {
        ...result,
        digit: recognizedDigit // Устанавливаем вычисленную цифру
    };
}

// Функция для обновления результата распознавания
function updateResultDisplay(digit) {
    if (resultText) {
        // Если digit равен 10, отображаем 'y', иначе отображаем цифру
        const displayValue = digit === 10 ? 'y' : digit.toString();
        resultText.textContent = digit !== undefined ? displayValue : '—';

        // Анимация результата
        resultText.style.transition = 'all 0.5s ease';
        resultText.style.transform = 'scale(1.2)';
        resultText.style.color = '#38b2ac';

        setTimeout(() => {
            resultText.style.transform = 'scale(1)';
            resultText.style.color = '';
        }, 500);
    }
}

// Обработчик для поля ввода предполагаемой цифры
const expectedNumberInput = document.getElementById('expected-number');
if (expectedNumberInput) {
    expectedNumberInput.addEventListener('input', function (e) {
        const value = e.target.value;
        if (value && !/^[0-9]$/.test(value)) {
            e.target.value = value.slice(0, -1);
        }
    });

    expectedNumberInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            if (recognizeBtn) recognizeBtn.click();
        }
    });
}

// Основная функция распознавания
if (recognizeBtn) {
    recognizeBtn.addEventListener('click', async () => {
        try {
            const targetInput = document.getElementById('expected-number');
            let target = targetInput ? targetInput.value.trim() : null;
            target = target === '' ? null : target;

            if (target && !/^[0-9]$/.test(target)) {
                alert('Пожалуйста, введите цифру от 0 до 9');
                if (targetInput) targetInput.focus();
                return;
            }

            if (!drawingCtx) {
                alert('Холст не инициализирован');
                return;
            }

            // Проверяем, есть ли что-то нарисованное
            const imageData = drawingCtx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height);
            let hasContent = false;
            for (let i = 0; i < imageData.data.length; i += 4) {
                if (imageData.data[i] > 10 || imageData.data[i + 1] > 10 || imageData.data[i + 2] > 10) {
                    hasContent = true;
                    break;
                }
            }

            if (!hasContent) {
                alert('Пожалуйста, нарисуйте цифру перед распознаванием');
                return;
            }

            recognizeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Распознавание...';
            recognizeBtn.disabled = true;

            // Получаем нормализованное изображение
            const normalizedImage = preprocessImageForServer();

            let serverResults = null;

            try {
                // Отправляем запрос на сервер
                serverResults = await sendToServer(normalizedImage, target);
                console.log('Результаты с сервера:', serverResults);

                // Обрабатываем результаты с сервера
                const processedResults = processServerResults(serverResults);
                console.log('Обработанные результаты:', processedResults);

                const recognizedDigit = processedResults.digit;

                // Обновляем результат распознавания
                updateResultDisplay(recognizedDigit);

                // Сохраняем текущий рисунок
                currentDrawing = drawingCtx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height);

                // Создаем 3D анимацию
                create3DAnimation(recognizedDigit);

            } catch (serverError) {
                console.error('Ошибка сервера:', serverError);

                // Демонстрационный результат при ошибке
                const randomDigit = Math.floor(Math.random() * 11); // 0-10

                // Обновляем результат
                updateResultDisplay(randomDigit);

                // Создаем демо-вероятности (уже нормализованные к сумме 1)
                const demoProbabilities = {};
                let sum = 0;
                for (let i = 0; i < 11; i++) {
                    const value = i === randomDigit ?
                        (0.7 + Math.random() * 0.2) :
                        (Math.random() * 0.05);
                    demoProbabilities[i] = value;
                    sum += value;
                }

                // Нормализуем
                for (let i = 0; i < 11; i++) {
                    demoProbabilities[i] = demoProbabilities[i] / sum;
                }

                // Обновляем проценты схожести с демо-данными
                updateSimilarityPercentagesFromProbabilities(demoProbabilities, randomDigit);

                // Сохраняем текущий рисунок
                currentDrawing = drawingCtx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height);

                // Создаем 3D анимацию с демо-данными
                create3DAnimation(randomDigit);
                
                // Если случайно получилась 'y', устанавливаем флаг
                if (randomDigit === 10) {
                    pendingYNotification = true;
                }

                alert('Сервер недоступен. Показан демонстрационный результат.');
            }

        } catch (error) {
            console.error("Ошибка:", error);
            alert('Произошла ошибка при распознавании. Проверьте консоль для подробностей.');

            // Сбрасываем результат
            updateResultDisplay('—');

            // Сбрасываем проценты схожести
            const similarityGrid = document.getElementById('similarityGrid');
            if (similarityGrid) {
                similarityGrid.innerHTML = '';
                for (let i = 0; i < 11; i++) {
                    const displayDigit = i === 10 ? 'y' : i;
                    const similarityItem = document.createElement('div');
                    similarityItem.className = 'similarity-item';
                    similarityItem.innerHTML = `
                        <div class="similarity-digit" data-digit="${displayDigit}">${displayDigit}</div>
                        <div class="similarity-bar-container">
                            <div class="similarity-bar" style="width: 0%"></div>
                        </div>
                        <div class="similarity-percentage">0%</div>
                    `;
                    similarityGrid.appendChild(similarityItem);
                }
            }

        } finally {
            recognizeBtn.innerHTML = '<i class="fas fa-search"></i> Распознать';
            recognizeBtn.disabled = false;
        }
    });
}

// Обработка нажатия кнопки очистки
if (eraseBtn) {
    eraseBtn.addEventListener('click', () => {
        if (!drawingCanvas || !drawingCtx) return;

        drawingCanvas.style.animation = 'eraseAnimation 0.5s forwards';
        setTimeout(() => {
            const containerWidth = drawingCanvas.parentElement.offsetWidth;
            const containerHeight = drawingCanvas.parentElement.offsetHeight;
            drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
            drawingCtx.fillStyle = '#000';
            drawingCtx.fillRect(0, 0, containerWidth, containerHeight);
            drawingCanvas.style.animation = '';
            drawingPaths = [];
            updateResultDisplay('—');
            if (expectedNumberInput) expectedNumberInput.value = '';

            // Сбрасываем проценты схожести
            const similarityGrid = document.getElementById('similarityGrid');
            if (similarityGrid) {
                similarityGrid.innerHTML = '';
                for (let i = 0; i < 11; i++) {
                    const displayDigit = i === 10 ? 'y' : i;
                    const similarityItem = document.createElement('div');
                    similarityItem.className = 'similarity-item';
                    similarityItem.innerHTML = `
                        <div class="similarity-digit" data-digit="${displayDigit}">${displayDigit}</div>
                        <div class="similarity-bar-container">
                            <div class="similarity-bar" style="width: 0%"></div>
                        </div>
                        <div class="similarity-percentage">0%</div>
                    `;
                    similarityGrid.appendChild(similarityItem);
                }
            }
            
            // Закрываем уведомление если оно открыто
            closeUnrecognizedNotification();
            // Сбрасываем флаг ожидающего уведомления
            pendingYNotification = false;
        }, 500);
    });
}

// Восстановление холста при изменении видимости страницы
document.addEventListener('visibilitychange', function () {
    if (!document.hidden) {
        setTimeout(() => {
            if (currentDrawing) {
                drawingCtx.putImageData(currentDrawing, 0, 0);
            }
        }, 100);
    }
});

window.addEventListener('focus', function () {
    setTimeout(() => {
        if (currentDrawing) {
            drawingCtx.putImageData(currentDrawing, 0, 0);
        }
    }, 100);
});

// ====================== THREE.JS ФУНКЦИИ ======================

// Упрощенные easing-функции для производительности
const EasingFunctions = {
    linear: t => t,
    easeInQuad: t => t * t,
    easeOutQuad: t => t * (2 - t),
    easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeOutCubic: t => (--t) * t * t + 1,
    easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
};

// Three.js переменные
let scene, camera, renderer, cubes = [];
let cubeGroup, countersGroup, digitsGroup, animationInProgress = false;
let cubeStats = { empty: 0, high: 0 };
let counterPositions = {};
let controls;
let animationPhase = 0;
let animationTime = 0;
let recognizedDigit3D = '0';

// Конфигурация
const COUNTER_POSITIONS_CONFIG = {
    empty: { x: -8, y: -5, z: 5 },
    high: { x: 8, y: -5, z: 5 }
};

const DIGITS_POSITION_CONFIG = {
    xSpacing: 3.5,
    y: -8,
    z: 7
};

const STAGE_TEXTS = {
    init: "Инициализация анимации...",
    showCanvas: "Показ исходного изображения",
    prepare: "Подготовка к анализу",
    pixelize: "Разбивка на пиксели",
    analyze: "Анализ пикселей",
    sorting: "Сортировка пикселей по категориям",
    counting: "Подсчет результатов",
    result: "Результат распознавания: ",
    complete: "Анимация завершена. Управляйте камерой свободно."
};

const ANIMATION_CONFIG = {
    totalTime: 15000,
    cameraPosition: { x: 0, y: 0, z: 25 },
    cubeSize: 0.3,
    cubeSpacing: 0.1,
    gridSize: 28,
    parabolaHeight: 2,
    rotationSpeed: 0.08,
    batchSize: 40,
    batchDelay: 50,
    flightSpeed: 2.5
};

// Инициализация Three.js сцены
function initThreeJS() {
    const container = document.getElementById('threejs-container');
    if (!container) {
        console.error('Three.js container not found!');
        return;
    }

    // Очищаем контейнер
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    // Создаем сцену
    scene = new THREE.Scene();

    // Создаем градиентный фон
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');

    const gradient = context.createRadialGradient(256, 256, 0, 256, 256, 256);
    gradient.addColorStop(0, '#0a1929');
    gradient.addColorStop(0.7, '#0b1c2e');
    gradient.addColorStop(1, '#0d2337');

    context.fillStyle = gradient;
    context.fillRect(0, 0, 512, 512);

    for (let i = 0; i < 200; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const radius = Math.random() * 1.5;
        const alpha = Math.random() * 0.8 + 0.2;

        context.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    scene.background = texture;

    // Создаем камеру
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(
        ANIMATION_CONFIG.cameraPosition.x,
        ANIMATION_CONFIG.cameraPosition.y,
        ANIMATION_CONFIG.cameraPosition.z
    );

    // Создаем рендерер
    renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // OrbitControls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 5;
    controls.maxDistance = 50;
    controls.maxPolarAngle = Math.PI;
    controls.enabled = true;

    // Освещение
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(10, 10, 10);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-10, -5, 5);
    scene.add(directionalLight2);

    const pointLight = new THREE.PointLight(0x38b2ac, 0.5, 50);
    pointLight.position.set(0, 0, 15);
    scene.add(pointLight);

    // Создаем сетку на полу
    const gridHelper = new THREE.GridHelper(50, 50, 0x38b2ac, 0x1a3b5a);
    gridHelper.position.y = -10;
    scene.add(gridHelper);

    // Группы объектов
    cubeGroup = new THREE.Group();
    countersGroup = new THREE.Group();
    digitsGroup = new THREE.Group();

    scene.add(cubeGroup);
    scene.add(countersGroup);
    scene.add(digitsGroup);

    // Инициализируем позиции счетчиков
    counterPositions = {
        empty: new THREE.Vector3(
            COUNTER_POSITIONS_CONFIG.empty.x,
            COUNTER_POSITIONS_CONFIG.empty.y,
            COUNTER_POSITIONS_CONFIG.empty.z
        ),
        high: new THREE.Vector3(
            COUNTER_POSITIONS_CONFIG.high.x,
            COUNTER_POSITIONS_CONFIG.high.y,
            COUNTER_POSITIONS_CONFIG.high.z
        )
    };

    window.addEventListener('resize', () => {
        if (container && camera && renderer) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
    });
}

// Создание 3D счетчиков
function create3DCounters() {
    if (!countersGroup) return;

    while (countersGroup.children.length > 0) {
        countersGroup.remove(countersGroup.children[0]);
    }

    const counterTypes = [
        { type: 'empty', label: 'Черное', color: 0x111111 },
        { type: 'high', label: 'Белое', color: 0xffffff }
    ];

    counterTypes.forEach((counter) => {
        const position = counterPositions[counter.type];
        if (!position) return;

        // Текст типа куба
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 256;
        context.fillStyle = '#38b2ac';
        context.font = 'bold 60px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(counter.label, canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);
        const labelMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide
        });
        const labelGeometry = new THREE.PlaneGeometry(6, 3);
        const label = new THREE.Mesh(labelGeometry, labelMaterial);
        label.position.set(position.x, position.y + 3.5, position.z + 1);
        countersGroup.add(label);

        // Текст для счетчика
        const countCanvas = document.createElement('canvas');
        const countContext = countCanvas.getContext('2d');
        countCanvas.width = 256;
        countCanvas.height = 128;
        countContext.fillStyle = '#38b2ac';
        countContext.font = 'bold 80px Arial';
        countContext.textAlign = 'center';
        countContext.textBaseline = 'middle';
        countContext.fillText('0', countCanvas.width / 2, countCanvas.height / 2);

        const countTexture = new THREE.CanvasTexture(countCanvas);
        const countLabelMaterial = new THREE.MeshBasicMaterial({
            map: countTexture,
            transparent: true,
            side: THREE.DoubleSide
        });
        const countLabelGeometry = new THREE.PlaneGeometry(2, 1);
        const countLabel = new THREE.Mesh(countLabelGeometry, countLabelMaterial);
        countLabel.position.set(position.x, position.y + 1.5, position.z + 1);
        countLabel.userData = { type: counter.type, canvas: countCanvas, context: countContext };
        countersGroup.add(countLabel);
    });
}

// Обновление счетчиков
function updateCounters() {
    countersGroup.children.forEach(child => {
        if (child.userData && child.userData.canvas) {
            const type = child.userData.type;
            const count = cubeStats[type] || 0;

            child.userData.context.clearRect(0, 0, child.userData.canvas.width, child.userData.canvas.height);
            child.userData.context.fillStyle = '#38b2ac';
            child.userData.context.font = 'bold 80px Arial';
            child.userData.context.textAlign = 'center';
            child.userData.context.textBaseline = 'middle';
            child.userData.context.fillText(count.toString(), child.userData.canvas.width / 2, child.userData.canvas.height / 2);

            child.material.map.needsUpdate = true;
        }
    });
}

// Создание 3D кубиков
function create3DCubesFromImage() {
    if (!cubeGroup) return;

    while (cubeGroup.children.length > 0) {
        cubeGroup.remove(cubeGroup.children[0]);
    }
    cubes = [];
    cubeStats = { empty: 0, high: 0 };

    const gridSize = ANIMATION_CONFIG.gridSize;
    const spacing = ANIMATION_CONFIG.cubeSpacing;
    const cubeSize = ANIMATION_CONFIG.cubeSize;

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = gridSize;
    tempCanvas.height = gridSize;

    tempCtx.fillStyle = '#000';
    tempCtx.fillRect(0, 0, gridSize, gridSize);
    tempCtx.drawImage(drawingCanvas, 0, 0, gridSize, gridSize);
    applyImageEnhancementFor3D(tempCtx, gridSize, gridSize);

    const pixelData = tempCtx.getImageData(0, 0, gridSize, gridSize).data;

    const emptyMaterial = new THREE.MeshLambertMaterial({ color: 0x111111 });
    const highMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const idx = (y * gridSize + x) * 4;
            const r = pixelData[idx];
            const brightness = r;

            let material, cubeType;

            if (brightness > 100) {
                material = highMaterial;
                cubeType = 'high';
            } else {
                material = emptyMaterial;
                cubeType = 'empty';
            }

            const cube = new THREE.Mesh(cubeGeometry, material);
            cube.position.x = (x - gridSize / 2) * (cubeSize + spacing);
            cube.position.y = (gridSize / 2 - y) * (cubeSize + spacing);
            cube.position.z = 0;

            cube.userData = {
                originalPosition: cube.position.clone(),
                type: cubeType,
                targetPosition: counterPositions[cubeType].clone(),
                arrived: false,
                counted: false,
                alreadyCounted: false,
                batchIndex: Math.floor(Math.random() * 2),
                startTime: 0,
                brightness: brightness
            };

            cubeGroup.add(cube);
            cubes.push(cube);
        }
    }

    updateCounters();
}

// Запуск 3D анимации
function start3DAnimation(digit) {
    if (!scene || !camera || !renderer) {
        console.error('Three.js not initialized!');
        return;
    }

    recognizedDigit3D = digit;
    animationPhase = 0;
    animationTime = 0;
    const totalAnimationTime = ANIMATION_CONFIG.totalTime;

    create3DCounters();

    let currentBatch = 0;
    let batches = Array.from({ length: 2 }, (_, i) =>
        cubes.filter(cube => cube.userData.batchIndex === i)
    );

    function animate() {
        if (!animationInProgress) return;

        animationInProgress = requestAnimationFrame(animate);
        animationTime += 16;
        const progress = Math.min(animationTime / totalAnimationTime, 1);

        // Фаза 1: Показ исходного холста (0-10%)
        if (progress < 0.1) {
            animationPhase = 0;
            cubeGroup.visible = true;
            countersGroup.visible = false;
            digitsGroup.visible = false;
            updateStageIndicator(STAGE_TEXTS.showCanvas);
        }
        // Фаза 2: Пауза после показа холста (10-15%)
        else if (progress < 0.15) {
            if (animationPhase < 1) {
                animationPhase = 1;
                updateStageIndicator(STAGE_TEXTS.prepare);
            }
        }
        // Фаза 3: Разбивка на кубы (15-20%)
        else if (progress < 0.2) {
            if (animationPhase < 2) {
                animationPhase = 2;
                updateStageIndicator(STAGE_TEXTS.pixelize);
            }
        }
        // Фаза 4: Пауза после разбивки (20-25%)
        else if (progress < 0.25) {
            if (animationPhase < 3) {
                animationPhase = 3;
                updateStageIndicator(STAGE_TEXTS.analyze);
            }
        }
        // Фаза 5: Полет кубиков к счетчикам (25-70%)
        else if (progress < 0.7) {
            if (animationPhase < 4) {
                animationPhase = 4;
                countersGroup.visible = true;
                updateStageIndicator(STAGE_TEXTS.sorting);
            }

            const phaseProgress = (progress - 0.25) / 0.45;
            let cubesToCount = [];
            let arrivedCubes = 0;
            const activeBatches = Math.min(currentBatch + 1, batches.length);

            for (let i = 0; i < activeBatches; i++) {
                const batch = batches[i];
                const batchProgress = Math.min(phaseProgress * ANIMATION_CONFIG.flightSpeed - i * 0.2, 1);

                if (batchProgress > 0) {
                    batch.forEach(cube => {
                        if (!cube.userData.arrived) {
                            const startPos = cube.userData.originalPosition;
                            const endPos = cube.userData.targetPosition;
                            const easedProgress = EasingFunctions.easeInOutCubic(batchProgress);

                            if (easedProgress < 1) {
                                cube.position.lerpVectors(startPos, endPos, easedProgress);
                                const parabolaHeight = ANIMATION_CONFIG.parabolaHeight;
                                const parabola = 4 * parabolaHeight * easedProgress * (1 - easedProgress);
                                cube.position.y += parabola;
                                cube.rotation.x += ANIMATION_CONFIG.rotationSpeed;
                                cube.rotation.y += ANIMATION_CONFIG.rotationSpeed * 0.8;

                                if (easedProgress > 0.6 && !cube.userData.counted) {
                                    cube.userData.counted = true;
                                    cubesToCount.push(cube);
                                }
                            } else {
                                cube.userData.arrived = true;
                                cube.position.copy(endPos);
                                arrivedCubes++;
                            }
                        } else {
                            arrivedCubes++;
                        }
                    });
                }
            }

            if (phaseProgress > currentBatch * 0.2 && currentBatch < batches.length - 1) {
                currentBatch++;
            }

            if (cubesToCount.length > 0) {
                cubesToCount.forEach(cube => {
                    if (!cube.userData.alreadyCounted) {
                        cubeStats[cube.userData.type]++;
                        cube.userData.alreadyCounted = true;
                    }
                });
                updateCounters();
            }

            if (arrivedCubes > cubes.length * 0.9 && animationPhase === 4) {
                updateStageIndicator(STAGE_TEXTS.counting);
            }
        }
        // Фаза 6: Пауза после подсчета кубов (70-75%)
        else if (progress < 0.75) {
            if (animationPhase < 5) {
                animationPhase = 5;
                updateStageIndicator(STAGE_TEXTS.counting);
            }
        }
        // Фаза 7: Показ цифр (75-90%)
        else if (progress < 0.9) {
            if (animationPhase < 6) {
                animationPhase = 6;
                create3DDigits(recognizedDigit3D);
                digitsGroup.visible = true;
                // Обновляем текст с учетом цифры y
                const displayDigit = recognizedDigit3D === 10 ? 'y' : recognizedDigit3D;
                updateStageIndicator(STAGE_TEXTS.result + displayDigit);
            }
        }
        // Фаза 8: Финальная пауза (90-100%)
        else {
            if (animationPhase < 7) {
                animationPhase = 7;
                updateStageIndicator(STAGE_TEXTS.complete);
                controls.enabled = true;
            }
        }

        controls.update();
        renderer.render(scene, camera);
    }

    animationInProgress = requestAnimationFrame(animate);
}

// Создание 3D цифр
function create3DDigits(digit) {
    if (!digitsGroup) return;

    while (digitsGroup.children.length > 0) {
        digitsGroup.remove(digitsGroup.children[0]);
    }

    for (let i = 0; i < 11; i++) {
        const isHighlighted = i === parseInt(digit);

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 256;

        // Определяем отображаемую цифру (для 10 показываем 'y')
        const displayDigit = i === 10 ? 'y' : i.toString();

        context.fillStyle = '#666666';
        context.font = 'bold 160px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(displayDigit, canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);
        const digitMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide
        });
        const digitGeometry = new THREE.PlaneGeometry(3, 3);
        const digitMesh = new THREE.Mesh(digitGeometry, digitMaterial);

        digitMesh.position.set(
            (i - 4.5) * DIGITS_POSITION_CONFIG.xSpacing,
            DIGITS_POSITION_CONFIG.y,
            DIGITS_POSITION_CONFIG.z
        );

        digitMesh.userData = {
            digit: i,
            displayDigit: displayDigit,
            canvas: canvas,
            context: context,
            material: digitMaterial,
            isHighlighted: isHighlighted
        };

        digitsGroup.add(digitMesh);
    }

    // Подсветка распознанной цифры через 2 секунды
    setTimeout(() => {
        highlightRecognizedDigit(digit);
    }, 2000);
}

// Подсветка распознанной цифры
function highlightRecognizedDigit(digit) {
    digitsGroup.children.forEach(digitMesh => {
        const digitValue = digitMesh.userData.digit;
        const isHighlighted = digitValue === parseInt(digit);

        if (isHighlighted) {
            digitMesh.userData.context.clearRect(0, 0, digitMesh.userData.canvas.width, digitMesh.userData.canvas.height);
            digitMesh.userData.context.fillStyle = '#38b2ac';
            digitMesh.userData.context.font = 'bold 160px Arial';
            digitMesh.userData.context.textAlign = 'center';
            digitMesh.userData.context.textBaseline = 'middle';
            digitMesh.userData.context.fillText(digitMesh.userData.displayDigit, digitMesh.userData.canvas.width / 2, digitMesh.userData.canvas.height / 2);

            digitMesh.userData.material.map.needsUpdate = true;
        }
    });
}

// Функция для создания 3D анимации
function create3DAnimation(digit) {
    if (!animationModal) return;

    animationModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Даем время для отображения модального окна
    setTimeout(() => {
        initThreeJS();
        create3DCubesFromImage();
        start3DAnimation(digit);
    }, 100);
}

// ====================== ИНИЦИАЛИЗАЦИЯ ======================
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        if (drawingCanvas && drawingCtx) {
            setupCanvas();
            initTouchEvents();
            observeContainerResize();

            // Инициализируем проценты схожести с нулевыми значениями для 11 цифр (0-9 и y)
            const similarityGrid = document.getElementById('similarityGrid');
            if (similarityGrid) {
                similarityGrid.innerHTML = '';
                for (let i = 0; i < 11; i++) {
                    const displayDigit = i === 10 ? 'y' : i;
                    const similarityItem = document.createElement('div');
                    similarityItem.className = 'similarity-item';
                    similarityItem.innerHTML = `
                        <div class="similarity-digit" data-digit="${displayDigit}">${displayDigit}</div>
                        <div class="similarity-bar-container">
                            <div class="similarity-bar" style="width: 0%"></div>
                        </div>
                        <div class="similarity-percentage">0%</div>
                    `;
                    similarityGrid.appendChild(similarityItem);
                }
            }

            if (expectedNumberInput) expectedNumberInput.focus();

            console.log('Инициализация завершена с поддержкой y');
        }
    }, 100);
});

// Глобальные функции
window.getCurrentModel = function () {
    return currentModel;
};

window.setCurrentModel = function (model) {
    if (['CNN'].includes(model)) {
        currentModel = model;
    }
};
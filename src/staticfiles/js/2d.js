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

function showUnrecognizedNotification() {
    if (unrecognizedNotification) {
        unrecognizedNotification.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeUnrecognizedNotification() {
    if (unrecognizedNotification) {
        unrecognizedNotification.classList.remove('active');
    }
    document.body.style.overflow = '';
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

// ====================== Dropdown меню ======================
let currentModel = 'Perceptron';

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
                'Perceptron': 'fas fa-circle-nodes',
                'MLP': 'fas fa-network-wired'
            };

            const modelNames = {
                'Perceptron': 'Perceptron',
                'MLP': 'MLP'
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

// Управление модальным окном для подсказки
const helpModal = document.getElementById('helpModal');
const helpBtn = document.getElementById('helpBtn');
const modalClose = document.getElementById('modalClose');
const modalGotIt = document.getElementById('modalGotIt');

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

if (modalClose) {
    modalClose.addEventListener('click', closeHelpModal);
}

if (modalGotIt) {
    modalGotIt.addEventListener('click', closeHelpModal);
}

if (helpModal) {
    helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal) {
            closeHelpModal();
        }
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && helpModal && helpModal.classList.contains('active')) {
        closeHelpModal();
    }
});

// ====================== РАБОТА С ХОЛСТОМ ======================
const drawingCanvas = document.getElementById('drawing-canvas');
const resultCanvas = document.getElementById('result-canvas');
const drawingCtx = drawingCanvas.getContext('2d');
const resultCtx = resultCanvas.getContext('2d');
const recognizeBtn = document.getElementById('recognize-btn');
const eraseBtn = document.getElementById('erase-btn');

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let drawingPaths = [];
let currentDrawing = null;
let isTextSelected = false;

const NORMALIZED_SIZE = 28;

// Установка размеров холста
function setupCanvases() {
    const container = drawingCanvas.parentElement;
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    const oldContent = currentDrawing;

    // Устанавливаем размеры для canvas рисования
    drawingCanvas.width = containerWidth;
    drawingCanvas.height = containerHeight;
    drawingCanvas.style.width = containerWidth + 'px';
    drawingCanvas.style.height = containerHeight + 'px';

    // Устанавливаем размеры для canvas результата
    resultCanvas.width = containerWidth;
    resultCanvas.height = containerHeight;
    resultCanvas.style.width = containerWidth + 'px';
    resultCanvas.style.height = containerHeight + 'px';

    // Очищаем и заполняем холст рисования
    drawingCtx.fillStyle = '#000';
    drawingCtx.fillRect(0, 0, containerWidth, containerHeight);

    // Очищаем холст результата
    resultCtx.fillStyle = '#000';
    resultCtx.fillRect(0, 0, containerWidth, containerHeight);

    if (oldContent && oldContent.width > 0 && oldContent.height > 0) {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = oldContent.width;
        tempCanvas.height = oldContent.height;
        tempCtx.putImageData(oldContent, 0, 0);
        drawingCtx.drawImage(tempCanvas, 0, 0, oldContent.width, oldContent.height, 0, 0, containerWidth, containerHeight);
    }

    currentDrawing = drawingCtx.getImageData(0, 0, containerWidth, containerHeight);

    // Настройки рисования
    const baseLineWidth = Math.max(8, Math.min(20, containerWidth / 25));
    drawingCtx.lineWidth = baseLineWidth;
    drawingCtx.lineCap = 'round';
    drawingCtx.lineJoin = 'round';
    drawingCtx.strokeStyle = '#FFFFFF';
    drawingCtx.fillStyle = '#000';

    // Настройки для результата
    resultCtx.fillStyle = '#000';
    resultCtx.strokeStyle = '#38b2ac';
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

// Обработчики событий мыши
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

// Обработчики для сенсорных устройств
function initTouchEvents() {
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

    drawingCanvas.addEventListener('touchcancel', (e) => {
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

// Наблюдение за изменением размеров контейнера
function observeContainerResize() {
    const container = drawingCanvas.parentElement;

    if (typeof ResizeObserver !== 'undefined') {
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    setupCanvases();
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
        setupCanvases();
    }, 100);
}

// Функция для нормализации изображения
function normalizeImage() {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    tempCanvas.width = NORMALIZED_SIZE;
    tempCanvas.height = NORMALIZED_SIZE;

    tempCtx.fillStyle = '#000000';
    tempCtx.fillRect(0, 0, NORMALIZED_SIZE, NORMALIZED_SIZE);
    tempCtx.drawImage(drawingCanvas, 0, 0, NORMALIZED_SIZE, NORMALIZED_SIZE);

    // Улучшение контрастности
    applyImageEnhancement(tempCtx, NORMALIZED_SIZE, NORMALIZED_SIZE);

    // Сохраняем данные для анимации
    const imageDataUrl = tempCanvas.toDataURL('image/png');
    localStorage.setItem('drawingImageData', imageDataUrl);

    const imageData = tempCtx.getImageData(0, 0, NORMALIZED_SIZE, NORMALIZED_SIZE);
    localStorage.setItem('drawingPixelData', JSON.stringify(Array.from(imageData.data)));

    return imageDataUrl;
}

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

// ====================== ФУНКЦИИ ДЛЯ ОТПРАВКИ НА СЕРВЕР ======================

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

    // Фильтруем только цифры 0-9 и y 
    const filteredProbs = {};
    for (let i = 0; i < 11; i++) {
        const key = i.toString();
        if (probabilities.hasOwnProperty(key)) {
            const value = probabilities[key];
            // Если значение уже в процентах (больше 1), делим на 100
            filteredProbs[i] = value > 1 ? value / 100 : value;
        } else {
            filteredProbs[i] = 0;
        }
    }

    // Проверяем, нужно ли нормализовать
    const sum = Object.values(filteredProbs).reduce((a, b) => a + b, 0);

    if (Math.abs(sum - 1) < 0.01) { // Уже нормализовано (сумма ~1)
        return filteredProbs;
    } else if (Math.abs(sum - 100) < 1) { // Уже в процентах (сумма ~100)
        // Делим все на 100
        const normalized = {};
        for (let i = 0; i < 11; i++) {
            normalized[i] = filteredProbs[i] / 100;
        }
        return normalized;
    } else {
        // Нормализуем к сумме 1
        const normalized = {};
        for (let i = 0; i < 11; i++) {
            normalized[i] = filteredProbs[i] / sum;
        }
        return normalized;
    }
}

// Функция для вычисления процентов схожести из probabilities 
function calculateProbabilitiesFromProbabilities(probabilitiesObj) {
    console.log('Вычисление вероятностей из probabilities (включая y):', probabilitiesObj);

    // Нормализуем вероятности 
    const normalizedProbs = normalizeProbabilities(probabilitiesObj);

    if (!normalizedProbs) {
        console.error('Invalid probabilities structure:', probabilitiesObj);
        return null;
    }

    const probabilities = {};

    // Преобразуем в проценты (умножаем на 100) для всех 11 нейронов
    for (let i = 0; i < 11; i++) {
        probabilities[i] = normalizedProbs[i] * 100;
    }

    console.log('Расчитанные вероятности (включая y):', probabilities);
    return probabilities;
}

// Функция для определения распознанной цифры на основе probabilities 
function determineRecognizedDigitFromProbabilities(probabilitiesObj) {
    console.log('Определение цифры из probabilities (включая y):', probabilitiesObj);

    // Нормализуем вероятности
    const normalizedProbs = normalizeProbabilities(probabilitiesObj);

    if (!normalizedProbs || typeof normalizedProbs !== 'object') {
        console.error('Invalid probabilities for digit determination:', probabilitiesObj);
        return 1;
    }

    let maxIndex = 0;
    let maxProbability = -1;

    // Ищем максимальное значение среди всех 11 нейронов
    for (let i = 0; i < 11; i++) {
        const probability = normalizedProbs[i];
        if (probability > maxProbability) {
            maxProbability = probability;
            maxIndex = i;
        }
    }

    console.log('Определена цифра:', maxIndex, '(y если 10) с вероятностью:', maxProbability);
    return maxIndex;
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

    console.log('Predictions for display (включая y):', predictions);

    // Проверяем максимальное значение для масштабирования полос
    const maxConfidence = Math.max(...predictions.map(p => p.confidence));
    const scaleFactor = maxConfidence > 0 ? 100 / maxConfidence : 1;

    // Добавляем элементы для каждой цифры (0-9 и y)
    predictions.forEach((prediction, index) => {
        const similarityItem = document.createElement('div');
        similarityItem.className = 'similarity-item';
        similarityItem.style.opacity = '0';

        // Подсвечиваем распознанную цифру
        if (prediction.digit === recognizedDigit) {
            similarityItem.style.background = 'rgba(56, 178, 172, 0.3)';
            similarityItem.style.borderColor = 'var(--accent-light)';
        }

        // Добавляем атрибут data-digit для подсказки
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

    // Если распознанная цифра - 'y', показываем уведомление
    if (recognizedDigit === 10) {
        setTimeout(() => {
            showUnrecognizedNotification();
            autoCloseNotification();
        }, 1500);
    }
}

// Функция для показа результата распознавания 
function showRecognitionResult(digit) {
    // Очищаем canvas результата
    const containerWidth = resultCanvas.width;
    const containerHeight = resultCanvas.height;

    resultCtx.fillStyle = '#000';
    resultCtx.fillRect(0, 0, containerWidth, containerHeight);

    // Определяем отображаемый символ 
    const displayChar = digit === 10 ? 'y' : digit.toString();

    // Рисуем символ
    const fontSize = Math.min(containerWidth, containerHeight) * 0.6;
    resultCtx.font = `bold ${fontSize}px Arial`;
    resultCtx.fillStyle = '#38b2ac';
    resultCtx.textAlign = 'center';
    resultCtx.textBaseline = 'middle';

    resultCanvas.classList.add('digit-reveal');
    resultCtx.fillText(displayChar, containerWidth / 2, containerHeight / 2);

    // Убираем класс анимации после завершения
    setTimeout(() => {
        resultCanvas.classList.remove('digit-reveal');
    }, 2000);
}

// Функция для обработки результатов с сервера
function processServerResults(serverResult) {
    console.log('Обработка результата от сервера (включая y):', serverResult);

    if (!serverResult || !Array.isArray(serverResult) || serverResult.length === 0) {
        throw new Error('No valid server response data');
    }

    // Берем первый результат
    const result = serverResult[0];

    // Проверяем наличие поля probabilities
    if (!result.probabilities) {

        if (result.weights && result.weights.output) {
            // Конвертируем weights в probabilities для отображения на 2D странице
            console.log('Конвертация weights в probabilities для отображения (включая y)');
            const weights = result.weights.output[0];
            const probabilities = {};

            // Создаем probabilities для всех 11 нейронов
            for (let i = 0; i < 11; i++) {
                probabilities[i] = weights[i] || 0;
            }

            // Нормализуем probabilities
            const sum = Object.values(probabilities).reduce((a, b) => a + b, 0);
            if (sum > 0) {
                for (let i = 0; i < 11; i++) {
                    probabilities[i] = probabilities[i] / sum;
                }
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


    const animationData = {
        ...result,
        digit: recognizedDigit 
    };

    // Для MLP модели нужно убедиться, что есть веса скрытых слоев
    if (currentModel === 'MLP' && (!animationData.weights || !animationData.weights.hidden_layer_1)) {
        console.log('Создаем демо-веса для скрытых слоев MLP');

        // Создаем демо-веса для MLP анимации
        animationData.weights = animationData.weights || {};

        // Скрытый слой 1 (128 нейронов)
        if (!animationData.weights.hidden_layer_1) {
            animationData.weights.hidden_layer_1 = [];
            for (let i = 0; i < 128; i++) {
                animationData.weights.hidden_layer_1.push(Array.from({ length: 784 }, () => Math.random() * 2 - 1));
            }
        }

        // Скрытый слой 2 (128 нейронов)
        if (!animationData.weights.hidden_layer_2) {
            animationData.weights.hidden_layer_2 = [];
            for (let i = 0; i < 128; i++) {
                animationData.weights.hidden_layer_2.push(Array.from({ length: 128 }, () => Math.random() * 2 - 1));
            }
        }

        // Выходной слой (11 нейронов)
        if (!animationData.weights.output) {
            animationData.weights.output = [];
            for (let i = 0; i < 11; i++) {
                animationData.weights.output.push(Array.from({ length: 128 }, () => Math.random() * 2 - 1));
            }
        }
    }

    // Для Perceptron модели нужно убедиться, что есть выходные веса
    if (currentModel === 'Perceptron' && (!animationData.weights || !animationData.weights.output)) {
        console.log('Создаем демо-веса для выходного слоя Perceptron (включая y)');

        // Создаем выходные веса на основе probabilities
        animationData.weights = animationData.weights || {};

        if (!animationData.weights.output) {
            animationData.weights.output = [];
            const outputWeights = [];

            // Для всех 11 нейронов используем probabilities для весов
            for (let i = 0; i < 11; i++) {
                const prob = result.probabilities[i] || 0;
                // Масштабируем probability для визуального эффекта
                outputWeights.push(prob * 1000);
            }

            animationData.weights.output.push(outputWeights);
        }
    }

    console.log('Данные для анимации сохранены (включая y):', animationData);
    return animationData;
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
            recognizeBtn.click();
        }
    });
}

// Основная функция распознавания
if (recognizeBtn) {
    recognizeBtn.addEventListener('click', async () => {
        try {
            // Проверяем, выбрана ли модель
            if (!currentModel) {
                alert('Пожалуйста, выберите модель ИИ для распознавания');
                return;
            }

            const targetInput = document.getElementById('expected-number');
            let target = targetInput ? targetInput.value.trim() : null;
            target = target === '' ? null : target;

            if (target && !/^[0-9]$/.test(target)) {
                alert('Пожалуйста, введите цифру от 0 до 9');
                if (targetInput) targetInput.focus();
                return;
            }

            // Проверяем, есть ли рисунок
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

            const normalizedImage = normalizeImage();

            let serverResults = null;

            try {
                // Отправляем на сервер
                serverResults = await sendToServer(normalizedImage, target);
                console.log('Результаты с сервера:', serverResults);

                const processedResults = processServerResults(serverResults);
                console.log('Обработанные результаты:', processedResults);

                // Показываем результат 
                showRecognitionResult(processedResults.digit);

                // Сохраняем ВСЕ данные для анимации
                localStorage.setItem('mlpRecognitionData', JSON.stringify(processedResults));

                // Открываем страницу анимации в зависимости от модели
                if (currentModel === 'Perceptron') {
                    openPerceptronAnimationPage(processedResults);
                } else if (currentModel === 'MLP') {
                    openMlpAnimationPage(processedResults);
                }

            } catch (serverError) {
                console.error('Ошибка сервера:', serverError);

                // Создаем демонстрационный результат 
                const randomDigit = Math.floor(Math.random() * 11);  

                // Создаем демо-вероятности
                const demoProbabilities = {};
                let sum = 0;
                for (let i = 0; i < 11; i++) {
                    const value = i === randomDigit ?
                        (0.7 + Math.random() * 0.2) :
                        (Math.random() * 0.03);
                    demoProbabilities[i] = value;
                    sum += value;
                }

                // Нормализуем
                for (let i = 0; i < 11; i++) {
                    demoProbabilities[i] = demoProbabilities[i] / sum;
                }

                // Показываем результат 
                showRecognitionResult(randomDigit);

                // Обновляем проценты схожести 
                updateSimilarityPercentagesFromProbabilities(demoProbabilities, randomDigit);

                // Создаем полные демо-данные для анимации
                const demoData = {
                    digit: randomDigit,
                    probabilities: demoProbabilities,
                    model: currentModel
                };

                // Добавляем веса в зависимости от модели
                if (currentModel === 'Perceptron') {
                    demoData.weights = {
                        output: [[]]
                    };
                    // Создаем выходные веса на основе probabilities
                    for (let i = 0; i < 11; i++) {
                        demoData.weights.output[0].push(demoProbabilities[i] * 1000);
                    }
                } else if (currentModel === 'MLP') {
                    demoData.weights = {
                        hidden_layer_1: [],
                        hidden_layer_2: [],
                        output: [[]]
                    };

                    // Скрытый слой 1 (128 нейронов, каждый с 784 весами)
                    for (let i = 0; i < 128; i++) {
                        demoData.weights.hidden_layer_1.push(Array.from({ length: 784 }, () => Math.random() * 2 - 1));
                    }

                    // Скрытый слой 2 (128 нейронов, каждый с 128 весами)
                    for (let i = 0; i < 128; i++) {
                        demoData.weights.hidden_layer_2.push(Array.from({ length: 128 }, () => Math.random() * 2 - 1));
                    }

                    // Выходной слой (11 нейронов, каждый с 128 весами)
                    for (let i = 0; i < 11; i++) {
                        demoData.weights.output[0].push(Math.random() * 1000 - 500);
                    }
                }

                // Сохраняем для анимации
                localStorage.setItem('mlpRecognitionData', JSON.stringify(demoData));

                // Если случайно получилась 'y', показываем уведомление
                if (randomDigit === 10) {
                    setTimeout(() => {
                        showUnrecognizedNotification();
                        autoCloseNotification();
                    }, 1500);
                }

                alert('Сервер недоступен. Показан демонстрационный результат.');
            }

            // Сохраняем текущий рисунок
            currentDrawing = drawingCtx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height);

        } catch (error) {
            console.error("Ошибка:", error);
            alert('Произошла ошибка при распознавании. Проверьте консоль для подробностей.');

            // Сбрасываем результат
            resultCtx.fillStyle = '#000';
            resultCtx.fillRect(0, 0, resultCanvas.width, resultCanvas.height);

            // Сбрасываем проценты схожести
            const similarityGrid = document.getElementById('similarityGrid');
            if (similarityGrid) {
                similarityGrid.innerHTML = '';
            }

        } finally {
            recognizeBtn.innerHTML = '<i class="fas fa-search"></i> Распознать';
            recognizeBtn.disabled = false;
        }
    });
}

// Функция для открытия страницы анимации перцептрона
function openPerceptronAnimationPage(recognitionData) {
    // Сохраняем данные распознавания
    localStorage.setItem('mlpRecognitionData', JSON.stringify(recognitionData));

    // Сохраняем URL текущей страницы для возврата
    localStorage.setItem('sourcePageUrl', window.location.href);
    localStorage.setItem('sourcePageTimestamp', Date.now().toString());

    // Открываем анимацию в новом окне
    window.open('perceptron-animation', '_blank');
}

// Функция для открытия страницы MLP анимации
function openMlpAnimationPage(recognitionData) {
    // Сохраняем данные распознавания
    localStorage.setItem('mlpRecognitionData', JSON.stringify(recognitionData));

    // Сохраняем URL текущей страницы для возврата
    localStorage.setItem('sourcePageUrl', window.location.href);
    localStorage.setItem('sourcePageTimestamp', Date.now().toString());

    // Открываем анимацию в новом окне
    window.open('mlp-animation', '_blank');
}

// Обработка нажатия кнопки очистки
if (eraseBtn) {
    eraseBtn.addEventListener('click', () => {
        drawingCanvas.style.animation = 'eraseAnimation 0.5s forwards';

        setTimeout(() => {
            const containerWidth = drawingCanvas.parentElement.offsetWidth;
            const containerHeight = drawingCanvas.parentElement.offsetHeight;

            // Очищаем холст рисования
            drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
            drawingCtx.fillStyle = '#000';
            drawingCtx.fillRect(0, 0, containerWidth, containerHeight);

            // Очищаем холст результата
            resultCtx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);
            resultCtx.fillStyle = '#000';
            resultCtx.fillRect(0, 0, containerWidth, containerHeight);

            drawingCanvas.style.animation = '';
            drawingPaths = [];

            // Сбрасываем поле ввода
            if (expectedNumberInput) expectedNumberInput.value = '';

            // Сбрасываем проценты схожести
            const similarityGrid = document.getElementById('similarityGrid');
            if (similarityGrid) {
                similarityGrid.innerHTML = '';
            }

            // Очищаем данные изображения в localStorage
            localStorage.removeItem('drawingImageData');
            localStorage.removeItem('drawingPixelData');
            localStorage.removeItem('mlpRecognitionData');
            
            // Закрываем уведомление если оно открыто
            closeUnrecognizedNotification();
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

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        setupCanvases();
        initTouchEvents();
        observeContainerResize();

        const canvasContainers = document.querySelectorAll('.canvas-container');
        canvasContainers.forEach(container => {
            container.classList.add('canvas-appear');
        });

        if (expectedNumberInput) expectedNumberInput.focus();

        // Инициализируем проценты схожести с нулевыми значениями
        const similarityGrid = document.getElementById('similarityGrid');
        if (similarityGrid) {
            similarityGrid.innerHTML = '';
            // Добавляем элементы для 0-9 и y
            for (let i = 0; i <= 10; i++) {
                const similarityItem = document.createElement('div');
                similarityItem.className = 'similarity-item';
                const displayDigit = i === 10 ? 'y' : i;
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

        console.log('Инициализация завершена (поддержка y)');
    }, 100);
});

window.addEventListener('load', function () {
    setTimeout(() => {
        forceCanvasUpdate();
    }, 500);
});

// Функция для принудительного обновления canvas
function forceCanvasUpdate() {
    setupCanvases();
}

// Глобальные функции для работы с моделью
window.getCurrentModel = function () {
    return currentModel;
};

window.setCurrentModel = function (model) {
    if (['MLP', 'Perceptron'].includes(model)) {
        currentModel = model;
    }
};
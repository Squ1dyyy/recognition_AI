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

// ====================== УПРАВЛЕНИЕ УВЕДОМЛЕНИЕМ О НЕРАСПОЗНАННОЙ ЦИФРЕ (ТАКОЕ ЖЕ КАК В 2D ВЕРСИИ) ======================
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
                'MLP': 'fas fa-network-wired',
                'CNN': 'fas fa-brain'
            };

            const modelNames = {
                'Perceptron': 'Perceptron',
                'MLP': 'MLP',
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

// ====================== РАБОТА С ХОЛСТОМ ======================
const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');
const recognizeBtn = document.getElementById('recognize-btn');
const eraseBtn = document.getElementById('erase-btn');
const resultText = document.getElementById('result-text');
const expectedNumberInput = document.getElementById('expected-number');

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let drawingPaths = [];
let currentDrawing = null;
let isTextSelected = false;

const NORMALIZED_SIZE = 28;

// Установка размеров холста
function setupCanvas() {
    const container = canvas.parentElement;
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    const oldContent = currentDrawing;

    canvas.width = containerWidth;
    canvas.height = containerHeight;
    canvas.style.width = containerWidth + 'px';
    canvas.style.height = containerHeight + 'px';

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, containerWidth, containerHeight);

    if (oldContent && oldContent.width > 0 && oldContent.height > 0) {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = oldContent.width;
        tempCanvas.height = oldContent.height;
        tempCtx.putImageData(oldContent, 0, 0);
        ctx.drawImage(tempCanvas, 0, 0, oldContent.width, oldContent.height, 0, 0, containerWidth, containerHeight);
    }

    currentDrawing = ctx.getImageData(0, 0, containerWidth, containerHeight);
    const baseLineWidth = Math.max(8, Math.min(20, containerWidth / 25));
    ctx.lineWidth = baseLineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#FFFFFF';
    ctx.fillStyle = '#000';
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
    currentDrawing = ctx.getImageData(0, 0, canvas.width, canvas.height);
    drawingPaths.push([{ x, y }]);

    ctx.beginPath();
    ctx.arc(x, y, ctx.lineWidth / 2, 0, Math.PI * 2);
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fill();
}

function draw(x, y) {
    if (!isDrawing || isTextSelected) return;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    if (drawingPaths.length > 0) {
        drawingPaths[drawingPaths.length - 1].push({ x, y });
    }

    [lastX, lastY] = [x, y];
}

function stopDrawing() {
    isDrawing = false;
    currentDrawing = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

// Обработчики событий мыши
canvas.addEventListener('mousedown', (e) => {
    const pos = getMousePos(canvas, e);
    startDrawing(pos.x, pos.y);
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const pos = getMousePos(canvas, e);
    draw(pos.x, pos.y);
});

canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Обработчики для сенсорных устройств
function initTouchEvents() {
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const pos = getTouchPos(canvas, e);
        startDrawing(pos.x, pos.y);
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (!isDrawing) return;
        const pos = getTouchPos(canvas, e);
        draw(pos.x, pos.y);
    }, { passive: false });

    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        stopDrawing();
    }, { passive: false });

    canvas.addEventListener('touchcancel', (e) => {
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
    const container = canvas.parentElement;

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

// Функция для предобработки изображения перед отправкой на сервер
function preprocessImageForServer() {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    tempCanvas.width = NORMALIZED_SIZE;
    tempCanvas.height = NORMALIZED_SIZE;

    tempCtx.fillStyle = '#000000';
    tempCtx.fillRect(0, 0, NORMALIZED_SIZE, NORMALIZED_SIZE);
    tempCtx.drawImage(canvas, 0, 0, NORMALIZED_SIZE, NORMALIZED_SIZE);
    applyImageEnhancement(tempCtx, NORMALIZED_SIZE, NORMALIZED_SIZE);

    return tempCanvas.toDataURL('image/png');
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
        // Конвертируем y в 10 для сервера
        let serverTarget = target;
        if (serverTarget && (serverTarget.toLowerCase() === 'y')) {
            serverTarget = '10'; // Сервер ожидает 10 для y
        }

        const requestData = {
            image: imageData,
            models: [currentModel],
            target: serverTarget
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

    // Включаем 11 классов (0-9 и y)
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
    console.log('Вычисление вероятностей из probabilities:', probabilitiesObj);

    // Нормализуем вероятности (включая y)
    const normalizedProbs = normalizeProbabilities(probabilitiesObj);

    if (!normalizedProbs) {
        console.error('Invalid probabilities structure:', probabilitiesObj);
        return null;
    }

    const probabilities = {};

    // Преобразуем в проценты (умножаем на 100)
    for (let i = 0; i < 11; i++) {
        probabilities[i] = normalizedProbs[i] * 100;
    }

    console.log('Расчитанные вероятности (включая y):', probabilities);
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

    // Ищем максимальное значение среди цифр 0-10 (y = 10)
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

    // Создаем массив предсказаний для всех классов 
    const predictions = [];
    for (let digit in probabilities) {
        if (probabilities.hasOwnProperty(digit)) {
            const digitInt = parseInt(digit);
            const displayDigit = digitInt === 10 ? 'y' : digitInt.toString();
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

    // Добавляем элементы для каждого класса (включая y)
    predictions.forEach((prediction, index) => {
        const similarityItem = document.createElement('div');
        similarityItem.className = 'similarity-item';
        similarityItem.style.opacity = '0';

        // Подсвечиваем распознанную цифру 
        if (prediction.digit === recognizedDigit) {
            similarityItem.style.background = 'rgba(56, 178, 172, 0.3)';
            similarityItem.style.borderColor = 'var(--accent-light)';
        }

        // Используем data-digit для y как в 2D версии
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
            // Конвертируем weights в probabilities (включая 11-й класс)
            console.log('Конвертация weights в probabilities');
            const weights = result.weights.output[0];
            const probabilities = {};
            for (let i = 0; i < 11; i++) {
                probabilities[i] = weights[i] || 0;
            }
            result.probabilities = probabilities;
        } else {
            throw new Error('No probabilities field in server response');
        }
    }

    // Определяем цифру на основе probabilities (включая y)
    const recognizedDigit = determineRecognizedDigitFromProbabilities(result.probabilities);

    // Обновляем проценты схожести на основе probabilities (включая y)
    updateSimilarityPercentagesFromProbabilities(result.probabilities, recognizedDigit);

    return {
        ...result,
        digit: recognizedDigit // Устанавливаем вычисленную цифру
    };
}

// Обработчик для поля ввода предполагаемой цифры
if (expectedNumberInput) {
    expectedNumberInput.addEventListener('input', function (e) {
        const value = e.target.value.toLowerCase();
        if (value && !/^[0-9y]$/.test(value)) {
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
            let target = expectedNumberInput ? expectedNumberInput.value.trim().toLowerCase() : null;
            target = target === '' ? null : target;

            if (target && !/^[0-9y]$/.test(target)) {
                alert('Пожалуйста, введите цифру от 0 до 9 или y');
                if (expectedNumberInput) expectedNumberInput.focus();
                return;
            }

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
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

            const normalizedImage = preprocessImageForServer();

            let serverResults = null;

            try {
                serverResults = await sendToServer(normalizedImage, target);
                console.log('Результаты с сервера:', serverResults);

                const processedResults = processServerResults(serverResults);
                console.log('Обработанные результаты:', processedResults);

                const recognizedDigit = processedResults.digit;

                // Определяем, как отображать результат
                let displayResult;
                let resultColor;
                if (recognizedDigit === 10) {
                    displayResult = 'y';
                    resultColor = '#ff6b6b'; 
                    // Показываем всплывающее окно о неопознанной цифре 
                    setTimeout(() => {
                        showUnrecognizedNotification();
                        autoCloseNotification();
                    }, 1500);
                } else {
                    displayResult = recognizedDigit;
                    resultColor = '#38b2ac';
                }

                // Обновляем результат распознавания
                resultText.textContent = displayResult;
                resultText.style.transition = 'all 0.5s ease';
                resultText.style.color = resultColor;
                resultText.style.transform = 'scale(1.2)';

                setTimeout(() => {
                    resultText.style.transform = 'scale(1)';
                }, 500);

                // Сохраняем данные для анимаций
                localStorage.setItem('mlpRecognitionData', JSON.stringify(processedResults));
                localStorage.setItem('drawingImageData', normalizedImage);
                localStorage.setItem('sourcePageUrl', window.location.href);
                localStorage.setItem('sourcePageTimestamp', Date.now().toString());

                // Сохраняем текущий рисунок
                currentDrawing = ctx.getImageData(0, 0, canvas.width, canvas.height);

            } catch (serverError) {
                console.error('Ошибка сервера:', serverError);

                // Демонстрационный результат при ошибке 
                const randomDigit = Math.floor(Math.random() * 11);
                let displayResult;
                let resultColor;
                if (randomDigit === 10) {
                    displayResult = 'y';
                    resultColor = '#ff6b6b';
                } else {
                    displayResult = randomDigit;
                    resultColor = '#ff6b6b'; // Красный для демо-результата
                }

                resultText.textContent = displayResult;

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

                // Обновляем проценты схожести с демо-данными (включая y)
                updateSimilarityPercentagesFromProbabilities(demoProbabilities, randomDigit);

                // Анимация результата
                resultText.style.transition = 'all 0.5s ease';
                resultText.style.transform = 'scale(1.2)';
                resultText.style.color = resultColor;

                setTimeout(() => {
                    resultText.style.transform = 'scale(1)';
                }, 500);

                // Сохраняем текущий рисунок
                currentDrawing = ctx.getImageData(0, 0, canvas.width, canvas.height);

                // Если случайно получилась 'y', показываем уведомление 
                if (randomDigit === 10) {
                    setTimeout(() => {
                        showUnrecognizedNotification();
                        autoCloseNotification();
                    }, 1500);
                }

                alert('Сервер недоступен. Показан демонстрационный результат.');
            }

        } catch (error) {
            console.error("Ошибка:", error);
            alert('Произошла ошибка при распознавании. Проверьте консоль для подробностей.');

            // Сбрасываем результат
            resultText.textContent = '—';
            resultText.style.color = '';

            // Сбрасываем проценты схожести
            const similarityGrid = document.getElementById('similarityGrid');
            if (similarityGrid) {
                similarityGrid.innerHTML = '';
                // Добавляем 11 классов (0-9 и y) 
                for (let i = 0; i < 11; i++) {
                    const similarityItem = document.createElement('div');
                    similarityItem.className = 'similarity-item';
                    const displayDigit = i === 10 ? 'y' : i.toString();
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
        canvas.style.animation = 'eraseAnimation 0.5s forwards';
        setTimeout(() => {
            const containerWidth = canvas.parentElement.offsetWidth;
            const containerHeight = canvas.parentElement.offsetHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, containerWidth, containerHeight);
            canvas.style.animation = '';
            drawingPaths = [];
            if (expectedNumberInput) expectedNumberInput.value = '';

            // Сбрасываем проценты схожести
            const similarityGrid = document.getElementById('similarityGrid');
            if (similarityGrid) {
                similarityGrid.innerHTML = '';
                // Инициализируем с нулевыми значениями (включая y)
                for (let i = 0; i < 11; i++) {
                    const similarityItem = document.createElement('div');
                    similarityItem.className = 'similarity-item';
                    const displayDigit = i === 10 ? 'y' : i.toString();
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

            // Сбрасываем результат
            resultText.textContent = '—';
            resultText.style.color = '';

            // Закрываем уведомление если оно открыто
            closeUnrecognizedNotification();
            
            // Очищаем данные в localStorage
            localStorage.removeItem('drawingImageData');
            localStorage.removeItem('mlpRecognitionData');
        }, 500);
    });
}

// Восстановление холста при изменении видимости страницы
document.addEventListener('visibilitychange', function () {
    if (!document.hidden) {
        setTimeout(() => {
            if (currentDrawing) {
                ctx.putImageData(currentDrawing, 0, 0);
            }
        }, 100);
    }
});

window.addEventListener('focus', function () {
    setTimeout(() => {
        if (currentDrawing) {
            ctx.putImageData(currentDrawing, 0, 0);
        }
    }, 100);
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        setupCanvas();
        initTouchEvents();
        observeContainerResize();

        const canvasContainer = document.querySelector('.canvas-container');
        canvasContainer.classList.add('canvas-appear');

        if (expectedNumberInput) expectedNumberInput.focus();

        // Инициализируем проценты схожести с нулевыми значениями (включая y с data-digit)
        const similarityGrid = document.getElementById('similarityGrid');
        if (similarityGrid) {
            similarityGrid.innerHTML = '';
            // Добавляем 11 классов (0-9 и y) с правильным data-digit для y
            for (let i = 0; i < 11; i++) {
                const similarityItem = document.createElement('div');
                similarityItem.className = 'similarity-item';
                const displayDigit = i === 10 ? 'y' : i.toString();
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

        console.log('Инициализация текстовой версии завершена (с поддержкой y и уведомлением как в 2D версии)');
    }, 100);
});

window.addEventListener('load', function () {
    setTimeout(() => {
        forceCanvasUpdate();
    }, 500);
});

// Функция для принудительного обновления canvas
function forceCanvasUpdate() {
    setupCanvas();
}

// Глобальные функции для работы с моделью
window.getCurrentModel = function () {
    return currentModel;
};

window.setCurrentModel = function (model) {
    if (['CNN', 'MLP', 'Perceptron'].includes(model)) {
        currentModel = model;
    }
};
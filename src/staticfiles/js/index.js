// ======================== ГЛОБАЛЬНЫЕ ФУНКЦИИ ========================

// Проверка и создание stateManager
if (typeof window.stateManager === 'undefined') {
    console.log('StateManager не найден, требуется загрузка state-manager.js');
}

// ======================== УПРАВЛЕНИЕ ТЕМОЙ ========================

const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle?.querySelector('i');

function updateThemeIcon() {
    if (themeIcon) {
        if (document.body.classList.contains('light-theme')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
        console.log('Иконка темы обновлена');
    }
}

if (themeToggle && themeIcon) {
    // Переключение между темами
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        updateThemeIcon();
        document.dispatchEvent(new CustomEvent('themeChanged'));
        console.log('Тема переключена');
    });
}

// ======================== УПРАВЛЕНИЕ МУЗЫКОЙ ========================

function updateMusicIcon() {
    const musicToggle = document.getElementById('musicToggle');
    const youtubePlayer = document.getElementById('youtubePlayer');
    
    if (!musicToggle || !youtubePlayer) {
        console.warn('Элементы музыки не найдены');
        return;
    }
    
    const isPlaying = !youtubePlayer.classList.contains('hidden');
    if (isPlaying) {
        musicToggle.classList.add('playing');
        musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
        console.log('Иконка музыки: воспроизведение');
    } else {
        musicToggle.classList.remove('playing');
        musicToggle.innerHTML = '<i class="fas fa-music"></i>';
        console.log('Иконка музыки: пауза');
    }
}

function toggleMusic() {
    const youtubePlayer = document.getElementById('youtubePlayer');
    const youtubeIframe = document.querySelector('.youtube-iframe');
    
    if (!youtubePlayer || !youtubeIframe) {
        console.warn('Плеер YouTube не найден');
        return;
    }
    
    const isHidden = youtubePlayer.classList.contains('hidden');
    
    if (isHidden) {
        // Включаем музыку
        youtubePlayer.classList.remove('hidden');
        console.log('Музыка включена');
        
        // Пытаемся запустить воспроизведение
        try {
            const currentSrc = youtubeIframe.src;
            const baseUrl = currentSrc.split('?')[0];
            youtubeIframe.src = `${baseUrl}?rel=0&modestbranding=1&autoplay=1`;
        } catch (e) {
            console.warn('Не удалось запустить воспроизведение:', e);
        }
    } else {
        // Выключаем музыку
        youtubePlayer.classList.add('hidden');
        console.log('Музыка выключена');
        
        // Пытаемся остановить воспроизведение
        try {
            const currentSrc = youtubeIframe.src;
            if (currentSrc.includes('autoplay=1')) {
                youtubeIframe.src = currentSrc.replace('autoplay=1', 'autoplay=0');
            }
        } catch (e) {
            console.warn('Не удалось остановить воспроизведение:', e);
        }
    }
    
    updateMusicIcon();
    document.dispatchEvent(new CustomEvent('musicStateChanged'));
}

// Инициализация элементов музыки
const musicToggle = document.getElementById('musicToggle');
const youtubePlayer = document.getElementById('youtubePlayer');
const closePlayer = document.getElementById('closePlayer');
const youtubeIframe = document.querySelector('.youtube-iframe');

if (musicToggle && youtubePlayer && closePlayer) {
    // Переключение музыки
    musicToggle.addEventListener('click', toggleMusic);

    // Закрытие плеера
    closePlayer.addEventListener('click', () => {
        youtubePlayer.classList.add('hidden');
        updateMusicIcon();
        document.dispatchEvent(new CustomEvent('musicStateChanged'));
        console.log('YouTube плеер закрыт');
    });
}

// ======================== УПРАВЛЕНИЕ МЕНЮ ========================

const dropdownBtn = document.getElementById('dropdownBtn');
if (dropdownBtn) {
    dropdownBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        const dropdownContent = document.getElementById('dropdownContent');
        const isShowing = dropdownContent.classList.contains('show');

        closeAllDropdowns();

        if (!isShowing) {
            dropdownContent.classList.add('show');
            this.classList.add('active');
            console.log('Выпадающее меню открыто');
        } else {
            dropdownContent.classList.remove('show');
            this.classList.remove('active');
            console.log('Выпадающее меню закрыто');
        }
    });
}

// Отображение боковой панели на мобильных устройствах
const menuToggle = document.getElementById('menuToggle');
if (menuToggle) {
    menuToggle.addEventListener('click', function () {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.toggle('show');
            const icon = this.querySelector('i');
            if (sidebar.classList.contains('show')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                console.log('Боковая панель открыта');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                console.log('Боковая панель закрыта');
            }
        }
    });
}

// Функция для закрытия всех выпадающих меню
function closeAllDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown-content');
    const dropdownBtns = document.querySelectorAll('.dropdown-btn');
    
    dropdowns.forEach(dropdown => {
        dropdown.classList.remove('show');
    });
    
    dropdownBtns.forEach(btn => {
        btn.classList.remove('active');
    });
}

// Скрытие меню при клике вне области
document.addEventListener('click', function (event) {
    if (!event.target.matches('.dropdown-btn') && !event.target.closest('.dropdown-content')) {
        closeAllDropdowns();
    }
    
    // Закрытие боковой панели при клике вне на мобильных
    if (window.innerWidth < 992) {
        const sidebar = document.getElementById('sidebar');
        const menuToggle = document.getElementById('menuToggle');
        if (sidebar && !event.target.closest('.sidebar') && !event.target.closest('.menu-toggle')) {
            sidebar.classList.remove('show');
            if (menuToggle) {
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    }
});

// Обработка ресайза окна
window.addEventListener('resize', function() {
    if (window.innerWidth >= 992) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.remove('show');
        }
        const menuToggle = document.getElementById('menuToggle');
        if (menuToggle) {
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
        console.log('Ресайз: закрыта боковая панель для десктопа');
    }
});

// ======================== ОПРОСНИК ========================

function initSurvey() {
    console.log('=== ИНИЦИАЛИЗАЦИЯ ОПРОСНИКА ===');
    
    const surveyIcon = document.getElementById('surveyIcon');
    const surveyModal = document.getElementById('surveyModal');
    const surveyContent = document.getElementById('surveyContent');
    
    if (!surveyIcon || !surveyModal || !surveyContent) {
        console.error('❌ Элементы опросника не найдены!');
        return;
    }
    
    console.log('✅ Элементы опросника найдены');
    
    // Проверяем, не завершен ли уже опрос
    if (window.stateManager && window.stateManager.isSurveyCompleted()) {
        console.log('📋 Опрос уже завершен, скрываем иконку');
        surveyIcon.classList.add('hidden');
        return;
    }
    
    let currentQuestion = 0;
    let answers = [];
    let surveyCompleted = false;

    // Вопросы для опросника
    const questions = [
        {
            question: "Насколько вам интересна тема виды ИИ для распознания цифр?",
            options: ["Очень интересна", "Интересна", "Нейтрально", "Не очень интересна", "Совсем не интересна"],
            stats: [70, 12, 13, 3, 2]
        },
        {
            question: "Как вы оцениваете свой уровень знаний в области нейронных сетей?",
            options: ["Эксперт", "Продвинутый", "Средний", "Начинающий", "Новичок"],
            stats: [5, 15, 35, 30, 15]
        },
        {
            question: "Как оцениваете работу Евгения Березницкого?",
            options: ["Идеально", "Хорошо", "Нормально", "Плохо", "Отвратительно"],
            stats: [1116, 24, 40, 20, 10]
        },
        {
            question: "Насколько полезным для вас был материал на этом сайте?",
            options: ["Очень полезен", "Полезен", "Нейтрально", "Не очень полезен", "Бесполезен"],
            stats: [40, 35, 15, 7, 3]
        },
        {
            question: "Как вы оцените работу студентов",
            options: ["Идеально", "Хорошо", "Нормально", "Плохо", "Не справились"],
            stats: [199, 1, 0, 0, 0]
        }
    ];

    // Скрываем иконку изначально
    surveyIcon.classList.add('hidden');
    
    // Показываем иконку через 30 секунд для тестирования
    setTimeout(() => {
        if (window.stateManager && !window.stateManager.isSurveyCompleted() && !surveyCompleted) {
            console.log('🕒 Показываем иконку опросника');
            surveyIcon.classList.remove('hidden');
            surveyIcon.style.animation = 'pulse 2s infinite';
        }
    }, 30000);

    // Открытие опросника
    surveyIcon.addEventListener('click', () => {
        console.log('🎯 Открытие опросника');
        surveyModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        showQuestion(0);
    });

    // Закрытие опросника при клике вне области
    surveyModal.addEventListener('click', (e) => {
        if (e.target === surveyModal) {
            closeSurvey();
        }
    });

    // Закрытие по ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && surveyModal.classList.contains('active')) {
            closeSurvey();
        }
    });

    // Навигация по вопросам
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressBar = document.getElementById('surveyProgress');

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentQuestion > 0) {
                currentQuestion--;
                showQuestion(currentQuestion);
                console.log('⬅️ Переход к предыдущему вопросу:', currentQuestion);
            }
        });

        nextBtn.addEventListener('click', () => {
            // Проверяем, есть ли ответ на текущий вопрос
            if (answers[currentQuestion] === undefined) {
                alert('Пожалуйста, выберите ответ на текущий вопрос');
                return;
            }
            
            if (currentQuestion < questions.length - 1) {
                currentQuestion++;
                showQuestion(currentQuestion);
                console.log('➡️ Переход к следующему вопросу:', currentQuestion);
            } else {
                completeSurvey();
            }
        });
    }

    function showQuestion(index) {
        const question = questions[index];
        
        // Обновляем прогресс
        if (progressBar) {
            const progress = ((index + 1) / questions.length) * 100;
            progressBar.style.width = `${progress}%`;
        }
        
        // Обновляем кнопки навигации
        if (prevBtn) prevBtn.disabled = index === 0;
        if (nextBtn) {
            nextBtn.textContent = index === questions.length - 1 ? 'Завершить' : 'Далее';
        }
        
        // Генерируем HTML для вопроса
        let html = `
            <div class="survey-question">
                <h3>${question.question}</h3>
                <div class="survey-options">
        `;
        
        // Добавляем варианты ответа
        question.options.forEach((option, i) => {
            const isSelected = answers[index] === i;
            html += `
                <div class="survey-option ${isSelected ? 'selected' : ''}" data-index="${i}">
                    ${option}
                </div>
            `;
        });
        
        html += '</div>';
        
        // Показываем статистику если есть ответ
        if (answers[index] !== undefined) {
            html += `
                <div class="survey-stats">
                    <p>Другие пользователи ответили так:</p>
                    <div class="stats-bars">
            `;
            
            question.stats.forEach((stat, i) => {
                const isUserAnswer = answers[index] === i;
                const barWidth = Math.max(stat, 5);
                html += `
                    <div class="stat-bar ${isUserAnswer ? 'user-answer' : ''}" style="width: ${barWidth}%">
                        <span>${stat}%</span>
                    </div>
                `;
            });
            
            html += '</div></div>';
        }
        
        html += '</div>';
        surveyContent.innerHTML = html;
        
        // Добавляем обработчики кликов на варианты ответа
        document.querySelectorAll('.survey-option').forEach(option => {
            option.addEventListener('click', () => {
                const selectedIndex = parseInt(option.getAttribute('data-index'));
                answers[index] = selectedIndex;
                
                // Снимаем выделение со всех вариантов
                document.querySelectorAll('.survey-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // Выделяем выбранный вариант
                option.classList.add('selected');
                
                console.log(`📝 Ответ на вопрос ${index + 1}: ${selectedIndex}`);
                
                // Показываем статистику
                showQuestion(index);
            });
        });
    }

    function completeSurvey() {
        console.log('✅ Завершение опроса', answers);
        surveyCompleted = true;
        
        // Сохраняем результат через StateManager
        if (window.stateManager) {
            window.stateManager.setSurveyCompleted(answers);
        }
        
        // Показываем сообщение о завершении
        surveyContent.innerHTML = `
            <div class="survey-completion">
                <h3>🎉 Спасибо за участие в опросе!</h3>
                <p>Ваши ответы помогут нам улучшить контент сайта.</p>
                <div class="completion-icon" style="font-size: 3rem; color: var(--accent-light); margin: 20px 0;">
                    <i class="fas fa-check-circle"></i>
                </div>
                <p><small>Иконка опросника больше не будет появляться на этом устройстве.</small></p>
            </div>
        `;
        
        // Обновляем кнопки
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) {
            nextBtn.textContent = 'Закрыть';
            nextBtn.onclick = closeSurvey;
        }
        
        // Обновляем прогресс
        if (progressBar) progressBar.style.width = '100%';
        
        console.log('🏆 Опрос успешно завершен!');
    }

    function closeSurvey() {
        console.log('❌ Закрытие опросника');
        surveyModal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Если опрос завершен, скрываем иконку
        if (surveyCompleted) {
            surveyIcon.classList.add('hidden');
            surveyIcon.style.animation = 'none';
            console.log('📭 Иконка опросника скрыта');
        } else {
            // Если не завершен, сбрасываем состояние
            currentQuestion = 0;
            answers = [];
            showQuestion(0);
            
            if (prevBtn) {
                prevBtn.style.display = 'block';
                prevBtn.disabled = true;
            }
            if (nextBtn) {
                nextBtn.textContent = 'Далее';
                nextBtn.onclick = null;
            }
            if (progressBar) progressBar.style.width = '20%';
            
            console.log('🔄 Опросник сброшен к началу');
        }
    }
}

// ======================== ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ ========================

// Подсветка текущей страницы в сайдбаре
function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop();
    const menuItems = document.querySelectorAll('.submenu-item');
    
    console.log('Текущая страница:', currentPage);
    
    menuItems.forEach(item => {
        item.classList.remove('active');
        
        if (item.getAttribute('href') === currentPage) {
            item.classList.add('active');
            console.log('Активная страница:', item.textContent);
        }
    });
}

// Инициализация навигации для welcome-section
function initWelcomeSection() {
    const theoryLinks = document.querySelectorAll('.theory-link');
    theoryLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetHref = this.getAttribute('href');
            if (targetHref && targetHref !== '#') {
                window.location.href = targetHref;
            }
        });
    });

    const navigationPromoLinks = document.querySelectorAll('.navigation-promo a');
    navigationPromoLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetHref = this.getAttribute('href');
            if (targetHref && targetHref !== '#') {
                window.location.href = targetHref;
            }
        });
    });
    
    console.log('Welcome section инициализирована');
}

// Управление анимациями и взаимодействиями
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .advantage-card, .app-card, .era-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    console.log('Анимации инициализированы');
}

// Инициализация интерактивных элементов
function initInteractiveElements() {
    document.querySelectorAll('.app-card').forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    console.log('Интерактивные элементы инициализированы');
}

// Функция для обновления индикатора загрузки
function showLoadingIndicator() {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.innerHTML = `
            <div class="loading-indicator">
                <div class="spinner"></div>
                <p>Загрузка...</p>
            </div>
        `;
    }
}

// Функция для показа сообщения об ошибке
function showError(message) {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Ошибка загрузки</h3>
                <p>${message}</p>
                <button onclick="window.location.href='index.html'" class="nav-btn">
                    <i class="fas fa-arrow-left"></i> На главную
                </button>
            </div>
        `;
    }
}

// Глобальные функции для навигации
window.navigateToSection = function(sectionId) {
    const sectionMap = {
        'ml-section': 'section-ml.html',
        'section1-1': 'section-history.html',
        'section1-2': 'section-paradigms.html',
        'section1-3': 'section-blackbox.html',
        'section1-4': 'section-research.html',
        'section2-1': 'section-perceptron.html',
        'section2-2': 'section-mlp.html',
        'section2-3': 'section-cnn.html',
        'section2-4': 'section-components.html',
        'section2-5': 'section-activation.html',
        'section3-1': 'section-gradient.html',
        'section3-2': 'section-supervised.html',
        'section3-3': 'section-backpropagation.html'
    };

    const targetPage = sectionMap[sectionId];
    if (targetPage) {
        window.location.href = targetPage;
        console.log('Навигация к разделу:', targetPage);
    }
};

// Функция для плавного скролла к элементам
window.smoothScrollTo = function(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        console.log('Прокрутка к элементу:', elementId);
    }
};

// ======================== ОБРАБОТЧИКИ СОБЫТИЙ ========================

document.addEventListener('keydown', function(e) {
    // Ctrl + / для поиска
    if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        console.log('Поиск активирован');
    }
    
    // Escape для закрытия модальных окон
    if (e.key === 'Escape') {
        closeAllDropdowns();
        const sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.classList.remove('show');
        
        const surveyModal = document.getElementById('surveyModal');
        if (surveyModal) surveyModal.classList.remove('active');
        
        const youtubePlayer = document.getElementById('youtubePlayer');
        if (youtubePlayer) {
            youtubePlayer.classList.add('hidden');
            updateMusicIcon();
        }
        
        console.log('Все модальные окна закрыты (ESC)');
    }
});

// ======================== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ ========================

document.addEventListener('DOMContentLoaded', function () {
    console.log('=== DOM ЗАГРУЖЕН ===');
    
    // Проверяем stateManager
    if (typeof window.stateManager === 'undefined') {
        console.error('⚠️ StateManager не инициализирован! Проверьте загрузку state-manager.js');
    } else {
        console.log('✅ StateManager готов');
    }
    
    // Инициализируем подсветку текущей страницы
    highlightCurrentPage();
    
    // Инициализируем опросник
    initSurvey();
    
    // Инициализируем welcome-section если мы на главной странице
    if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
        initWelcomeSection();
    }
    
    // Инициализируем анимации
    initAnimations();
    
    // Инициализируем интерактивные элементы
    initInteractiveElements();
    
    // Восстанавливаем состояние прокрутки если есть
    const savedScroll = sessionStorage.getItem('scrollPosition');
    if (savedScroll) {
        setTimeout(() => {
            window.scrollTo(0, parseInt(savedScroll));
            sessionStorage.removeItem('scrollPosition');
            console.log('Позиция прокрутки восстановлена');
        }, 100);
    }
    
    // Обновляем иконки после загрузки
    setTimeout(() => {
        updateThemeIcon();
        updateMusicIcon();
        console.log('Иконки обновлены');
    }, 500);
    
    console.log('✅ Все модули инициализированы успешно');
});

// Сохранение позиции прокрутки перед переходом
window.addEventListener('beforeunload', function() {
    sessionStorage.setItem('scrollPosition', window.pageYOffset.toString());
});

// ======================== ГЛОБАЛЬНЫЕ УТИЛИТЫ ========================

window.debugState = function() {
    console.log('=== ОТЛАДКА СОСТОЯНИЯ ===');
    console.log('Текущее состояние:', window.stateManager ? window.stateManager.state : 'StateManager не доступен');
    console.log('Опрос завершен:', window.stateManager ? window.stateManager.isSurveyCompleted() : 'N/A');
    console.log('YouTube плеер:', document.getElementById('youtubePlayer') ? 'найден' : 'не найден');
    console.log('Иконка опросника:', document.getElementById('surveyIcon') ? 'найдена' : 'не найдена');
};

window.resetSurvey = function() {
    if (window.stateManager) {
        window.stateManager.resetSurvey();
        const surveyIcon = document.getElementById('surveyIcon');
        if (surveyIcon) {
            surveyIcon.classList.remove('hidden');
            surveyIcon.style.animation = 'pulse 2s infinite';
        }
        console.log('Опрос сброшен! Иконка показана.');
        alert('Опрос сброшен! Иконка опросника появится через 30 секунд.');
    } else {
        console.error('StateManager не доступен для сброса опроса');
    }
};

// Автоматическое обновление года в футере
function updateFooterYear() {
    const footerYear = document.getElementById('footer-year');
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
        console.log('Год в футере обновлен:', footerYear.textContent);
    }
}

// Инициализация аналитики
function initAnalytics() {
    const pageView = {
        page: window.location.pathname,
        timestamp: new Date().toISOString(),
        referrer: document.referrer
    };
    
    const analytics = JSON.parse(localStorage.getItem('analytics') || '[]');
    analytics.push(pageView);
    localStorage.setItem('analytics', JSON.stringify(analytics.slice(-100)));
    console.log('Аналитика сохранена:', pageView);
}

// ======================== ЭКСПОРТ ФУНКЦИЙ ========================

window.initSurvey = initSurvey;
window.highlightCurrentPage = highlightCurrentPage;
window.closeAllDropdowns = closeAllDropdowns;
window.showLoadingIndicator = showLoadingIndicator;
window.showError = showError;
window.updateThemeIcon = updateThemeIcon;
window.updateMusicIcon = updateMusicIcon;
window.toggleMusic = toggleMusic;
window.resetSurvey = resetSurvey;
window.debugState = debugState;

console.log('✅ Index.js успешно загружен и инициализирован');
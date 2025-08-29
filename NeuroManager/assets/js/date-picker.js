document.addEventListener('DOMContentLoaded', function () {
    // Элементы DOM
    const calendarToggle = document.getElementById('calendarToggle');
    const calendarContainer = document.getElementById('calendarContainer');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const currentMonthYear = document.getElementById('currentMonthYear');
    const calendarDays = document.getElementById('calendarDays');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const applyBtn = document.getElementById('applyBtn');

    // Текущая дата и выбранный диапазон
    let currentDate = new Date(2025, 7, 1); // Август 2025
    let startDate = null;
    let endDate = null;
    let selectingStart = true;

    // Показать/скрыть календарь
    calendarToggle.addEventListener('click', function () {
        calendarContainer.classList.toggle('active');
    });

    // Инициализация календаря
    function initCalendar() {
        renderCalendar();

        // Обработчики событий
        prevMonthBtn.addEventListener('click', function () {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });

        nextMonthBtn.addEventListener('click', function () {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });

        applyBtn.addEventListener('click', function () {
            calendarContainer.classList.remove('active');
        });
    }

    // Отрисовка календаря
    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // Установка заголовка
        const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
            "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
        currentMonthYear.textContent = `${monthNames[month]} ${year}`;

        // Очистка календаря
        calendarDays.innerHTML = '';

        // Первый день месяца и последний день месяца
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        // Дни предыдущего месяца
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        const firstDayIndex = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

        // Дни следующего месяца
        const daysInMonth = lastDay.getDate();
        const lastDayIndex = lastDay.getDay() === 0 ? 6 : lastDay.getDay() - 1;
        const nextDays = 7 - lastDayIndex - 1;

        // Создание дней календаря
        let days = '';

        // Предыдущий месяц
        for (let i = firstDayIndex; i > 0; i--) {
            days += `<div class="day other-month">${prevMonthLastDay - i + 1}</div>`;
        }

        // Текущий месяц
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            let className = 'day';

            // Проверка, является ли день сегодняшним
            const today = new Date();
            if (date.toDateString() === today.toDateString()) {
                className += ' today';
            }

            // Проверка, выбран ли день
            if (startDate && date.getTime() === startDate.getTime()) {
                className += ' selected start-date';
            } else if (endDate && date.getTime() === endDate.getTime()) {
                className += ' selected end-date';
            } else if (isDateInRange(date)) {
                className += ' in-range';
            }

            days += `<div class="${className}" data-date="${date.toISOString()}">${i}</div>`;
        }

        // Следующий месяц
        for (let i = 1; i <= nextDays; i++) {
            days += `<div class="day other-month">${i}</div>`;
        }

        calendarDays.innerHTML = days;

        // Добавление обработчиков событий для дней
        document.querySelectorAll('.day:not(.other-month)').forEach(day => {
            day.addEventListener('click', function () {
                const date = new Date(this.dataset.date);

                if (selectingStart) {
                    // Выбор начальной даты
                    startDate = date;
                    endDate = null;
                    selectingStart = false;
                    startDateInput.value = formatDate(date);
                    endDateInput.value = '';
                } else {
                    // Выбор конечной даты
                    if (date < startDate) {
                        // Если выбрана дата раньше начальной, меняем местами
                        endDate = startDate;
                        startDate = date;
                    } else {
                        endDate = date;
                    }
                    selectingStart = true;
                    endDateInput.value = formatDate(date);
                }

                renderCalendar();
            });
        });
    }

    // Проверка, находится ли дата в выбранном диапазоне
    function isDateInRange(date) {
        if (!startDate || !endDate) return false;
        return date > startDate && date < endDate;
    }

    // Форматирование даты в строку
    function formatDate(date) {
        if (!date) return '';
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }

    // Инициализация календаря
    initCalendar();

    // Установка начальных значений из примера
    startDateInput.value = "22.08.2025";
    endDateInput.value = "28.08.2025";
    startDate = new Date(2025, 7, 22); // 22 августа 2025 (месяцы 0-11)
    endDate = new Date(2025, 7, 28);   // 28 августа 2025
    selectingStart = true;

    // Перерисовка календаря с учетом начальных значений
    renderCalendar();
});
const menuButton = document.querySelector(".window__header-sidebar_button");

menuButton.addEventListener('click', () => {
    try {
        let userId;
        // Проверяем, доступен ли API
        if (window.Telegram && window.Telegram.WebApp) {
            const webApp = window.Telegram.WebApp;

            // Получаем объект user
            const user = webApp.initDataUnsafe?.user;

            if (user) {
                const telegramId = user.id;
                alert("Telegram ID:", telegramId);
                // Отправьте telegramId на свой сервер для обработки
            } else {
                alert("Данные пользователя недоступны.");
            }
        } else {
            alert("Telegram WebApp API недоступен.");
        }
    }
    catch (e) {
        alert(e);
    }
    alert(userId);
});

let currentChatId = -1;
let app_tg_id = 5254325840;
let project_id = null;
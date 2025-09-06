// =======ПРОД=======

const menuButton = document.querySelector(".window__header-sidebar_button");

menuButton.addEventListener("click", () => {
    if (window.app_tg_id) {
        console.log("TG ID:", window.app_tg_id);
        // Можно отправить на сервер или использовать дальше
    } else {
        console.warn("TG ID пока не инициализирован.");
    }
});

// Глобальные переменные
let currentChatId = -1;
let project_id = null;

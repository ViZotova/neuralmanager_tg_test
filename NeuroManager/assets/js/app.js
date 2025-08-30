window.addEventListener('load', (event) => {
    const tg = window.Telegram.WebApp;
    tg.ready(); // Подготовка WebApp
    tg.expand(); // Разворачиваем WebApp
    tg.disableVerticalSwipes();

    // Сохраняем userId в localStorage
    const userId = tg.initDataUnsafe.user?.id;
    document.querySelector("#tg_id_value").innerHTML = userId;
    
    if (userId) {
        localStorage.setItem("userId", userId);
        console.log("User ID сохранен:", userId);
    } else {
        console.error("User ID не найден в initDataUnsafe.");
    }
});

let currentChatId = -1;
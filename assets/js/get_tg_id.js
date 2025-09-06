

async function fetchUsers() {
    const url = `https://ai-meneger-edward0076.amvera.io/users/`;
    try {
        const response = await fetch(url, { headers: { Accept: "application/json" } });
        if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
        return await response.json();
    } catch (err) {
        console.error("Ошибка получения пользователей:", err);
        return [];
    }
}

function displayTgId(tgId) {
    const p = document.getElementById("telegram_id_display");
    if (p) p.textContent = tgId ? tgId : "Не найдено";
}

async function initTgId() {
    try {
        let telegramWebId;

        const tg = window.Telegram?.WebApp;
        if (tg) {
            tg.ready();
            tg.expand();
            tg.disableVerticalSwipes();

            const user = tg.initDataUnsafe?.user;
            if (!user) {
                console.error("Нет данных о пользователе из Telegram WebApp");
                return;
            }

            telegramWebId = user.id;
        } else {
            // Заглушка 
            console.warn("Telegram WebApp недоступен, используем тестовый ID");
            telegramWebId = 5254325840; 
        }

        console.log("Используемый Telegram ID:", telegramWebId);

        // Сохраняем ID в localStorage и глобально
        localStorage.setItem("userId", telegramWebId);
        window.app_tg_id = telegramWebId;

        // Загружаем пользователей из базы
        const users = await fetchUsers();
        const currentUser = users.find(u => String(u.tg_id) === String(telegramWebId));

        if (currentUser) {
            window.app_tg_id = currentUser.tg_id;
            localStorage.setItem("userId", currentUser.tg_id);
            displayTgId(window.app_tg_id);
            console.log("TG ID найден:", window.app_tg_id, "Пользователь:", currentUser.name);
        } else {
            console.warn(`Пользователь с TG ID ${telegramWebId} не найден в базе`);
            displayTgId(window.app_tg_id);
        }

    } catch (err) {
        console.error("Ошибка в initTgId:", err);
    }
}

initTgId();


initTgId();

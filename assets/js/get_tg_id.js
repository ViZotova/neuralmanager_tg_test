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
        const tg = window.Telegram?.WebApp;
        tg?.ready();

        const user = tg?.initDataUnsafe?.user;
        if (!user) {
            console.error("Нет данных о пользователе из Telegram WebApp");
            return;
        }

        const currentUsername = `@${user.username}`;
        console.log("Зашёл пользователь:", currentUsername);

        const users = await fetchUsers();
        const currentUser = users.find(u => u.username === currentUsername);

        if (currentUser) {
            window.app_tg_id = currentUser.tg_id;
            displayTgId(window.app_tg_id);
            console.log("TG ID найден:", window.app_tg_id);
        } else {
            console.warn(`Пользователь ${currentUsername} не найден в базе`);
        }
    } catch (err) {
        console.error("Ошибка в initTgId:", err);
    }
}

initTgId();


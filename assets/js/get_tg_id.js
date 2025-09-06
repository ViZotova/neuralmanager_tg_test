// === Заглушка для теста ===
// if (!window.Telegram) {
//     window.Telegram = {
//         WebApp: {
//             ready: () => console.log("WebApp ready"),
//             expand: () => console.log("WebApp expanded"),
//             disableVerticalSwipes: () => console.log("Vertical swipes disabled"),
//             initDataUnsafe: {
//                 user: {
//                     id: 5254325840
//                 }
//             }
//         }
//     };
// }

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
        tg?.expand();
        tg?.disableVerticalSwipes();

        const user = tg?.initDataUnsafe?.user;
        if (!user) {
            console.error("Нет данных о пользователе из Telegram WebApp");
            return;
        }

        const telegramWebId = user.id;
        console.log("Зашёл пользователь с WebApp ID:", telegramWebId);

        localStorage.setItem("userId", telegramWebId);
        window.app_tg_id = telegramWebId;

        const users = await fetchUsers();
        const currentUser = users.find(u => String(u.tg_id) === String(telegramWebId) || u.username === `@${user.username}`);

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

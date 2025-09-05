
async function fetchTgId(tgId) {
    const url = `https://ai-meneger-edward0076.amvera.io/users/tg/${tgId}`;
    try {
        const response = await fetch(url, {
            headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
        const data = await response.json();
        return data.tg_id;
    } catch (err) {
        console.error(err);
        return null;
    }
}

function displayTgId(tgId) {
    const p = document.getElementById("telegram_id_display");
    if (!p) return;
    p.textContent = tgId ? tgId : "Не найдено";
}

if (window.app_tg_id) {
    displayTgId(window.app_tg_id);
} else {

    const tgIdFromUser = user.telegramId;
    fetchTgId(tgIdFromUser).then(id => {
        displayTgId(id);
    });
}

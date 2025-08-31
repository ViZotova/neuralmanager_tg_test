const menuButton = document.querySelector(".window__header-sidebar_button");

menuButton.addEventListener('click', () => {
    try {
        const userId = window.Telegram.WebApp.initDataUnsafe?.user?.id || localStorage.getItem('userId');
    }
    catch (e) {
        alert(e);
    }
    alert(userId);
});

let currentChatId = -1;
let app_tg_id = 5254325840;
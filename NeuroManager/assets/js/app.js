const menuButton = document.querySelector(".window__header-sidebar_button");

menuButton.addEventListener('click', () => {
    try {
        const userId = window.Telegram.WebApp.initDataUnsafe?.user?.id || localStorage.getItem('userId');
    }
    catch {
        alert("Запустите приложение в Telegram");
    }
    alert(userId);
});

let currentChatId = -1;
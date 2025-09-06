// =======ПРОД=======

const menuButton = document.querySelector(".window__header-sidebar_button");

menuButton.addEventListener("click", () => {
  console.log("TG ID:", window.app_tg_id);
});

// Глобальные переменные
let currentChatId = -1;
let project_id = null;

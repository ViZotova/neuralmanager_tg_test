// =======ПРОД=======

// Селектор кнопки меню
const menuButton = document.querySelector(".window__header-sidebar_button");

// Функция для получения Telegram ID
function getTelegramId() {
  let telegramId = null;

  try {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      tg.disableVerticalSwipes();

      telegramId = tg.initDataUnsafe?.user?.id;
      if (telegramId) {
        localStorage.setItem("userId", telegramId);
        console.log("Telegram ID получен из WebApp:", telegramId);
      } else {
        console.warn("Telegram ID недоступен в initDataUnsafe.");
      }
    } else {
      console.warn("Telegram WebApp API недоступен.");
    }
  } catch (e) {
    console.error("Ошибка при получении Telegram ID:", e);
  }

  // Резервное получение из localStorage
  if (!telegramId) {
    telegramId = localStorage.getItem("userId");
    if (telegramId)
      console.log("Telegram ID получен из localStorage:", telegramId);
  }

  // Обновляем UI и глобальную переменную
  if (telegramId) {
    const el = document.getElementById("telegram_id_display");
    if (el) el.textContent = telegramId;
    window.app_tg_id = telegramId;
  } else {
    console.error("Не удалось получить Telegram ID.");
  }

  return telegramId;
}

// Вешаем на кнопку меню
menuButton.addEventListener("click", () => {
  getTelegramId();
});

// Глобальные переменные
let currentChatId = -1;
let project_id = null;

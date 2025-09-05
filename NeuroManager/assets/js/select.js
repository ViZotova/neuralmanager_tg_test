document.addEventListener("DOMContentLoaded", function () {
  const filterModal = document.querySelector(".filters_modal");
  const filtersToggle = document.querySelector(
    ".tasks_list-header__actions-filters"
  );
  const cancelBtn = document.querySelector(
    ".parameters__actions-cancel_button"
  );
  const applyBtn = document.querySelector(".parameters__actions-accept_button");
  const selectContainers = document.querySelectorAll(
    ".select-container, .filters__select-container"
  );

  // ---------- ОТКРЫТИЕ ----------
  filtersToggle.addEventListener("click", () => {
    filterModal.classList.add("__modal_opened");
  });

  // ---------- ЗАКРЫТИЕ ----------
  const closeModal = () => filterModal.classList.remove("__modal_opened");

  cancelBtn.addEventListener("click", closeModal);

  filterModal
    .querySelector(".filters_modal__overlay")
    .addEventListener("click", (e) => {
      if (e.target === e.currentTarget) closeModal();
    });

  // ---------- СЕЛЕКТОРЫ ----------
  selectContainers.forEach((sc) => {
    const selectHeader = sc.querySelector(".select-header");
    const options = sc.querySelectorAll(".option-item");
    const searchInput = sc.querySelector(".search-input");
    const selectedValue = sc.querySelector(".selected-value");

    selectHeader.addEventListener("click", (e) => {
      e.stopPropagation();
      sc.classList.toggle("open");
      selectHeader.classList.toggle("open");
      if (sc.classList.contains("open") && searchInput) searchInput.focus();
    });

    options.forEach((opt) => {
      opt.addEventListener("click", (e) => {
        e.stopPropagation();
        selectedValue.textContent = opt.textContent.trim();
        options.forEach((o) => o.classList.remove("selected"));
        opt.classList.add("selected");
        sc.classList.remove("open");
        selectHeader.classList.remove("open");
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", () => {
        const searchText = searchInput.value.toLowerCase();
        options.forEach((opt) => {
          opt.style.display = opt.textContent.toLowerCase().includes(searchText)
            ? "block"
            : "none";
        });
      });
    }
  });

  document.addEventListener("click", () => {
    selectContainers.forEach((sc) => {
      sc.classList.remove("open");
      const sh = sc.querySelector(".select-header");
      if (sh) sh.classList.remove("open");
    });
  });

  // ---------- ПРИМЕНИТЬ ----------
  applyBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const filters = {};
    selectContainers.forEach((sc) => {
      const label = sc.querySelector(".select-label")?.textContent.trim();
      const value = sc.querySelector(".selected-value")?.textContent.trim();
      if (label && value) {
        if (label === "Исполнитель") filters.executor = value;
        if (label === "Название проекта") filters.project = value;
        if (label === "Статус") filters.status = value;
      }
    });

    const startDate = document.querySelector("#startDate")?.value;
    const endDate = document.querySelector("#endDate")?.value;
    if (startDate) filters.deadline_from = startDate;
    if (endDate) filters.deadline_to = endDate;

    // ФИЛЬТР
    const tasksContainer = document.querySelector(
      ".window__tasks_list.__tab.__tab_opened[data-tab-id='5'] .window__tasks_list-table"
    );
    if (!tasksContainer) return;

    const tasks = tasksContainer.querySelectorAll(".tasks_list-table__task");
    tasks.forEach((task) => {
      let show = true;
      const props = task.querySelectorAll(".task-properties__prop");
      props.forEach((prop) => {
        const propName = prop
          .querySelector(".task-properties__prop-name")
          ?.textContent.trim();
        const propValue = prop
          .querySelector(".task-properties__prop-value")
          ?.textContent.trim();

        if (
          filters.executor &&
          propName === "Исполнитель" &&
          !propValue.includes(filters.executor)
        )
          show = false;
        if (
          filters.status &&
          propName === "Статус" &&
          !propValue.includes(filters.status)
        )
          show = false;
        if (
          filters.project &&
          propName === "Название проекта" &&
          !propValue.includes(filters.project)
        )
          show = false;
        if (
          filters.deadline_from &&
          propName === "Дедлайн" &&
          propValue < filters.deadline_from
        )
          show = false;
        if (
          filters.deadline_to &&
          propName === "Дедлайн" &&
          propValue > filters.deadline_to
        )
          show = false;
      });

      task.style.display = show ? "block" : "none";
    });

    closeModal();
  });
});

  // ---------- ПОИСК ПО ЗАДАЧАМ ----------

document.addEventListener("DOMContentLoaded", function () {
  const searchIcon = document.querySelector(
    ".tasks_list-header__actions-search"
  );
  const searchField = document.querySelector(
    ".tasks_list-header__search-field"
  );
  const searchInput = document.querySelector("#taskSearchInput");

  function getTasksContainer() {
    return document.querySelector(
      ".window__tasks_list.__tab.__tab_opened .window__tasks_list-table"
    );
  }

  searchIcon.addEventListener("click", () => {
    if (searchField.style.display === "none") {
      searchField.style.display = "block";
      searchInput.focus();
    } else {
      searchField.style.display = "none";
      searchInput.value = "";
      filterTasks("");
    }
  });

  // Фильтрация задач при вводе
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    filterTasks(query);
  });

  function filterTasks(query) {
    const tasksContainer = getTasksContainer();
    if (!tasksContainer) return;

    const tasks = tasksContainer.querySelectorAll(".tasks_list-table__task");
    tasks.forEach((task) => {
      const title =
        task
          .querySelector(".tasks_list-table__task-title")
          ?.textContent.toLowerCase() || "";

      // вручную
      let executor = "";
      task.querySelectorAll(".task-properties__prop").forEach((prop) => {
        const name = prop
          .querySelector(".task-properties__prop-name")
          ?.textContent.trim();
        const value = prop
          .querySelector(".task-properties__prop-value")
          ?.textContent.trim();
        if (name === "Исполнитель") executor = value.toLowerCase();
      });

      if (title.includes(query) || executor.includes(query)) {
        task.style.display = "block";
      } else {
        task.style.display = "none";
      }
    });
  }
});
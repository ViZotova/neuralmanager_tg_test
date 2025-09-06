document.addEventListener("DOMContentLoaded", async function () {
  const filterModal = document.querySelector(".filters_modal");
  const filtersToggle = document.querySelector(".tasks_list-header__actions-filters");
  const cancelBtn = document.querySelector(".parameters__actions-cancel_button");
  const resetBtn = document.querySelector(".parameters__actions-reset_button");
  const applyBtn = document.querySelector(".parameters__actions-accept_button");
  const selectContainers = document.querySelectorAll(".select-container, .filters__select-container");

  // ---------- ПОЛУЧЕНИЕ ПОЛЬЗОВАТЕЛЕЙ ----------
  const executorSelect = document.querySelector(".select-dropdown");
  if (executorSelect) {
    const optionsContainer = executorSelect.querySelector(".options-list");
    const searchInput = executorSelect.querySelector(".search-input");

    let selectedValue = executorSelect.querySelector(".selected-value");
    if (!selectedValue) {
      const header = document.createElement("div");
      header.className = "select-header";
      selectedValue = document.createElement("span");
      selectedValue.className = "selected-value";
      selectedValue.textContent = "Выбрать";
      header.appendChild(selectedValue);
      executorSelect.insertBefore(header, executorSelect.firstChild);
    }

    async function fetchUsers() {
      try {
        const res = await fetch("https://ai-meneger-edward0076.amvera.io/users/", {
          headers: { Accept: "application/json" }
        });
        if (!res.ok) throw new Error("Ошибка получения пользователей");
        return await res.json();
      } catch (err) {
        console.error(err);
        return [];
      }
    }

    async function fillExecutors() {
      const users = await fetchUsers();
      if (!optionsContainer) return;

      optionsContainer.innerHTML = "";

      const chooseOption = document.createElement("div");
      chooseOption.className = "option-item selected";
      chooseOption.textContent = "Выбрать";
      chooseOption.dataset.id = "";
      optionsContainer.appendChild(chooseOption);
      selectedValue.textContent = "Выбрать";

      users.forEach(u => {
        const div = document.createElement("div");
        div.className = "option-item";
        div.textContent = u.name;
        div.dataset.id = u.id;

        div.addEventListener("click", (e) => {
          e.stopPropagation();
          optionsContainer.querySelectorAll(".option-item").forEach(o => o.classList.remove("selected"));
          div.classList.add("selected");
          selectedValue.textContent = div.textContent;
        });

        optionsContainer.appendChild(div);
      });
    }

    await fillExecutors();

    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase();
      optionsContainer.querySelectorAll(".option-item").forEach(opt => {
        opt.style.display = opt.textContent.toLowerCase().includes(query) ? "block" : "none";
      });
    });

    const selectHeader = executorSelect.querySelector(".select-header");
    if (selectHeader) {
      selectHeader.addEventListener("click", e => {
        e.stopPropagation();
        executorSelect.classList.toggle("open");
        selectHeader.classList.toggle("open");
        if (executorSelect.classList.contains("open") && searchInput) searchInput.focus();
      });
    }
  }

  // ---------- ПОЛУЧЕНИЕ ПРОЕКТОВ ----------
  const projectSelect = document.querySelector(".select-container[data-select-id='2']");
  if (projectSelect) {
    const optionsContainer = projectSelect.querySelector(".options-list");
    const searchInput = projectSelect.querySelector(".search-input");
    const selectedValue = projectSelect.querySelector(".selected-value");

    async function fetchProjects() {
      try {
        const res = await fetch("https://ai-meneger-edward0076.amvera.io/projects/", {
          headers: { Accept: "application/json" }
        });
        if (!res.ok) throw new Error("Ошибка получения проектов");
        return await res.json();
      } catch (err) {
        console.error(err);
        return [];
      }
    }

    async function fillProjects() {
      const projects = await fetchProjects();
      if (!optionsContainer) return;

      optionsContainer.innerHTML = "";

      const chooseOption = document.createElement("div");
      chooseOption.className = "option-item selected";
      chooseOption.textContent = "Выбрать";
      chooseOption.dataset.id = "";
      optionsContainer.appendChild(chooseOption);
      if (selectedValue) selectedValue.textContent = "Выбрать";

      projects.forEach(p => {
        const div = document.createElement("div");
        div.className = "option-item";
        div.textContent = p.title;
        div.dataset.id = p.id;

        div.addEventListener("click", (e) => {
          e.stopPropagation();
          optionsContainer.querySelectorAll(".option-item").forEach(o => o.classList.remove("selected"));
          div.classList.add("selected");
          if (selectedValue) selectedValue.textContent = div.textContent;
        });

        optionsContainer.appendChild(div);
      });
    }

    await fillProjects();

    // Поиск проектов
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase();
      optionsContainer.querySelectorAll(".option-item").forEach(opt => {
        opt.style.display = opt.textContent.toLowerCase().includes(query) ? "block" : "none";
      });
    });
  }


  // ---------- ОТКРЫТИЕ ----------
  filtersToggle.addEventListener("click", () => {
    resetFilters();
    filterModal.classList.add("__modal_opened");
  });

  // ---------- СБРОС ФИЛЬТРОВ ----------
  resetBtn.addEventListener("click", () => {
    resetFilters();
    showAllTasks();
  });

  // ---------- ЗАКРЫТИЕ ----------
  const closeModal = () => filterModal.classList.remove("__modal_opened");
  cancelBtn.addEventListener("click", () => { resetFilters(); closeModal(); });
  filterModal.querySelector(".filters_modal__overlay").addEventListener("click", e => {
    if (e.target === e.currentTarget) { resetFilters(); closeModal(); }
  });

  // ---------- СЕЛЕКТОРЫ ----------
  selectContainers.forEach((sc) => {
    const selectHeader = sc.querySelector(".select-header");
    const options = sc.querySelectorAll(".option-item");
    const searchInput = sc.querySelector(".search-input");
    const selectedValue = sc.querySelector(".selected-value");

    if (!selectHeader) return;

    selectHeader.addEventListener("click", e => {
      e.stopPropagation();
      sc.classList.toggle("open");
      selectHeader.classList.toggle("open");
      if (sc.classList.contains("open") && searchInput) searchInput.focus();
    });

    options.forEach(opt => {
      opt.addEventListener("click", e => {
        e.stopPropagation();
        if (selectedValue) selectedValue.textContent = opt.textContent.trim();
        options.forEach(o => o.classList.remove("selected"));
        opt.classList.add("selected");
        sc.classList.remove("open");
        selectHeader.classList.remove("open");
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", () => {
        const searchText = searchInput.value.toLowerCase();
        options.forEach(opt => {
          opt.style.display = opt.textContent.toLowerCase().includes(searchText) ? "block" : "none";
        });
      });
    }
  });

  document.addEventListener("click", () => {
    selectContainers.forEach(sc => {
      sc.classList.remove("open");
      const sh = sc.querySelector(".select-header");
      if (sh) sh.classList.remove("open");
    });
    if (executorSelect) {
      executorSelect.classList.remove("open");
      const sh = executorSelect.querySelector(".select-header");
      if (sh) sh.classList.remove("open");
    }
    if (projectSelect) {
      projectSelect.classList.remove("open");
      const sh = projectSelect.querySelector(".select-header");
      if (sh) sh.classList.remove("open");
    }
  });

  // ---------- ПРИМЕНИТЬ ----------
  applyBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const filters = {};

    selectContainers.forEach(sc => {
      const label = sc.querySelector(".select-label")?.textContent.trim();
      const value = sc.querySelector(".selected-value")?.textContent.trim();
      if (label && value && value !== "Выбрать") {
        if (label === "Исполнитель") filters.executor = value;
        if (label === "Название проекта") filters.project = value;
        if (label === "Статус") filters.status = value;
      }
    });

    if (executorSelect) {
      const selValue = executorSelect.querySelector(".selected-value")?.textContent.trim();
      if (selValue && selValue !== "Выбрать") filters.executor = selValue;
    }

    if (projectSelect) {
      const selValue = projectSelect.querySelector(".selected-value")?.textContent.trim();
      if (selValue && selValue !== "Выбрать") filters.project = selValue;
    }

    const startDate = document.querySelector("#startDate")?.value;
    const endDate = document.querySelector("#endDate")?.value;
    if (startDate) filters.deadline_from = startDate;
    if (endDate) filters.deadline_to = endDate;

    const tasksContainer = document.querySelector(".window__tasks_list.__tab.__tab_opened[data-tab-id='5'] .window__tasks_list-table");
    if (!tasksContainer) return;

    const tasks = tasksContainer.querySelectorAll(".tasks_list-table__task");
    tasks.forEach(task => {
      let show = true;
      const props = task.querySelectorAll(".task-properties__prop");
      props.forEach(prop => {
        const propName = prop.querySelector(".task-properties__prop-name")?.textContent.trim();
        const propValue = prop.querySelector(".task-properties__prop-value")?.textContent.trim();
        if (filters.executor && propName === "Исполнитель" && !propValue.includes(filters.executor)) show = false;
        if (filters.status && propName === "Статус" && !propValue.includes(filters.status)) show = false;
        if (filters.project && propName === "Название проекта" && !propValue.includes(filters.project)) show = false;
        if (filters.deadline_from && propName === "Дедлайн" && propValue < filters.deadline_from) show = false;
        if (filters.deadline_to && propName === "Дедлайн" && propValue > filters.deadline_to) show = false;
      });
      task.style.display = show ? "block" : "none";
    });

    closeModal();
  });

  function resetFilters() {
    selectContainers.forEach(sc => {
      const selectedValue = sc.querySelector(".selected-value");
      if (selectedValue) selectedValue.textContent = "Выбрать";
      sc.querySelectorAll(".option-item").forEach(opt => opt.classList.remove("selected"));
    });
    if (executorSelect) {
      const selValue = executorSelect.querySelector(".selected-value");
      if (selValue) selValue.textContent = "Выбрать";
      executorSelect.querySelectorAll(".option-item").forEach(opt => opt.classList.remove("selected"));
    }
    if (projectSelect) {
      const selValue = projectSelect.querySelector(".selected-value");
      if (selValue) selValue.textContent = "Выбрать";
      projectSelect.querySelectorAll(".option-item").forEach(opt => opt.classList.remove("selected"));
    }
    const startDate = document.querySelector("#startDate");
    const endDate = document.querySelector("#endDate");
    if (startDate) startDate.value = "";
    if (endDate) endDate.value = "";
  }

  function showAllTasks() {
    const tasksContainer = document.querySelector(".window__tasks_list.__tab.__tab_opened[data-tab-id='5'] .window__tasks_list-table");
    if (!tasksContainer) return;
    tasksContainer.querySelectorAll(".tasks_list-table__task").forEach(task => task.style.display = "block");
  }
});



// ---------- ПОИСК ПО ЗАДАЧАМ ----------
document.addEventListener("DOMContentLoaded", function () {
  const searchIcon = document.querySelector(".tasks_list-header__actions-search");
  const searchField = document.querySelector(".tasks_list-header__search-field");
  const searchInput = document.querySelector("#taskSearchInput");

  function getTasksContainer() {
    return document.querySelector(".window__tasks_list.__tab.__tab_opened .window__tasks_list-table");
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

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    filterTasks(query);
  });

  function filterTasks(query) {
    const tasksContainer = getTasksContainer();
    if (!tasksContainer) return;

    const tasks = tasksContainer.querySelectorAll(".tasks_list-table__task");
    tasks.forEach((task) => {
      const title = task.querySelector(".tasks_list-table__task-title")?.textContent.toLowerCase() || "";

      let executor = "";
      task.querySelectorAll(".task-properties__prop").forEach((prop) => {
        const name = prop.querySelector(".task-properties__prop-name")?.textContent.trim();
        const value = prop.querySelector(".task-properties__prop-value")?.textContent.trim();
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

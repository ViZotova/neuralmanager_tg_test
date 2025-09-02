async function getTasks() {

    const tasksContainer = document.querySelector(".window__tasks_list-table");

    fetch("https://ai-meneger-edward0076.amvera.io/tasks")
        .then(res => {
            return res.json();
        })
        .then(res => {

            console.log(res);

            tasksContainer.innerHTML = "";

            res.forEach(task => {

                let deadlineDate =

                    tasksContainer.innerHTML +=
                    `
                <div class="tasks_list-table__task" data-task-id=${task.id}>
                    <h2 class="tasks_list-table__task-title">
                        ${task.title}
                    </h2>
                    <div class="tasks_list-table__task-properties">
                        <div class="task-properties__prop">
                            <div class="task-properties__prop-name">
                                Исполнитель
                            </div>
                            <div class="task-properties__prop-value">
                                ${task.executor.name}
                            </div>
                        </div>
                        <div class="task-properties__prop">
                            <div class="task-properties__prop-name">
                                Дедлайн
                            </div>
                            <div class="task-properties__prop-value">
                                ${task.deadline_date}
                            </div>
                        </div>
                    </div>
                </div>              
            `;
            });

            document.querySelectorAll(".tasks_list-table__task").forEach(task => {
                task.onclick = () => {
                    openTask(+task.dataset.taskId);
                };
            });
        });
}

async function openTask(id) {
    fetch(`https://ai-meneger-edward0076.amvera.io/tasks/${id}`)
        .then(res => res.json())
        .then(res => {

            console.log(res);

            const openedTaskContainer = document.querySelector(".window__check");

            document.querySelector(".__tab_opened").classList.remove("__tab_opened");
            openedTaskContainer.classList.add("__tab_opened");

            openedTaskContainer.innerHTML =
                `
                <div class="window__check-header">
                    <h1>${res.title}</h1>
                    <div class="window__check-header__description">
                        <h3>Описание</h2>
                            <p>${res.description}</p>
                    </div>
                </div>

                <div class="window__check-info_container">

                    <div class="window__check-properties">
                        <div class="window__check-properties-prop">
                            <h3>Комментарий</h3>
                            <p>${res.comment}</p>
                        </div>
                        <div class="window__check-properties-prop">
                            <h3>Статус</h3>
                            <p>${res.status}</p>
                        </div>
                        <div class="window__check-properties-prop">
                            <h3>Дедлайн</h3>
                            <p>${res.deadline}</p>
                        </div>
                        <div class="window__check-properties-prop">
                            <h3>Файл</h3>
                            <p>${(res.file_path) ? res.file_path : "Нет файла"}</p>
                        </div>
                    </div>

                    <div class="window__check-user_info">
                        <div class="window__check-user_info__char">
                            <h3>Имя Фамилия</h3>
                            <p>${res.executor.name}</p>
                        </div>
                        <div class="window__check-user_info__char">
                            <h3>Имя пользователя</h3>
                            <p>${res.executor.username}</p>
                        </div>
                        <div class="window__check-user_info__char">
                            <h3>Дедлайн</h3>
                            <p>${res.deadline_date}</p>
                        </div>
                    </div>

                </div>

                <div class="window__check-buttons">
                    <button class="window__check-buttons__change_button" onclick="editTask(${id})">
                        Изменить
                    </button>
                    <button class="window__check-buttons__back_button">
                        Назад к списку
                    </button>
                </div>
            `

            document.querySelector(".window__check-buttons__back_button").onclick = () => {
                document.querySelector("#tasks_link").click();
            }
        });
}

function editTask(id) {
    fetch(`https://ai-meneger-edward0076.amvera.io/tasks/${id}`)
        .then(res => res.json())
        .then(res => {

            console.log(res);

            document.querySelector(".__tab_opened").classList.remove("__tab_opened");
            document.querySelector(".window__edit_task").classList.add("__tab_opened");

            document.querySelector(".window__edit_task").innerHTML =
                `
                <div class="window__tasks-task">
                    <div class="task__header">
                        <h1>
                            Редактирование задачи "${res.title}"
                        </h1>
                    </div>
                    <div class="task__body">
                        <div class="task__name">
                            ${res.title}
                        </div>
                        <div class="task__text">
                            ${res.description}
                        </div>
                        <div class="task__select">
                            <div class="select-container" data-select-id="1">
                                <div class="select-header">
                                    <span class="select-label">Исполнитель</span>
                                    <div class="selected-value">${res.executor.name}</div>
                                    <span class="dropdown-arrow">
                                        <svg width="13" height="7" viewBox="0 0 13 7" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M6.56641 6.70801C6.38867 6.70801 6.23145 6.63965 6.10156 6.50977L0.810547 1.0957C0.694336 0.972656 0.625977 0.822266 0.625977 0.651367C0.625977 0.295898 0.892578 0.0224609 1.24805 0.0224609C1.42578 0.0224609 1.58301 0.0908203 1.69238 0.200195L6.56641 5.17676L11.4336 0.200195C11.5498 0.0908203 11.707 0.0224609 11.8779 0.0224609C12.2334 0.0224609 12.5 0.295898 12.5 0.651367C12.5 0.822266 12.4316 0.972656 12.3154 1.08887L7.02441 6.50977C6.9082 6.63965 6.7373 6.70801 6.56641 6.70801Z"
                                                fill="#8E8E93" />
                                        </svg>
                                    </span>
                                </div>

                                <div class="select-dropdown">
                                    <div class="search-container">
                                        <input type="text" placeholder="Поиск..." class="search-input">
                                    </div>

                                    <div class="options-list">
                                        <div class="option-item selected">
                                            ${res.executor.name}
                                        </div>
                                        <div class="option-item">
                                            Иван Иванов (ОТК)
                                        </div>
                                        <div class="option-item">
                                            Петр Петров (ПТО)
                                        </div>
                                        <div class="option-item">
                                            Мария Сидорова (ОТК)
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div class="task__date">
                            28.08.2025
                        </div>
                        <div class="task__file">
                            Выбрать файл
                        </div>
                    </div>
                </div>
            `

        });
}
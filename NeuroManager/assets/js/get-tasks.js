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
                    <button class="window__check-buttons__change_button">
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
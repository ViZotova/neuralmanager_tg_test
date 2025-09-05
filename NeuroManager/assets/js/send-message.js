let chatRoll = document.querySelector(".window__chat-content");

async function sendMessage(messageText) {
    if (!messageText.trim()) return;

    const fileInput = document.querySelector(".chat-search__input input[type='file']");
    const formData = new FormData();

    formData.append('tg_id', app_tg_id);
    formData.append('prompt', messageText);
    if (currentChatId >= 0) formData.append('chat_id', currentChatId);
    if (fileInput.files[0]) formData.append('file', fileInput.files[0]);

    // Сообщение пользователя
    if (fileInput.files[0]) {
        chatRoll.innerHTML += `
        <div class="user_message">
            <div class="user_message__file">
                <div class="user_message__file-icon">...</div>
                <div class="user_message__file-data">
                    <h3>${fileInput.files[0].name}</h3>
                    <p>Файл</p>
                </div>
            </div>
            <div class="user_message__card">
                <div class="user_message__text">${messageText}</div>
            </div>
        </div>`;
    } else {
        chatRoll.innerHTML += `
        <div class="user_message">
            <div class="user_message__card">
                <div class="user_message__text">${messageText}</div>
            </div>
        </div>`;
    }

    chatRoll.innerHTML += `<div class="gpt_typing_marker">Печатает...</div>`;

    let res;
    try {
        const response = await fetch('https://ai-meneger-edward0076.amvera.io/chat_gpt/message_all', {
            method: 'POST',
            body: formData
        });
        res = await response.json();
    } catch (e) {
        console.error("Ошибка запроса:", e);
        return;
    }

    const typingMarker = chatRoll.querySelector(".gpt_typing_marker");
    if (typingMarker) typingMarker.remove();

    let isTaskCommand = messageText.toUpperCase().startsWith("РАСПРЕДЕЛИ ЗАДАЧИ");

    // --- Если пришёл массив ---
    if (Array.isArray(res) || isTaskCommand) {
        let tasks = Array.isArray(res) ? res : [{
            title: res.message || "Задача на создание",
            description: res.message || "",
            deadline_date: new Date().toISOString().split("T")[0],
            executor_id: 1
        }];

        // ---  функция для получения пользователей  ---
        let users = [];
        async function fetchUsersOnce() {
            if (users.length) return; // уже загружены
            try {
                const r = await fetch('https://ai-meneger-edward0076.amvera.io/users/', {
                    method: 'GET',
                    headers: { 'accept': 'application/json' }
                });
                users = await r.json();
            } catch (e) {
                console.error("Ошибка получения пользователей:", e);
                users = [];
            }
        }

        // --- helpers ---
        function normalizeField(field) {
            if (field == null) return '';
            if (typeof field === 'string') return field;
            if (typeof field === 'object') {
                if (typeof field.title === 'string') return field.title;
                if (typeof field.message === 'string') return field.message;
                for (const k of Object.keys(field)) {
                    if (typeof field[k] === 'string') return field[k];
                }
                return JSON.stringify(field, null, 2);
            }
            return String(field);
        }

        function cleanMarkdown(text) {
            return text
                .replace(/^#{1,6}\s*/gm, '')   // заголовки
                .replace(/[-*]\s+/gm, '')      // буллиты
                .replace(/\|/g, '')            // таблицы
                .replace(/\n{2,}/g, '\n')      // переносы
                .trim();
        }

        function extractTitleAndDescription(rawTitle, rawDescription) {
            let baseText = normalizeField(rawTitle) || normalizeField(rawDescription);
            if (!baseText) return { title: "Задача на создание", description: "" };

            const lines = baseText.split("\n");
            let firstLine = cleanMarkdown(lines[0]).trim();
            if (!firstLine) firstLine = "Задача на создание";

            let rest = cleanMarkdown(lines.slice(1).join("\n"));
            return { title: firstLine, description: rest };
        }

        await fetchUsersOnce();

        let mess = '';
        tasks.forEach(task => {
            const { title: taskTitle, description: taskDescription } =
                extractTitleAndDescription(task.title, task.description);

            // для селекта пользователей
            let userOptions = '';
            if (Array.isArray(users) && users.length) {
                userOptions = users.map(u => {
                    const selected = (task.executor_id && Number(task.executor_id) === Number(u.id)) ? 'selected' : '';
                    const label = `${u.name}${u.department ? ` (${u.department})` : ''}`;
                    return `<option value="${u.id}" ${selected}>${escapeHtml(label)}</option>`;
                }).join('');
            } else {
                userOptions = `<option value="1">Исполнитель 1</option>`;
            }

            const titleForOnclick = taskTitle.replace(/'/g, "\\'");
            const dateVal = (task.deadline_date && /^\d{4}-\d{2}-\d{2}$/.test(task.deadline_date))
                ? task.deadline_date
                : new Date().toISOString().split('T')[0];

            mess += `
<div class="task_card" style="font-size:16px; line-height:1.5; margin-bottom:12px;">
    <div><b>Наименование:</b> ${escapeHtml(taskTitle)}</div>
    <div><b>Описание:</b></div>
    <div style="white-space:pre-wrap; margin:6px 0;">${escapeHtml(taskDescription)}</div>
    <div><b>Сроки выполнения:</b> <input type="date" value="${dateVal}"></div>
    <div><b>Исполнитель:</b> 
        <select>
            ${userOptions}
        </select>
    </div>
    <div><b>Файл:</b> 
    <input type="file" class="task_file" style="display:none" onchange="showFileName(this)">
    <button type="button" onclick="triggerFileSelect(this)">Добавить файл</button>
    <span class="file-info" style="margin-left:10px; font-size:14px; color:#333;"></span>
</div>

    <div style="margin-top:8px;"><button onclick="createTask('${titleForOnclick}')">Создать</button></div>
</div>`;
        });

        chatRoll.innerHTML += `<div class="gpt_message"><div class="gpt_message__card">${mess}</div></div>`;

        function escapeHtml(str) {
            if (str == null) return '';
            return String(str)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#39;");
        }

        document.querySelector("#tasksContainer").innerHTML = mess;
        document.querySelector("#tasksModal").style.display = "flex";
        return;
    }
    

    // --- Markdown / текст ---
    let mess = (res.message && res.message.message) ? res.message.message : res.message || "";
    mess = mess.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>'); 

    let sentences = mess.split("\n");
    let gptMessage = '';

    sentences.forEach(sentence => {
        let title_order = 0;
        for (let i = 0; i < sentence.length; i++) {
            if (sentence[i] === "#") title_order++;
            else break;
        }

        sentence = sentence.slice(title_order > 0 ? title_order + 1 : 0);
        let tag = title_order === 0 ? 'p' : 'h' + title_order;

        gptMessage += `<${tag}>${sentence.trim() !== "" ? sentence.trim() : "<span class='msg_whitespace'></span>"}</${tag}>`;
    });

    chatRoll.innerHTML += `
    <div class="gpt_message">
        <div class="gpt_message__card">
            ${gptMessage}
            <div class="gpt_message__footer">
                <div class="gpt_message__footer-btn">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.8999 10.1C5.8999 8.12039 5.8999 7.12989 6.5152 6.51529C7.1298 5.89999 8.1203 5.89999 10.0999 5.89999H10.7999C12.7795 5.89999 13.77 5.89999 14.3846 6.51529C14.9999 7.12989 14.9999 8.12039 14.9999 10.1V10.8C14.9999 12.7796 14.9999 13.7701 14.3846 14.3847C13.77 15 12.7795 15 10.7999 15H10.0999C8.1203 15 7.1298 15 6.5152 14.3847C5.8999 13.7701 5.8999 12.7796 5.8999 10.8V10.1Z" stroke="#8E8E93" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M11.5 5.9C11.4979 3.8301 11.4671 2.7577 10.8644 2.0234C10.7481 1.88175 10.6182 1.75186 10.4766 1.6356C9.701 1 8.5516 1 6.25 1C3.9491 1 2.7983 1 2.0234 1.6356C1.88175 1.75186 1.75186 1.88175 1.6356 2.0234C1 2.799 1 3.9484 1 6.25C1 8.5509 1 9.7017 1.6356 10.4766C1.75186 10.6182 1.88175 10.7481 2.0234 10.8644C2.7584 11.4664 3.8294 11.4986 5.9 11.5" stroke="#8E8E93" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            </div>
        </div>
    </div>`;

    if (res.chat_id) currentChatId = res.chat_id;
}

function triggerFileSelect(btn) {
    const fileInput = btn.parentElement.querySelector(".task_file");
    if (fileInput) {
        fileInput.click(); 
    }
}

function showFileName(input) {
    const info = input.parentElement.querySelector(".file-info");
    if (input.files && input.files[0]) {
        info.textContent = `Добавлен файл: ${input.files[0].name}`;
    } else {
        info.textContent = '';
    }
}

function closeTasksModal() {
    document.querySelector("#tasksModal").style.display = "none";
}


function createTask(title) {
    alert(`Задача "${title}" создана!`);
}

document.querySelector("#desktop_search_btn").onclick = () => {
    const messageText = document.querySelector("#desktop_search_input").value;
    document.querySelector("#desktop_search_input").value = '';
    sendMessage(messageText);
};

document.querySelector("#mobile_search_btn").onclick = () => {
    const messageText = document.querySelector("#mobile_search_input").value;
    document.querySelector("#mobile_search_input").value = '';
    sendMessage(messageText);
};

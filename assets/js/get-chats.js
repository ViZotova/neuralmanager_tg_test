
window.onload = async () => {
    try {
        while (!window.app_tg_id) {
            window.app_tg_id = Number(localStorage.getItem("userId"));
            if (!window.app_tg_id) await new Promise(r => setTimeout(r, 300));
        }

        const appTgId = window.app_tg_id;
        const projectsRes = await fetch(`https://ai-meneger-edward0076.amvera.io/projects/by_tg/${appTgId}`);
        const projectsList = await projectsRes.json();

        const sidebarContainer = document.querySelector(".sidebar__catalog-chats");
        sidebarContainer.innerHTML = ""; // очищаем перед рендером

        for (const project of projectsList) {
            const projectDiv = document.createElement("div");
            projectDiv.classList.add("sidebar__catalog-folder");
            projectDiv.dataset.folderOrder = project.id;
            projectDiv.innerHTML = `
                <div class="catalog-folder__header" data-folder-order="${project.id}">
                    <div class="catalog-folder__icon">
                        <svg class="__folder__closed" width="19" height="18" ...></svg>
                        <svg class="__folder__expanded" width="19" height="18" ...></svg>
                    </div>
                    <div class="catalog-folder__name">${project.title}</div>
                </div>
                <div class="catalog-folder__inner"></div>
            `;
            sidebarContainer.appendChild(projectDiv);

            const innerContainer = projectDiv.querySelector(".catalog-folder__inner");

            // Загружаем чаты 
            const chatsRes = await fetch(`https://ai-meneger-edward0076.amvera.io/projects/${project.id}/chats`);
            const chatsData = await chatsRes.json();

            chatsData.forEach(chat => {
                innerContainer.innerHTML += `
                    <div class="folder-inner__link" data-chat-id="${chat.id}">
                        <div class="inner-link__space"></div>
                        <div class="inner-link__name">${chat.title}</div>
                    </div>
                `;
            });

            const header = projectDiv.querySelector(".catalog-folder__header");
            header.onclick = () => openProject(project.id);
        }

        const userChatsRes = await fetch(`https://ai-meneger-edward0076.amvera.io/chat_gpt/chats/${appTgId}`);
        const userChats = await userChatsRes.json();

        userChats.forEach(chat => {
            if (!chat.project_id) {
                sidebarContainer.innerHTML += `
                    <div class="sidebar__catalog-link user-chats-link" onclick="openChat(${chat.id})" data-chat-id="${chat.id}">
                        <div class="catalog-link__name">${chat.title}</div>
                    </div>
                `;
            }
        });

        document.querySelectorAll(".folder-inner__link").forEach(link => {
            link.onclick = () => openChat(link.dataset.chatId);
        });

    } catch (err) {
        console.error("Ошибка при загрузке проектов и чатов:", err);
    }
};

function openChat(chat_id) {
    const chatContainer = document.querySelector(".window__chat-container");
    const chatContent = document.querySelector(".window__chat-content");

    document.querySelector(".sidebar").classList.add("__closed");
    document.querySelector(".sidebar__back_overlay").classList.remove("__opened");

    document.querySelector(".__tab_opened")?.classList.remove("__tab_opened");
    chatContainer.classList.add("__tab_opened");
    chatContent.innerHTML = "";

    fetch(`https://ai-meneger-edward0076.amvera.io/chat_gpt/messages/${chat_id}`)
        .then(res => res.json())
        .then(res => renderChat(res));
}


function renderChat(chats_data) {

    let chatRoll = document.querySelector(".window__chat-content");
    chats_data.forEach(chat_data => {

        console.log(chat_data);

        if (chat_data.is_user) {
            if (chat_data.file_path) {
                chatRoll.innerHTML +=
                    `
                        <div class="user_message">
                            <div class="user_message__file">
                                <div class="user_message__file-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M304 112L192 112C183.2 112 176 119.2 176 128L176 512C176 520.8 183.2 528 192 528L448 528C456.8 528 464 520.8 464 512L464 272L376 272C336.2 272 304 239.8 304 200L304 112zM444.1 224L352 131.9L352 200C352 213.3 362.7 224 376 224L444.1 224zM128 128C128 92.7 156.7 64 192 64L325.5 64C342.5 64 358.8 70.7 370.8 82.7L493.3 205.3C505.3 217.3 512 233.6 512 250.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128z"/></svg>
                                </div>
                                <div class="user_message__file-data">
                                    <h3>${getFileNameFromPath(chat_data.file_path)}</h3>
                                    <p>Файл</p>
                                </div>
                            </div>
                            <div class="user_message__card">
                                <div class="user_message__text">${chat_data.content}</div>
                            </div>
                        </div>
                        `;
            }
            else {
                chatRoll.innerHTML +=
                    `
                    <div class="user_message">
                        <div class="user_message__card">
                            <div class="user_message__text">${chat_data.content}</div>
                        </div>
                    </div>
                    `;
            }
        }
        else {

            let mess = chat_data.content.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');

            let sentences = mess.split("\n");

            let gptMessage = ``;

            sentences.forEach(sentence => {
                let title_order = 0;

                for (let i = 0; i < sentence.length; i++) {
                    if (sentence[i] === "#") {
                        title_order++;
                    }
                    else {
                        break;
                    }
                }

                // Cutting # markers in beginning
                sentence = sentence.slice((title_order == 0) ? 0 : title_order + 1);

                let tag = "";
                if (title_order === 0) {
                    tag = "p";
                }
                else {
                    tag = "h" + title_order;
                }

                gptMessage +=
                    `
                <${tag}>
                    ${(sentence.trim() !== "") ? sentence.trim() : "<span class='msg_whitespace'></span>"}
                </${tag}>
                `;

            });

            chatRoll.innerHTML +=
                `
            <div class="gpt_message">
                <div class="gpt_message__card">
                    ${gptMessage}

                    <div class="gpt_message__footer">
                    <div class="gpt_message__footer-btn" onclick="() => {copyMessage(${chat_data.id})}">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M5.8999 10.1C5.8999 8.12039 5.8999 7.12989 6.5152 6.51529C7.1298 5.89999 8.1203 5.89999 10.0999 5.89999H10.7999C12.7795 5.89999 13.77 5.89999 14.3846 6.51529C14.9999 7.12989 14.9999 8.12039 14.9999 10.1V10.8C14.9999 12.7796 14.9999 13.7701 14.3846 14.3847C13.77 15 12.7795 15 10.7999 15H10.0999C8.1203 15 7.1298 15 6.5152 14.3847C5.8999 13.7701 5.8999 12.7796 5.8999 10.8V10.1Z"
                                stroke="#8E8E93" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
                            <path
                                d="M11.5 5.9C11.4979 3.8301 11.4671 2.7577 10.8644 2.0234C10.7481 1.88175 10.6182 1.75186 10.4766 1.6356C9.701 1 8.5516 1 6.25 1C3.9491 1 2.7983 1 2.0234 1.6356C1.88175 1.75186 1.75186 1.88175 1.6356 2.0234C1 2.799 1 3.9484 1 6.25C1 8.5509 1 9.7017 1.6356 10.4766C1.75186 10.6182 1.88175 10.7481 2.0234 10.8644C2.7584 11.4664 3.8294 11.4986 5.9 11.5"
                                stroke="#8E8E93" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>
                </div>

                </div>
            </div>
            `;

        }
    });

    document.querySelectorAll(".gpt_message__footer-btn").forEach(copyBtn => {
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(copyBtn.parentNode.parentNode.innerText);
        };
    });
}

function getFileNameFromPath(filePath) {
    const lastIndex = filePath.lastIndexOf('/');
    if (lastIndex === -1) {
        return filePath; // Если '/' не найден, возвращаем всю строку (это может быть просто имя файла)
    }
    return filePath.substring(lastIndex + 1);
}
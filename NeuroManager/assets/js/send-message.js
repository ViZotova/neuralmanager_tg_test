
let chatRoll = document.querySelector(".window__chat-content");

document.querySelector("#desktop_search_btn").onclick = async () => {

    let messageText = document.querySelector("#desktop_search_input").value;
    document.querySelector("#desktop_search_input").value = '';

    

    if (messageText.trim() !== "") {

        const fileInput = document.querySelector(".chat-search__input input[type='file']");
        console.log(fileInput)
        const formData = new FormData();

        formData.append('tg_id', app_tg_id);
        formData.append('prompt', String(messageText));

        if (fileInput.files[0]) {
            chatRoll.innerHTML +=
            `<div class="user_message">
                <div class="user_message__file">
                    <div class="user_message__file-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M304 112L192 112C183.2 112 176 119.2 176 128L176 512C176 520.8 183.2 528 192 528L448 528C456.8 528 464 520.8 464 512L464 272L376 272C336.2 272 304 239.8 304 200L304 112zM444.1 224L352 131.9L352 200C352 213.3 362.7 224 376 224L444.1 224zM128 128C128 92.7 156.7 64 192 64L325.5 64C342.5 64 358.8 70.7 370.8 82.7L493.3 205.3C505.3 217.3 512 233.6 512 250.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128z"/></svg>
                    </div>
                    <div class="user_message__file-data">
                        <h3>${fileInput.files[0].name}</h3>
                        <p>Файл</p>
                    </div>
                </div>
                <div class="user_message__card">
                    <div class="user_message__text">${messageText}</div>
                </div>
            </div>`;
        }
        else {
            chatRoll.innerHTML +=
            `<div class="user_message">
                <div class="user_message__card">
                    <div class="user_message__text">${messageText}</div>
                </div>
            </div>`;
        }


        let mess = '';

        chatRoll.innerHTML +=
            `
        <div class="gpt_typing_marker">
            Печатает...
        </div>
        `;

        // Добавляем опциональные поля, если они заполнены
        // if (chat_id) formData.append('chat_id', 1);
        // if (project_id) formData.append('project_id', project_id);

        // Добавляем файл, если выбран
        if (fileInput.files[0]) {
            formData.append('file', fileInput.files[0]);
            console.log(fileInput.files[0]);
        }

        // Отправляем запрос
        await fetch('https://ai-meneger-edward0076.amvera.io/chat_gpt/message_all', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(res => {

                let typingMarker = chatRoll.lastChild.previousElementSibling;
                chatRoll.removeChild(typingMarker);

                console.log(res);

                mess = res.message.message.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
            });

        // await fetch("https://ai-meneger-edward0076.amvera.io/chat_gpt/message_all", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },

        //     body: JSON.stringify({
        //         chat_id: currentChatId,
        //         prompt: String(messageText),
        //         tg_id: 5254325840
        //     })
        // })

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
                <div class="gpt_message__footer-btn">
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
};

// For mobile

document.querySelector("#mobile_search_btn").onclick = async () => {

    let messageText = document.querySelector("#mobile_search_input").value;
    document.querySelector("#mobile_search_input").value = '';

    if (messageText.trim() !== "") {

        const fileInput = document.querySelector(".__mobile__chat-search__input input[type='file']");
        console.log(fileInput)
        const formData = new FormData();

        formData.append('tg_id', app_tg_id);
        formData.append('prompt', String(messageText));

        if (fileInput.files[0]) {
            chatRoll.innerHTML +=
            `<div class="user_message">
                <div class="user_message__file">
                    <div class="user_message__file-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M304 112L192 112C183.2 112 176 119.2 176 128L176 512C176 520.8 183.2 528 192 528L448 528C456.8 528 464 520.8 464 512L464 272L376 272C336.2 272 304 239.8 304 200L304 112zM444.1 224L352 131.9L352 200C352 213.3 362.7 224 376 224L444.1 224zM128 128C128 92.7 156.7 64 192 64L325.5 64C342.5 64 358.8 70.7 370.8 82.7L493.3 205.3C505.3 217.3 512 233.6 512 250.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128z"/></svg>
                    </div>
                    <div class="user_message__file-data">
                        <h3>${fileInput.files[0].name}</h3>
                        <p>Файл</p>
                    </div>
                </div>
                <div class="user_message__card">
                    <div class="user_message__text">${messageText}</div>
                </div>
            </div>`;
        }
        else {
            chatRoll.innerHTML +=
            `<div class="user_message">
                <div class="user_message__card">
                    <div class="user_message__text">${messageText}</div>
                </div>
            </div>`;
        }

        let mess = '';

        chatRoll.innerHTML +=
            `
        <div class="gpt_typing_marker">
            Печатает...
        </div>
        `;

        // Добавляем опциональные поля, если они заполнены
        // if (chat_id) formData.append('chat_id', 1);
        // if (project_id) formData.append('project_id', project_id);

        // Добавляем файл, если выбран
        if (fileInput.files[0]) {
            formData.append('file', fileInput.files[0]);
            console.log(fileInput.files[0]);
        }

        // Отправляем запрос
        await fetch('https://ai-meneger-edward0076.amvera.io/chat_gpt/message_all', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(res => {

                let typingMarker = chatRoll.lastChild.previousElementSibling;
                chatRoll.removeChild(typingMarker);

                console.log(res);

                mess = res.message.message.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
            });

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
                <div class="gpt_message__footer-btn">
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
};
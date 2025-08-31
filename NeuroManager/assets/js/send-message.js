
let chatRoll = document.querySelector(".window__chat-content");

document.querySelector("#desktop_search_btn").onclick = async () => {

    let messageText = document.querySelector("#desktop_search_input").value;
    document.querySelector("#desktop_search_input").value = '';

    if (messageText.trim() !== "") {

        chatRoll.innerHTML +=
            `<div class="user_message">
                <div class="user_message__card">
                    <div class="user_message__text">${messageText}</div>
                </div>
            </div>`;


        let mess = '';

        chatRoll.innerHTML +=
            `
        <div class="gpt_typing_marker">
            Печатает...
        </div>
        `;


        const fileInput = document.querySelector(".chat-search__input input[type='file']");
        console.log(fileInput)
        const formData = new FormData();

        formData.append('tg_id', app_tg_id);
        formData.append('prompt', String(messageText));

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
        chatRoll.innerHTML +=
            `<div class="user_message">
                <div class="user_message__card">
                    <div class="user_message__text">${messageText}</div>
                </div>
            </div>`;


        let mess = '';

        chatRoll.innerHTML +=
            `
        <div class="gpt_typing_marker">
            Печатает...
        </div>
        `;

        await fetch("https://ai-meneger-edward0076.amvera.io/chat_gpt/message_all", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                chat_id: currentChatId,
                prompt: String(messageText),
                tg_id: 5254325840
            })
        })
            .then(res => res.json())
            .then(res => {
                mess = res.message.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');

                let typingMarker = chatRoll.lastChild.previousElementSibling;
                chatRoll.removeChild(typingMarker);
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
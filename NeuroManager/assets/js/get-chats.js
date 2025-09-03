
window.onload = async () => {

    // let projectsList = [];

    // await fetch("https://ai-meneger-edward0076.amvera.io/projects/")
    // .then(res => res.json())
    // .then(res => {

    //     projectsList = [...res];

    // });

    let allProjects = [];

    await fetch(`https://ai-meneger-edward0076.amvera.io/projects/by_tg/${app_tg_id}`)
        .then(projectsList => {
            return projectsList.json();
        })
        .then(projectsList => {

            console.log(projectsList);

            projectsList.forEach(project => {

                currentProjectBlank = {
                    title: project.title,
                    id: project.id,
                    chats: new Array()
                };

                fetch(`https://ai-meneger-edward0076.amvera.io/projects/${project.id}/chats`)
                    .then(chatsData => {
                        return chatsData.json()
                    })
                    .then(chatsData => {

                        chatsData.forEach(chat => {
                            currentProjectBlank.chats.push({
                                chat_id: chat.id,
                                title: chat.title
                            });
                        });
                    });

                allProjects.push(currentProjectBlank);
            });

            allProjects.forEach(async (projectData) => {

                document.querySelector(".sidebar__catalog-chats").innerHTML +=
                    `
            <div class="sidebar__catalog-folder" data-folder-order="${projectData.id}">
                <div class="catalog-folder__header" data-folder-order="${projectData.id}">
                    <div class="catalog-folder__icon">
                        <svg class="__folder__closed" width="19" height="18" viewBox="0 0 19 18" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M5.25 4.55556H13.5375C15.3285 4.55556 16.2235 4.55556 16.867 5.00533C17.1451 5.19977 17.384 5.44955 17.5699 5.74044C18 6.41333 18 7.34933 18 9.22222C18 12.3431 18 13.904 17.2835 15.0249C16.9733 15.5104 16.5747 15.9272 16.1105 16.2516C15.0403 17 13.5477 17 10.5625 17H9.5C5.4931 17 3.48965 17 2.2444 15.6978C1 14.3973 1 12.3022 1 8.11111V5.39467C1 3.78044 1 2.97333 1.323 2.36711C1.55346 1.93518 1.89426 1.57879 2.3073 1.33778C2.887 1 3.6588 1 5.2024 1C6.1918 1 6.6865 1 7.12 1.16978C8.10855 1.55733 8.51655 2.49689 8.9628 3.42933L9.5 4.55556"
                                stroke="black" stroke-width="1.4" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                        <svg class="__folder__expanded" width="19" height="18" viewBox="0 0 19 18" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
d="M4.24219 0C5.00989 -1.30247e-06 5.61349 -0.0140535 6.15137 0.236328C6.74108 0.510335 7.12845 0.9684 7.40723 1.43848C7.67815 1.8954 7.88081 2.42407 8.05957 2.86816L8.33691 3.55566H12.1104C12.8465 3.55566 13.464 3.55421 13.9629 3.61719C14.483 3.68287 14.9522 3.82617 15.3623 4.16602L15.4756 4.26465C15.7351 4.50317 15.9538 4.79115 16.125 5.10938L16.2373 5.34375C16.4303 5.80223 16.5042 6.32278 16.5381 6.92969C17.009 7.05466 17.4291 7.27607 17.7461 7.68457H17.7471C18.4045 8.533 18.2892 9.57659 18.0703 10.3809C17.8564 11.1665 17.4375 12.0486 17.2637 12.5117C16.8878 13.5128 16.5891 14.3098 16.2861 14.9307C15.9776 15.5629 15.6378 16.0692 15.1504 16.4668L15.1514 16.4678C14.4235 17.0617 13.5577 17.2763 12.752 17.3555C11.9686 17.4323 11.1197 17.3867 10.4805 17.3867H8.89941C8.85399 17.396 8.80694 17.4004 8.75879 17.4004H7.86426C6.95932 17.4004 6.15154 17.3997 5.43457 17.3721C4.82803 17.3573 4.29544 17.3277 3.83496 17.2646C3.01687 17.1526 2.31393 16.9234 1.78027 16.4082C1.57397 16.2464 1.38159 16.0581 1.2041 15.8379C0.556636 15.0344 0.272756 14.0276 0.135742 12.7637C-0.000423451 11.5068 0 9.88948 0 7.81055V5.0957C-1.40513e-07 4.29896 -0.000141895 3.66416 0.0361328 3.1543C0.0724966 2.64349 0.148994 2.19935 0.331055 1.79102C0.559109 1.26282 0.926315 0.806415 1.39355 0.470703L1.40332 0.462891V0.463867C1.77905 0.203516 2.19149 0.0960893 2.64062 0.046875C3.07392 -0.000570515 3.60716 -2.1579e-10 4.24219 0ZM5.88477 8.14258C5.48052 8.14257 5.1759 8.12413 4.8623 8.15918C4.57245 8.19168 4.3789 8.26276 4.24023 8.38086L4.24121 8.38184C4.16514 8.4473 4.08146 8.55078 3.96875 8.78418C3.85086 9.02836 3.72709 9.35653 3.54199 9.85156C3.54068 9.85482 3.5374 9.85809 3.53613 9.86133C3.17759 10.8141 2.68315 11.7979 2.4082 12.8633C2.1386 13.9083 2.17598 14.7265 2.66699 15.3125C2.67479 15.3218 2.68425 15.3298 2.69238 15.3389C3.02522 15.5852 3.44913 15.7466 4.04883 15.8467C4.45813 15.915 4.92757 15.9516 5.47754 15.9727C6.01968 15.9853 6.64846 15.9863 7.38379 15.9863H10.4805C11.2343 15.9863 11.9222 16.0309 12.6152 15.9629C13.2863 15.897 13.839 15.7308 14.2656 15.3828L14.3652 15.2959C14.5939 15.0818 14.7986 14.7861 15.0273 14.3174C15.2944 13.77 15.5679 13.0458 15.9531 12.0195C16.2037 11.3519 16.5229 10.7329 16.7188 10.0137C16.9095 9.31304 16.8747 8.84637 16.6396 8.54297C16.5413 8.41618 16.3656 8.29254 15.8564 8.21973C15.3311 8.14464 14.6084 8.14258 13.5439 8.14258H5.88477ZM4.24219 1.40039C3.5762 1.40039 3.1325 1.4013 2.79297 1.43848C2.47286 1.47357 2.31539 1.53442 2.20312 1.61133C1.94503 1.79856 1.74267 2.0529 1.61621 2.3457L1.61133 2.35645C1.52381 2.55074 1.46418 2.81054 1.43262 3.25391C1.40072 3.70249 1.40039 4.27891 1.40039 5.0957V7.81055C1.40039 9.21927 1.40173 10.3682 1.43945 11.3223C1.72226 10.5683 2.0427 9.86044 2.23047 9.36035C2.407 8.88824 2.55588 8.49092 2.70801 8.17578C2.86541 7.84983 3.05081 7.5588 3.32812 7.32031L3.3291 7.31934C3.76262 6.94829 4.26771 6.81676 4.70703 6.76758C5.12391 6.72098 5.58434 6.74217 5.88477 6.74219H13.5439C14.1306 6.74219 14.6584 6.7434 15.124 6.76074C15.0822 6.27375 15.0086 5.98872 14.8926 5.77344L14.8916 5.77246C14.774 5.55388 14.628 5.37508 14.4697 5.24414H14.4688C14.3367 5.13478 14.1574 5.05254 13.7881 5.00586C13.3971 4.95648 12.8826 4.95508 12.1104 4.95508H4.91406C4.52757 4.95506 4.21403 4.64231 4.21387 4.25586C4.21406 3.86943 4.5276 3.55568 4.91406 3.55566H6.82715L6.76074 3.3916V3.39062C6.56408 2.90205 6.40613 2.49472 6.20312 2.15234C6.00791 1.82322 5.80621 1.61815 5.5625 1.50488H5.56152C5.37057 1.41584 5.1408 1.40039 4.24219 1.40039Z"
                                fill="black" />
                        </svg>
                    </div>
                    <div class="catalog-folder__name">
                        ${projectData.title}
                    </div>
                </div>

                <div class="catalog-folder__inner">
                    
                </div>
            </div>
        `;

                let currentInner = document.querySelector(`.sidebar__catalog-folder[data-folder-order="${projectData.id}"] .catalog-folder__inner`);

                await fetch(`https://ai-meneger-edward0076.amvera.io/projects/${projectData.id}/chats`)
                    .then(chatsData => {
                        return chatsData.json()
                    })
                    .then(chatsData => {

                        chatsData.forEach(chat => {

                            console.log(chat);

                            currentInner.innerHTML +=
                                `
                            <div class="folder-inner__link" data-chat-id="${chat.id}">
                                <div class="inner-link__space"></div>
                                <div class="inner-link__name">
                                    ${chat.title}
                                </div>
                            </div>
                            `
                        });
                    });

                await fetch(`https://ai-meneger-edward0076.amvera.io/chat_gpt/chats/${app_tg_id}`)
                    .then(chatsList => {
                        return chatsList.json();
                    })
                    .then(chatsList => {
                        console.log(chatsList);
                        chatsList.forEach(chat => {
                            if (chat.project_id === null) {
                                document.querySelector(".sidebar__catalog-chats").innerHTML +=
                                    `
                    <div class="sidebar__catalog-link user-chats-link" onclick="openChat(${chat.id})" data-chat-id="${chat.id}">
                        <div class="catalog-link__name">
                            ${chat.title}
                        </div>
                    </div>
                    `;
                            }
                        });
                    });

                let currentFolder = document.querySelector(`.catalog-folder__header[data-folder-order="${projectData.id}"]`);

                currentFolder.onclick = (event) => {
                    let folderID = currentFolder.dataset.folderOrder;
                    // document.querySelector(`.sidebar__catalog-folder[data-folder-order='${folderID}'`).classList.toggle("__expanded");

                    document.querySelector(".__tab_opened").classList.remove("__tab_opened");
                    document.querySelector(".window__folder_observe").classList.add("__tab_opened");

                    document.querySelector(".sidebar").classList.add("__closed");
                    document.querySelector(".sidebar__back_overlay").classList.remove("__opened");

                    openProject(folderID);

                };


                // document.querySelectorAll(".folder-inner__link").forEach(link => {

                //     link.onclick = () => {

                //         // Clear input
                //         document.querySelector(".chat-search__input .search__input-field").value = "";
                //         document.querySelector(".__mobile__chat-search__input .search__input-field").value = "";

                //         // Open Chat Window
                //         document.querySelector(".__tab_opened").classList.remove("__tab_opened");
                //         document.querySelector(".window__chat-container").classList.add("__tab_opened");

                //         // Close sidebar
                //         document.querySelector(".sidebar").classList.add("__closed");
                //         document.querySelector(".sidebar__back_overlay").classList.remove("__opened");

                //         currentChatId = Number(link.dataset.chatId);
                //         openChat(link.dataset.chatId);
                //     }
                // });

            });

        });
}

function openChat(chat_id) {

    document.querySelector(".sidebar").classList.add("__closed");
    document.querySelector(".sidebar__back_overlay").classList.remove("__opened");

    document.querySelector(".__tab_opened").classList.remove("__tab_opened");
    document.querySelector(".window__chat-content").classList.add("__tab_opened");
    document.querySelector(".window__chat-content").innerHTML = "";

    fetch(`https://ai-meneger-edward0076.amvera.io/chat_gpt/messages/${chat_id}`)
        .then(res => res.json())
        .then(res => {
            renderChat(res);
        });
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
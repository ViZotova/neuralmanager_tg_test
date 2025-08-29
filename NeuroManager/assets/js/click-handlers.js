document.querySelectorAll(".catalog-folder__header").forEach(folder => {

    folder.onclick = () => {        
        let folderID = folder.dataset.folderOrder;

        document.querySelector(`.sidebar__catalog-folder[data-folder-order='${folderID}'`).classList.toggle("__expanded");
    };
});

document.querySelector(".window__header-sidebar_button").onclick = () => {
    document.querySelector(".sidebar").classList.remove("__closed");
    document.querySelector(".sidebar__back_overlay").classList.add("__opened");
};

document.querySelector(".sidebar__xmark").onclick = () => {
    document.querySelector(".sidebar").classList.add("__closed");
        document.querySelector(".sidebar__back_overlay").classList.remove("__opened");
};

document.querySelector(".sidebar__back_overlay").onclick = () => {
    document.querySelector(".sidebar").classList.add("__closed");
    document.querySelector(".sidebar__back_overlay").classList.remove("__opened");
};

document.querySelector(".filters_modal__overlay").onclick = (event) => {
    if (event.target.classList.contains("filters_modal__overlay")) {
        document.querySelector(".filters_modal").classList.remove("__modal_opened");        
    }
};

document.querySelector("#tokens_link").onclick = () => {
    document.querySelector(".__tab_opened").classList.remove("__tab_opened");
    document.querySelector(".window__token_info").classList.add("__tab_opened");
    
    document.querySelector(".sidebar").classList.add("__closed");
    document.querySelector(".sidebar__back_overlay").classList.remove("__opened");
};

document.querySelector("#newchat_link").onclick = () => {
    document.querySelector(".__tab_opened").classList.remove("__tab_opened");
    document.querySelector(".window__chat-container").classList.add("__tab_opened");
    
    document.querySelector(".sidebar").classList.add("__closed");
    document.querySelector(".sidebar__back_overlay").classList.remove("__opened");
};

document.querySelector(".search__input-plus").onclick = () => {

};
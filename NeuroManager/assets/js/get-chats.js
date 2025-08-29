
window.onload = async () => {

    let projectsList = [];

    await fetch("https://ai-meneger-edward0076.amvera.io/projects/")
    .then(res => res.json())
    .then(res => {
        
        projectsList = [...res];

    });


    let chatsList = [];
    
    await fetch("https://ai-meneger-edward0076.amvera.io/chat_gpt/chats/5254325840")
    .then(res => res.json())
    .then(res => {
        
        chatsList = [...res];

    });
}

    


const { ipcRenderer } = require("electron");

const displayNotification = (message, type) => {
    const notificationEl = document.createElement('div');
    notificationEl.id = "notification";
    notificationEl.innerHTML = `
    <style>
#notification {
    position: absolute;
    display: flex;
    top: 50px;
    right: -350px;
    background-color: #333;
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    font-family: gamefont;
    font-size: 14px;
    width: 300px;
    height: 50px;
    z-index: 999;
}

#notification.slide-in {
    transform: translateX(-380px);
    transition: all 1s cubic-bezier(0.87, 0, 0.13, 1);
}

#notification.slide-out {
    transform: translateX(380px);
    transition: all 1s cubic-bezier(0.87, 0, 0.13, 1);
}

#notification-content {
    text-align: center;
    color: white;
    flex-warp: nowrap;
}

#notification-timer {
    position: absolute;
    bottom: 0;
    right: 0;
    margin-right: 5px;
    margin-bottom: 2px;
    justify-content: flex-end;
    font-size: 12px;
    color: white;
}
#notification-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 0;
    bottom: 0;
    margin-left: 20px;
    margin-bottom: 5px;
    font-size:10px;
}

.bounce {
    transform: scale(1.2)!important;
    transition: transform 0.2s ease-in-out!important;
    display: inline-block!important;
}
    
</style>
        <div id="notification-content">${message}</div>
        <div id="notification-timer">10</div>
        <div id="notification-actions" style="${type === 1 ?'' : 'display: none;'}">
            <div >
                <span id="y" style="background-color: #444; border-radius: 4px; padding: 2px 4px; color: white; margin-right: 3px; display: inline-block;">Y</span>
                <span style="color:white">/</span>
                <span id="n" style="background-color: #444; border-radius: 4px; padding: 2px 4px; color: white; margin-left: 3px; margin-right: 5px; display: inline-block;">N</span>
            </div>
        </div>
    `;

    document.body.appendChild(notificationEl);


    //timeout galore
    setTimeout(() => {
        notificationEl.classList.add('slide-in');
    }, 10);

    const timerEl = notificationEl.querySelector('#notification-timer');
    const timerInterval = setInterval(() => {
        timerEl.textContent = Number(timerEl.textContent) - 1;
    }, 1000);

    setTimeout(() => {
        clearInterval(timerInterval);
        notificationEl.classList.add('slide-out');
        document.removeEventListener('keydown', handleKeyDown);
        ipcRenderer.send("notificationResponse", false)
        setTimeout(() => {
            notificationEl.remove();
        }, 2000);
    }, 10000);

    const handleKeyDown = (event) => {
        if (event.key === 'y' || event.key === 'n') {
            const action = event.key === 'y' ? true : false;
            ipcRenderer.send('notificationResponse', action);
            notificationEl.classList.add('slide-out');
            notificationEl.querySelector(`#${event.key}`).classList.add('bounce');
            document.removeEventListener('keydown', handleKeyDown);
            setTimeout(() => {
                notificationEl.remove();
            }, 2000);
        }
    };

    document.addEventListener('keydown', handleKeyDown);
};

ipcRenderer.on("notification", (event, message, type) => {
    displayNotification(message, type);
});


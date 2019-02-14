/* MESSAGING */
function requestController(port, request, sender) {

    if (!request || !request.type) {
        console.error(`invalid request: ${request.type} - ${request}`);
    }

    switch (request.type) {

        case `SAY_HELLO`:
        const currentTime = Date.now() / 1000;
            localStorage.setItem(`lastHello`, currentTime);
            port.postMessage(createResponse(`SAY_HELLO_RESPONSE`, createPayload(currentTime)));
            break;

        case `LAST_HELLO`:
            port.postMessage(createResponse(`LAST_HELLO_RESPONSE`, createPayload(localStorage.getItem(`lastHello`))));
            break;
    }
}

/* RESPONSE CREATION */
function createResponse(type, payload = createPayload(), error = null) {
    return {
        origin: `background`,
        error,
        type,
        payload
    }
}

function createPayload(data = { data: null }) {
    return {
        data
    }
}

/* BOOTSTRAPPING */

// Listens for single messages sent
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.type) {
        case `ID`:
            sendResponse(createResponse(`ID_RESPONSE`, createPayload(sender.tab.id)));
            break;
    }
});

// Listens on port and sends messages to controller
browser.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener((request, sender) => {
        requestController(port, request, sender);
    });
});
/* REPO */
function save(field, data) {
    localStorage.setItem(field, data);
}

function load(field) {
    return localStorage.getItem(field);
}

/* MESSAGING */
function requestController(port, request, sender) {

    if (!request || !request.type) {
        console.log(`error in request: `, request);
        throw new Error(`invalid request: ${request.type} - ${request}`);
    }

    switch (request.type) {

        case `SAY_HELLO`:
            currentTime = Date.now() / 1000;
            save(`hello`, currentTime);
            port.postMessage(createResponse(`SAY_HELLO_RESPONSE`, createPayload(currentTime)));
            break;

        case `LAST_HELLO`:
            port.postMessage(createResponse(`LAST_HELLO_RESPONSE`, createPayload(load(`hello`))));
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
            sendResponse(createResponse(`ID_RESPONSE`, sender.tab.id));
            break;
    }
});

// Listens on port and sends messages to controller
browser.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener((request, sender) => {
        requestController(port, request, sender);
    });
});
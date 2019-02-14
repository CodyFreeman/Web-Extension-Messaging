// Gets tab id for future use
function init() {
    return new Promise((resolve) => {
        browser.runtime.sendMessage({ type: `ID` }, (response) => {
            resolve(response.payload.data);
        });
    })
}

// Controller to deal with responses from the background script
function responseController(response) {
    if (!response || !response.type) {
        console.error(`invalid response: ${response.type} - ${response}`);
    }

    // Logic depending on response type
    switch (response.type) {
        case `SAY_HELLO_RESPONSE`:
            console.log(`SAY HELLO: ${response.payload}`);
            break;

        case `LAST_HELLO_RESPONSE`:
            console.log(`LAST HELLO: ${response.payload}`);
            break;
    }
}

/* BOOTSTRAPPING */
init()
    .then((tabId) => {

        // Creating port to background script
        const port = browser.runtime.connect();

        // Creating listener on port
        port.onMessage.addListener((response) => {
            responseController(response);
        });

        // TODO: Better example
        if (tabId % 2) {
            port.postMessage({ origin: tabId, type: `SAY_HELLO` });
        } else {
            port.postMessage({ origin: tabId, type: `LAST_HELLO` });
        }
    })
    .catch((e) => {
        console.error(`
        --- ERROR CAUGHT ---
        ${e.message}
        ---
        `);
    });
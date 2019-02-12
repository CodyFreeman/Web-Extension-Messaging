// Gets tab id for future use
function init() {
    return new Promise((resolve, reject) => {
        browser.runtime.sendMessage({ type: `ID` }, (response) => {
            resolve(response.payload);
        });
    })
}

// Controller to deal with responses from the background script
function responseController(port, response) {
    if (!response || !response.type) {
        console.log(`error in resonse: `, response);
        throw new Error(`invalid response: ${response.type} - ${response}`);
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
    .then((id) => {
        // Store Tab ID as tab cannot identify itself.
        const tabId = id;

        // Creating port to background script
        const port = browser.runtime.connect();

        // Creating listener on port
        port.onMessage.addListener((response) => {
            responseController(port, response);
        });

        if (tabId % 2) {
            port.postMessage({ origin: tabId, type: `SAY_HELLO` });
        } else {
            port.postMessage({ origin: tabId, type: `LAST_HELLO` });
        }
    })

    .catch((e) => {
        console.log(`--- ERROR CAUGHT ---`);
        console.log(e.message);
        console.log(`---`);
    });
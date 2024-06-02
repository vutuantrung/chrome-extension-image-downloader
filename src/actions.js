/*global chrome*/

export const downloadMedias = (mediasToDownload, options) => {
    return new Promise((resolve) => {
        console.log('[mediasToDownload]', mediasToDownload);
        console.log('[options]', options);
        chrome.runtime.sendMessage({ type: "downloadMedias", mediasToDownload, options }, (data) => {
            resolve(data);
        });
    });
};

export const getMediasFromTabs = () => {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: "getMediasFromTabs" }, (data) => {
            resolve(data);
        });
    });
};

export const getPageCookie = () => {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: "getCookies" }, (data) => {
            resolve(data);
        });
    });
};

export const getPageDOMElement = () => {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: "getPageDomElement" }, (data) => {
            resolve(data);
        });
    });
};

export const getCurrentTab = () => {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: "getCurrentTab" }, (data) => {
            resolve(data);
        });
    });
};

export const runScriptInCurrentTab = () => {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: "runScriptInCurrentTab" }, (data) => {
            resolve(data);
        });
    });
};

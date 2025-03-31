/*global chrome*/

export const downloadMedias = (mediasToDownload, options) => {
	return new Promise((resolve) => {
		// console.log('[mediasToDownload]', mediasToDownload);
		// console.log('[options]', options);
		chrome.runtime.sendMessage({ type: "DOWNLOAD_MEDIAS", mediasToDownload, options }, (data) => {
			resolve(data);
		});
	});
};

export const getMediasFromTabs = () => {
	return new Promise((resolve) => {
		chrome.runtime.sendMessage({ type: "GET_TABS_MEDIAS" }, (data) => {
			resolve(data);
		});
	});
};

export const getPageCookie = () => {
	return new Promise((resolve) => {
		chrome.runtime.sendMessage({ type: "GET_COOKIES" }, (data) => {
			resolve(data);
		});
	});
};

export const getPageDOMElement = () => {
	return new Promise((resolve) => {
		chrome.runtime.sendMessage({ type: "GET_TAB_DOM" }, (data) => {
			resolve(data);
		});
	});
};

export const getCurrentTab = () => {
	return new Promise((resolve) => {
		chrome.runtime.sendMessage({ type: "GET_CURRENT_TAB" }, (data) => {
			resolve(data);
		});
	});
};

export const runScriptInCurrentTab = () => {
	return new Promise((resolve) => {
		chrome.runtime.sendMessage({ type: "RUN_SCRIPTS_IN_CURRENT_TAB" }, (data) => {
			resolve(data);
		});
	});
};

export const fetchData = (url, method, headers, body) => {
	return new Promise((resolve) => {
		chrome.runtime.sendMessage({ type: "FETCH_DATA", url, method, headers, body }, (data) => {
			resolve(data);
		});
	});
};
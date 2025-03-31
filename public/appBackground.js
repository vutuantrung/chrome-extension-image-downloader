/*global chrome*/

const tasks = new Set();
// const tabsWithImages = {};
const imageMimeTypes = {
	"image/jpeg": true,
	"image/png": true,
	"image/gif": true,
	"image/webp": true,
	"video/webm": true,
};

const imageExtensions = {
	jpg: true,
	jpeg: true,
	png: true,
	gif: true,
	webp: true,
	webm: true,
};

chrome.runtime.onMessage.addListener(listeners);
chrome.downloads.onDeterminingFilename.addListener(suggestNewFilename);

function listeners(message, sender, sendResponse) {
	if (message.type === "DOWNLOAD_MEDIAS") {
		downloadMedias({
			numberOfProcessedImages: 0,
			startIndex: parseInt(message.options.start_index),
			mediasToDownload: message.mediasToDownload,
			options: message.options,
			next() {
				this.startIndex += 1;
				this.numberOfProcessedImages += 1;
				if (this.numberOfProcessedImages === this.mediasToDownload.length) {
					tasks.delete(this);
				}
			},
		}).then((result) => {
			sendResponse(result);
		});

		return true;
	}

	if (message.type === "GET_TABS_MEDIAS") {
		extractMediasFromTabs().then((result) => {
			sendResponse({ tabMedias: result });
		});

		return true;
	}

	if (message.type === "GET_TAB_DOM") {
		collectDomFromPage().then((result) => {
			sendResponse({
				domString: result.domString,
				baseUri: result.baseUri,
			});
		});

		return true;
	}

	if (message.type === "GET_CURRENT_TAB") {
		getCurrentTab().then((result) => {
			sendResponse(result);
		});

		return true;
	}

	if (message.type === "RUN_SCRIPTS_IN_CURRENT_TAB") {
		// import("./testScript.js");
		runScriptInCurrentTab().then((result) => {
			// const token = import("DTSGInitialData").token;
			import("./testScript.js");
			const token = "NAcMzSAtTTdRVu_rbJg3OS_IsvI9cb0ZJDjbUo8_S4yjSeq7Vb3jF5Q:27:1699035696s";
			sendResponse({ result, token });
		});

		return true;
	}

	if (message.type === "GET_COOKIES") {
		// import("./testScript.js");
		getCookieFromPage().then((cookie) => {
			sendResponse(cookie);
		});

		return true;
	}

	if (message.type === "FETCH_DATA") {
		fetch(message.url, {
			method: message.method,
			headers: message.headers,
			body: message.body,
		})
			.then((response) => response.json())
			.then((data) => {
				sendResponse(data);
			})
			.catch((error) => {
				console.error("Error:", error);
				sendResponse({ error: "Failed to fetch data" });
			});

		return true;
	}
}

async function runScriptInTab({ func, tabId, args = [] }) {
	return new Promise((resolve, reject) => {
		chrome.scripting.executeScript(
			{
				target: { tabId: tabId },
				func: func,
				args: args,
				world: chrome.scripting.ExecutionWorld.MAIN,
				injectImmediately: true,
			},
			(injectionResults) => {
				// https://developer.chrome.com/docs/extensions/reference/scripting/#handling-results
				resolve(injectionResults?.find?.((_) => _.result)?.result);
			}
		);
	});
}

async function runScriptFile({ scriptFile, tabId, args = [] }) {
	return new Promise((resolve, reject) => {
		chrome.scripting.executeScript(
			{
				target: { tabId: tabId },
				files: [scriptFile],
				args: args,
				world: chrome.scripting.ExecutionWorld.MAIN,
				injectImmediately: true,
			},
			(injectionResults) => {
				// https://developer.chrome.com/docs/extensions/reference/scripting/#handling-results
				resolve(injectionResults?.find?.((_) => _.result)?.result);
			}
		);
	});
}

async function runScriptInCurrentTab(func, args) {
	const tab = await getCurrentTab();
	focusToTab(tab);
	return await runScriptInTab({ func, args, tabId: tab.id });
}

async function runScriptFileInCurrentTab(scriptFile, args) {
	const tab = await getCurrentTab();
	focusToTab();
	return await runScriptFile({ scriptFile, args, tabId: tab.id });
}

function focusToTab(tab) {
	return chrome.tabs.update(tab.id, { active: true });
}

function closeTab(tab) {
	return chrome.tabs.remove(tab.id);
}

async function getCurrentTabId() {
	return (await getCurrentTab())?.id;
}

function getCurrentTab() {
	return new Promise((resolve) => {
		chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
			resolve(tabs[0]);
		});
	});
}

async function openWebAndRunScript({ url, func, args, focusAfterRunScript = true, closeAfterRunScript = false }) {
	// https://stackoverflow.com/a/68634884/11898496
	const tab = await chrome.tabs.create({ active: false, url: url });
	const res = await runScriptInTab({ func, tabId: tab.id, args });
	!closeAfterRunScript && focusAfterRunScript && focusToTab(tab);
	closeAfterRunScript && closeTab(tab);
	return res;
}

function attachDebugger(tab) {
	return chrome.debugger.attach({ tabId: tab.id }, "1.2");
}

function detachDebugger(tab) {
	return chrome.debugger.detach({ tabId: tab.id });
}

async function downloadMedias(task) {
	let completeDownloadMedias = [];
	tasks.add(task);
	for (const media of task.mediasToDownload) {
		await new Promise((resolve) => {
			chrome.downloads.download({ url: media.src }, (downloadId) => {
				let success = true;
				let errorMsg = "";
				if (downloadId == null) {
					if (chrome.runtime.lastError) {
						errorMsg = chrome.runtime.lastError.message;
						console.log(`${media.src}:`, chrome.runtime.lastError.message);
					}
					success = false;
					task.next();
				}

				resolve({
					mediaId: media.id,
					success: success,
					errorMsg: errorMsg,
				});
			});
		}).then((result) => {
			completeDownloadMedias.push(result);
		});
	}

	return {
		completeDownloadMedias: completeDownloadMedias,
		lastIndex: task.options.new_file_name === "" ? 0 : task.startIndex,
	};
}

function suggestNewFilename(item, suggest) {
	const task = [...tasks][0];
	if (!task) {
		suggest();
		return;
	}

	let newFilename = "";
	if (task.options.folder_name) {
		newFilename += `${task.options.folder_name.trim()}/`;
	}
	let genre = task.options.genre === "none" ? "" : `[${task.options.genre}]`;
	if (task.options.new_file_name) {
		const regex = /(?:\.([^.]+))?$/;
		const extension = regex.exec(item.filename)[1];
		// const numberOfDigits = task.mediasToDownload.length.toString().length;
		const formattedImageNumber = `${task.startIndex}`.padStart(3, "0");

		newFilename += `${genre}${task.options.new_file_name}_${formattedImageNumber}.${extension}`;
	} else {
		newFilename += `${genre}${item.filename}`;
	}

	suggest({
		filename: normalizeSlashes(newFilename),
	});
	task.next();
}

function collectDomFromPage() {
	return new Promise((resolve) => {
		chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
			chrome.scripting.executeScript(
				{
					target: { tabId: tabs[0].id, allFrames: true },
					func: () => document.documentElement.innerHTML,
				},
				(results) => {
					resolve({ domString: results[0].result, baseUri: tabs[0].url });
				}
			);
		});
	});
}

function getCookieFromPage() {
	return new Promise((resolve) => {
		chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
			chrome.scripting.executeScript(
				{
					target: { tabId: tabs[0].id, allFrames: true },
					func: () => document.cookie,
				},
				(results) => {
					resolve({ cookie: results });
				}
			);
		});
	});
}

function extractMediasFromTabs() {
	return new Promise((resolve) => {
		const tabsToReturn = [];
		chrome.tabs.query({ currentWindow: true }, async (tabs) => {
			for (let i = 0; i < tabs.length; i++) {
				const tabObj = {
					id: generateRandomId(7),
					tabId: tabs[i].id,
					mediaType: "image",
					thumbs: tabs[i].url,
					src: tabs[i].url,
				};

				// regex captures extension
				const urlFileExtension = tabs[i].url.match(/.+\.([^?]+)(\?|$)/);
				if (urlFileExtension) {
					if (imageExtensions[urlFileExtension[1].toLowerCase()]) {
						tabsToReturn.push(tabObj);
					} else {
						const response = await fetch(tabs[i].url);
						const contentType = response.headers.get("content-type");
						const isImageUrl = imageMimeTypes[contentType] || false;
						if (isImageUrl) {
							tabsToReturn.push(tabObj);
						}
					}
				}
			}

			resolve(tabsToReturn);
		});
	});
}

async function getCookie(domain, raw = false) {
	let cookies = await chrome.cookies.getAll({ domain });
	return raw ? cookies : cookies.map((_) => _.name + "=" + decodeURI(_.value)).join(";");
}

//////////////// Utils ////////////////
function generateRandomId(length) {
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	const charactersLength = characters.length;
	let result = "";
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

function normalizeSlashes(filename) {
	return filename.replace(/\\/g, "/").replace(/\/{2,}/g, "/");
}

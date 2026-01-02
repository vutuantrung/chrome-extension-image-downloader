let overlay = null;
let box = null;
let start = null;
let lastContextElement = null;

document.addEventListener(
	"contextmenu",
	(e) => { lastContextElement = e.target; },
	true
);

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
	// keep your existing START_AREA_SELECTION handler
	if (msg?.type === "START_AREA_SELECTION") {
		startSelection();
		return;
	}

	if (msg?.type === "MENU_COLLECT_CODE_DOM" || msg?.type === "MENU_COLLECT_IDOL_NAME_DOM") {
		const content = msg.content || "code";
		try {
			extractElements(content)
				.then((res) => {
					console.log('[MENU_COLLECT_IDOL_NAME_DOM]', res)
					if (res) sendResponse({ ok: true, data: res });
				})
		} catch (e) {
			sendResponse({ ok: false, error: String(e) });
		}
		return true; // async response safe
	}

	if (msg?.type === "MENU_COLLECT_CODE_HREF") {
		try {
			const el = lastContextElement;
			if (!el) {
				sendResponse({ ok: false, error: "No cached right-click element yet." });
				return true;
			}
			const hrefs = collectHrefs(el);
			sendResponse({
				ok: true,
				target: describeElement(el),
				hrefs
			});
		} catch (e) {
			sendResponse({ ok: false, error: String(e) });
		}
		return true;
	}
});

async function extractElements(contentType) {
	return new Promise((resolve, reject) => {
		const currentHref = location.href;
		if (currentHref.startsWith("https://www.javdatabase.com/movies/")) {
			let contentId = "", releaseDate = "", fullCodeDateRetrieved = "", allIdolsHrefs = [];
			const allmb1Eles = document.querySelectorAll("p[class='mb-1']")
			for (const e of allmb1Eles) {
				const bEle = e.querySelector("b");
				const bEleInnerText = bEle.innerText.toLowerCase().trim();
				if (bEleInnerText === "content id:") {
					contentId = e.innerText.toLowerCase().replace(bEleInnerText, "").trim();
				}
				if (bEleInnerText === "release date:") {
					const releaseDateString = e.innerText.toLowerCase().replace(bEleInnerText, "").trim();
					if (releaseDateString) {
						releaseDate = new Date(releaseDateString).getTime().toString();
					}
				}
				if (bEleInnerText === "idol(s)/actress(es):") {
					const allIdolHrefElements = e.querySelectorAll("a");
					for (const idolA of allIdolHrefElements) {
						allIdolsHrefs.push(idolA.getAttribute("href").trim());
					}
				}
			}

			if (contentId && releaseDate) {
				fullCodeDateRetrieved = `${contentId}-${releaseDate}`
				console.log(fullCodeDateRetrieved);
				if (contentType === "code") {
					resolve(fullCodeDateRetrieved);
					return;
				}

				chrome.runtime.sendMessage({
					type: "FETCH_DATA",
					url: `https://javher.com/api/video/watch-${fullCodeDateRetrieved}`,
					headers: {
						"Content-Type": "application/json",
						"Accept": "application/json",
						"Authorization": "HAHA_ADAM_HAVE_TO_RESORT_TO_THIS#@!@#",
					},
				}, (reqResult) => {
					if (!reqResult.success) {
						resolve("");
						return;
					}
					console.log("herere", reqResult)
					const fetchedIdolQueryNames = reqResult?.video?.casts?.[0]?.slug || "";
					const domIdolName = allIdolsHrefs?.[0]?.replace("https://www.javdatabase.com/idols", "")?.replaceAll("/", "")?.trim() || "";
					const queryIdolName = domIdolName + "," + fetchedIdolQueryNames;
					console.log('[queryIdolName]', queryIdolName)
					resolve(queryIdolName);
				});
			}
		}

		if (currentHref.startsWith("https://javher.com/video/watch-")) {
			let fullCodeDateRetrieved = currentHref.replace("https://javher.com/video/watch-", "").trim();
			console.log(fullCodeDateRetrieved)
			resolve(fullCodeDateRetrieved);
			return;
		}
	});

}

function collectHrefs(rootEl) {
	const out = [];
	const seen = new Set();
	console.log('[rootEl]', rootEl, rootEl.className, rootEl.tagName);

	if (rootEl && rootEl.tagName.toLowerCase() === "img" && rootEl.className === "card-img-top video-image") {
		//movie-cover-thumb
		let parentEle = rootEl.parentElement;
		while (true) {
			if (parentEle.className === "card-container") {
				console.log("searched parent node")
				break;
			}
			parentEle = parentEle.parentElement;
			console.log('[parentElement]', parentEle, parentEle.className)
		}

		// Collect descendant links
		const links = parentEle.querySelectorAll("a[href]");
		for (const a of links) {
			const href = a.href; // absolute URL resolved by browser
			if (!href) continue;
			if (seen.has(href)) continue;
			seen.add(href);
			out.push({
				href,
				text: (a.innerText || a.textContent || "").trim().slice(0, 500)
			});
		}
	}

	if (rootEl && rootEl.tagName.toLowerCase() === "img" && rootEl.parentElement.parentElement.className === "movie-cover-thumb") {
		const links = rootEl.parentElement.parentElement.querySelectorAll("a[href]");
		for (const a of links) {
			const href = a.href; // absolute URL resolved by browser
			if (!href) continue;
			if (seen.has(href)) continue;
			seen.add(href);
			out.push({
				href,
				text: (a.innerText || a.textContent || "").trim().slice(0, 500)
			});
		}
	}

	return out;
}

function describeElement(el) {
	const attrs = {};
	for (const a of el.attributes || []) {
		if (a.name.toLowerCase() === "style") continue;
		attrs[a.name] = a.value;
	}

	return {
		tag: el.tagName?.toLowerCase() || "",
		id: el.id || "",
		className: (el.className && String(el.className)) || "",
		attributes: attrs,
		cssPath: getCssPath(el)
	};
}

function getCssPath(el) {
	if (!(el instanceof Element)) return "";
	const parts = [];
	while (el && el.nodeType === Node.ELEMENT_NODE) {
		let part = el.nodeName.toLowerCase();
		if (el.id) {
			part += `#${CSS.escape(el.id)}`;
			parts.unshift(part);
			break;
		} else {
			const parent = el.parentElement;
			if (parent) {
				const siblings = Array.from(parent.children).filter((c) => c.nodeName === el.nodeName);
				if (siblings.length > 1) {
					part += `:nth-of-type(${siblings.indexOf(el) + 1})`;
				}
			}
		}
		parts.unshift(part);
		el = el.parentElement;
	}
	return parts.join(" > ");
}

function startSelection() {
	cleanup();

	overlay = document.createElement("div");
	overlay.style.position = "fixed";
	overlay.style.left = "0";
	overlay.style.top = "0";
	overlay.style.width = "100vw";
	overlay.style.height = "100vh";
	overlay.style.zIndex = "2147483647";
	overlay.style.cursor = "crosshair";
	overlay.style.background = "rgba(0,0,0,0.05)";

	box = document.createElement("div");
	box.style.position = "fixed";
	box.style.border = "2px solid #000";
	box.style.background = "rgba(255,255,255,0.2)";
	box.style.left = "0";
	box.style.top = "0";
	box.style.width = "0";
	box.style.height = "0";

	overlay.appendChild(box);
	document.documentElement.appendChild(overlay);

	overlay.addEventListener("mousedown", onDown, true);
	overlay.addEventListener("mousemove", onMove, true);
	overlay.addEventListener("mouseup", onUp, true);

	// ESC to cancel
	window.addEventListener("keydown", onKey, true);
}

function onKey(e) {
	if (e.key === "Escape") cleanup();
}

function onDown(e) {
	e.preventDefault();
	e.stopPropagation();
	start = { x: e.clientX, y: e.clientY };
	updateBox(start.x, start.y, 0, 0);
}

function onMove(e) {
	if (!start) return;
	e.preventDefault();
	e.stopPropagation();

	const x1 = start.x;
	const y1 = start.y;
	const x2 = e.clientX;
	const y2 = e.clientY;

	const left = Math.min(x1, x2);
	const top = Math.min(y1, y2);
	const w = Math.abs(x2 - x1);
	const h = Math.abs(y2 - y1);

	updateBox(left, top, w, h);
}

function onUp(e) {
	if (!start) return;

	e.preventDefault();
	e.stopPropagation();

	const rect = box.getBoundingClientRect();
	const result = {
		x: rect.left,
		y: rect.top,
		w: rect.width,
		h: rect.height
	};

	// very small boxes are usually mistakes
	if (result.w < 5 || result.h < 5) {
		cleanup();
		return;
	}

	chrome.runtime.sendMessage({
		type: "AREA_SELECTED",
		rect: result,
		devicePixelRatio: window.devicePixelRatio || 1
	});

	cleanup();
}

function updateBox(left, top, w, h) {
	box.style.left = `${left}px`;
	box.style.top = `${top}px`;
	box.style.width = `${w}px`;
	box.style.height = `${h}px`;
}

function cleanup() {
	start = null;
	window.removeEventListener("keydown", onKey, true);

	if (overlay) {
		overlay.remove();
		overlay = null;
		box = null;
	}
}
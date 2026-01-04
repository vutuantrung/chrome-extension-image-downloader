let overlay = null;
let box = null;
let start = null;
let lastContextElement = null;
let lastSelectionText = "";
let floatingBtn = null;
let inputBox = null;

// let lastMouse = { x: 0, y: 0 };

// document.addEventListener(
//     "mousemove",
//     (e) => {
//         lastMouse = { x: e.clientX, y: e.clientY };
//     },
//     { capture: true, passive: true }
// );

document.addEventListener(
    "contextmenu",
    (e) => {
        lastContextElement = e.target;
    },
    { capture: true, passive: true },
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

    if (msg?.type === "MENU_SHOW_OVERLAY") {
        // console.log('[msg]', msg);
        const title = typeof msg.title === "string" ? msg.title : "Results";
        const variant = msg.variant === "error" ? "error" : "success";
        const items = Array.isArray(msg.data) ? msg.data : []

        showOverlay({ title, variant, items });
    }

    if (msg?.type === "MENU_CHECK_INPUT") {
        showTextInputNearElement();
    }
});


document.addEventListener("selectionchange", () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return hideIcon();

    const text = sel.toString().trim();
    if (!text) return hideIcon();

    lastSelectionText = text;
    showIconNearSelection(sel);
});

document.addEventListener("mousedown", () => {
    setTimeout(hideIcon, 0);
});

function showOverlay({ title, variant, items }) {
    const ID = "__my_ext_results_toast__";
    const el = lastContextElement;

    // console.log('[content_items]', items);

    // Remove previous toast
    document.getElementById(ID)?.remove();

    const toast = document.createElement("div");
    toast.id = ID;

    const bg = variant === "error" ? "#b00020" : "#111";

    Object.assign(toast.style, {
        position: "fixed",
        zIndex: "2147483647",
        left: "0px",
        top: "0px",
        transform: "translate(-9999px, -9999px)",
        background: bg,
        color: "#fff",
        padding: "10px 12px",
        borderRadius: "10px",
        fontSize: "13px",
        lineHeight: "1.2",
        boxShadow: "0 10px 24px rgba(0,0,0,.28)",
        userSelect: "none",
        pointerEvents: "none",
        // width: "320px",
        // maxWidth: "min(360px, calc(100vw - 24px))"
    });

    // Header
    const header = document.createElement("div");
    header.textContent = title;
    Object.assign(header.style, {
        fontWeight: "600",
        marginBottom: "8px"
    });
    toast.appendChild(header);

    // List container
    const list = document.createElement("div");
    list.id = "my_list_container";
    Object.assign(list.style, {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        maxHeight: "240px",
        overflow: "hidden"
    });

    const safeItems = items.slice(0, 6);
    if (safeItems.length === 0) {
        const empty = document.createElement("div");
        empty.textContent = "(No results)";
        Object.assign(empty.style, { opacity: "0.85" });
        list.appendChild(empty);
    } else {
        for (const it of safeItems) {
            const row = document.createElement("div");
            Object.assign(row.style, {
                display: "flex",
                flexDirection: "column",
                gap: "10px"
            });

            // Image
            const img = document.createElement("img");
            img.alt = "";
            img.referrerPolicy = "no-referrer"; // reduces leakage; some sites may still block
            img.decoding = "async";
            img.loading = "lazy";
            Object.assign(img.style, {
                width: "300px",
                borderRadius: "6px",
                objectFit: "cover",
                background: "rgba(255,255,255,0.12)",
                flex: "0 0 auto"
            });

            // const cover = typeof it?.imageCover === "string" ? it.imageCover : "";
            // // console.log('[cover]', it?.thumbs);
            // if (cover) {
            //     img.src = typeof it.imageCover === "string" ? it.imageCover : ""; // can be https URL or data:image/... (recommended if you control it)
            // } else {
            //     // keep blank placeholder
            //     img.src =
            //         "data:image/svg+xml;charset=utf-8," +
            //         encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34"></svg>`);
            // }

            img.src = typeof it.imageCover === "string" ? it.imageCover : "";

            // Text (safe: use textContent)
            const codeVideo = document.createElement("div");
            codeVideo.textContent = it?.code;
            Object.assign(codeVideo.style, {
                whiteSpace: "nowrap",
                opacity: "0.95",
                fontSize: "15px"
            });

            const createdTime = document.createElement("div");
            createdTime.textContent = it?.createdTime;
            Object.assign(createdTime.style, {
                overflow: "hidden",
                textOverflow: "ellipsis",
                opacity: "0.5",
                fontSize: "13px"
            });
            const contentVideoData = document.createElement("div");
            Object.assign(contentVideoData.style, {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
            });

            contentVideoData.appendChild(codeVideo);
            contentVideoData.appendChild(createdTime);

            row.appendChild(img);
            row.appendChild(contentVideoData);
            list.appendChild(row);
        }
    }

    toast.appendChild(list);
    document.documentElement.appendChild(toast);

    // Position near element (fallback to top-left)
    const anchorRect = el?.getBoundingClientRect?.() || { left: 16, top: 16, right: 16, bottom: 16 };

    const margin = 10;
    const tRect = toast.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const candidates = [
        { x: anchorRect.right + margin, y: anchorRect.top },                 // right
        { x: anchorRect.left - tRect.width - margin, y: anchorRect.top },    // left
        { x: anchorRect.left, y: anchorRect.bottom + margin },               // bottom
        { x: anchorRect.left, y: anchorRect.top - tRect.height - margin }    // top
    ];

    const fits = (p) =>
        p.x >= margin &&
        p.y >= margin &&
        p.x + tRect.width <= vw - margin &&
        p.y + tRect.height <= vh - margin;

    let pos = candidates.find(fits) || candidates[0];
    pos = {
        x: Math.max(margin, Math.min(pos.x, vw - tRect.width - margin)),
        y: Math.max(margin, Math.min(pos.y, vh - tRect.height - margin))
    };

    toast.style.transform = `translate(${Math.round(pos.x)}px, ${Math.round(pos.y)}px)`;

    // Auto-dismiss (increase if you want)
    setTimeout(() => toast.remove(), 5000);
}

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
                    const fetchedIdolQueryNames = reqResult?.video?.casts?.[0]?.slug || "";
                    const domIdolName = allIdolsHrefs?.[0]?.replace("https://www.javdatabase.com/idols", "")?.replaceAll("/", "")?.trim() || "";
                    const queryIdolName = domIdolName + "," + fetchedIdolQueryNames;
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

function showIconNearSelection(selection) {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return;

    if (!floatingBtn) {
        floatingBtn = document.createElement("div");
        floatingBtn.id = "__my_ext_selection_btn__";
        floatingBtn.setAttribute("role", "button");
        floatingBtn.setAttribute("aria-label", "Process selected text");

        Object.assign(floatingBtn.style, {
            position: "fixed",
            zIndex: "2147483647",
            width: "22px",
            height: "22px",
            borderRadius: "999px",
            background: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            userSelect: "none",
            pointerEvents: "auto"
        });

        // Inline SVG (no img-src => CSP-safe)
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", "14");
        svg.setAttribute("height", "14");
        svg.setAttribute("viewBox", "0 0 24 24");

        const path = document.createElementNS(svgNS, "path");
        // simple “spark” icon; replace with any path you like
        path.setAttribute(
            "d",
            "M12 2l1.2 5.1L18 9l-4.8 1.9L12 16l-1.2-5.1L6 9l4.8-1.9L12 2z"
        );
        path.setAttribute("fill", "#111");

        svg.appendChild(path);
        floatingBtn.appendChild(svg);

        // Prevent selection from collapsing before we read it
        floatingBtn.addEventListener("mousedown", (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        floatingBtn.addEventListener("mousedown", (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Ask background to process highlighted text
            chrome.runtime.sendMessage({
                type: "PROCESS_FETCH_SELECTED_TEXT",
                text: lastSelectionText
            }, (result) => {
                console.log('[PROCESS_FETCH_SELECTED_TEXT]', result);
                const title = typeof result.title === "string" ? result.title : "Results";
                const variant = result.variant === "error" ? "error" : "success";
                const items = Array.isArray(result.data) ? result.data : []

                showOverlay({ title, variant, items });
            });

            hideIcon();
        });


        document.documentElement.appendChild(floatingBtn);
    }

    // Position near selection (top-right)
    const margin = 6;
    let x = rect.right + margin;
    let y = rect.top - 10;

    // Clamp to viewport
    x = Math.min(x, window.innerWidth - 24);
    y = Math.max(8, y);

    floatingBtn.style.left = `${Math.round(x)}px`;
    floatingBtn.style.top = `${Math.round(y)}px`;
    floatingBtn.style.display = "flex";
}

function hideIcon() {
    if (floatingBtn) floatingBtn.style.display = "none";
}

function showTextInputNearElement() {
    removeInputBox();

    const el = lastContextElement;
    const anchorRect = el?.getBoundingClientRect?.() || { left: 16, top: 16, right: 16, bottom: 16 };

    inputBox = document.createElement("div");
    inputBox.id = "__my_ext_input_box__";

    Object.assign(inputBox.style, {
        position: "fixed",
        zIndex: "2147483647",
        left: "0px",
        top: "0px",
        transform: "translate(-9999px, -9999px)",
        background: "#111",
        color: "#fff",
        padding: "8px",
        borderRadius: "10px",
        boxShadow: "0 10px 24px rgba(0,0,0,.28)",
        pointerEvents: "auto",
        width: "200px",
    });

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Check…";

    Object.assign(input.style, {
        width: "100%",
        border: "0",
        outline: "none",
        borderRadius: "8px",
        padding: "10px 10px",
        fontSize: "13px",
        background: "#fff",
        color: "#111",
        boxSizing: "border-box"
    });

    inputBox.appendChild(input);
    document.documentElement.appendChild(inputBox);

    // Position near element
    positionPopupNearRect(inputBox, anchorRect);

    // Focus
    setTimeout(() => input.focus(), 0);

    // Close on outside click
    const onDocDown = (e) => {
        if (!inputBox) return;
        if (!inputBox.contains(e.target)) removeInputBox();
    };

    // Handle keys
    const onKeyDown = async (e) => {
        if (e.key === "Escape") {
            e.preventDefault();
            removeInputBox();
            return;
        }

        if (e.key === "Enter") {
            e.preventDefault();
            const value = input.value.trim();
            if (!value) return;

            // Optional: disable during send
            input.disabled = true;

            const isSavingInput = value[0] === "!"; // e.g. !myinput to save
            const realData = isSavingInput ? value.slice(1).trim() : value;
            if (isSavingInput) {
                chrome.runtime.sendMessage(
                    { type: "PROCESS_SAVE_SELECTED_TEXT", text: realData },
                    (resp) => {
                        if (resp?.success) {
                            console.log("The indentity saved successfully");
                        }
                    });
            } else {
                chrome.runtime.sendMessage(
                    { type: "PROCESS_FETCH_SELECTED_TEXT", text: realData },
                    (resp) => {
                        console.log('[PROCESS_FETCH_SELECTED_TEXT]', resp);
                        const title = typeof resp.title === "string" ? resp.title : "Results";
                        const variant = resp.variant === "error" ? "error" : "success";
                        const items = Array.isArray(resp.data) ? resp.data : []

                        showOverlay({ title, variant, items });
                    });
            }
            removeInputBox();
        }
    };

    document.addEventListener("mousedown", onDocDown, true);
    window.addEventListener("keydown", onKeyDown, true);

    // Store cleanup handlers on the node
    inputBox.__cleanup = () => {
        document.removeEventListener("mousedown", onDocDown, true);
        window.removeEventListener("keydown", onKeyDown, true);
    };
}

function positionPopupNearRect(node, anchorRect) {
    const margin = 10;

    // Measure after attach
    const nRect = node.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const candidates = [
        { x: anchorRect.right + margin, y: anchorRect.top },                 // right
        { x: anchorRect.left - nRect.width - margin, y: anchorRect.top },    // left
        { x: anchorRect.left, y: anchorRect.bottom + margin },               // bottom
        { x: anchorRect.left, y: anchorRect.top - nRect.height - margin }    // top
    ];

    const fits = (p) =>
        p.x >= margin &&
        p.y >= margin &&
        p.x + nRect.width <= vw - margin &&
        p.y + nRect.height <= vh - margin;

    let pos = candidates.find(fits) || candidates[0];

    // Clamp
    pos = {
        x: Math.max(margin, Math.min(pos.x, vw - nRect.width - margin)),
        y: Math.max(margin, Math.min(pos.y, vh - nRect.height - margin))
    };

    node.style.transform = `translate(${Math.round(pos.x)}px, ${Math.round(pos.y)}px)`;
}

function removeInputBox() {
    if (!inputBox) return;
    try {
        inputBox.__cleanup?.();
    } catch { }
    inputBox.remove();
    inputBox = null;
}
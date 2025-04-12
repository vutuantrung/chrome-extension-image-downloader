import { generateRandomId, isTruthy, toArray, unique } from "../utils";
import { icons, IMAGES } from "../constants";
import * as chromeActions from '../actions';

const imageUrlRegex =
	/(?:([^:/?#]+):)?(?:\/\/([^/?#]*))?([^?#]*\.(?:bmp|gif|ico|jfif|jpe?g|png|svg|tiff?))(?:\?([^#]*))?(?:#(.*))?/i;
const videoUrlRegex =
	/(?:([^:/?#]+):)?(?:\/\/([^/?#]*))?([^?#]*\.(?:mp4|avi|flv|mkv|mov(?!ie)|webp?))(?:\?([^#]*))?(?:#(.*))?/i;
const urlJJGirlString = "http://www.jjgirls.com/japanese/#nameModel#/#pageNumber#/#nameModel#-#fileNumber#.jpg";

const tumblrHiddenIframeSelector = 'iframe[class="photoset"]';

const PAGE_MODE = ["jjgirl", "cyberdrop", "telegram", "rule34", "jpgchurch", "normal", "tumblr", "reddit", "mrcong"];

/**
 * It returns true if the url is a valid video url, and false otherwise
 * @param url - The URL to test.
 */
export const isVideoURL = (url) => videoUrlRegex.test(url);

/**
 * It returns true if the url is a valid image url, and false otherwise
 * @param url - The URL to test.
 */
export const isImageURL = (url) => url.indexOf("data:image") === 0 || imageUrlRegex.test(url);

export const treatCyberdropUrls = (element) => {
	let src = element.src;
	let changingValue = element.mediaType === "image" ? "fs-01" : "fs-01";
	if (src.includes("cyberdrop")) {
		element.src = src
			.replace("fs-01", changingValue)
			.replace("fs-02", changingValue)
			.replace("fs-03", changingValue)
			.replace("fs-04", changingValue)
			.replace("fs-05", changingValue)
			.replace("fs-06", changingValue);
	}

	return element;
};

export const isCyberdropException = (element) => {
	if (!element.href.includes("cyberdrop")) return false;
	if (element.id !== "file") return false;

	return true;
};

export const treatJpgChurchUrls = (element) => {
	let src = element.src;
	if (src.includes("jpg.church")) {
		element.src = src.replace(".md", "");
	}

	return element;
};

export const countImagesIndexes = async (modelName) => {
	let imgArray = [];
	let currentPageNumber = 0,
		currentImageNumber = 0;
	let checkingUrl = "";

	while (true) {
		currentPageNumber++;
		checkingUrl = replaceUrlParam(modelName, currentPageNumber, "1");
		let res = await fetch(checkingUrl);
		if (res.url === "https://e.ugj.net/404.Not.Found.svg") {
			currentPageNumber--;
			break;
		}

		if (currentPageNumber > 1) {
			for (let i = 1; i <= 12; i++) {
				imgArray.push({
					id: generateRandomId(7),
					src: replaceUrlParam(modelName, currentPageNumber - 1, i),
				});
			}
		}
	}

	while (true) {
		currentImageNumber++;
		checkingUrl = replaceUrlParam(modelName, currentPageNumber, currentImageNumber);

		let res = await fetch(checkingUrl);
		if (res.url === "https://e.ugj.net/404.Not.Found.svg") {
			currentImageNumber--;
			break;
		}

		imgArray.push({
			id: generateRandomId(7),
			src: checkingUrl,
		});
	}

	return { lastPageNumber: currentPageNumber, lastImageNumber: currentImageNumber, imgUrls: imgArray };
};

export const relativeUrlToAbsolute = (obj) => {
	obj.src = obj.src.indexOf("/") === 0 ? `${window.location.origin}${obj.src}` : obj.src;
	return obj;
};

export const getExtraMediasFromTumblr = async (domPage) => {
	let allMediasLocal = [];
	let linkedMediasLocal = [];

	const nodeList = domPage.querySelectorAll(tumblrHiddenIframeSelector);

	if (nodeList.length > 0) {
		// get the medias of each node src
		for (const node of nodeList) {
			let url = node.src;

			if (!url) {
				console.log("[NotFound][Tumblr] no iframe with this class found !");
				continue;
			}

			const html = await (await fetch(url)).text(); // html as text
			const dom = new DOMParser().parseFromString(html, "text/html");

			let collectedMedias = collectMediasFromPage(dom);

			allMediasLocal = [...allMediasLocal, ...collectedMedias.allMediasLocal];
			linkedMediasLocal = [...linkedMediasLocal, ...collectedMedias.linkedMediasLocal];
		}
	}

	return { allM: allMediasLocal, linkedM: linkedMediasLocal };
};

export const getYoutubeVideoInformation = async (url) => {
	const apiURL = "https://www.clipto.com/api/youtube";
	const headers = {
		"Content-Type": "application/json",
	};
	const body = JSON.stringify({
		url: url,
	});
	console.log(apiURL, headers, body);
	const data = await chromeActions.fetchData(apiURL, "POST", headers, body);
	console.log('[dataYoutube]', data);
	return data;
};

export const getMrcongPageInformation = async (pageDom) => {
	let itemDataArr = [];
	let itemList = pageDom.querySelectorAll('div[class="post-thumbnail"] > a');

	for (const item of itemList) {
		let thumbs = item.querySelector("img").src;

		let itemData = await retrieveData(item.href);
		itemDataArr.push({ thumbs: thumbs, ...itemData });
	}

	return itemDataArr;
};

async function retrieveData(url) {
	const html = await (await fetch(url)).text(); // html as text
	const dom = new DOMParser().parseFromString(html, "text/html");

	let albumName = dom.querySelector('span[itemprop="name"]').innerHTML;
	let boxInfo = dom.querySelector('div[class*="box info"]');
	let nodes = [...boxInfo.getElementsByTagName("strong")];
	// model information
	let modelName = "",
		nbItems = "",
		size = "",
		photoRes = "",
		downloadLinks = [];
	nodes.forEach((n) => {
		let info = n.nextSibling.data ? n.nextSibling.data.trim() : "";
		if (n.innerText === "Người mẫu:") modelName = info;
		if (n.innerText === "Tổng số ảnh:") nbItems = info;
		if (n.innerText === "Dung lượng:") size = info;
		if (n.innerText === "Kích cỡ ảnh:") photoRes = info;
	});

	// download links
	let linkDivs = dom.querySelectorAll('a[class*="shortc-button medium"]');
	linkDivs.forEach((lDiv) => {
		downloadLinks.push({
			name: lDiv.childNodes[1].data.replace("Download link:", "").trim(),
			link: lDiv.href,
		});
	});

	const result = {
		id: generateRandomId(3),
		albumName: albumName,
		modelName: modelName,
		nbItems: nbItems,
		size: size,
		photoRes: photoRes,
		downloadLinks: downloadLinks,
	};

	return result;
}

function replaceUrlParam(name, pageNum, fileNum) {
	return urlJJGirlString
		.replaceAll("#nameModel#", name)
		.replaceAll("#pageNumber#", pageNum)
		.replaceAll("#fileNumber#", fileNum);
}

export const collectMediasFromPage = (pageDoc) => {
	let allMediasLocal = [];
	let linkedMediasLocal = [];
	let selectors = toArray(pageDoc.querySelectorAll("img, image, a, video, [class], [style]"));

	selectors.forEach((element) => {
		let value = null;
		if (element.tagName.toLowerCase() === "img") {
			const src = element.src;
			const hashIndex = src.indexOf("#");
			if (hashIndex >= 0) src.substr(0, hashIndex);
			value = {
				id: generateRandomId(7),
				mediaType: "image",
				thumbs: src,
				src: src,
			};

			allMediasLocal.push(value);
		}

		if (element.tagName.toLowerCase() === "image") {
			const src = element.getAttribute("xlink:href");
			const hashIndex = src.indexOf("#");
			if (hashIndex >= 0) src.substr(0, hashIndex);
			value = {
				id: generateRandomId(7),
				mediaType: "image",
				thumbs: src,
				src: src,
			};

			allMediasLocal.push(value);
		}

		if (element.tagName.toLowerCase() === "video") {
			element.childNodes.forEach((e) => {
				const thumbsUrl = element.poster;
				if (e.tagName.toLowerCase() === "source") {
					value = {
						id: generateRandomId(7),
						mediaType: "video",
						thumbs: thumbsUrl,
						src: e.src,
					};

					allMediasLocal.push(value);
					linkedMediasLocal.push(value);
				}
			});
		}

		if (element.tagName.toLowerCase() === "a") {
			let href = element.href;
			let mediaType;
			if (isCyberdropException(element)) return; // Except for cyberdrop video span
			if (isVideoURL(href)) mediaType = "video";
			else if (isImageURL(href)) mediaType = "image";
			else return;

			if (mediaType === "image") {
				value = {
					id: generateRandomId(7),
					mediaType: mediaType,
					thumbs: href,
					src: href,
				};
			} else if (mediaType === "video") {
				const thumbsElement = element.getElementsByTagName("img")[0];
				value = {
					id: generateRandomId(7),
					mediaType: mediaType,
					thumbs: thumbsElement.src,
					src: href,
				};
			} else {
				return;
			}

			allMediasLocal.push(value);
			linkedMediasLocal.push(value);
		}
	});

	allMediasLocal = unique(
		allMediasLocal
			.flat()
			.filter(isTruthy)
			.map(treatCyberdropUrls)
			.map(treatJpgChurchUrls)
			.map(relativeUrlToAbsolute)
	);

	linkedMediasLocal = unique(
		linkedMediasLocal
			.flat()
			.filter(isTruthy)
			.map(treatCyberdropUrls)
			.map(treatJpgChurchUrls)
			.map(relativeUrlToAbsolute)
	);

	return { allMediasLocal: allMediasLocal, linkedMediasLocal: linkedMediasLocal };
};

export const changeOptionsMode = (mode, currentPageName) => {
	let newMode;
	if (mode === "tab") newMode = currentPageName;
	if (PAGE_MODE.includes(mode)) newMode = "tab";
	return newMode;
};

export const getIconByMode = (mode) => {
	if (mode === "cyberdrop") return IMAGES.cyberdropIconImage;
	if (mode === "telegram") return IMAGES.telegramIconImage;
	if (mode === "jjgirl") return IMAGES.jjgirlsFaviconImage;
	if (mode === "rule34") return IMAGES.rule34FaviconImage;
	if (mode === "jpgchurch") return IMAGES.jpgChurchFaviconImage;
	if (mode === "tumblr") return IMAGES.tumblrIconImage;
	if (mode === "reddit") return IMAGES.redditIconImage;
	if (mode === "mrcong") return IMAGES.mrcongIconImage;
	if (mode === "youtube") return IMAGES.youtubeIconImage;
	if (mode === "exhentai") return IMAGES.exHentaiIconImage;

	return icons.browserIcon;
};

export const getSpecificPageName = (baseUrl) => {
	if (baseUrl.includes("jjgirls")) return "jjgirl";
	if (baseUrl.includes("jpg.church")) return "jpgchurch";
	if (baseUrl.includes("cyberdrop")) return "cyberdrop";
	if (baseUrl.includes("telegra.ph")) return "telegram";
	if (baseUrl.includes("rule34.xxx")) return "rule34";
	if (baseUrl.includes("tumblr.com")) return "tumblr";
	if (baseUrl.includes("reddit.com")) return "reddit";
	if (baseUrl.includes("misskon.com")) return "mrcong";
	if (baseUrl.includes("youtube.com")) return "youtube";

	return "normal";
};

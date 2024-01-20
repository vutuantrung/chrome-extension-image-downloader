let uniqueIds = [];

export const isStrictEqual = (value1) => (value2) => value1 === value2;

export const isNotStrictEqual = (value1) => (value2) => value1.src !== value2.src;

export const isIncludedIn = (array) => (item) => array.findIndex((e) => e.id === item.id) !== -1;

export const srcIncluded = (array, src) => array.findIndex(e => e.src === src);

export const stopPropagation = (e) => e.stopPropagation();

export const toArray = (values) => [...values];

export const isTruthy = (value) => !!value;

export const isFunction = (o) => typeof o === "function";

export const isNumericString = (value) => {
    if (typeof value !== "string") return false;
    return !isNaN(value) && !isNaN(parseFloat(value));
}

export const removeSpecialCharacters = (value) => value.replace(/[<>:"|?*]/g, '');

export const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const replaceStringAtPosition = (orgText, srText, repText, pos = 1) => {
    let regex = pos === 0
        ? new RegExp(`(?:(?:.|\n)*?${srText})`, 'gi')
        : new RegExp(`(?:(?:.|\n)*?${srText}){${pos}}`);

    let replacer = (x) => x.replace(RegExp(srText + "$"), repText);
    let newText = srText.length === 0
        ? orgText
        : orgText.replace(regex, replacer);

    return newText;
}

export const unique = (values) => {
    uniqueIds = [];
    const uniqueMedia = values.filter(e => {
        const isDuplicate = uniqueIds.includes(e.id);
        if (!isDuplicate) {
            uniqueIds.push(e.id);
            return true;
        }

        return false;
    });

    return toArray(new Set(uniqueMedia));
}

export const normalizeSlashes = (filename) => {
    return filename.replace(/\\/g, '/').replace(/\/{2,}/g, '/');
}

export const generateRandomId = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export const parseHtmlString = ({ domString, baseUri }) => {
    let doc = (new DOMParser()).parseFromString(domString, 'text/html');
    let base = doc.createElement('base');
    base.href = baseUri;
    doc.head.appendChild(base);
    return doc;
}

// Source: https://github.com/fregante/webext-patterns/blob/main/index.ts
export const matchPatterns = (url, patterns) => {
    const patternValidationRegex =
        /^(https?|wss?|file|ftp|\*):\/\/(\*|\*\.[^*/]+|[^*/]+)\/.*$|^file:\/\/\/.*$|^resource:\/\/(\*|\*\.[^*/]+|[^*/]+)\/.*$|^about:/;
    const isFirefox =
        typeof navigator === "object" && navigator.userAgent.includes("Firefox/");
    const allStarsRegex = isFirefox
        ? /^(https?|wss?):[/][/][^/]+([/].*)?$/
        : /^https?:[/][/][^/]+([/].*)?$/;
    const allUrlsRegex = /^(https?|file|ftp):[/]+/;

    function getRawPatternRegex(pattern) {
        if (!patternValidationRegex.test(pattern))
            throw new Error(
                pattern +
                " is an invalid pattern, it must match " +
                String(patternValidationRegex)
            );
        let [, protocol, host, pathname] = pattern.split(/(^[^:]+:[/][/])([^/]+)?/);
        protocol = protocol
            .replace("*", isFirefox ? "(https?|wss?)" : "https?")
            .replace(/[/]/g, "[/]");
        host = (host ?? "")
            .replace(/^[*][.]/, "([^/]+.)*")
            .replace(/^[*]$/, "[^/]+")
            .replace(/[.]/g, "[.]")
            .replace(/[*]$/g, "[^.]+");
        pathname = pathname
            .replace(/[/]/g, "[/]")
            .replace(/[.]/g, "[.]")
            .replace(/[*]/g, ".*");
        return "^" + protocol + host + "(" + pathname + ")?$";
    }

    function patternToRegex(matchPatterns) {
        if (matchPatterns.length === 0) return /$./;
        if (matchPatterns.includes("<all_urls>")) return allUrlsRegex;
        if (matchPatterns.includes("*://*/*")) return allStarsRegex;
        return new RegExp(
            matchPatterns.map((x) => getRawPatternRegex(x)).join("|")
        );
    }

    try {
        return patternToRegex(patterns).test(url);
    } catch (e) {
        console.log("ERROR matchPatterns", e);
        return false;
    }
}

export const checkBlackWhiteList = (script, url) => {
    if (!url) return false;

    let w = script.whiteList || [],
        b = script.blackList || [],
        hasWhiteList = w.length > 0,
        hasBlackList = b.length > 0,
        inWhiteList = matchPatterns(url, w) ?? true,
        inBlackList = matchPatterns(url, b) ?? false;

    let willRun =
        (!hasWhiteList && !hasBlackList) ||
        (hasWhiteList && inWhiteList) ||
        (hasBlackList && !inBlackList);

    return willRun;
}

/**
 * It takes the current date, formats it to a string, and returns it.
 * @returns A string of the current date in the format ddmmYYYY
 */
export const getCurrentDateText = () => {
    let today = new Date();
    let dd = (today.getDate()).toString().padStart(2, '0');
    let mm = (today.getMonth() + 1).toString().padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    let date = `${dd}${mm}${yyyy}`;

    return date;
}

export const removeAccents = (str) => {
    var from =
        "àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ",
        to =
            "aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy";
    for (var i = 0, l = from.length; i < l; i++) {
        str = str.replace(RegExp(from[i], "gi"), to[i]);
    }

    str = str.toLowerCase().trim();
    // .replace(/[^a-z0-9\-]/g, "-")
    // .replace(/-+/g, "-");

    return str;
}

export const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export const JSONUtils = {
    // https://stackoverflow.com/a/9804835/11898496
    isJson(item) {
        item = typeof item !== "string" ? JSON.stringify(item) : item;
        try {
            item = JSON.parse(item);
        } catch (e) {
            return false;
        }
        if (typeof item === "object" && item !== null) {
            return true;
        }
        return false;
    },

    // https://stackoverflow.com/a/52799327/11898496
    hasJsonStructure(str) {
        if (typeof str !== "string") return false;
        try {
            const result = JSON.parse(str);
            const type = Object.prototype.toString.call(result);
            return type === "[object Object]" || type === "[object Array]";
        } catch (err) {
            return false;
        }
    },

    // https://stackoverflow.com/a/52799327/11898496
    safeJsonParse(str) {
        try {
            return [null, JSON.parse(str)];
        } catch (err) {
            return [err];
        }
    },

    // https://stackoverflow.com/a/54174739/11898496
    strObjToObject(strObj) {
        try {
            let jsonStr = strObj.replace(/(\w+:)|(\w+ :)/g, function (s) {
                return '"' + s.substring(0, s.length - 1) + '":';
            });
            prompt("", jsonStr);
            return [null, JSON.parse(jsonStr)];
        } catch (e) {
            return [e];
        }
    },
}

// https://stackoverflow.com/a/38552302/11898496
export const parseJwt = (token) => {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
        window
            .atob(base64)
            .split("")
            .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
    );
    return JSON.parse(jsonPayload);
}
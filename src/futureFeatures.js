export const getImageElementUrl = async (pageDom, urls) => {
    // First
    let eTypeFirst = 'div', eClassFirst = 'col-md-12 col-lg-12', eIdFirst = '', eIndexFirst = 2;
    let selectors = getSelectorsByAttribute(eTypeFirst, eClassFirst, eIdFirst);
    let sourceParent = pageDom.querySelectorAll(selectors)[eIndexFirst];
    console.log(sourceParent);

    // Second
    let eTypeSecond = 'a', eClassSecond = 'thumbnail', eIdSecond = '';
    selectors = getSelectorsByAttribute(eTypeSecond, eClassSecond, eIdSecond);
    // let pageSources = Array.from(sourceParent.querySelectorAll(selectors)).map(e => e.href);
    // console.log(pageSources);

    // Last
    // let eTypeLast = '', eClassLast = '', eIdLast = '', eIndexLast = 0;
    // selectors = getSelectorsByAttribute(eTypeLast, eClassLast, eIdLast);
    // console.log(selectors);

    urls.forEach(async (url) => {
        await fetch(url).then(res => {
            console.log(res);
        })
    });
}

function getSelectorsByAttribute(elementType, elementClass, elementId) {
    return `${elementType}${elementClass === '' ? '' : '[class="' + elementClass + '"]'}${elementId === '' ? '' : '[id="' + elementId + '"]'}`;
}

// export const getYoutubePageInformation = async (url) => {
//     const options = { quality: 'highest' }
//     const info = await ytdl.getInfo(url, [options]);
//     const jsonValue = JSON.parse(info);

//     const dataVideoDetails = {
//         title: jsonValue["videoDetails"]["title"],
//         embed: jsonValue["videoDetails"]["embed"],
//         viewCount: jsonValue["videoDetails"]["viewCount"],
//         uploadDate: jsonValue["videoDetails"]["uploadDate"],
//         publishDate: jsonValue["videoDetails"]["publishDate"],
//         lengthSeconds: secondsToHms(jsonValue["videoDetails"]["lengthSeconds"]),
//         description: jsonValue["videoDetails"]["description"],
//         video_url: jsonValue["videoDetails"]["video_url"],
//         thumbnails: jsonValue["videoDetails"]["thumbnails"],
//     }

//     const dataVideoFormat = jsonValue["formats"].map(val => {
//         return {
//             mimeType: val["mimeType"],
//             bitrate: val["bitrate"],
//             qualityLabel: val["qualityLabel"],
//             url: val["url"],
//             width: val["width"],
//             height: val["height"],
//             contentLength: val["contentLength"],
//             quality: val["quality"],
//             fps: val["fps"],
//             projectionType: val["projectionType"],
//             hasVideo: val["hasVideo"],
//             hasAudio: val["hasAudio"],
//         }
//     });

//     const videoData = {
//         ...dataVideoDetails,
//         formats: dataVideoFormat
//     }


//     return videoData;
// }

// function secondsToHms(d) {
//     d = Number(d);
//     const h = Math.floor(d / 3600);
//     const m = Math.floor(d % 3600 / 60);
//     const s = Math.floor(d % 3600 % 60);

//     const hDisplay = h > 0 ? h : "";
//     const mDisplay = m > 0 ? m : "";
//     const sDisplay = s > 0 ? s : "";

//     const times = [hDisplay, mDisplay, sDisplay].filter(t => t);
//     const value = times.reduce((acc, cur) => acc + ":" + cur);

//     return value;
// }

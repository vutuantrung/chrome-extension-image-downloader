/*global chrome*/

import "../../assets/styles/index.css";
import * as chromeActions from "../../actions";
import { useEffect, useState } from "react";

export const Facebook = (props) => {
    // const [data, setData] = useState(dumpData);
    const [data, setData] = useState(props.videoData);
    // const [formats, setFormats] = useState([]);

    const extractFbVideoIdFromUrl = (url) => {
        return url.match(/\/(?:videos|reel|watch)(?:\/?)(?:\?v=)?(\d+)/)?.[1];
    };

    const getDtsg = async () => {
        return await chromeActions.runScriptInCurrentTab((result) => {
            console.log("[result]", result);
        });
    };

    const getFacebookVideoId = async () => {
        const tab = await chromeActions.getCurrentTab();
        const videoId = extractFbVideoIdFromUrl(tab.url);
        console.log(videoId);

        const dtsg = await getDtsg();
        console.log("[dtsg]", dtsg);

        let link = await getLinkFbVideo(videoId, dtsg);
        console.log("[link]", link);
    };

    const getLinkFbVideo = async (videoId, dtsg) => {
        try {
            return await getLinkFbVideo2(videoId, dtsg);
        } catch (e) {
            return await getLinkFbVideo1(videoId, dtsg);
        }
    };

    // Original source code: https://gist.github.com/monokaijs/270e29620c46cabec1caca8c3746729d
    // POST FB: https://www.facebook.com/groups/j2team.community/posts/1880294815635963/
    // Cần thêm rule trong rule.jsons để hàm này có thể chạy trong extension context
    const getLinkFbVideo1 = async (videoId, dtsg) => {
        function fetchGraphQl(doc_id, variables) {
            return fetch("https://www.facebook.com/api/graphql/", {
                method: "POST",
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                },
                body: stringifyVariables({
                    doc_id: doc_id,
                    variables: JSON.stringify(variables),
                    fb_dtsg: dtsg,
                    server_timestamps: !0,
                }),
            });
        }

        let res = await fetchGraphQl("5279476072161634", {
            UFI2CommentsProvider_commentsKey: "CometTahoeSidePaneQuery",
            caller: "CHANNEL_VIEW_FROM_PAGE_TIMELINE",
            displayCommentsContextEnableComment: null,
            displayCommentsContextIsAdPreview: null,
            displayCommentsContextIsAggregatedShare: null,
            displayCommentsContextIsStorySet: null,
            displayCommentsFeedbackContext: null,
            feedbackSource: 41,
            feedLocation: "TAHOE",
            focusCommentID: null,
            privacySelectorRenderLocation: "COMET_STREAM",
            renderLocation: "video_channel",
            scale: 1,
            streamChainingSection: !1,
            useDefaultActor: !1,
            videoChainingContext: null,
            videoID: videoId,
        });
        let text = await res.text();

        let a = JSON.parse(text.split("\n")[0]),
            link = a.data.video.playable_url_quality_hd || a.data.video.playable_url;

        return link;
    };

    // DYL extension: faster
    const getLinkFbVideo2 = async (videoId, dtsg) => {
        let res = await fetch("https://www.facebook.com/video/video_data_async/?video_id=" + videoId, {
            method: "POST",
            headers: { "content-type": "application/x-www-form-urlencoded" },
            body: stringifyVariables({
                __a: "1",
                fb_dtsg: dtsg,
            }),
        });

        let text = await res.text();
        console.log(text);
        text = text.replace("for (;;);", "");
        let json = JSON.parse(text);

        const { hd_src, hd_src_no_ratelimit, sd_src, sd_src_no_ratelimit } = json?.payload || {};

        return hd_src_no_ratelimit || hd_src || sd_src_no_ratelimit || sd_src;
    };

    // DYL extension: use access token
    const getLinkFbVideo3 = async (videoId, access_token) => {
        let res = await fetch(
            "https://graph.facebook.com/v8.0/" + videoId + "?fields=source&access_token=" + access_token
        );
        let json = await res.json();
        return json.source;
    };

    const stringifyVariables = (d, e) => {
        let f = [],
            a;
        for (a in d)
            if (d.hasOwnProperty(a)) {
                let g = e ? e + "[" + a + "]" : a,
                    b = d[a];
                f.push(
                    null !== b && "object" == typeof b
                        ? stringifyVariables(b, g)
                        : encodeURIComponent(g) + "=" + encodeURIComponent(b)
                );
            }
        return f.join("&");
    };

    useEffect(() => {
        getFacebookVideoId();
    }, []);

    const runScriptTest = () => {
        // console.log(__dirname);
        // const scriptPath = "./Components/DisplayImages/testScript.js";
        chromeActions.runScriptInCurrentTab();
    };

    return (
        <div>
            Facebook
            <button
                onClick={() => {
                    runScriptTest();
                }}
            >
                Click
            </button>
        </div>
    );
};

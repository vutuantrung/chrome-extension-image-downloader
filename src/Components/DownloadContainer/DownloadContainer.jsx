/*global chrome*/

import { useState } from "react";
import { useRunAfterUpdate } from "../../hooks/useRunAfterUpdate";
import { removeSpecialCharacters, isNumericString, generateRandomId, getCurrentDateText } from "../../utils";
import { TEXTS, icons } from "../../constants/index";
import * as chromeActions from "../../actions";

export const DownloadContainer = ({ options, setOptions, mediasToDownload, tabsMedias, setTabsMedias }) => {
    const [downloadedMedias, setDownloadedMedias] = useState([]);
    const [downloadProcess, setDownloadProcess] = useState("pending");

    const tooltipText =
        mediasToDownload.length === 0
            ? "Select some images to download first"
            : downloadProcess === "downloading"
            ? "If you want, you can close the extension popup\nwhile the images are downloading!"
            : "";

    const btnText = options.mode === "tab" && downloadProcess === "finish" ? "Close tabs" : "Download";

    const runAfterUpdate = useRunAfterUpdate();

    function closeTabs() {
        // close tabs
        let tabMediasId = downloadedMedias.map((e) => e.id);
        chrome.tabs.remove(downloadedMedias.map((e) => e.tabId));

        // remove element from medias with that id
        const remainingMedias = tabsMedias.filter((m) => !tabMediasId.includes(m.id));

        setTabsMedias([...remainingMedias]);
        setDownloadedMedias([]);
        setDownloadProcess("pending");
    }

    function saveSubFolderChange({ currentTarget: input }) {
        const savedSelectionStart = removeSpecialCharacters(input.value.slice(0, input.selectionStart)).length;

        runAfterUpdate(() => {
            input.selectionStart = input.selectionEnd = savedSelectionStart;
        });

        setOptions((options) => ({
            ...options,
            folder_name: removeSpecialCharacters(input.value),
        }));
    }

    function renameFileChange({ currentTarget: input }) {
        const savedSelectionStart = removeSpecialCharacters(input.value.slice(0, input.selectionStart)).length;

        runAfterUpdate(() => {
            input.selectionStart = input.selectionEnd = savedSelectionStart;
        });

        setOptions((options) => ({
            ...options,
            new_file_name: removeSpecialCharacters(input.value),
        }));
    }

    function startIndexChange({ currentTarget: input }) {
        const curIdx = input.value;
        if (!isNumericString(curIdx)) return;

        setOptions((options) => ({ ...options, start_index: curIdx }));
    }

    function mediaGenreChange({ currentTarget: { value } }) {
        setOptions((options) => ({ ...options, genre: value.trim() }));
    }

    function suggestNewName() {
        let id = generateRandomId(5);
        let date = getCurrentDateText();
        let prefName = "#id#_#date#".replace("#id#", id).replace("#date#", date);

        setOptions((options) => ({
            ...options,
            new_file_name: removeSpecialCharacters(prefName),
        }));
    }

    async function download() {
        setDownloadProcess("downloading");
        if (options.mode === "mrcong") {
            const e = document.createElement("a");
            const textFile = new Blob([JSON.stringify(mediasToDownload)], { type: "text/plain" }); //pass data from localStorage API to blob
            e.href = URL.createObjectURL(textFile);
            e.download = `${options.new_file_name}Download_${getCurrentDateText()}.json`;
            e.click();

            setOptions((options) => ({ ...options, new_file_name: "" }));
        } else {
            await chromeActions.downloadMedias(mediasToDownload, options).then((result) => {
                // collect all downloaded tab medias ID
                let intersection = mediasToDownload.filter((m1) =>
                    result.completeDownloadMedias.filter((m2) => m1.id === m2.id)
                );
                setDownloadedMedias([...intersection]);
                // place the last index to input
                setOptions((options) => ({
                    ...options,
                    start_index: result.lastIndex,
                }));
            });
        }
        setDownloadProcess("finish");
    }

    return (
        <div
            id="downloads_container"
            style={{
                width: "100%",
                gridTemplateColumns: `90px 100px 40px 80px 30px 80px`,
            }}
        >
            <input
                type="text"
                placeholder="Subfolder"
                title="Set the name of the subfolder you want to download the images to."
                value={options.folder_name}
                onChange={saveSubFolderChange}
            />

            <input
                type="text"
                placeholder="Rename files"
                title="Set a new file name for the images you want to download."
                value={options.new_file_name}
                onChange={renameFileChange}
            />

            <input
                type="text"
                placeholder="S.I."
                title="Set start index for custom file name"
                value={options.start_index}
                onChange={startIndexChange}
                style={{ marginRight: "2px" }}
            />

            <select onChange={mediaGenreChange}>
                <option value="none" title={TEXTS.normalTitle} selected>
                    None
                </option>
                <option value="3d" title={TEXTS.wildcardTitle}>
                    3D
                </option>
                <option value="hentai" title={TEXTS.regexTitle}>
                    Hentai
                </option>
                <option value="asian" title={TEXTS.regexTitle}>
                    Asian
                </option>
                <option value="western" title={TEXTS.regexTitle}>
                    Western
                </option>
            </select>

            <input
                type="button"
                className="suggestion-name"
                style={{
                    backgroundImage: `url(${icons.shuffleIcon})`,
                }}
                onClick={suggestNewName}
            />

            <input
                type="button"
                className="accent ${loading ? 'loading' : ''}"
                value={btnText}
                disabled={mediasToDownload.length === 0 || downloadProcess === "downloading"}
                title={tooltipText}
                onClick={options.mode === "tab" && downloadProcess === "finish" ? closeTabs : download}
            />
        </div>
    );
};

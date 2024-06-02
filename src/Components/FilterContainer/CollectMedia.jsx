import "../../assets/styles/index.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { replaceStringAtPosition } from "../../utils";
import { TEXTS, icons } from "../../constants";
import { v4 as uuidv4 } from "uuid";
import { UpdateUrlText } from "./UpdateUrlText";
import { UpdateUrlNumber } from "./UpdateUrlNumber";

/** Use to replace filter url specific text at specific position */
export const CollectMedia = ({ urlFiltering, setChangeUrlTasks }) => {
    const urlFilteringEl = useRef(null);
    const containerEl = useRef(null);

    const [lastChange, setLastChange] = useState({});
    const [currentText, setCurrentText] = useState("");
    const [validChanging, setValidChanging] = useState(true);

    const [updateRows, setUpdateRows] = useState([]);

    const tableStyle = useMemo(() => {
        return {
            transition: "transform 0.2s",
            transformOrigin: "top center",
            transform: `scaleY(${!validChanging ? "1" : "0"})`,
        };
    }, [validChanging]);

    useEffect(() => {
        urlFilteringEl.current.innerHTML = urlFiltering;
        setCurrentText(urlFiltering);
    }, [urlFiltering]);

    function addNewParam(_) {
        const newRows = [
            ...updateRows,
            {
                id: uuidv4(),
                type: "unknown",
            },
        ];
        setUpdateRows(newRows);
    }

    function undoChange(_) {
        // push undo task in options
        setChangeUrlTasks((tasks) => [...tasks, { taskName: "undo" }]);

        if (Object.keys(lastChange).length === 0) return;

        // update in replacing div
        let updatedCurText = replaceStringAtPosition(currentText, lastChange.newText, lastChange.oldText, 1);
        setCurrentText(updatedCurText);

        urlFilteringEl.current.innerHTML = updatedCurText;
    }

    function changeTextUpdateType({ currentTarget: { value } }) {}

    return (
        <div ref={containerEl} className="url-customize-container">
            <div className="url-customize">
                <div ref={urlFilteringEl} className="text url-text-filter-result"></div>
                <button id="exchange_button" title="Undo" onClick={undoChange}>
                    <img src={icons.backIcon} alt="" />
                </button>
                <button id="exchange_button" title="Add" onClick={addNewParam}>
                    <img src={icons.plusIcon} alt="" />
                </button>
            </div>
            <table style={tableStyle} id="paramTable" className="grid">
                <colgroup>
                    <col />
                    <col />
                    <col style={{ width: "30px" }} />
                    <col style={{ width: "30px" }} />
                    <col style={{ width: "30px" }} />
                </colgroup>
                <tbody>
                    {updateRows.map((updateRow, index) => {
                        if (updateRow.type === "unknown") {
                            return (
                                <tr key={updateRow.id}>
                                    <td>
                                        <select onChange={changeTextUpdateType}>
                                            <option value="" disabled>
                                                Select your option
                                            </option>
                                            <option value="text" title={TEXTS.normalTitle}>
                                                Text
                                            </option>
                                            <option value="number" title={TEXTS.wildcardTitle}>
                                                Number
                                            </option>
                                        </select>
                                    </td>
                                </tr>
                            );
                        }

                        if (updateRow.type === "text") {
                            return (
                                <tr key={updateRow.id}>
                                    <UpdateUrlText />
                                </tr>
                            );
                        }

                        if (updateRow.type === "number") {
                            return (
                                <tr key={updateRow.id}>
                                    <UpdateUrlNumber />
                                </tr>
                            );
                        }

                        return <></>;
                    })}
                </tbody>
            </table>
        </div>
    );
};

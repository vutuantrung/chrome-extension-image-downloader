import "../../assets/styles/index.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { generateRandomId, replaceStringAtPosition, getCountSubstring } from "../../utils";
import { icons } from "../../constants";

/** Use to replace filter url specific text at specific position */
export const CustomizeUrl = ({ urlFiltering, setChangeUrlTasks }) => {
	const urlFilteringEl = useRef(null);
	const containerEl = useRef(null);

	const [lastChange, setLastChange] = useState({});
	const [currentText, setCurrentText] = useState("");
	const [validChanging, setValidChanging] = useState(true);
	const [searchingText, setSearchingText] = useState("");
	const [replacingText, setReplacingText] = useState("");
	const [countNumberfoundText, setCountNumberFoundText] = useState(0);
	const [replacingPos, setReplacingPos] = useState(0);

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

	function handleSearchingValueChange(e) {
		let curText = e.target.value;
		let curFound = getCountSubstring(currentText, curText);

		setCountNumberFoundText(curFound);
		setSearchingText(curText);
		highlightText(curText, replacingPos);
	}

	function handleReplacingValueChange(e) {
		let curText = e.target.value;
		setReplacingText(curText);
	}

	function handleIndexesValueChange(e) {
		let curPos = e.target.value;
		setReplacingPos(curPos);
		highlightText(searchingText, curPos);
	}

	function validReplacingString(e) {
		// replace text in div
		let newText = replaceStringAtPosition(currentText, searchingText, replacingText, replacingPos);
		urlFilteringEl.current.innerHTML = newText;

		// update lastChange
		let change = { newText: newText, oldText: currentText };
		setLastChange(change);

		// add task into list tasks in options
		setChangeUrlTasks((tasks) => {
			return [
				...tasks,
				{
					id: generateRandomId(3),
					taskName: "change",
					flag: "pending",
					searchValue: change.oldText,
					replaceValue: change.newText,
				},
			];
		});

		// set new current text
		setCurrentText(newText);

		// hide replacing div
		containerEl.current.style.height = "30px";
		setValidChanging(true);
	}

	function addNewParam(_) {
		containerEl.current.style.height = validChanging ? "76px" : "30px";
		setValidChanging(!validChanging);
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

	function highlightText(text, pos) {
		urlFilteringEl.current.innerHTML = replaceStringAtPosition(
			currentText,
			text,
			`<mark class="highlight">$&</mark>`,
			pos
		);
	}

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
					<tr>
						<td>
							<input
								type="text"
								title="Searching text in above url"
								placeholder="Searching"
								onChange={handleSearchingValueChange}
							/>
						</td>
						<td>
							<input
								type="text"
								title="Replacing text"
								placeholder="Replacing"
								onChange={handleReplacingValueChange}
							/>
						</td>
						<td>
							<input
								readOnly
								type="text"
								value={countNumberfoundText}
								style={{ width: 30 }}
								title="Number of position found for searching text"
							// onChange={(e) => {}}
							/>
						</td>
						<td>
							<input
								type="text"
								style={{ width: 30, height: 30, padding: 5, textAlign: "center" }}
								min={0}
								defaultValue={0}
								onChange={handleIndexesValueChange}
							/>
						</td>
						<td>
							<button id="exchange_button" onClick={validReplacingString}>
								<img src={icons.checkMarkIcon} alt="" />
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

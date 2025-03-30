import "../../assets/styles/index.css";
import { useState } from "react";
import { generateRandomId, replaceStringAtPosition, getCountSubstring } from "../../utils";
import { icons } from "../../constants";

export const UpdateUrlText = ({ urlFilteringEl, containerEl, setChangeUrlTasks }) => {
	const [lastChange, setLastChange] = useState({});
	const [currentText, setCurrentText] = useState("");
	const [validChanging, setValidChanging] = useState(true);
	const [searchingText, setSearchingText] = useState("");
	const [replacingText, setReplacingText] = useState("");
	const [countNumberfoundText, setCountNumberFoundText] = useState(0);
	const [replacingPos, setReplacingPos] = useState(0);

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

	function highlightText(text, pos) {
		urlFilteringEl.current.innerHTML = replaceStringAtPosition(
			currentText,
			text,
			`<mark class="highlight">$&</mark>`,
			pos
		);
	}

	return (
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
	);
};

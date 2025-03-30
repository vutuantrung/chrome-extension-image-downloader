import { FilterSizes } from "./FilterSizes";
import { OptionsMenu } from "./OptionsMenu";
import { CollectMedia } from "./CollectMedia";
import { CustomizeUrl } from "./CustomizeUrl";

import { icons } from "../../constants";
import { changeOptionsMode, getIconByMode } from "../../helpers/urlHelper";
import { useEffect, useState } from "react";
import { FilterUrl } from "./FilterUrl";
import images from "../../constants/images";

export const FilterContainer = ({ options, setOptions, medias, setMedias, currentPageName }) => {
	const [showOptionMenu, setShowOptionMenu] = useState(false);
	const [changeUrlTasks, setChangeUrlTasks] = useState([]);

	useEffect(() => {
		// get last task and change value
		if (changeUrlTasks.length <= 0) return;

		let currMedias = medias;
		let currentTasks = changeUrlTasks;
		let currentTask = currentTasks[currentTasks.length - 1];

		// Change
		if (currentTask.taskName === "change" && currentTask.flag === "pending") {
			currMedias = medias.map((m) => {
				return {
					...m,
					src: m.src.replace(currentTask.searchValue, currentTask.replaceValue),
				};
			});

			currentTasks = currentTasks.map((task) => (task.id === currentTask.id ? { ...task, flag: "ok" } : task));
		}

		// Undo
		if (currentTask.taskName === "undo") {
			if (currentTasks.length >= 2) {
				let undoTask = currentTasks[currentTasks.length - 2];
				currMedias = medias.map((m) => {
					return {
						...m,
						src: m.src.replace(undoTask.replaceValue, undoTask.searchValue),
					};
				});
			}
			// remove last 2 tasks from task list
			currentTasks.splice(-2);
		}

		setChangeUrlTasks(currentTasks);
		setMedias(currMedias);
	}, [changeUrlTasks, medias]);

	function optionMenuButtonClick() {
		setShowOptionMenu(!showOptionMenu);
	}

	function changeFilterMode() {
		let newMode;
		if (options.filter_mode === "size") newMode = "url";
		if (options.filter_mode === "url") newMode = "collect";
		if (options.filter_mode === "collect") newMode = "size";

		setOptions((options) => ({ ...options, filter_mode: newMode }));
	}

	function changeMode() {
		let newMode = changeOptionsMode(options.mode, currentPageName);
		setOptions((options) => ({ ...options, mode: newMode }));
	}

	function changeFilterUrl({ currentTarget: { value } }) {
		setOptions((options) => ({ ...options, filter_url: value.trim() }));
	}

	function changeFilterUrlMode({ currentTarget: { value } }) {
		setOptions((options) => ({ ...options, filter_url_mode: value }));
	}

	function displayFilter() {
		if (["jjgirl", "youtube"].includes(currentPageName)) return <></>;
		let filterMode = <></>;
		if (options.filter_mode === "size") {
			filterMode = <FilterSizes options={options} setOptions={setOptions} />;
		}
		if (options.filter_mode === "url") {
			filterMode = <CustomizeUrl urlFiltering={options.filter_url} setChangeUrlTasks={setChangeUrlTasks} />;
		}
		if (options.filter_mode === "collect") {
			filterMode = <CollectMedia urlFiltering={options.filter_url} setChangeUrlTasks={setChangeUrlTasks} />;
		}

		return (
			<div>
				<FilterUrl
					options={options}
					changeFilterUrl={changeFilterUrl}
					changeFilterUrlMode={changeFilterUrlMode}
				/>
				{options.show_advanced_filters === "true" && filterMode}
			</div>
		);
	}

	return (
		<div id="filters_container">
			<div className="filter-platforms">
				<div className="user-view">
					<img src={images.userAvatar} alt="avatar" />
					<div>Welcome, user</div>
				</div>
				<div className="buttons-view">
					<button
						id="exchange_button"
						title={"Change filter mode: " + options.filter_mode}
						onClick={changeFilterMode}
					>
						<img className="toggle" src={icons.repeat2Icon} alt="" />
					</button>
					<button id="exchange_button" title="Change mode" onClick={changeMode}>
						<img src={getIconByMode(options.mode)} alt="" />
					</button>
					<button id="open_options_button" title="Options" onClick={optionMenuButtonClick}>
						<img src={icons.toolsIcon} alt="" />
					</button>
					<OptionsMenu showMenu={showOptionMenu} options={options} setOptions={setOptions} />
				</div>
			</div>

			{displayFilter()}
		</div>
	);
};

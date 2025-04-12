/*global chrome*/

import { useEffect, useState } from "react";
import { getRandomInt } from "../../utils";
import { icons } from "../../constants/index";

export const JJGirlProfile = (props) => {
	const [imgBGUrl, setImgBGUrl] = useState("");
	const [imgSize, setImgSize] = useState({ width: 0, height: 0 });

	let modelInfor = props.modelInfor;
	let urlJJGirstString = "http://www.jjgirls.com/japanese/#nameModel#/#pageNumber#/#nameModel#-#fileNumber#.jpg";

	useEffect(() => {
		setImgBGUrl(
			urlJJGirstString
				.replaceAll("#nameModel#", modelInfor ? modelInfor.name : "unknown")
				.replaceAll("#pageNumber#", "1")
				.replaceAll("#fileNumber#", "1")
		);
	}, [modelInfor, urlJJGirstString]);

	useEffect(() => {
		const img = new Image();
		let height;
		img.onload = function () {
			height = Math.floor((this.height * 440) / this.width);
			setImgSize({ width: 440, height: height });
		};
		img.src = imgBGUrl;
	}, [imgBGUrl]);

	const randomFileNumber = () => {
		let rPageNumber = getRandomInt(1, modelInfor.lastPageNumber);
		let rFileNumber = getRandomInt(1, rPageNumber === modelInfor.lastPageNumber ? modelInfor.lastPageNumber : 12);

		setImgBGUrl(
			urlJJGirstString
				.replaceAll("#nameModel#", modelInfor ? modelInfor.name : "unknown")
				.replaceAll("#pageNumber#", rPageNumber)
				.replaceAll("#fileNumber#", rFileNumber)
		);
	};

	return (
		<div
			style={{
				backgroundRepeat: "no-repeat",
				backgroundPosition: "center",
				backgroundSize: "cover",
				backgroundImage: `url('${imgBGUrl}')`,
				width: imgSize.width + "px",
				height: imgSize.height + "px",
			}}
		>
			<button
				type="button"
				style={{
					width: "50px",
					height: "50px",
					borderRadius: "5px",
					margin: "5px",
					backgroundColor: "rgba(177, 177, 177, 0.2)",
				}}
				onClick={randomFileNumber}
			>
				<img src={icons.repeatIcon} alt="" />
			</button>
			<button
				type="button"
				style={{
					width: "50px",
					height: "50px",
					borderRadius: "5px",
					margin: "5px",
					backgroundColor: "rgba(177, 177, 177, 0.5)",
				}}
				onClick={() => {
					chrome.tabs.create({ url: imgBGUrl, active: false });
				}}
			>
				<img src={icons.expandIcon} alt="" />
			</button>
		</div>
	);
};

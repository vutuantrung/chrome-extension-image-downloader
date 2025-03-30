import "../../assets/styles/index.css";
import { useMemo } from "react";
import { isNotStrictEqual, stopPropagation } from "../../utils";

import { JJGirlProfile } from "./JJGirlProfile";
import { Youtube } from "./Youtube";
import { DownloadMediaButton, MediaUrlTextbox, OpenMediaButton } from "./MediaActions";

import { IMAGES } from "../../constants/index";
import { LazyLoadImage } from "react-lazy-load-image-component";

export const Images = ({
	options,
	medias,
	mediasToDownload,
	selectedMedias,
	setSelectedMedias,
	style,
	modelInfor,
	youtubeData,
	isLoading,
	...props
}) => {
	// const someImagesAreSelected = useMemo(
	//     () => medias.length > 0 && medias.some(isIncludedIn(selectedMedias)),
	//     [medias, selectedMedias]
	// );

	// const allImagesAreSelected = useMemo(
	//     () => medias.length > 0 && medias.every(isIncludedIn(selectedMedias)),
	//     [medias, selectedMedias]
	// );

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				// backgroundColor: "red",
				alignItems: "center",
			}}
		>
			{/* {options.mode !== "youtube" && (
                <Checkbox
                    checkboxClass="select_all_checkbox"
                    checked={allImagesAreSelected}
                    indeterminate={someImagesAreSelected && !allImagesAreSelected}
                    onChange={({ currentTarget: { checked } }) => {
                        setSelectedMedias(checked ? medias : []);
                    }}
                >
                    {" "}
                    Select all ({mediasToDownload.length} / {medias.length})
                </Checkbox>
            )} */}

			{/* <JJGirlProfile
                modelInfor={{
                    name: "amiri-saitou",
                    lastPageNumber: 12,
                    lastImageNumber: 12,
                }}
            /> */}

			{/* <Youtube videoData={youtubeData} /> */}

			{/* <Facebook /> */}

			{isLoading ? (
				<WatingComponent />
			) : options.mode === "jjgirl" ? (
				<JJGirlProfile modelInfor={modelInfor} />
			) : options.mode === "youtube" ? (
				<Youtube videoData={youtubeData} />
			) : (
				<ListImage
					medias={medias}
					options={options}
					selectedMedias={selectedMedias}
					setSelectedMedias={setSelectedMedias}
				/>
			)}
		</div>
	);
};

const ListImage = ({ options, medias, selectedMedias, setSelectedMedias, style, ...props }) => {
	const containerStyle = useMemo(() => {
		const columns = parseInt(options.columns, 10);
		return {
			gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
			width: `calc(2 * var(--images-container-padding) + ${columns} * ${options.image_max_width}px + ${columns - 1
				} * var(--images-container-gap))`,
			...style,
		};
	}, [options.columns, options.image_max_width, style]);

	const showMediaUrl = useMemo(() => options.show_image_url === "true", [options.show_image_url]);

	const showOpenMediaButton = useMemo(
		() => options.show_open_image_button === "true",
		[options.show_open_image_button]
	);

	const showDownloadMediaButton = useMemo(
		() => options.show_download_image_button === "true",
		[options.show_download_image_button]
	);

	return (
		<div id="images_container" style={containerStyle} {...props}>
			{options.mode === "mrcong"
				? medias.map((media, index) => (
					<MrcongPageInfo
						key={media.id}
						media={media}
						mediaIndex={index}
						options={options}
						selectedMedias={selectedMedias}
						setSelectedMedias={setSelectedMedias}
					/>
				))
				: medias.map((media, index) => (
					<Image
						key={media.id}
						media={media}
						mediaIndex={index}
						options={options}
						selectedMedias={selectedMedias}
						setSelectedMedias={setSelectedMedias}
						showOpenMediaButton={showOpenMediaButton}
						showDownloadMediaButton={showDownloadMediaButton}
						showMediaUrl={showMediaUrl}
					/>
				))}
		</div>
	);
};

const Image = ({
	media,
	mediaIndex,
	options,
	selectedMedias,
	setSelectedMedias,
	showOpenMediaButton,
	showDownloadMediaButton,
	showMediaUrl,
}) => (
	<div
		id={`card_${mediaIndex}`}
		className={`card ${selectedMedias.findIndex((e) => e.id === media.id) !== -1 ? "checked" : ""}`}
		style={{ minHeight: `${options.image_min_height}px` }}
		onClick={() => {
			setSelectedMedias((selectedMedias) =>
				selectedMedias.findIndex((e) => e.id === media.id) !== -1
					? selectedMedias.filter(isNotStrictEqual(media))
					: [...selectedMedias, media]
			);
		}}
	>
		<LazyLoadImage
			className="imgDisplay"
			src={media.thumbs}
			style={{
				minWidth: `${options.image_min_width}px`,
				maxWidth: `${options.image_max_width}px`,
				objectFit: "cover",
			}}
			effect="blur"
		/>

		{media.mediaType === "video" && (
			<img
				src={IMAGES.videoPlayImage}
				style={{
					background: "transparent",
					position: "absolute",
					top: 0,
					left: 0,
				}}
				alt=""
			/>
		)}

		<div className="checkbox"></div>

		{(showOpenMediaButton || showDownloadMediaButton) && (
			<div className="actions">
				{showOpenMediaButton && <OpenMediaButton media={media} onClick={stopPropagation} />}
				{showDownloadMediaButton && (
					<DownloadMediaButton media={media} options={options} onClick={stopPropagation} />
				)}
			</div>
		)}

		{showMediaUrl && (
			<div className="image_url_container">
				<MediaUrlTextbox value={media.src} onClick={stopPropagation} />
			</div>
		)}
	</div>
);

export const MrcongPageInfo = ({ media, mediaIndex, options, selectedMedias, setSelectedMedias }) => {
	return (
		<div
			id={`card_${mediaIndex}`}
			className={`card ${selectedMedias.findIndex((e) => e.id === media.id) !== -1 ? "checked" : ""}`}
			style={{ minHeight: `${options.image_min_height}px` }}
			onClick={() => {
				setSelectedMedias((selectedMedias) =>
					selectedMedias.findIndex((e) => e.id === media.id) !== -1
						? selectedMedias.filter(isNotStrictEqual(media))
						: [...selectedMedias, media]
				);
			}}
		>
			<LazyLoadImage
				src={media.thumbs}
				className="imgDisplay"
				effect="blur"
				style={{
					minWidth: `${options.image_min_width}px`,
					maxWidth: `${options.image_max_width}px`,
					objectFit: "cover",
				}}
			/>
			<div className="info">
				<h1>{media.albumName}</h1>
				<div style={{ display: "flex", alignContent: "center" }}>
					<img src={IMAGES.userIconImage} className="model-img" alt="" />
					<p>{media.modelName}</p>
					<img src={IMAGES.storageCloudIconImage} className="size-img" alt="" />
					<p>{media.size}</p>
				</div>
			</div>

			<div className="checkbox"></div>
			<div className="actions">
				<DownloadMediaButton media={media} options={options} onClick={stopPropagation} />
			</div>
		</div>
	);
};

const WatingComponent = () => {
	return (
		<div className="waiting-component">
			<img src={IMAGES.loadingImage} alt="" />
		</div>
	);
};

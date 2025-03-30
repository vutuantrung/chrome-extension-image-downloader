/*global chrome*/

import './assets/styles/App.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
	isIncludedIn,
	removeSpecialCharacters,
	unique,
	parseHtmlString,
} from './utils.js';
import {
	countImagesIndexes,
	collectMediasFromPage,
	getExtraMediasFromTumblr,
	getSpecificPageName,
	getMrcongPageInformation,
	getYoutubeVideoInformation,
} from './helpers/urlHelper';
//import { DownloadConfirmation } from './DownloadConfirmation';
import { Images } from './Components/DisplayImages/Images';
import { DownloadContainer } from './Components/DownloadContainer/DownloadContainer';
import { FilterContainer } from './Components/FilterContainer/FilterContainer';
import { Checkbox } from './Components/FilterContainer/Checkbox.jsx';
import * as chromeActions from './actions.js';

const initialOptions = localStorage;

const App = () => {
	const [options, setOptions] = useState(initialOptions);

	// Medias collections
	const [medias, setMedias] = useState([]);
	const [allMedias, setAllMedias] = useState([]);
	const [tabsMedias, setTabsMedias] = useState([]);
	const [linkedMedias, setLinkedMedias] = useState([]);
	const [selectedMedias, setSelectedMedias] = useState([]);

	const [isLoading, setIsLoading] = useState(true);
	//const [downloadConfirmationIsShown, setDownloadConfirmationIsShown] = useState(false);
	const [modelInfor, setModelInfor] = useState();
	const [youtubeData, setYoutubeData] = useState();
	const [currentPageName, setCurrentPageName] = useState('normal');

	const imagesCacheRef = useRef(null);

	const filterMedias = () => {
		let medias =
			options.mode === 'tab'
				? tabsMedias
				: options.only_images_from_links === 'true'
					? linkedMedias
					: allMedias;
		// With images
		medias =
			options.with_images === 'true'
				? medias
				: medias.filter((media) => media.mediaType !== 'image');
		// With videos
		medias =
			options.with_videos === 'true'
				? medias
				: medias.filter((media) => media.mediaType !== 'video');

		let filterValue = options.filter_url;
		if (filterValue) {
			switch (options.filter_url_mode) {
				case 'normal':
					const terms = filterValue.split(/\s+/);
					medias = medias.filter((media) => {
						const url = media.mediaType !== 'image' ? media.src : media.thumbs;

						for (let i = 0; i < terms.length; i++) {
							if (terms[i].length === 0) {
								continue;
							}

							let term = terms[i];
							const expected = term[0] !== '-';
							if (!expected) {
								term = term.substr(1);
								if (term.length === 0) {
									continue;
								}
							}

							const found = url.indexOf(term) !== -1;
							if (found !== expected) {
								return false;
							}
						}
						return true;
					});
					break;
				case 'wildcard':
					filterValue = filterValue
						.replace(/([.^$[\]\\(){}|-])/g, '\\$1')
						.replace(/([?*+])/, '.$1');
				/* fall through */
				case 'regex':
					medias = medias.filter((media) => {
						try {
							const url =
								media.mediaType === 'image' ? media.src : media.thumbs;
							return url.match(filterValue);
						} catch (error) {
							return false;
						}
					});
					break;
				default:
					break;
			}
		}

		medias =
			currentPageName === 'youtube'
				? []
				: medias.filter((media) => {
					const source = encodeURI(
						media.mediaType === 'image' ? media.src : media.thumbs,
					);
					const image = imagesCacheRef.current.querySelector(
						`img[src="${source}"]`,
					);

					return (
						(options.filter_min_width_enabled !== 'true' || options.filter_min_width <= image.naturalWidth) &&
						(options.filter_max_width_enabled !== 'true' || options.filter_max_width >= image.naturalWidth) &&
						(options.filter_min_height_enabled !== 'true' || options.filter_min_height <= image.naturalHeight) &&
						(options.filter_max_height_enabled !== 'true' || options.filter_max_height >= image.naturalHeight)
					);
				});

		setMedias(medias);
	};

	useEffect(filterMedias, [allMedias, linkedMedias, tabsMedias, options]);

	useEffect(() => {
		Object.assign(localStorage, options);
	}, [options]);

	useEffect(() => {
		chromeActions.getPageCookie().then((cookies) => console.log(cookies));

		setIsLoading(true);

		if (options.fix_folder_name !== 'true') {
			setOptions((options) => ({ ...options, folder_name: '' }));
		}
		if (options.fix_new_file_name !== 'true') {
			setOptions((options) => ({ ...options, new_file_name: '' }));
		}
		if (options.fix_start_index !== 'true') {
			setOptions((options) => ({ ...options, start_index: 0 }));
		}

		const collectMedias = async () => {
			let allM, linkedM;
			// Current page information (base uri, DOM)
			const currentPageInfor = await getCurrentPageElement();
			const pageName = getSpecificPageName(currentPageInfor.baseUri);

			// Set mode
			setOptions((options) => ({
				...options,
				mode: pageName,
				image_max_width: 200,
				columns: 2,
				show_open_image_button: true,
			}));

			// "Normal mode' : Page medias
			const collectedMedias = collectMediasFromPage(currentPageInfor.dom);

			// DO NOT DELETE! -> others page
			allM = collectedMedias.allMediasLocal;
			linkedM = collectedMedias.linkedMediasLocal;

			if (
				pageName === 'normal' ||
				pageName === 'jpgchurch' ||
				pageName === 'rule34'
			) {
				allM = collectedMedias.allMediasLocal;
				linkedM = collectedMedias.linkedMediasLocal;
			}

			if (pageName === 'telegram') {
				// Get title
				const titleDiv = currentPageInfor.dom.querySelector(
					'header[class="tl_article_header"] > h1',
				);
				const titleText = titleDiv.innerText;
				setOptions((options) => ({
					...options,
					folder_name: removeSpecialCharacters(titleText),
				}));

				allM = linkedM = collectedMedias.allMediasLocal;
			}

			if (pageName === 'cyberdrop') {
				// Get title
				const titleDiv = currentPageInfor.dom.querySelector('h1[id="title"][class="title has-text-centered"]');
				const titleText = titleDiv.innerText.trim();
				setOptions((options) => ({
					...options,
					folder_name: removeSpecialCharacters(titleText),
				}));

				allM = linkedM = collectedMedias.linkedMediasLocal;
			}

			if (pageName === 'tumblr') {
				allM = collectedMedias.allMediasLocal;
				linkedM = collectedMedias.linkedMediasLocal;

				// get extra medias from hidden #document
				const extraMedias = await getExtraMediasFromTumblr(currentPageInfor.dom);
				allM = [...allM, ...extraMedias.allM];
				linkedM = [...linkedM, ...extraMedias.linkedM];
			}

			if (pageName === 'youtube') {
				const result = await getYoutubeVideoInformation(currentPageInfor.baseUri);
				setYoutubeData(result?.data?.data ?? undefined);
			}

			if (pageName === 'jjgirl') {
				const result = await getJJGirlModelInformation(currentPageInfor.baseUri);
				setModelInfor({
					name: result.name,
					lastPageNumber: result.lastPageNumber,
					lastImageNumber: result.lastImageNumber,
				});

				allM = linkedM = result.imgUrls;
			}

			if (pageName === 'mrcong') {
				const titleDiv = currentPageInfor.dom.querySelector('h1[class="page-title"] > span');
				const preName = `[MrCong]${titleDiv !== null ? `[${titleDiv.innerHTML.trim()}]` : '[mix]'}`;
				setOptions((options) => ({
					...options,
					image_max_width: 400,
					columns: 1,
					show_open_image_button: false,
					new_file_name: preName,
				}));

				const result = await getMrcongPageInformation(currentPageInfor.dom);
				allM = linkedM = result;
			}

			setAllMedias((allMedias) => unique([...allMedias, ...allM]));
			setLinkedMedias((linkedMedias) => unique([...linkedMedias, ...linkedM]));

			// Tab medias
			let colectedTabMedias = await getTabMedias();
			setTabsMedias((tabsMedias) =>
				unique([...tabsMedias, ...colectedTabMedias]),
			);

			// Set other states
			setCurrentPageName(pageName);
		};

		collectMedias()
			.then(() => {
				setIsLoading(false);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [
		options.fix_folder_name,
		options.fix_new_file_name,
		options.fix_start_index,
	]);

	const mediasToDownload = useMemo(
		() => medias.filter(isIncludedIn(selectedMedias)),
		[medias, selectedMedias],
	);

	async function getJJGirlModelInformation(url) {
		const modelName = url.split('/')[4];
		const result = await countImagesIndexes(modelName);
		return { name: modelName, ...result };
	}

	async function getTabMedias() {
		const getTabMediasReq = await chromeActions.getMediasFromTabs();
		return getTabMediasReq.tabMedias;
	}

	async function getCurrentPageElement() {
		const pageDOM = await chromeActions.getPageDOMElement();
		return {
			baseUri: pageDOM.baseUri,
			dom: parseHtmlString(pageDOM),
		};
	}

	const someImagesAreSelected = useMemo(
		() => medias.length > 0 && medias.some(isIncludedIn(selectedMedias)),
		[medias, selectedMedias],
	);

	const allImagesAreSelected = useMemo(
		() => medias.length > 0 && medias.every(isIncludedIn(selectedMedias)),
		[medias, selectedMedias],
	);

	return (
		<div style={{ width: '450px' }}>
			<FilterContainer
				options={options}
				setOptions={setOptions}
				medias={medias}
				setMedias={setMedias}
				currentPageName={currentPageName}
			/>

			{currentPageName !== 'youtube' && (
				<div ref={imagesCacheRef} className='hidden'>
					{allMedias.map((media) => {
						const url = media.mediaType === 'image' ? media.src : media.thumbs;
						return <img src={encodeURI(url)} onLoad={filterMedias} alt={''} />;
					})}
				</div>
			)}

			{currentPageName !== 'youtube' && (
				<Checkbox
					checkboxClass='select_all_checkbox'
					checked={allImagesAreSelected}
					indeterminate={someImagesAreSelected && !allImagesAreSelected}
					onChange={({ currentTarget: { checked } }) => {
						setSelectedMedias(checked ? medias : []);
					}}
				>
					{' '}
					Select all ({mediasToDownload.length} / {medias.length})
				</Checkbox>
			)}

			<Images
				options={options}
				medias={medias}
				isLoading={isLoading}
				selectedMedias={selectedMedias}
				mediasToDownload={mediasToDownload}
				setSelectedMedias={setSelectedMedias}
				modelInfor={modelInfor}
				youtubeData={youtubeData}
			/>

			{!isLoading && currentPageName !== 'youtube' && (
				<DownloadContainer
					options={options}
					setOptions={setOptions}
					tabsMedias={tabsMedias}
					setTabsMedias={setTabsMedias}
					mediasToDownload={mediasToDownload}
				/>
			)}
		</div>
	);
};

export default App;

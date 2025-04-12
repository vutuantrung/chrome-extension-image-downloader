/*global chrome*/

import "../../assets/styles/index.css";
import { Tooltip } from "react-tooltip";
import images from "../../constants/images";

export const Youtube = (props) => {
	const data = props.videoData;

	const sortItems = (formats) => {
		const audio = [];
		const video = [];
		const film = [];
		for (let i = 0; i <= formats.length; i++) {
			if (!formats[i] || Object.keys(formats[i]).length === 0) {
				continue;
			}
			const format = { ...formats[i] };
			if (format.hasAudio && !format.hasVideo) {
				audio.push(format);
			} else if (!format.hasAudio && format.hasVideo) {
				video.push(format);
			} else {
				film.push(format);
			}
		}

		return [...film, ...video, ...audio];
	};
	console.log("Youtube data", data);
	if (data === undefined || !data.success) {
		return (
			<div style={{ margin: "20px" }}>
				<img src={images.error404Image} alt="" />
			</div>
		);
	}
	console.log("Youtube data 2");

	return (
		<div className="yt-content">
			{/* Thumbs */}
			<img className="thumbs" src={data.thumbnail.split("?")[0]} alt="thumbnails" />

			{/* Title */}
			<div className="title">
				<h2>{data.title}</h2>
			</div>

			{/* Formats */}
			<div className="formats">
				{sortItems(data.medias).map((f, index) => {
					const priorityVideo = f.type === "video" && parseInt(f.quality.split("p")[0]) > 2160;
					const videoDetails = f.quality;
					return (
						<div
							className="tooltip"
							data-tooltip-id="my-tooltip"
							data-tooltip-place="top"
							key={index}
							onClick={() => {
								chrome.tabs.create({ url: f.url, active: false });
							}}
						>
							<div
								className="content"
								style={{
									backgroundColor: priorityVideo ? "yellow" : "#ff1a005e",
								}}
							>
								<div className="video-format">
									<img
										src={f.extension === "mp4" ? images.mp4FormatIcon : images.webmFormatIcon}
										style={{ marginRight: "3px" }}
										alt=""
									/>
									<div
										style={{
											fontSize: "12px",
											position: "relative",
										}}
									>
										<span
											style={{
												// backgroundColor: 'grey',
												position: "absolute",
												bottom: "0px",
											}}
										>
											{videoDetails}
										</span>
									</div>
								</div>
								<div className="video-format">
									{f.hasAudio && <img src={images.audioIcon} alt="" />}
									{f.hasVideo && <img src={images.videoIcon} alt="" />}
								</div>
							</div>
							<Tooltip id="my-tooltip" place="top" />
						</div>
					);
				})}
			</div>
		</div>
	);
};

const dumpData = {
	title: "See-through Try On Haul Women Clothes | Fully Transparent Lingerie | Very revealing!💦",
	embed: {
		iframeUrl: "https://www.youtube.com/embed/TISf7ez-Tgg",
		width: 1280,
		height: 720,
	},
	viewCount: 34071,
	uploadDate: "01-01-2024 02:00:13",
	publishDate: "01-01-2024 02:00:13",
	lengthSeconds: "2:38",
	description:
		"💋 For more content, visit my website: lilasweet.com\n\n📺 Check out my latest YouTube video featuring my new Fully Transparent Women's Lingerie collection and daring outfits! Some garments provide a playful peek at my silhouette 😂. Enjoyed the see-through clothes? 🎉 Don't forget to hit \"LIKE\" to show your support! ❤️\n\n🔔 Ring the notification bell to never miss an upload! Stay tuned for more exciting content. 🚀\n\n📌 Connect on my socials for exclusive behind-the-scenes moments and updates! 📌\n\nThanks for joining this incredible journey! 🙌 Stay fabulous, and see you in the next video! 🎥💫",
	video_url: "https://www.youtube.com/watch?v=TISf7ez-Tgg",
	thumbnails: [
		{
			url: "https://i.ytimg.com/vi/TISf7ez-Tgg/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLAZmOZQHtztbYqgzMIo9dekKSMl_w",
			width: 168,
			height: 94,
		},
		{
			url: "https://i.ytimg.com/vi/TISf7ez-Tgg/hqdefault.jpg?sqp=-oaymwEbCMQBEG5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLC1OkHW4hAUK0mpOw6beRO6XT1P2w",
			width: 196,
			height: 110,
		},
		{
			url: "https://i.ytimg.com/vi/TISf7ez-Tgg/hqdefault.jpg?sqp=-oaymwEcCPYBEIoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAfLwtJRabnrQy9-0QRPzkU-JXGiw",
			width: 246,
			height: 138,
		},
		{
			url: "https://i.ytimg.com/vi/TISf7ez-Tgg/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAZ4i1a9XzsZP-EWRX8MQQAiPGCWg",
			width: 336,
			height: 188,
		},
		{
			url: "https://i.ytimg.com/vi_webp/TISf7ez-Tgg/maxresdefault.webp",
			width: 1920,
			height: 1080,
		},
	],
	id: "TISf7ez-Tgg",
	dateCreated: "2024-01-06T06:44:00.459818Z",
	likes: 1266,
	dislikes: 25,
	rating: 4.9225406661502715,
	deleted: false,
	formats: [
		{
			url: "https://rr2---sn-8qj-8ube.googlevideo.com/videoplayback?expire=1704545813&ei=tPmYZbKuPM6B1d8P2quz2AU&ip=123.28.103.129&id=o-AFiAVOAxXT3J2t_tEaJ3LaxtTK5VR2lrNQqjyO4EWivD&itag=18&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=IX&mm=31%2C29&mn=sn-8qj-8ube%2Csn-8qj-nboll&ms=au%2Crdu&mv=m&mvi=2&pl=23&initcwndbps=1316250&spc=UWF9f4M6S-nno7vkRM5hBxJCcOyG-6QnwJ3MitnMbw&vprv=1&svpuc=1&mime=video%2Fmp4&ns=WevwWKohbmW4N5heADndk4EQ&gir=yes&clen=11514592&ratebypass=yes&dur=157.663&lmt=1703825199445099&mt=1704523987&fvip=2&fexp=24007246&c=WEB&sefc=1&txp=6309224&n=2gnrkc7OzVotrg&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&sig=AJfQdSswRAIgbJg0J-1LjgkwC00tJfzLwZ3sTmcMI3-0PYBpbxpCgAMCIBuBvwQyH6hiJPrFN3-4m8W_QZ-eChu7cQVjhD-QFPgQ&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AAO5W4owRgIhAOsivghKn4a8QntOLDkT3ve4-aOFzk8wA5sAfuRoy7EoAiEAkU9FkZ9UaRaqu7tXZ5fX5jxxLWC40-nCgadc6votx5U%3D",
			mimeType: 'video/mp4; codecs="avc1.42001E, mp4a.40.2"',
			bitrate: 584497,
			fps: 30,
			qualityLabel: "360p",
			width: 640,
			height: 360,
			contentLength: "11514592",
			quality: "medium",
			projectionType: "RECTANGULAR",
			hasVideo: true,
			hasAudio: true,
		},
		{
			url: "https://rr2---sn-8qj-8ube.googlevideo.com/videoplayback?expire=1704545813&ei=tPmYZbKuPM6B1d8P2quz2AU&ip=123.28.103.129&id=o-AFiAVOAxXT3J2t_tEaJ3LaxtTK5VR2lrNQqjyO4EWivD&itag=136&aitags=133%2C134%2C135%2C136%2C160%2C242%2C243%2C244%2C247%2C278&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=IX&mm=31%2C29&mn=sn-8qj-8ube%2Csn-8qj-nboll&ms=au%2Crdu&mv=m&mvi=2&pl=23&initcwndbps=1316250&spc=UWF9f4M6S-nno7vkRM5hBxJCcOyG-6QnwJ3MitnMbw&vprv=1&svpuc=1&mime=video%2Fmp4&ns=DGKq-X_Yn2EqOhgDise7cn0Q&gir=yes&clen=38396466&dur=157.599&lmt=1703825211042161&mt=1704523987&fvip=2&keepalive=yes&fexp=24007246&c=WEB&sefc=1&txp=6309224&n=CsrhvO44lAP7EA&sparams=expire%2Cei%2Cip%2Cid%2Caitags%2Csource%2Crequiressl%2Cxpc%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Cgir%2Cclen%2Cdur%2Clmt&sig=AJfQdSswRAIgIG3TIR5__RP2RoUYnp1kY035fOYNT7pKQBiN0Wvat_8CIAnf3kS8ioFvaNfqfkYsGtOpHnk-bAUkrtvg36vgYYJc&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AAO5W4owRgIhAOsivghKn4a8QntOLDkT3ve4-aOFzk8wA5sAfuRoy7EoAiEAkU9FkZ9UaRaqu7tXZ5fX5jxxLWC40-nCgadc6votx5U%3D",
			mimeType: 'video/mp4; codecs="avc1.64001f"',
			bitrate: 2299328,
			fps: 30,
			qualityLabel: "720p",
			width: 1280,
			height: 720,
			contentLength: "38396466",
			quality: "hd720",
			projectionType: "RECTANGULAR",
			hasVideo: true,
			hasAudio: false,
		},
		{
			url: "https://rr2---sn-8qj-8ube.googlevideo.com/videoplayback?expire=1704545813&ei=tPmYZbKuPM6B1d8P2quz2AU&ip=123.28.103.129&id=o-AFiAVOAxXT3J2t_tEaJ3LaxtTK5VR2lrNQqjyO4EWivD&itag=247&aitags=133%2C134%2C135%2C136%2C160%2C242%2C243%2C244%2C247%2C278&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=IX&mm=31%2C29&mn=sn-8qj-8ube%2Csn-8qj-nboll&ms=au%2Crdu&mv=m&mvi=2&pl=23&initcwndbps=1316250&spc=UWF9f4M6S-nno7vkRM5hBxJCcOyG-6QnwJ3MitnMbw&vprv=1&svpuc=1&mime=video%2Fwebm&ns=DGKq-X_Yn2EqOhgDise7cn0Q&gir=yes&clen=20054917&dur=157.600&lmt=1703825205300769&mt=1704523987&fvip=2&keepalive=yes&fexp=24007246&c=WEB&sefc=1&txp=630F224&n=CsrhvO44lAP7EA&sparams=expire%2Cei%2Cip%2Cid%2Caitags%2Csource%2Crequiressl%2Cxpc%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Cgir%2Cclen%2Cdur%2Clmt&sig=AJfQdSswRAIgHmA1zjKaB7_yNQsvYdV5xKJuJc6zKnuePUah3gXh1xYCIBLJ4eYcIm59M9QYMvszbAvtSiN7-N1fGqKTI7KEwQxy&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AAO5W4owRgIhAOsivghKn4a8QntOLDkT3ve4-aOFzk8wA5sAfuRoy7EoAiEAkU9FkZ9UaRaqu7tXZ5fX5jxxLWC40-nCgadc6votx5U%3D",
			mimeType: 'video/webm; codecs="vp9"',
			bitrate: 2173813,
			fps: 30,
			qualityLabel: "720p",
			width: 1280,
			height: 720,
			contentLength: "20054917",
			quality: "hd720",
			projectionType: "RECTANGULAR",
			hasVideo: true,
			hasAudio: false,
		},
		{
			url: "https://rr2---sn-8qj-8ube.googlevideo.com/videoplayback?expire=1704545813&ei=tPmYZbKuPM6B1d8P2quz2AU&ip=123.28.103.129&id=o-AFiAVOAxXT3J2t_tEaJ3LaxtTK5VR2lrNQqjyO4EWivD&itag=135&aitags=133%2C134%2C135%2C136%2C160%2C242%2C243%2C244%2C247%2C278&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=IX&mm=31%2C29&mn=sn-8qj-8ube%2Csn-8qj-nboll&ms=au%2Crdu&mv=m&mvi=2&pl=23&initcwndbps=1316250&spc=UWF9f4M6S-nno7vkRM5hBxJCcOyG-6QnwJ3MitnMbw&vprv=1&svpuc=1&mime=video%2Fmp4&ns=DGKq-X_Yn2EqOhgDise7cn0Q&gir=yes&clen=17980430&dur=157.599&lmt=1703825221900684&mt=1704523987&fvip=2&keepalive=yes&fexp=24007246&c=WEB&sefc=1&txp=6309224&n=CsrhvO44lAP7EA&sparams=expire%2Cei%2Cip%2Cid%2Caitags%2Csource%2Crequiressl%2Cxpc%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Cgir%2Cclen%2Cdur%2Clmt&sig=AJfQdSswRgIhANMlJfT9H--AH6H3d8iNzuMZhjlXIL7Y6V5-pJhUKH3dAiEAnibhNmy8Dr3Nq5fv0AUvPijJ1HGrtjYGnLloMuzUI3U%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AAO5W4owRgIhAOsivghKn4a8QntOLDkT3ve4-aOFzk8wA5sAfuRoy7EoAiEAkU9FkZ9UaRaqu7tXZ5fX5jxxLWC40-nCgadc6votx5U%3D",
			mimeType: 'video/mp4; codecs="avc1.4d401f"',
			bitrate: 1198264,
			fps: 30,
			qualityLabel: "480p",
			width: 854,
			height: 480,
			contentLength: "17980430",
			quality: "large",
			projectionType: "RECTANGULAR",
			hasVideo: true,
			hasAudio: false,
		},
		{
			url: "https://rr2---sn-8qj-8ube.googlevideo.com/videoplayback?expire=1704545813&ei=tPmYZbKuPM6B1d8P2quz2AU&ip=123.28.103.129&id=o-AFiAVOAxXT3J2t_tEaJ3LaxtTK5VR2lrNQqjyO4EWivD&itag=244&aitags=133%2C134%2C135%2C136%2C160%2C242%2C243%2C244%2C247%2C278&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=IX&mm=31%2C29&mn=sn-8qj-8ube%2Csn-8qj-nboll&ms=au%2Crdu&mv=m&mvi=2&pl=23&initcwndbps=1316250&spc=UWF9f4M6S-nno7vkRM5hBxJCcOyG-6QnwJ3MitnMbw&vprv=1&svpuc=1&mime=video%2Fwebm&ns=DGKq-X_Yn2EqOhgDise7cn0Q&gir=yes&clen=10947770&dur=157.600&lmt=1703825204092601&mt=1704523987&fvip=2&keepalive=yes&fexp=24007246&c=WEB&sefc=1&txp=630F224&n=CsrhvO44lAP7EA&sparams=expire%2Cei%2Cip%2Cid%2Caitags%2Csource%2Crequiressl%2Cxpc%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Cgir%2Cclen%2Cdur%2Clmt&sig=AJfQdSswRgIhAIqr3kMl3mP4eNVvrRUkHBDpenJS7j6bL8xLN2k-ltmfAiEApoSmlhlsMNebrA-Tgg_p32CB-P_B2fiHm0L540xm-So%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AAO5W4owRgIhAOsivghKn4a8QntOLDkT3ve4-aOFzk8wA5sAfuRoy7EoAiEAkU9FkZ9UaRaqu7tXZ5fX5jxxLWC40-nCgadc6votx5U%3D",
			mimeType: 'video/webm; codecs="vp9"',
			bitrate: 947576,
			fps: 30,
			qualityLabel: "480p",
			width: 854,
			height: 480,
			contentLength: "10947770",
			quality: "large",
			projectionType: "RECTANGULAR",
			hasVideo: true,
			hasAudio: false,
		},
		{
			url: "https://rr2---sn-8qj-8ube.googlevideo.com/videoplayback?expire=1704545813&ei=tPmYZbKuPM6B1d8P2quz2AU&ip=123.28.103.129&id=o-AFiAVOAxXT3J2t_tEaJ3LaxtTK5VR2lrNQqjyO4EWivD&itag=134&aitags=133%2C134%2C135%2C136%2C160%2C242%2C243%2C244%2C247%2C278&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=IX&mm=31%2C29&mn=sn-8qj-8ube%2Csn-8qj-nboll&ms=au%2Crdu&mv=m&mvi=2&pl=23&initcwndbps=1316250&spc=UWF9f4M6S-nno7vkRM5hBxJCcOyG-6QnwJ3MitnMbw&vprv=1&svpuc=1&mime=video%2Fmp4&ns=DGKq-X_Yn2EqOhgDise7cn0Q&gir=yes&clen=9540568&dur=157.599&lmt=1703825213107162&mt=1704523987&fvip=2&keepalive=yes&fexp=24007246&c=WEB&sefc=1&txp=6309224&n=CsrhvO44lAP7EA&sparams=expire%2Cei%2Cip%2Cid%2Caitags%2Csource%2Crequiressl%2Cxpc%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Cgir%2Cclen%2Cdur%2Clmt&sig=AJfQdSswRAIgcs6UXdeMAvuWmWU4YzuFfJgaTtPMW--v5mPs7LfKzs0CIARmwE2QTYaT_gewiRhu0KU7OZOwu9qJD7dR3TbLZldl&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AAO5W4owRgIhAOsivghKn4a8QntOLDkT3ve4-aOFzk8wA5sAfuRoy7EoAiEAkU9FkZ9UaRaqu7tXZ5fX5jxxLWC40-nCgadc6votx5U%3D",
			mimeType: 'video/mp4; codecs="avc1.4d401e"',
			bitrate: 651517,
			fps: 30,
			qualityLabel: "360p",
			width: 640,
			height: 360,
			contentLength: "9540568",
			quality: "medium",
			projectionType: "RECTANGULAR",
			hasVideo: true,
			hasAudio: false,
		},
		{
			url: "https://rr2---sn-8qj-8ube.googlevideo.com/videoplayback?expire=1704545813&ei=tPmYZbKuPM6B1d8P2quz2AU&ip=123.28.103.129&id=o-AFiAVOAxXT3J2t_tEaJ3LaxtTK5VR2lrNQqjyO4EWivD&itag=243&aitags=133%2C134%2C135%2C136%2C160%2C242%2C243%2C244%2C247%2C278&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=IX&mm=31%2C29&mn=sn-8qj-8ube%2Csn-8qj-nboll&ms=au%2Crdu&mv=m&mvi=2&pl=23&initcwndbps=1316250&spc=UWF9f4M6S-nno7vkRM5hBxJCcOyG-6QnwJ3MitnMbw&vprv=1&svpuc=1&mime=video%2Fwebm&ns=DGKq-X_Yn2EqOhgDise7cn0Q&gir=yes&clen=6136569&dur=157.600&lmt=1703825208981883&mt=1704523987&fvip=2&keepalive=yes&fexp=24007246&c=WEB&sefc=1&txp=630F224&n=CsrhvO44lAP7EA&sparams=expire%2Cei%2Cip%2Cid%2Caitags%2Csource%2Crequiressl%2Cxpc%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Cgir%2Cclen%2Cdur%2Clmt&sig=AJfQdSswRgIhAJmlknsUX_IjFVGWNu_PYQKFUYx2wbnrBm8VUTvoNIWRAiEA7YfCo0yuPHawp6k45eIC9xKD1CmPngmbq_EfR-4-hRI%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AAO5W4owRgIhAOsivghKn4a8QntOLDkT3ve4-aOFzk8wA5sAfuRoy7EoAiEAkU9FkZ9UaRaqu7tXZ5fX5jxxLWC40-nCgadc6votx5U%3D",
			mimeType: 'video/webm; codecs="vp9"',
			bitrate: 500013,
			fps: 30,
			qualityLabel: "360p",
			width: 640,
			height: 360,
			contentLength: "6136569",
			quality: "medium",
			projectionType: "RECTANGULAR",
			hasVideo: true,
			hasAudio: false,
		},
		{
			url: "https://rr2---sn-8qj-8ube.googlevideo.com/videoplayback?expire=1704545813&ei=tPmYZbKuPM6B1d8P2quz2AU&ip=123.28.103.129&id=o-AFiAVOAxXT3J2t_tEaJ3LaxtTK5VR2lrNQqjyO4EWivD&itag=242&aitags=133%2C134%2C135%2C136%2C160%2C242%2C243%2C244%2C247%2C278&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=IX&mm=31%2C29&mn=sn-8qj-8ube%2Csn-8qj-nboll&ms=au%2Crdu&mv=m&mvi=2&pl=23&initcwndbps=1316250&spc=UWF9f4M6S-nno7vkRM5hBxJCcOyG-6QnwJ3MitnMbw&vprv=1&svpuc=1&mime=video%2Fwebm&ns=DGKq-X_Yn2EqOhgDise7cn0Q&gir=yes&clen=3756519&dur=157.600&lmt=1703825217558073&mt=1704523987&fvip=2&keepalive=yes&fexp=24007246&c=WEB&sefc=1&txp=630F224&n=CsrhvO44lAP7EA&sparams=expire%2Cei%2Cip%2Cid%2Caitags%2Csource%2Crequiressl%2Cxpc%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Cgir%2Cclen%2Cdur%2Clmt&sig=AJfQdSswRQIgDtdaPVrzpZSoLB5Dm6jZ7ZkBasVyWBCI4dhvS5DHhZkCIQCDVM6F47dhRPLxF2s5DdmchjVw5v9yfVLg2AYaUHd3Gw%3D%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AAO5W4owRgIhAOsivghKn4a8QntOLDkT3ve4-aOFzk8wA5sAfuRoy7EoAiEAkU9FkZ9UaRaqu7tXZ5fX5jxxLWC40-nCgadc6votx5U%3D",
			mimeType: 'video/webm; codecs="vp9"',
			bitrate: 293057,
			fps: 30,
			qualityLabel: "240p",
			width: 426,
			height: 240,
			contentLength: "3756519",
			quality: "small",
			projectionType: "RECTANGULAR",
			hasVideo: true,
			hasAudio: false,
		},
		{
			url: "https://rr2---sn-8qj-8ube.googlevideo.com/videoplayback?expire=1704545813&ei=tPmYZbKuPM6B1d8P2quz2AU&ip=123.28.103.129&id=o-AFiAVOAxXT3J2t_tEaJ3LaxtTK5VR2lrNQqjyO4EWivD&itag=133&aitags=133%2C134%2C135%2C136%2C160%2C242%2C243%2C244%2C247%2C278&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=IX&mm=31%2C29&mn=sn-8qj-8ube%2Csn-8qj-nboll&ms=au%2Crdu&mv=m&mvi=2&pl=23&initcwndbps=1316250&spc=UWF9f4M6S-nno7vkRM5hBxJCcOyG-6QnwJ3MitnMbw&vprv=1&svpuc=1&mime=video%2Fmp4&ns=DGKq-X_Yn2EqOhgDise7cn0Q&gir=yes&clen=4767509&dur=157.599&lmt=1703825224118027&mt=1704523987&fvip=2&keepalive=yes&fexp=24007246&c=WEB&sefc=1&txp=6309224&n=CsrhvO44lAP7EA&sparams=expire%2Cei%2Cip%2Cid%2Caitags%2Csource%2Crequiressl%2Cxpc%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Cgir%2Cclen%2Cdur%2Clmt&sig=AJfQdSswRQIhAMN41j0caq2GVCgn8oHBA9ZwjL07i9uptCTGLKjf-enNAiAViPhUYezdrCf3RCi-FjYRnje4gH4qx1bvplK-lb14RQ%3D%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AAO5W4owRgIhAOsivghKn4a8QntOLDkT3ve4-aOFzk8wA5sAfuRoy7EoAiEAkU9FkZ9UaRaqu7tXZ5fX5jxxLWC40-nCgadc6votx5U%3D",
			mimeType: 'video/mp4; codecs="avc1.4d4015"',
			bitrate: 289454,
			fps: 30,
			qualityLabel: "240p",
			width: 426,
			height: 240,
			contentLength: "4767509",
			quality: "small",
			projectionType: "RECTANGULAR",
			hasVideo: true,
			hasAudio: false,
		},
		{
			url: "https://rr2---sn-8qj-8ube.googlevideo.com/videoplayback?expire=1704545813&ei=tPmYZbKuPM6B1d8P2quz2AU&ip=123.28.103.129&id=o-AFiAVOAxXT3J2t_tEaJ3LaxtTK5VR2lrNQqjyO4EWivD&itag=160&aitags=133%2C134%2C135%2C136%2C160%2C242%2C243%2C244%2C247%2C278&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=IX&mm=31%2C29&mn=sn-8qj-8ube%2Csn-8qj-nboll&ms=au%2Crdu&mv=m&mvi=2&pl=23&initcwndbps=1316250&spc=UWF9f4M6S-nno7vkRM5hBxJCcOyG-6QnwJ3MitnMbw&vprv=1&svpuc=1&mime=video%2Fmp4&ns=DGKq-X_Yn2EqOhgDise7cn0Q&gir=yes&clen=2198575&dur=157.599&lmt=1703825211555172&mt=1704523987&fvip=2&keepalive=yes&fexp=24007246&c=WEB&sefc=1&txp=6309224&n=CsrhvO44lAP7EA&sparams=expire%2Cei%2Cip%2Cid%2Caitags%2Csource%2Crequiressl%2Cxpc%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Cgir%2Cclen%2Cdur%2Clmt&sig=AJfQdSswRQIgISpKb3FwBGqysrl-S8wxWx8xo_bdG2W9VeKOR83G_FsCIQDmSmuhO7h1cTxJOwu7mYoGkCHJluS2WNv1FcDbJTvcbg%3D%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AAO5W4owRgIhAOsivghKn4a8QntOLDkT3ve4-aOFzk8wA5sAfuRoy7EoAiEAkU9FkZ9UaRaqu7tXZ5fX5jxxLWC40-nCgadc6votx5U%3D",
			mimeType: 'video/mp4; codecs="avc1.4d400c"',
			bitrate: 132968,
			fps: 30,
			qualityLabel: "144p",
			width: 256,
			height: 144,
			contentLength: "2198575",
			quality: "tiny",
			projectionType: "RECTANGULAR",
			hasVideo: true,
			hasAudio: false,
		},
		{
			url: "https://rr2---sn-8qj-8ube.googlevideo.com/videoplayback?expire=1704545813&ei=tPmYZbKuPM6B1d8P2quz2AU&ip=123.28.103.129&id=o-AFiAVOAxXT3J2t_tEaJ3LaxtTK5VR2lrNQqjyO4EWivD&itag=278&aitags=133%2C134%2C135%2C136%2C160%2C242%2C243%2C244%2C247%2C278&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=IX&mm=31%2C29&mn=sn-8qj-8ube%2Csn-8qj-nboll&ms=au%2Crdu&mv=m&mvi=2&pl=23&initcwndbps=1316250&spc=UWF9f4M6S-nno7vkRM5hBxJCcOyG-6QnwJ3MitnMbw&vprv=1&svpuc=1&mime=video%2Fwebm&ns=DGKq-X_Yn2EqOhgDise7cn0Q&gir=yes&clen=1969678&dur=157.600&lmt=1703825201522514&mt=1704523987&fvip=2&keepalive=yes&fexp=24007246&c=WEB&sefc=1&txp=630F224&n=CsrhvO44lAP7EA&sparams=expire%2Cei%2Cip%2Cid%2Caitags%2Csource%2Crequiressl%2Cxpc%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Cgir%2Cclen%2Cdur%2Clmt&sig=AJfQdSswRQIhAJfuus1T1isVS0QAIIH_najqrCch2EAvO5SyeGDC5fXJAiB_kTZrvBOScNbMYD0gPlzQTWu9ZYY4qGJOKaDNaYKz6Q%3D%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AAO5W4owRgIhAOsivghKn4a8QntOLDkT3ve4-aOFzk8wA5sAfuRoy7EoAiEAkU9FkZ9UaRaqu7tXZ5fX5jxxLWC40-nCgadc6votx5U%3D",
			mimeType: 'video/webm; codecs="vp9"',
			bitrate: 131778,
			fps: 30,
			qualityLabel: "144p",
			width: 256,
			height: 144,
			contentLength: "1969678",
			quality: "tiny",
			projectionType: "RECTANGULAR",
			hasVideo: true,
			hasAudio: false,
		},
		{
			url: "https://rr2---sn-8qj-8ube.googlevideo.com/videoplayback?expire=1704545813&ei=tPmYZbKuPM6B1d8P2quz2AU&ip=123.28.103.129&id=o-AFiAVOAxXT3J2t_tEaJ3LaxtTK5VR2lrNQqjyO4EWivD&itag=251&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=IX&mm=31%2C29&mn=sn-8qj-8ube%2Csn-8qj-nboll&ms=au%2Crdu&mv=m&mvi=2&pl=23&initcwndbps=1316250&spc=UWF9f4M6S-nno7vkRM5hBxJCcOyG-6QnwJ3MitnMbw&vprv=1&svpuc=1&mime=audio%2Fwebm&ns=DGKq-X_Yn2EqOhgDise7cn0Q&gir=yes&clen=2387039&dur=157.621&lmt=1703825221084607&mt=1704523987&fvip=2&keepalive=yes&fexp=24007246&c=WEB&sefc=1&txp=6308224&n=CsrhvO44lAP7EA&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Cgir%2Cclen%2Cdur%2Clmt&sig=AJfQdSswRAIgeGq5nY2BkvXYW246fxNUpS7quRyTZadK-TFXJlI-mdACIEo7uZIrG4L5A5XzQzQ8zv3_UQu1huX0BIOAaQnazaJD&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AAO5W4owRgIhAOsivghKn4a8QntOLDkT3ve4-aOFzk8wA5sAfuRoy7EoAiEAkU9FkZ9UaRaqu7tXZ5fX5jxxLWC40-nCgadc6votx5U%3D",
			mimeType: 'audio/webm; codecs="opus"',
			bitrate: 139384,
			qualityLabel: null,
			contentLength: "2387039",
			quality: "tiny",
			projectionType: "RECTANGULAR",
			hasVideo: false,
			hasAudio: true,
		},
		{
			url: "https://rr2---sn-8qj-8ube.googlevideo.com/videoplayback?expire=1704545813&ei=tPmYZbKuPM6B1d8P2quz2AU&ip=123.28.103.129&id=o-AFiAVOAxXT3J2t_tEaJ3LaxtTK5VR2lrNQqjyO4EWivD&itag=140&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=IX&mm=31%2C29&mn=sn-8qj-8ube%2Csn-8qj-nboll&ms=au%2Crdu&mv=m&mvi=2&pl=23&initcwndbps=1316250&spc=UWF9f4M6S-nno7vkRM5hBxJCcOyG-6QnwJ3MitnMbw&vprv=1&svpuc=1&mime=audio%2Fmp4&ns=DGKq-X_Yn2EqOhgDise7cn0Q&gir=yes&clen=2552295&dur=157.663&lmt=1703825206794151&mt=1704523987&fvip=2&keepalive=yes&fexp=24007246&c=WEB&sefc=1&txp=6308224&n=CsrhvO44lAP7EA&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Cgir%2Cclen%2Cdur%2Clmt&sig=AJfQdSswRgIhALSf3QtNiXGROwOalWGx8hqafQ776ho8tsmwRv7f1tlcAiEA4ctNjRZ3LwAr2pw7a0Z2XpOy_F52TT1QHZKY_xz0Pb0%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AAO5W4owRgIhAOsivghKn4a8QntOLDkT3ve4-aOFzk8wA5sAfuRoy7EoAiEAkU9FkZ9UaRaqu7tXZ5fX5jxxLWC40-nCgadc6votx5U%3D",
			mimeType: 'audio/mp4; codecs="mp4a.40.2"',
			bitrate: 130390,
			qualityLabel: null,
			contentLength: "2552295",
			quality: "tiny",
			projectionType: "RECTANGULAR",
			hasVideo: false,
			hasAudio: true,
		},
		{
			url: "https://rr2---sn-8qj-8ube.googlevideo.com/videoplayback?expire=1704545813&ei=tPmYZbKuPM6B1d8P2quz2AU&ip=123.28.103.129&id=o-AFiAVOAxXT3J2t_tEaJ3LaxtTK5VR2lrNQqjyO4EWivD&itag=250&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=IX&mm=31%2C29&mn=sn-8qj-8ube%2Csn-8qj-nboll&ms=au%2Crdu&mv=m&mvi=2&pl=23&initcwndbps=1316250&spc=UWF9f4M6S-nno7vkRM5hBxJCcOyG-6QnwJ3MitnMbw&vprv=1&svpuc=1&mime=audio%2Fwebm&ns=DGKq-X_Yn2EqOhgDise7cn0Q&gir=yes&clen=1295067&dur=157.621&lmt=1703825221389959&mt=1704523987&fvip=2&keepalive=yes&fexp=24007246&c=WEB&sefc=1&txp=6308224&n=CsrhvO44lAP7EA&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Cgir%2Cclen%2Cdur%2Clmt&sig=AJfQdSswRgIhANLk887nArVnCuPuxW2s1n9AaZUU7Amz_H_bD1GzbjVvAiEA6Mc1qVegdJ1VzyFARQQwQSLk98q22BxGDvZjoQ9mVZ4%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AAO5W4owRgIhAOsivghKn4a8QntOLDkT3ve4-aOFzk8wA5sAfuRoy7EoAiEAkU9FkZ9UaRaqu7tXZ5fX5jxxLWC40-nCgadc6votx5U%3D",
			mimeType: 'audio/webm; codecs="opus"',
			bitrate: 72860,
			qualityLabel: null,
			contentLength: "1295067",
			quality: "tiny",
			projectionType: "RECTANGULAR",
			hasVideo: false,
			hasAudio: true,
		},
		{
			url: "https://rr2---sn-8qj-8ube.googlevideo.com/videoplayback?expire=1704545813&ei=tPmYZbKuPM6B1d8P2quz2AU&ip=123.28.103.129&id=o-AFiAVOAxXT3J2t_tEaJ3LaxtTK5VR2lrNQqjyO4EWivD&itag=249&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=IX&mm=31%2C29&mn=sn-8qj-8ube%2Csn-8qj-nboll&ms=au%2Crdu&mv=m&mvi=2&pl=23&initcwndbps=1316250&spc=UWF9f4M6S-nno7vkRM5hBxJCcOyG-6QnwJ3MitnMbw&vprv=1&svpuc=1&mime=audio%2Fwebm&ns=DGKq-X_Yn2EqOhgDise7cn0Q&gir=yes&clen=1009004&dur=157.621&lmt=1703825221062877&mt=1704523987&fvip=2&keepalive=yes&fexp=24007246&c=WEB&sefc=1&txp=6308224&n=CsrhvO44lAP7EA&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Cgir%2Cclen%2Cdur%2Clmt&sig=AJfQdSswRQIgSGQe4fUfWy8i6juJvdPlO4WrdDdFr0xsxQdDKdp1HMcCIQDXCPR7CpriAbIMxtwPKJDBNYeCVbZPRuJZIUQjA0Bwnw%3D%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AAO5W4owRgIhAOsivghKn4a8QntOLDkT3ve4-aOFzk8wA5sAfuRoy7EoAiEAkU9FkZ9UaRaqu7tXZ5fX5jxxLWC40-nCgadc6votx5U%3D",
			mimeType: 'audio/webm; codecs="opus"',
			bitrate: 54199,
			qualityLabel: null,
			contentLength: "1009004",
			quality: "tiny",
			projectionType: "RECTANGULAR",
			hasVideo: false,
			hasAudio: true,
		},
		{
			url: "https://rr2---sn-8qj-8ube.googlevideo.com/videoplayback?expire=1704545813&ei=tPmYZbKuPM6B1d8P2quz2AU&ip=123.28.103.129&id=o-AFiAVOAxXT3J2t_tEaJ3LaxtTK5VR2lrNQqjyO4EWivD&itag=22&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=IX&mm=31%2C29&mn=sn-8qj-8ube%2Csn-8qj-nboll&ms=au%2Crdu&mv=m&mvi=2&pl=23&initcwndbps=1316250&spc=UWF9f4M6S-nno7vkRM5hBxJCcOyG-6QnwJ3MitnMbw&vprv=1&svpuc=1&mime=video%2Fmp4&ns=WevwWKohbmW4N5heADndk4EQ&cnr=14&ratebypass=yes&dur=157.663&lmt=1703825223301746&mt=1704523987&fvip=2&fexp=24007246&c=WEB&sefc=1&txp=6308224&n=2gnrkc7OzVotrg&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AJfQdSswRAIgK8QxQzFni5lqXvzkwqw93fPTPG5qaFT3MfbVsVwx0lECIG4yzG0844ZLVLV9GrW5QpriASEVOFhNw5_MR-XQxbvF&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AAO5W4owRgIhAOsivghKn4a8QntOLDkT3ve4-aOFzk8wA5sAfuRoy7EoAiEAkU9FkZ9UaRaqu7tXZ5fX5jxxLWC40-nCgadc6votx5U%3D",
			mimeType: 'video/mp4; codecs="avc1.64001F, mp4a.40.2"',
			bitrate: 2077735,
			fps: 30,
			qualityLabel: "720p",
			width: 1280,
			height: 720,
			quality: "hd720",
			projectionType: "RECTANGULAR",
			hasVideo: true,
			hasAudio: true,
		},
	],
};

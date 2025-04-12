import { getIconByMode } from "../../helpers/urlHelper";
import * as chromeActions from '../../actions';

export const ModeRetrieve = ({ options, setOptions }) => {
	const doWork = (pageName) => {
		// Perform the work here
		console.log("Do work function called");
		chromeActions.retrieveMediaFromTabs(pageName).then((data) => {
			console.log("Data retrieved:", data);
			// Handle the retrieved data as needed
		});
	};

	return (
		<div style={{ display: 'flex', alignItems: 'center' }}>
			<button id="exchange_button" title="Change mode" style={{ marginRight: "10px", marginLeft: "10px" }}>
				<img src={getIconByMode("rule34")} alt="" onClick={() => { doWork("rule34") }} />
			</button>
			<button id="exchange_button" title="Change mode" style={{ marginRight: "10px" }}>
				<img src={getIconByMode("exhentai")} alt="" onClick={() => { doWork("exhentai") }} />
			</button>
		</div>
	);
};
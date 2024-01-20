import { TEXTS } from "../../constants";

export const FilterUrl = ({ changeFilterUrlMode, changeFilterUrl, options }) => {
    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            {/* <div style={{ marginLeft: '5px' }}>{'Filter by url: '}</div> */}
            <input
                type="text"
                placeholder="Filter by URL"
                title="Filter by parts of the URL or regular expressions."
                value={options.filter_url}
                style={{ flex: "1", margin: "5px" }}
                onChange={changeFilterUrl}
            />

            <select value={options.filter_url_mode} onChange={changeFilterUrlMode} style={{ margin: "5px" }} s>
                <option value="normal" title={TEXTS.normalTitle}>
                    Text
                </option>
                <option value="wildcard" title={TEXTS.wildcardTitle}>
                    Wildcard
                </option>
                <option value="regex" title={TEXTS.regexTitle}>
                    Regex
                </option>
            </select>
        </div>
    );
};

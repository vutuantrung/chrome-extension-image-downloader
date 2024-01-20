/*global chrome*/

import * as chromeActions from '../../actions';
import { icons } from '../../constants/index';

export const MediaUrlTextbox = (props) => {
    return (
        <input
            type="text"
            readOnly
            onClick={(e) => {
                e.currentTarget.select();
            }}
            {...props}
        />);
}

export const OpenMediaButton = ({ media, onClick, ...props }) => {
    return (
        <button
            type="button"
            title="Open in new tab"
            style={{ padding: '0px', display: 'flex', alignContent: 'center', justifyContent: 'center', width: '30px', height: '30px' }}
            onClick={(e) => {
                chrome.tabs.create({ url: media.src, active: false });
                if (onClick) { onClick(e); }
            }}
            {...props}
        >
            <img src={icons.expandIcon} style={{ background: 'transparent' }} alt='' />
        </button>);
};

export const DownloadMediaButton = ({
    media,
    options,
    onClick,
    ...props
}) => {
    return (
        <button
            type="button"
            title="Download"
            style={{ padding: '0px', display: 'flex', alignContent: 'center', justifyContent: 'center', width: '30px', height: '30px' }}
            onClick={(e) => {
                chromeActions.downloadMedias([media], options);
                if (onClick) { onClick(e); }
            }}
            {...props}
        >
            <img src={icons.downloadIcon} style={{ background: 'transparent' }} alt='' />
        </button>);
};
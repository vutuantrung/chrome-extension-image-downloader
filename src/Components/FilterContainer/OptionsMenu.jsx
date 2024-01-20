import { useMemo, useState } from "react";

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import Switch from "react-switch";

import Collapse from "@mui/material/Collapse";
import FolderIcon from "@mui/icons-material/Folder";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import ImageIcon from "@mui/icons-material/Image";
import FlakyIcon from "@mui/icons-material/Flaky";

export const OptionsMenu = ({ showMenu, options, setOptions }) => {
    const fontSizePrimary = { fontSize: 13 };
    const fontSizeSecondary = { fontSize: 10 };

    const [openImageDropdown, setOpenImageDropdown] = useState(false);
    const [openNamingDropdown, setOpenNamingDropdown] = useState(false);
    const [selectingDropdown, setSelectingDropdown] = useState(false);

    const containerStyle = useMemo(() => {
        return {
            fontSize: "15px",
            position: "absolute",
            top: 45,
            right: 15,
            maxWidth: 200,
            backgroundColor: "white",
            width: "100%",
            display: "inline-block",
            zIndex: 2,
            transition: "transform 0.2s",
            transformOrigin: "top center",
            transform: `scaleY(${showMenu ? "1" : "0"})`,
        };
    }, [showMenu]);

    const dropdownClick = (dropdownName) => {
        if (dropdownName === "naming") setOpenNamingDropdown(!openNamingDropdown);
        if (dropdownName === "image") setOpenImageDropdown(!openImageDropdown);
        if (dropdownName === "selecting") setSelectingDropdown(!openImageDropdown);
    };

    return (
        <List sx={containerStyle}>
            <ListItem>
                <ListItemText primary="Display filter" primaryTypographyProps={fontSizePrimary} />
                <Switch
                    checked={options.show_advanced_filters === "true"}
                    onChange={() => {
                        setOptions((options) => ({
                            ...options,
                            show_advanced_filters: options.show_advanced_filters === "true" ? "false" : "true",
                        }));
                    }}
                />
            </ListItem>

            <ListItemButton
                onClick={() => {
                    dropdownClick("naming");
                }}
            >
                <ListItemIcon>
                    <FolderIcon />
                </ListItemIcon>
                <ListItemText primary="Naming" primaryTypographyProps={fontSizePrimary} />
                {openNamingDropdown ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openNamingDropdown} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 4 }}>
                        <ListItemText primary="Fix folder name" primaryTypographyProps={fontSizeSecondary} />
                        <Switch
                            width={42}
                            height={21}
                            checked={options.fix_folder_name === "true"}
                            onChange={() => {
                                setOptions((options) => ({
                                    ...options,
                                    fix_folder_name: options.fix_folder_name === "true" ? "false" : "true",
                                }));
                            }}
                        />
                    </ListItemButton>
                    <ListItemButton sx={{ pl: 4 }}>
                        <ListItemText primary="Fix new file name" primaryTypographyProps={fontSizeSecondary} />
                        <Switch
                            width={42}
                            height={21}
                            checked={options.fix_new_file_name === "true"}
                            onChange={() => {
                                setOptions((options) => ({
                                    ...options,
                                    fix_new_file_name: options.fix_new_file_name === "true" ? "false" : "true",
                                }));
                            }}
                        />
                    </ListItemButton>
                </List>
            </Collapse>

            <ListItemButton
                onClick={() => {
                    dropdownClick("image");
                }}
            >
                <ListItemIcon>
                    <ImageIcon />
                </ListItemIcon>
                <ListItemText primary="Image Options" primaryTypographyProps={fontSizePrimary} />
                {openImageDropdown ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openImageDropdown} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 4 }}>
                        <ListItemText primary="Show image url" primaryTypographyProps={fontSizeSecondary} />
                        <Switch
                            width={42}
                            height={21}
                            checked={options.show_image_url === "true"}
                            onChange={() => {
                                setOptions((options) => ({
                                    ...options,
                                    show_image_url: options.show_image_url === "true" ? "false" : "true",
                                }));
                            }}
                        />
                    </ListItemButton>
                    <ListItemButton sx={{ pl: 4 }}>
                        <ListItemText primary="Show open button" primaryTypographyProps={fontSizeSecondary} />
                        <Switch
                            width={42}
                            height={21}
                            checked={options.show_open_image_button === "true"}
                            onChange={() => {
                                setOptions((options) => ({
                                    ...options,
                                    show_open_image_button:
                                        options.show_open_image_button === "true" ? "false" : "true",
                                }));
                            }}
                        />
                    </ListItemButton>
                    <ListItemButton sx={{ pl: 4 }}>
                        <ListItemText primary="Show download button" primaryTypographyProps={fontSizeSecondary} />
                        <Switch
                            width={42}
                            height={21}
                            checked={options.show_download_image_button === "true"}
                            onChange={() => {
                                setOptions((options) => ({
                                    ...options,
                                    show_download_image_button:
                                        options.show_download_image_button === "true" ? "false" : "true",
                                }));
                            }}
                        />
                    </ListItemButton>
                </List>
            </Collapse>

            <ListItemButton
                onClick={() => {
                    dropdownClick("selecting");
                }}
            >
                <ListItemIcon>
                    <FlakyIcon />
                </ListItemIcon>
                <ListItemText primary="Select Options" primaryTypographyProps={fontSizePrimary} />
                {selectingDropdown ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={selectingDropdown} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 4 }}>
                        <ListItemText primary="Auto select-all" primaryTypographyProps={fontSizeSecondary} />
                        <Switch
                            width={42}
                            height={21}
                            checked={options.auto_all_select === "true"}
                            onChange={() => {
                                setOptions((options) => ({
                                    ...options,
                                    auto_all_select: options.auto_all_select === "true" ? "false" : "true",
                                }));
                            }}
                        />
                    </ListItemButton>
                </List>
            </Collapse>
        </List>
    );
};

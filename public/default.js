// TODO: Convert to a module and split into 2 - the default values and setting `localStorage` based on the default values initially


const defaults = {
    // Filters
    folder_name: '',
    new_file_name: '',
    filter_mode: 'size',
    filter_url: '',
    filter_url_mode: 'normal',
    filter_min_width: 0,
    filter_min_width_enabled: false,
    filter_max_width: 3000,
    filter_max_width_enabled: false,
    filter_min_height: 0,
    filter_min_height_enabled: false,
    filter_max_height: 3000,
    filter_max_height_enabled: false,
    only_images_from_links: false,
    with_images: true,
    with_videos: true,

    // Options
    // Mode
    mode: 'page',
    // Folder
    fix_folder_name: false,
    fix_new_file_name: true,
    fix_start_index: false,

    // General
    show_advanced_filters: true,
    show_download_confirmation: true,
    show_file_renaming: true,

    // Images
    show_image_url: false,
    show_open_image_button: true,
    show_download_image_button: true,
    columns: 2,
    start_index: 0,
    image_min_width: 50,
    image_max_width: 200,
    image_min_height: 200,

    // Selecting images
    auto_all_select: false
};

Object.keys(defaults).forEach((option) => {
    if (localStorage[option] === undefined) {
        localStorage[option] = defaults[option];
    }
    localStorage[`${option}_default`] = defaults[option];
});

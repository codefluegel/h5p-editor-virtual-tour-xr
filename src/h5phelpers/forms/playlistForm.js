import {getPlaylistField, isChildrenValid} from "../editorForms";

/**
 * Creates playlist form and appends it to wrapper
 *
 * @param {Object} field
 * @param {Object} params
 * @param {HTMLElement} wrapper
 * @param {Object} parent
 */
export const createPlaylistForm = (field, params, wrapper, parent) => {
  const playlistField = getPlaylistField(field);
  const hiddenPlaylistFields = [
    'playlistId',
  ];

  const playlistFields = playlistField.field.fields.filter(playlistField => {
    return !hiddenPlaylistFields.includes(playlistField.name);
  });

  H5PEditor.processSemanticsChunk(
    playlistFields,
    params,
    wrapper,
    parent,
  );
};

/**
 * Checks if playlist form is valid and marks invalid fields
 *
 * @param children
 * @returns {boolean} True if valid
 */
 export const validatePlaylistForm = (children) => {
  H5PEditor.Html.removeWysiwyg();
  return isChildrenValid(children);
};

/**
 * Get initial parameters for an empty playlist
 *
 * @param {Playlist[]} playlists
 * @returns {Playlist}
 */
export const getDefaultPlaylistParams = (playlists) => {
  return {
    playlistId: getUniquePlaylistId(playlists),
  };
};

/**
 * Grabs a unique ID that is higher than the highest ID in our playlists collection
 *
 * @param {Playlist[]} playlists
 * @returns {number}
 */
const getUniquePlaylistId = (playlists) => {
  if (!(playlists && playlists.length)) {
    return 0;
  }

  const playlistIds = playlists.map(playlist => playlist.playlistId);
  const maxSceneId = Math.max(...playlistIds);
  return maxSceneId + 1;
};

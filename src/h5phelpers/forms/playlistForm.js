// @ts-check

import {getPlaylistField} from "../editorForms";

/**
 * Creates scene form and appends it to wrapper
 *
 * @param {Object} field
 * @param {Object} params
 * @param {HTMLElement} wrapper
 * @param {Object} parent
 */
export const createPlaylistForm = (field, params, wrapper, parent) => {
  const playlistField = getPlaylistField(field);
  const hiddenPlaylistFields = [
    'id',
  ];

  const playlistFields = playlistField.field.fields.filter(sceneField => {
    return !hiddenPlaylistFields.includes(sceneField.name);
  });

  H5PEditor.processSemanticsChunk(
    playlistFields,
    params,
    wrapper,
    parent,
  );
};

/**
 * Get initial parameters for an empty scene
 *
 * @param {Playlist[]} playlists
 * @returns {Playlist}
 */
export const getDefaultPlaylistParams = (playlists) => {
  return {
    id: getUniquePlaylistId(playlists),
    tracks: [],
    title: '',
  };
};

/**
 * Grabs a unique ID that is higher than the highest ID in our scenes collection
 *
 * @param {Playlist[]} playlists
 * @returns {number}
 */
const getUniquePlaylistId = (playlists) => {
  if (!playlists.length) {
    return 0;
  }

  const playlistIds = playlists.map(playlist => playlist.id);
  const maxSceneId = Math.max(...playlistIds);
  return maxSceneId + 1;
};

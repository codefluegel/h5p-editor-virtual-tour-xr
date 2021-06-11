// @ts-check

import { PlaylistEditingType } from '../playlist-widget/widget-components/PlaylistEditor';

/**
 * Get playlist from id
 *
 * @param {Playlist[]} playlists
 * @param {number} playlistId
 * @returns {Playlist}
 */
export const getPlaylistFromId = (playlists, playlistId) => {
  return playlists.find(playlist => {
    return playlist.playlistId === playlistId;
  });
};

/**
 * Updates a playlist within parameters
 *
 * @param {Playlist[]} playlists
 * @param {Playlist} params
 * @param {number} editingPlaylist
 * @returns {Playlist[]}
 */
export const updatePlaylist = (playlists, params, editingPlaylist = -1) => {
  if (editingPlaylist === PlaylistEditingType.NEW_PLAYLIST) {
    playlists.push(params);
    return playlists;
  }

  return playlists.map(playlist => {
    if (playlist.playlistId === editingPlaylist) {
      playlist = params;
    }
    return playlist;
  });
};

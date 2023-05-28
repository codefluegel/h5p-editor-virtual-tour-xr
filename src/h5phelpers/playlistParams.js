import { PlaylistEditingType } from '../playlist-widget/widget-components/PlaylistEditor';

/**
 * Get playlist from id
 *
 * @param {Playlist[]} playlists
 * @param {string} playlistId
 * @returns {Playlist}
 */
export const getPlaylistFromId = (playlists, playlistId) => {
  return playlists.find((playlist) => {
    return playlist.playlistId === playlistId;
  });
};

/**
 * Updates a playlist within parameters
 *
 * @param {Playlist[]} playlists
 * @param {Playlist} params
 * @param {string} editingPlaylist
 * @returns {Playlist[]}
 */
export const updatePlaylist = (playlists, params, editingPlaylist = '') => {
  if (editingPlaylist === PlaylistEditingType.NEW_PLAYLIST) {
    playlists.push(params);
    return playlists;
  }

  return playlists.map((playlist) => {
    if (playlist.playlistId === editingPlaylist) {
      playlist = params;
    }
    return playlist;
  });
};

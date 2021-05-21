// @ts-check
/// <reference path="../../index.d.ts" />

import { PlaylistEditingType } from '../components/EditingDialog/PlaylistEditor';

/**
 * Get playlist from id
 *
 * @param {Playlist[]} playlists
 * @param {number} playlistId
 * @returns {Playlist}
 */
export const getPlaylistFromId = (playlists, playlistId) => {
  return playlists.find(playlist => {
    return playlist.id === playlistId;
  });
};

/**
 * Updates a playlist within parameters
 *
 * @param {Playlist[]} playlists
 * @param {Playlist} newPlaylist
 * @param {number} playlistId
 * @returns {Playlist[]}
 */
export const updatePlaylist = (playlists, newPlaylist, playlistId = -1) => {
  if (playlistId === PlaylistEditingType.NEW_PLAYLIST) {
    playlists.push(newPlaylist);
    return playlists;
  }

  return playlists.map(playlist => {
    if (playlist.id === playlistId) {
      playlist = newPlaylist;
    }
    return playlist;
  });
};

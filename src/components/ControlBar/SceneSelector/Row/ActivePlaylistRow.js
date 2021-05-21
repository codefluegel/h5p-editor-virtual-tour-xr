// @ts-check
/// <reference path="../../../../../index.d.ts" />


import React from 'react';
import './ActivePlaylistRow.scss';
import PropTypes from 'prop-types';

/**
 * 
 * @param {Object} props
 * @param {string} props.currentPlaylistLabel
 * @param {Playlist} props.playlist
 * @param {string} props.noPlaylistsTitle
 * @returns {JSX.Element}
 */
const ActivePlaylistRow = (props) => {
  if (!props.playlist) {
    return (
      <div>{props.noPlaylistsTitle}</div>
    );
  }

  return (
    <div className="active-playlist">
      <div className="h5p-playlist-denotation">{props.currentPlaylistLabel}:</div>
      <div className="h5p-playlist-name">{props.playlist.title}</div>
    </div>
  );
};

ActivePlaylistRow.propTypes = {
  playlist: PropTypes.object.isRequired,
  noPlaylistsTitle: PropTypes.string.isRequired,
  currentPlaylistLabel: PropTypes.string.isRequired
};

export default ActivePlaylistRow;
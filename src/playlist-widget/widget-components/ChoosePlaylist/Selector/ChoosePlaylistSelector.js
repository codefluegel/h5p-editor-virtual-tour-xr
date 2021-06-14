import React from 'react';
import PropTypes from 'prop-types';
import PlaylistList from "./List/PlaylistList";
import './ChoosePlaylistSelector.scss';

const ChoosePlaylistSelector = (props) => (
  <div className='choose-playlist-selector'>
    <div className='error-message'>{props.selectAPlaylistErrorLabel}</div>
    <PlaylistList
      playlists={props.playlists}
      markedPlaylist={props.markedPlaylist}
      onPlaylistClick={props.setNextPlaylistId.bind(this)}
      isShowingCheck={true}
    />
  </div>
);

ChoosePlaylistSelector.propTypes = {
  playlists: PropTypes.arrayOf(PropTypes.object).isRequired,
  markedPlaylist: PropTypes.string,
  setNextPlaylistId: PropTypes.func.isRequired,
  selectAPlaylistErrorLabel: PropTypes.string
};

export default ChoosePlaylistSelector;
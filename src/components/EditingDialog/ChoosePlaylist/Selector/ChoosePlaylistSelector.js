import React from 'react';
import PropTypes from 'prop-types';
import PlaylistList from "../../../ControlBar/PlaylistSelector/PlaylistList";
import './ChoosePlaylistSelector.scss';

const ChoosePlaylistSelector = (props) => (
  <div className='choose-playlist-selector'>
    <div className='choose-playlist-selector-title'>
        {props.pickAnExistingPlaylistLabel}:
    </div>
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
  markedPlaylist: PropTypes.number,
  setNextPlaylistId: PropTypes.func.isRequired,
  pickAnExistingPlaylistLabel: PropTypes.string.isRequired,
  selectAPlaylistErrorLabel: PropTypes.string.isRequired
};

export default ChoosePlaylistSelector;
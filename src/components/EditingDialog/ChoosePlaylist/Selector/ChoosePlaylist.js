import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {H5PContext} from "../../../../context/H5PContext";
import './ChoosePlaylist.scss';
import ChoosePlaylistSelector from "./ChoosePlaylistSelector";

export default class ChoosePlaylist extends Component {

  render() {
    const playlistClasses = ['choose-playlist'];
    if (this.props.hasInputError) {
      playlistClasses.push('has-error');
    }

    const playlists = this.props.params ? this.props.params.playlists : this.props.playlists;

    return (
      <div className={playlistClasses.join(' ')} >
        {
          playlists && playlists.length > 0 &&
          <div className='choose-playlist-selector-wrapper'>
            <ChoosePlaylistSelector
              playlists={playlists}
              markedPlaylist={this.props.markedPlaylist}
              setNextPlaylistId={this.props.setNextPlaylistId.bind(this)}
              selectAPlaylistErrorLabel={this.context.t('selectAPlaylistError')}
            />
          </div>
        }
        {
          !playlists || playlists.length === 0 &&
          <div className='no-playlists'>{this.context.t('noPlaylistsAdded')}</div>
        }
      </div>
    );
  }
}

ChoosePlaylist.contextType = H5PContext;

ChoosePlaylist.propTypes = {
  markedPlaylist: PropTypes.number,
  hasInputError: PropTypes.bool,
  setNextPlaylistId: PropTypes.func,
  newPlaylist: PropTypes.func.isRequired,
};
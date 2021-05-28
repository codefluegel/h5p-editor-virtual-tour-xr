import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {H5PContext} from "../../../../context/H5PContext";
import './ChoosePlaylist.scss';
import ChoosePlaylistSelector from "./ChoosePlaylistSelector";

export default class ChoosePlaylist extends Component {

  render() {
    // Filter out current scene
    const playlists = this.context.params.playlists ? this.context.params.playlists.filter(playlist => {
      return playlist.playlistId !== this.props.currentPlaylist;
    }): null;

    const playlistClasses = ['choose-playlist'];
    if (this.props.hasInputError) {
      playlistClasses.push('has-error');
    }

    const allowCreateNewPlaylist = false;

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
            {
                allowCreateNewPlaylist &&
                <div className='selector-separator'>{this.context.t('or')}</div>
            }
          </div>
        }
        {
          !playlists &&
          <div className='no-playlists'>{this.context.t('noPlaylistsAdded')}</div>
        }
        {
            allowCreateNewPlaylist &&
            <div className='create-new-playlist-wrapper'>
            <div className='new-playlist-title'>{this.context.t('createAPlaylist')}:</div>
            {
                this.props.hasInputError && !playlists && !playlists.length &&
                <div className='error-message'>{this.context.t('createPlaylistError')}</div>
            }
            <button
                className='h5p-new-playlist-button'
                onClick={this.props.newPlaylist.bind(this)}
            >+ {this.context.t('newPlaylist')}</button>
            </div>
        }
      </div>
    );
  }
}

ChoosePlaylist.contextType = H5PContext;

ChoosePlaylist.propTypes = {
  currentPlaylist: PropTypes.number,
  markedPlaylist: PropTypes.number,
  hasInputError: PropTypes.bool,
  setNextPlaylistId: PropTypes.func,
  newPlaylist: PropTypes.func.isRequired,
};
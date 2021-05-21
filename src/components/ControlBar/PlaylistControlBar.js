// @ts-check

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './ControlBar.scss';
import {H5PContext} from "../../context/H5PContext";
import { PlaylistEditingType } from '../EditingDialog/PlaylistEditor';
import PlaylistSelector from './SceneSelector/PlaylistSelector';

export default class PlaylistControlBar extends Component {
  /**
   * @param {Object} props 
   * @param {number} props.currentPlaylist
   * @param {boolean} props.isPlaylistSelectorExpanded
   * @param {() => void} props.toggleExpandPlaylistSelector
   * @param {(playlist: Playlist) => void} props.changePlaylist
   * @param {(playlistId: number) => void} props.newPlaylist
   * @param {(playlistId: number) => void} props.editPlaylist
   * @param {(playlistId: number) => void} props.deletePlaylist
   */
  constructor(props) {
    super(props);

    // Unnecessary, however helps type checking
    this.props = props;
  }

  render() {
    return (
      <div className='h5p-control-bar'>
        <PlaylistSelector
          currentPlaylistId={this.props.currentPlaylist}
          isExpanded={this.props.isPlaylistSelectorExpanded}
          toggleExpand={this.props.toggleExpandPlaylistSelector.bind(this)}
        >
          <PlaylistList
            playlist={this.context.params.playlists}
            markedPlaylist={this.props.currentPlaylist}
            onPlaylistClick={this.props.changePlaylist}
          >
            {(/** @type {number} */ playlistId) => (
              <PlaylistSelectorSubmenu
                onEdit={this.props.editPlaylist.bind(this, playlistId)}
                onDelete={this.props.deletePlaylist.bind(this, playlistId)}
                editLabel={this.context.t('edit')}
                deleteLabel={this.context.t('delete')}
              />
            )}
          </PlaylistList>
        </PlaylistSelector>
        <div className='buttons-wrapper'>
          <button
            className='h5p-new-playlist-button'
            onClick={this.props.newPlaylist.bind(this, PlaylistEditingType.NEW_PLAYLIST)}
          >+ {this.context.t('newPlaylist')}</button>
        </div>
      </div>
    );
  }
}

PlaylistControlBar.contextType = H5PContext;

PlaylistControlBar.propTypes = {
  currentPlaylist: PropTypes.number,
  isPlaylistSelectorExpanded: PropTypes.bool.isRequired,
  toggleExpandPlaylistSelector: PropTypes.func.isRequired,
  newPlaylist: PropTypes.func.isRequired,
  editPlaylist: PropTypes.func.isRequired,
  deletePlaylist: PropTypes.func.isRequired,
};

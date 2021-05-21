// @ts-check

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './ControlBar.scss';
import {H5PContext} from "../../context/H5PContext";
import { PlaylistEditingType } from '../EditingDialog/PlaylistEditor';
import PlaylistSelector from './SceneSelector/PlaylistSelector';

export default class PlaylistControlBar extends Component {
  render() {
    return (
      <div className='h5p-control-bar'>
        <PlaylistSelector
          currentPlaylist={this.props.currentPlaylist}
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

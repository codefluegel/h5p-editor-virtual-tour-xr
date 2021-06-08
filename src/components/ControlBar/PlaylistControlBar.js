// @ts-check

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './PlaylistControlBar.scss';
import {H5PContext} from "../../context/H5PContext";
import { PlaylistEditingType } from '../EditingDialog/PlaylistEditor';
import ChoosePlaylistWrapper from "../EditingDialog/ChoosePlaylist/ChoosePlaylistWrapper";

export default class PlaylistControlBar extends Component {
  /**
   * @param {Object} props 
   * @param {(playlistId: number) => void} props.newPlaylist
   * @param {(playlistId: number) => void} props.editPlaylist
   */
  constructor(props) {
    super(props);

    // Unnecessary, however helps type checking
    this.props = props;

    this.state = {
      isExpanded: false
    };
  }

  toggleExpand() {
    this.setState({
      isExpanded: !this.state.isExpanded
    });
  }

  render() {
    const commonClasses = ['common'];
    if (!this.state.isExpanded) {
      commonClasses.push('collapsed');
    }

    return (
      <div className={commonClasses.join(' ')}>
        <div 
          className="h5peditor-label" 
          onClick={this.toggleExpand.bind(this)}
        >
          <span className="icon">{this.context.t('playlists')}</span>
        </div>
        <div className="fields">
          <div className='h5p-control-bar-playlist'>
            <div className='h5peditor-label'>{this.context.t('addedPlaylists')}</div>
            <div className='h5peditor-field-description'>{this.context.t('addedPlaylistsDescription')}</div>
            {
              <ChoosePlaylistWrapper
                selectedPlaylist={this.props.editPlaylist.bind(this)}
                playlists={this.context.params.playlists}
                params={this.context.params}
                noPlaylistsTranslation={this.context.t('noPlaylistsAdded')}
                isMainPage
              />
            }
            <div className='buttons-wrapper'>
              <button
                className='h5p-new-playlist-button'
                onClick={this.props.newPlaylist.bind(this, PlaylistEditingType.NEW_PLAYLIST)}
              >+ {this.context.t('newPlaylist')}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PlaylistControlBar.contextType = H5PContext;

PlaylistControlBar.propTypes = {
  newPlaylist: PropTypes.func.isRequired,
  editPlaylist: PropTypes.func.isRequired,
};

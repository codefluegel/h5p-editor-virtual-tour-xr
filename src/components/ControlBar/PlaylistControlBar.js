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
   * @param {(playlistId: number) => void} props.deletePlaylist
   */
  constructor(props) {
    super(props);

    // Unnecessary, however helps type checking
    this.props = props;
  }

  render() {
    return (
      <div className='h5p-control-bar-playlist'>
        {
          <ChoosePlaylistWrapper
            selectedPlaylist={this.props.editPlaylist.bind(this)}
            params={this.context.params}
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
    );
  }
}

PlaylistControlBar.contextType = H5PContext;

PlaylistControlBar.propTypes = {
  newPlaylist: PropTypes.func.isRequired,
  editPlaylist: PropTypes.func.isRequired,
};

// @ts-check

import React from 'react';
import PropTypes from 'prop-types';
import {H5PContext} from "../../../context/H5PContext";
import './PlaylistSelector.scss';
import ActivePlaylistRow from "./Row/ActivePlaylistRow";
import ExpandedPlaylistSelector from "./ExpandedPlaylistSelector";

export default class PlaylistSelector extends React.Component {
  /**
   * 
   * @param {Object} props
   * @param {number} props.currentPlaylist
   * @param {() => void} props.toggleExpand
   * @param {boolean} props.isExpanded
   * @param {JSX.Element} props.children
   */
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: false,
    };

    // Unnecessary, however helps type checking
    this.props = props;
  }

  render() {
    /** @type {Playlist[]} */
    const playlists = this.context.params.playlists;
    const activePlaylist = this.props.currentPlaylist ? playlists.find(playlist => {
      return playlist.playlistiId === this.props.currentPlaylist;
    }) : null;

    const playlistSelectorClasses = ['h5p-playlist-selector'];
    if (!activePlaylist) {
      playlistSelectorClasses.push('disabled');
    }

    return (
      <div className='playlist-selector-wrapper'>
        <div
          id='playlist-selector'
          className={playlistSelectorClasses.join(' ')}
          onClick={this.props.toggleExpand.bind(this, undefined)}
        >
          <div className='h5p-select-content'>
            <ActivePlaylistRow
              noPlaylistsTitle={this.context.t('noPlaylistsTitle')}
              currentPlaylistLabel={this.context.t('currentPlaylist')}
              playlist={activePlaylist}
            />
          </div>
          <div className='h5p-select-handle'/>
        </div>
        {
          this.props.isExpanded &&
          <ExpandedPlaylistSelector choosePlaylistLabel={this.context.t('choosePlaylist')}>
            {this.props.children}
          </ExpandedPlaylistSelector>
        }
      </div>
    );
  }
}

PlaylistSelector.contextType = H5PContext;

PlaylistSelector.propTypes = {
  currentPlaylist: PropTypes.number,
  isExpanded: PropTypes.bool,
  toggleExpand: PropTypes.func.isRequired,
  children: PropTypes.node,
};

import React from 'react';
import PropTypes from 'prop-types';
import NoPlaylist from "./NoPlaylist";
import './Playlist.scss';
import {H5PContext} from "../../context/H5PContext";
import {initializeThreeSixtyPreview} from "../../h5phelpers/h5pComponents";

export const PlaylistTypes = {
  PLAYLIST: 'playlist',
  NO_PLAYLIST: null,
};

export default class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.previewRef = React.createRef();

    this.state = {
      isInitialized: false,
    };
  }

  componentDidMount() {
    this.initializePreview();
  }

  componentDidUpdate() {
    if (this.props.isPlaylistUpdated) {
      return;
    }

    if (!this.state.isInitialized) {
      this.initializePreview();
      return;
    }

    this.redrawPlaylist();
  }

  setAsActivePlaylist() {
    this.props.setPlaylistPreview(this.preview);
    this.props.platlistIsInitialized();
  }

  redrawPlaylist() {
    this.preview.reDraw(this.props.currentPlaylist);
    this.setAsActivePlaylist();
  }

  initializePreview() {
    if (this.context.params.playlists.length <= 0) {
      return;
    }

    this.preview = initializeThreeSixtyPreview(
      this.previewRef.current,
      this.context.parent.params,
      {
        edit: this.context.t('edit'),
        delete: this.context.t('delete'),
        goToPlaylist: this.context.t('goToPlaylist'),
      }
    );

    H5P.$window.on('resize', () => {
      this.preview.trigger('resize');
    });


    this.setAsActivePlaylist();

    this.setState({
      isInitialized: true,
    });
  }

  render() {
    const playlistClasses = ['playlist-wrapper'];
    const hasNoPlaylists = this.context.params.playlists.length <= 0;
    if (hasNoPlaylists) {
      playlistClasses.push('no-playlists');
    }

    return (
      <div className={playlistClasses.join(' ')}>
        {
          hasNoPlaylists &&
          <NoPlaylist/>
        }
        <div className='playlist-container' ref={this.previewRef} aria-hidden={ this.props.hasOverlay } />
        {
          this.props.hasOverlay &&
          <button
            className='playlist-overlay'
            aria-label={ this.context.t('closePlaylistSelector') }
            aria-controls={ 'playlist-selector' }
            onClick={ this.props.onCloseOverlay }
          />
        }
      </div>
    );
  }
}

Playlist.contextType = H5PContext;

Playlist.propTypes = {
  isPlaylistUpdated: PropTypes.bool,
  hasOverlay: PropTypes.bool,
  currentPlaylist: PropTypes.number,
  playlistIsInitialized: PropTypes.func.isRequired,
  setPlaylistPreview: PropTypes.func.isRequired,
};

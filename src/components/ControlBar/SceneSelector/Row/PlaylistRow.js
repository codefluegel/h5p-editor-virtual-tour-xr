import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {PlaylistTypes} from "../../../Playlist/Playlist";
import './PlaylistRow.scss';
import {getImageSource} from "../../../../context/H5PContext";
import {H5PContext} from "../../../../context/H5PContext";

export default class PlaylistRow extends Component {
  constructor(props) {
    super(props);

    this.imageRef = React.createRef();

    this.state = {
      isVerticalImage: false,
    };
  }

  onImageLoad() {
    const image = this.imageRef.current;
    const ratio = 4 / 3;

    this.setState({
      isVerticalImage: image.naturalWidth / image.naturalHeight < ratio,
    });
  }

  onPlaylistClick() {
    if (this.props.onPlaylistClick) {
      this.props.onPlaylistClick(this.props.playlist.playlistId);
    }
  }

  onTitleClick() {
    if (this.props.onTitleClick) {
      this.props.onTitleClick(this.props.playlist.playlistId);
    }
  }

  render() {

    const rowClasses = ['h5p-playlist-row'];
    if (this.props.playlist.playlistType === PlaylistTypes.THREE_SIXTY_PLAYLIST) {
      rowClasses.push('three-sixty');
    }

    if (this.props.isMarkedPlaylist) {
      rowClasses.push('marked-playlist');

      if (this.props.isShowingCheck) {
        rowClasses.push('checked');
      }
    }

    if (this.props.isAfterActivePlaylist) {
      rowClasses.push('no-top-border');
    }

    const imageClasses = ['playlist-thumbnail'];
    if (this.state.isVerticalImage) {
      imageClasses.push('vertical');
    }

    return (
      <div
        className={rowClasses.join(' ')}
        onClick={this.onPlaylistClick.bind(this)}
      >
        <div className='thumbnail-wrapper'>
          <img
            className={imageClasses.join(' ')}
            src={getImageSource(this.props.playlist.playlistsrc.path)}
            alt={this.props.playlist.playlistsrc.alt}
            onLoad={this.onImageLoad.bind(this)}
            ref={this.imageRef}
          />
        </div>
        <div className='playlist-wrapper'>
          <div
            className='h5p-playlist-name'
            onClick={this.onTitleClick.bind(this)}
            dangerouslySetInnerHTML={ {__html: this.props.playlist.playlistname} }
          ></div>
        </div>
        {this.props.children}
      </div>
    );
  }
}

PlaylistRow.contextType = H5PContext;

PlaylistRow.propTypes = {
  playlist: PropTypes.shape({
    playlistType: PropTypes.oneOf(Object.values(PlaylistTypes)).isRequired,
    playlistname: PropTypes.string.isRequired,
    playlistsrc: PropTypes.shape({
      path: PropTypes.string.isRequired,
      alt: PropTypes.string
    }).isRequired
  }),
  isMarkedPlaylist: PropTypes.bool,
  isShowingCheck: PropTypes.bool,
  isAfterActivePlaylist: PropTypes.bool,
  onPlaylistClick: PropTypes.func,
  onTitleClick: PropTypes.func,
  children: PropTypes.node,
};

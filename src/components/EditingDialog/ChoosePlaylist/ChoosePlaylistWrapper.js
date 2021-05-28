import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ChoosePlaylist from "./Selector/ChoosePlaylist";
import {createPlaylistForm} from "../../../h5phelpers/forms/playlistForm";
import {H5PContext} from "../../../context/H5PContext";

export default class ChoosePlaylistWrapper extends Component {
  constructor(props) {
    super(props);

    this.newPlaylist = React.createRef();

    this.state = {
      markedPlaylist: this.props.markedPlaylist,
      isCreatingNewPlaylist: false,
    };
  }

  createNewPlaylist() {
    // Process semantics for new playlist
    const playlists = this.context.params.playlists;
    const params = getPlaylistParams();

    // Preserve parent's children
    this.parentChildren = this.context.parent.children;

    createPlaylistForm(
      this.context.field,
      params,
      this.newPlaylist.current,
      this.context.parent
    );

    // Capture own children and restore parent
    this.playlistChildren = this.context.parent.children;
    this.context.parent.children = this.parentChildren;


    this.setNextPlaylistId(params.playlistId);

    this.props.setPlaylist({
      children: this.playlistChildren,
      params: params,
    });

    this.setState({
      isCreatingNewPlaylist: true,
    });
  }

  setNextPlaylistId(playlistId) {
    this.props.selectedPlaylist(playlistId);

    var newMarkedPlaylist = playlistId === this.state.markedPlaylist ? null : playlistId;

    if (this.props.isMainPage) {
        newMarkedPlaylist = null;
    }

    this.setState({
      markedPlaylist: newMarkedPlaylist,
    });
  }

  render() {
    const classes = ['choose-playlist-wrapper'];
    if (this.state.isCreatingNewPlaylist) {
      classes.push('new-playlist');
    }

    const playlistLabel = this.props.isMainPage ? this.context.t('addedPlaylists') : this.context.t('playlist');
    const playlistDescription = this.props.isMainPage ? this.context.t('addedPlaylistsDescription') : this.context.t('playlistDescription');

    return (
      <div className={classes.join(' ')}>
        <label className='h5peditor-label'>
          {playlistLabel}
        </label>
        <div className='h5peditor-field-description'>
          {playlistDescription}
        </div>
        {
          !this.state.isCreatingNewPlaylist &&
          <ChoosePlaylist
            params={this.props.params}
            markedPlaylist={this.state.markedPlaylist}
            currentPlaylist={this.props.currentPlaylist}
            hasInputError={this.props.hasInputError}
            newPlaylist={this.createNewPlaylist.bind(this)}
            setNextPlaylistId={this.setNextPlaylistId.bind(this)}
          />
        }
        <div ref={this.newPlaylist} />
      </div>
    );
  }
}

ChoosePlaylistWrapper.contextType = H5PContext;

ChoosePlaylistWrapper.propTypes = {
  params: PropTypes.object,
  nextPlaylistIdWidget: PropTypes.object,
  currentPlaylist: PropTypes.number,
  hasInputError: PropTypes.bool,
  selectedPlaylist: PropTypes.func,
  setPlaylist: PropTypes.func,
};

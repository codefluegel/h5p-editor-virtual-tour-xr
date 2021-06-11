import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ChoosePlaylist from "./Selector/ChoosePlaylist";
import {H5PContext} from "../../../context/H5PContext";

export default class ChoosePlaylistWrapper extends Component {
  constructor(props) {
    super(props);

    this.newPlaylist = React.createRef();

    this.state = {
      markedPlaylist: !this.props.canEdit ? this.props.markedPlaylist : null
    };
  }

  setNextPlaylistId(playlistId) {
    this.props.selectedPlaylist(playlistId);
    
    var newMarkedPlaylist = playlistId === this.state.markedPlaylist ? null : playlistId;

    if (this.props.canEdit) {
      this.props.editPlaylist(playlistId);
      newMarkedPlaylist = null;
    }

    this.setState({
      markedPlaylist: newMarkedPlaylist,
    });
  }

  render() {
    const classes = ['choose-playlist-wrapper'];

    return (
      <div className={classes.join(' ')}>
        {
          <ChoosePlaylist
            params={this.props.params}
            playlists={this.props.playlists}
            markedPlaylist={this.state.markedPlaylist}
            hasInputError={this.props.hasInputError}
            setNextPlaylistId={this.setNextPlaylistId.bind(this)}
            noPlaylistsTranslation={this.props.noPlaylistsTranslation}
            translate={this.props.translate}
          />
        }
      </div>
    );
  }
}

ChoosePlaylistWrapper.contextType = H5PContext;

ChoosePlaylistWrapper.propTypes = {
  params: PropTypes.object,
  nextPlaylistIdWidget: PropTypes.object,
  hasInputError: PropTypes.bool,
  selectedPlaylist: PropTypes.func,
};

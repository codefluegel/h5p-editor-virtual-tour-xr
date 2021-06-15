// @ts-check

import React from 'react';
import PropTypes from 'prop-types';
import EditingDialog from "../../components/EditingDialog/EditingDialog";
import {H5PContext} from "../../context/H5PContext";
import './PlaylistEditor.scss';
import {getPlaylistFromId} from "../../h5phelpers/playlistParams";
import {
  createPlaylistForm,
  getDefaultPlaylistParams,
  validatePlaylistForm
} from "../../h5phelpers/forms/playlistForm";

export const PlaylistEditingType = {
  NOT_EDITING: null,
  NEW_PLAYLIST: "",
}

export default class PlaylistEditor extends React.Component {
  constructor(props) {
    super(props);

    this.semanticsRef = React.createRef();

    this.state = {
      library: null,
      hasInputError: false,
    }
  }

  getPlaylistParams() {
    const playlists = this.props.playlists;

    // New playlist
    if (this.props.editingPlaylist === PlaylistEditingType.NEW_PLAYLIST) {
      return getDefaultPlaylistParams();
    }

    return getPlaylistFromId(playlists, this.props.editingPlaylist);
  }

  componentDidMount() {
    this.params = this.getPlaylistParams();

    var contextParent = this.props.context.parent;
    
    // Preserve parent's children
    this.parentChildren = contextParent && contextParent.children;

    createPlaylistForm(
      this.props.context.field,
      this.params,
      this.semanticsRef.current,
      contextParent
    );

    // Capture own children and restore parent
    this.children = this.props.context.parent.children;
    this.props.context.parent.children = this.parentChildren;
  }

  handleDone() {
    const isValid = validatePlaylistForm(this.children);
    if (!isValid) {
      return;
    }
    if (!this.params.audioTracks) {
      return;
    }
    this.props.doneAction(this.params);
  }

  confirmDone() {
    this.props.doneAction(this.params);
  }

  removeInputErrors() {
    this.setState({
      hasInputError: false,
    });
  }

  render() {
    const semanticsClasses = ['semantics-wrapper'];
    semanticsClasses.push('choose-playlist-editor');

    return (
      <EditingDialog
        title={this.props.translate('playlist')}
        titleClasses={['playlist']}
        removeAction={this.props.removeAction}
        doneAction={this.handleDone.bind(this)}
        doneLabel={this.props.translate('done')}
        removeLabel={this.props.translate('remove')}
      >
        <div className={semanticsClasses.join(' ')} ref={this.semanticsRef}/>
      </EditingDialog>
    );
  }
}

PlaylistEditor.contextType = H5PContext;

PlaylistEditor.propTypes = {
  editingPlaylist: PropTypes.string.isRequired,
  doneAction: PropTypes.func.isRequired,
  removeAction: PropTypes.func.isRequired,
};

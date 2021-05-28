// @ts-check

import React from 'react';
import PropTypes from 'prop-types';
import EditingDialog from "./EditingDialog";
import {H5PContext} from "../../context/H5PContext";
import './PlaylistEditor.scss';
import {getPlaylistFromId} from "../../h5phelpers/playlistParams";
import {
  createPlaylistForm,
  getDefaultPlaylistParams,
  validatePlaylistForm
} from "../../h5phelpers/forms/playlistForm";
import ChoosePlaylistWrapper from "./ChoosePlaylist/ChoosePlaylistWrapper";

export const PlaylistEditingType = {
  NOT_EDITING: null,
  NEW_PLAYLIST: -1,
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
    const playlists = this.context.params.playlists;

    // New playlist
    if (this.props.editingPlaylist === PlaylistEditingType.NEW_PLAYLIST) {
      return getDefaultPlaylistParams(playlists);
    }

    return getPlaylistFromId(playlists, this.props.editingPlaylist);
  }

  componentDidMount() {
    this.params = this.getPlaylistParams();

    // Preserve parent's children
    this.parentChildren = this.context.parent.children;

    createPlaylistForm(
      this.context.field,
      this.params,
      this.semanticsRef.current,
      this.context.parent
    );

    // Capture own children and restore parent
    this.children = this.context.parent.children;
    this.context.parent.children = this.parentChildren;
  }

  handleDone() {
    const isValid = validatePlaylistForm(this.children);
    if (!isValid) {
      return;
    }
    this.props.doneAction(this.params);
  }

  confirmDone() {
    this.props.doneAction(this.params);
  }

  setPlaylist(playlist) {
    this.playlist = playlist;
  }

  removeInputErrors() {
    this.setState({
      hasInputError: false,
    });
  }

  render() {
    const semanticsClasses = ['semantics-wrapper'];
    semanticsClasses.push('choose-playlist');

    const showList = false;

    return (
      <EditingDialog
        title={this.context.t('playlist')}
        titleClasses={['playlist']}
        removeAction={this.props.removeAction}
        doneAction={this.handleDone.bind(this)}
        doneLabel={this.context.t('done')}
        removeLabel={this.context.t('remove')}
      >
        <div className={semanticsClasses.join(' ')} ref={this.semanticsRef}/>
        {
          showList &&
          <ChoosePlaylistWrapper
            selectedPlaylist={this.removeInputErrors.bind(this)}
            hasInputError={this.state.hasInputError}
            currentScene={this.props.currentScene}
            params={this.params}
            setPlaylist={this.setPlaylist.bind(this)}
          />
        }
      </EditingDialog>
    );
  }
}

PlaylistEditor.contextType = H5PContext;

PlaylistEditor.propTypes = {
  editingPlaylist: PropTypes.number.isRequired,
  doneAction: PropTypes.func.isRequired,
  removeAction: PropTypes.func.isRequired,
};

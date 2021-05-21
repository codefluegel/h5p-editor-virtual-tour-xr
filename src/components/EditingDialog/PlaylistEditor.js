// @ts-check

import React from 'react';
import PropTypes from 'prop-types';
import EditingDialog from "./EditingDialog";
import {H5PContext} from "../../context/H5PContext";
import './PlaylistEditor.scss';
import {getPlaylistFromId} from "../../h5phelpers/playlistParams";
import {showConfirmationDialog} from "../../h5phelpers/h5pComponents";
import {
  getDefaultPlaylistParams
} from "../../h5phelpers/forms/playlistForm";
import { createPlaylistForm } from '../../h5phelpers/forms/playlistForm';

export const PlaylistEditingType = {
  NOT_EDITING: 0,
  NEW_PLAYLIST: 1,
}

export default class PlaylistEditor extends React.Component {
  constructor(props) {
    super(props);

    this.semanticsRef = React.createRef();
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
    this.confirmDone();

    showConfirmationDialog({
      headerText: this.context.t('changePlaylistTitle'),
      dialogText: this.context.t('changePlaylistBody'),
      cancelText: this.context.t('cancel'),
      confirmText: this.context.t('confirm'),
    }, this.confirmDone.bind(this));

  }

  confirmDone() {
    this.props.doneAction(this.params);
  }

  render() {
    return (
      <EditingDialog
        title={this.context.t('playlist')}
        titleClasses={['playlist']}
        removeAction={this.props.removeAction}
        doneAction={this.handleDone.bind(this)}
        doneLabel={this.context.t('done')}
        removeLabel={this.context.t('remove')}
      >
        <div ref={this.semanticsRef}/>
      </EditingDialog>
    );
  }
}

PlaylistEditor.contextType = H5PContext;

PlaylistEditor.propTypes = {
  editingPlaylist: editingPlaylistType,
  doneAction: PropTypes.func.isRequired,
  removeAction: PropTypes.func.isRequired,
};

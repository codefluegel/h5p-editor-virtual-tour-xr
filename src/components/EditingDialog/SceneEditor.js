import React from 'react';
import PropTypes from 'prop-types';
import {editingSceneType} from "../../types/types";
import EditingDialog from "./EditingDialog";
import {H5PContext} from "../../context/H5PContext";
import {SceneTypes} from "../Scene/Scene";
import './SceneEditor.scss';
import {getSceneFromId} from "../../h5phelpers/sceneParams";
import {createSceneForm} from "../../h5phelpers/forms/sceneForm";
import {showConfirmationDialog} from "../../h5phelpers/h5pComponents";
import {
  getDefaultSceneParams,
  isInteractionsValid,
  sanitizeSceneForm,
  validateSceneForm
} from "../../h5phelpers/forms/sceneForm";
import ChoosePlaylistWrapper from "./ChoosePlaylist/ChoosePlaylistWrapper";

export const SceneEditingType = {
  NOT_EDITING: null,
  NEW_SCENE: -1,
};

export default class SceneEditor extends React.Component {
  constructor(props) {
    super(props);

    this.semanticsRef = React.createRef();

    this.state = {
      showPlaylists: false
    }
  }

  getSceneParams() {
    const scenes = this.context.params.scenes;

    // New scene
    if (this.props.editingScene === SceneEditingType.NEW_SCENE) {
      return getDefaultSceneParams(scenes);
    }

    return getSceneFromId(scenes, this.props.editingScene);
  }

  componentDidMount() {
    this.params = this.getSceneParams();

    // Update playlist component
    this.setState({
      showPlaylists: this.params.audioType === "playlist"
    })

    // Preserve parent's children
    this.parentChildren = this.context.parent.children;

    createSceneForm(
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
    const isValid = validateSceneForm(this.children);
    if (!isValid) {
      return;
    }

    const isThreeSixtyScene = this.params.sceneType
      === SceneTypes.THREE_SIXTY_SCENE;

    if (isInteractionsValid(this.params, isThreeSixtyScene)) {
      this.confirmDone();
      return;
    }

    showConfirmationDialog({
      headerText: this.context.t('changeSceneTitle'),
      dialogText: this.context.t('changeSceneBody'),
      cancelText: this.context.t('cancel'),
      confirmText: this.context.t('confirm'),
    }, this.confirmDone.bind(this));

  }

  confirmDone() {
    const isThreeSixtyScene = this.params.sceneType
      === SceneTypes.THREE_SIXTY_SCENE;

    if (this.params.audioType === "playlist" && this.playlist != null) {
      this.params.playlist = this.playlist;
    }

    if (this.params.playlist != null && this.params.audioType === "audio") {
      this.params.playlist = null;
    }
    
    sanitizeSceneForm(
      this.params,
      isThreeSixtyScene,
      this.params.cameraStartPosition
    );

    this.props.doneAction(this.params);
  }

  setPlaylist(playlist) {
    this.playlist = playlist;
  }

  selectedPlaylist(playlist) {
    const playlistMarked = this.playlist && this.playlist === playlist;
    const playlistAddedToScene = this.params.playlist && this.params.playlist === playlist;
    // Unmark playlist if already marked or added to scene
    this.playlist = playlistMarked || playlistAddedToScene ? null : playlist;
  }

  hasPlaylist() {
    this.params = this.getSceneParams();
    return this.params.playlist;
  }

  getAudioType() {
    this.params = this.getSceneParams();
    return this.params.audioType;
  }

  checkSemantics() {
    // Get updated value for Audio Type
    var audioTypeIsPlaylist = this.semanticsRef.current.getElementsByClassName("playlist")[0].children[0].checked;

    if (this.params) {
      if (!this.state.showPlaylists && audioTypeIsPlaylist) {
        this.setState({
          showPlaylists: true
        });
      }
      if (this.state.showPlaylists && !audioTypeIsPlaylist) {
        this.setState({
          showPlaylists: false
        });
      }
    }
  }

  render() {
    return (
      <EditingDialog
        title={this.context.t('scene')}
        titleClasses={['scene']}
        removeAction={this.props.removeAction}
        doneAction={this.handleDone.bind(this)}
        doneLabel={this.context.t('done')}
        removeLabel={this.context.t('remove')}
      >
        <div ref={this.semanticsRef} onClick={this.checkSemantics.bind(this)} />
        {
          this.state.showPlaylists &&
          <ChoosePlaylistWrapper
            selectedPlaylist={this.selectedPlaylist.bind(this)}
            markedPlaylist={this.hasPlaylist()}
            params={this.params}
            setPlaylist={this.setPlaylist.bind(this)}
          />
        }
      </EditingDialog>
    );
  }
}

SceneEditor.contextType = H5PContext;

SceneEditor.propTypes = {
  editingScene: editingSceneType,
  doneAction: PropTypes.func.isRequired,
  removeAction: PropTypes.func.isRequired,
};

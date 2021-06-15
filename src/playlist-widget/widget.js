// @ts-check

import React from "react";
import ReactDOM from "react-dom";
import { updatePlaylist } from "../h5phelpers/playlistParams";
import ChoosePlaylistWrapper from "./widget-components/ChoosePlaylist/ChoosePlaylistWrapper";
import PlaylistEditor, {
  PlaylistEditingType,
} from "./widget-components/PlaylistEditor";
import "./widget.scss";

/** @typedef {any} jQuery */

/**
 * @typedef {{
 *  children: [any, any, any];
 *  currentLibrary: string;
 * }} Form
 */

/**
 * @typedef {{
 *  canEdit?: boolean;
 *  description: string;
 *  label: string;
 *  name: string;
 *  type: string;
 *  widget: string;
 * }} Field
 */

/**
 * @typedef {(field: Field, value: number) => void} SetValue
 */

H5PEditor.widgets.playlist = class PlaylistWidget {
  /**
   * @param {Form} form
   * @param {Field} field
   * @param {number} value
   * @param {SetValue} setValue
   */
  constructor(form, field, value, setValue) {
    this.form = form;
    this.field = field;
    this.value = value;
    this.setValue = setValue;
  }

  /**
   * @param {jQuery} $wrapper
   */
  appendTo($wrapper) {
    ReactDOM.render(
      <PlaylistWidgetComponent
        form={this.form}
        setValue={(/** @type {number} */ value) => {
          this.value = value;
          this.setValue(this.field, value);
        }}
        playlistId={this.value}
        label={this.field.label}
        description={this.field.description}
        canEdit={this.field.canEdit}
      />,
      $wrapper.get(0)
    );
  }

  validate() {
    return true;
  }

  remove() {}
};

class PlaylistWidgetComponent extends React.Component {
  /**
   * @param {{
   *   form: Form;
   *   setValue: (value: number) => void;
   *   playlistId: number;
   *   label: string;
   *   description: string;
   *   index: number;
   *   canEdit: boolean;
   * }} props
   */
  constructor(props) {
    super(props);

    const playlists = this.getPlaylists();
    this.state = {
      playlists,
      selectedPlaylist: playlists.find(
        (playlist) => playlist.playlistId === this.props.playlistId
      ),
      prevSelectedPlaylist: playlists.find(
        (playlist) => playlist.playlistId === this.props.playlistId
      ),
      isPlaylistsUpdated: false,
      editingPlaylist: PlaylistEditingType.NOT_EDITING,
    };
  }

  componentDidMount() {
    window.addEventListener(
      "h5pPlaylistsUpdated",
      (/** @type {CustomEvent<Array<Playlist>>} */ event) => {
        const updatedPlaylists = event.detail;

        const selectedPlaylistStillExists =
          this.state.selectedPlaylist &&
          updatedPlaylists.find(
            (playlist) =>
              playlist.playlistId === this.state.selectedPlaylist.playlistId
          );

        this.setState({
          playlists: updatedPlaylists,
        });

        if (!selectedPlaylistStillExists) {
          this.selectPlaylist(null);
        }
      }
    );
  }

  /**
   * Event that updates the array of playlists when triggered.
   * @param {Array<Playlist>} updatedPlaylists
   */
  triggerUpdatedEvent(updatedPlaylists) {
    /** @type {CustomEvent<Array<Playlist>>} */
    const event = new CustomEvent("h5pPlaylistsUpdated", {
      detail: updatedPlaylists,
    });

    window.dispatchEvent(event);
  }

  /**
   * Help fetch the correct translations.
   * @param {string[]} args
   * @return {string}
   */
  translate(...args) {
    const translations = ["H5PEditor.ThreeImage", ...args];
    return H5PEditor.t.apply(window, translations);
  }

  /**
   * Help fetch the current context.
   * @returns {object} context
   */
  getContext() {
    if (
      this.props.form?.children &&
      this.props.form?.children[0]?.form?.children?.length > 0
    ) {
      return this.props.form.children[0].form;
    }
    return this.props.form;
  }

  /**
   * Help fetch the current array of playlists.
   * @returns {Array<Playlist>}
   */
  getPlaylists() {
    const threeImage = this.props.form.children[0];

    if (threeImage?.params?.playlists) {
      return threeImage.params.playlists;
    } 
    else if (threeImage?.parent?.params?.threeImage?.playlists) {
      return threeImage.parent.params.threeImage.playlists;
    } 
    else if (threeImage?.parent?.parent?.params?.threeImage?.playlists) {
      return threeImage.parent.parent.params.threeImage.playlists;
    } 
    else if (threeImage?.form?.parent?.params?.threeImage?.playlists) {
      return threeImage.form.parent.params.threeImage.playlists;
    } 
    else if (this.props.form?.parent?.params?.threeImage?.playlists) {
      return this.props.form.parent.params.threeImage.playlists;
    }

    return [];
  }

  /**
   * @returns {Array<Scene>}
   */
  getScenes() {
    const threeImage = this.props.form.children[0];

    if (threeImage?.form?.parent?.params?.threeImage?.scenes) {
      return threeImage.form.parent.params.threeImage.scenes;
    }
    return [];
  }

  /**
   * @param {string} playlistId
   */
  removePlaylistFromGlobal(playlistId) {
    const threeImage = this.props.form;

    if (threeImage?.parent?.params?.behaviour?.playlist === playlistId) {
      threeImage.parent.params.behaviour.playlist = undefined;
    }
  }

  /**
   * @param {Array<Playlist>} newPlaylists
   */
  updatePlaylists(newPlaylists) {
    const threeImage = this.props.form.children[0];

    if (threeImage?.form?.parent?.params?.threeImage) {
      threeImage.form.parent.params.threeImage.playlists = newPlaylists;
    }
  }

  /**
   * Help fecth the current params.
   * @returns {Object} params
   */
  getParams() {
    const threeImage = this.props.form.children[0];

    if (threeImage?.params) {
      return threeImage.params;
    }

    if (threeImage?.parent?.parent?.params?.threeImage) {
      return threeImage.parent.parent.params.threeImage;
    }

    if (threeImage?.form?.parent?.params?.threeImage) {
      return threeImage.form.parent.params.threeImage;
    }

    return null;
  }

  /**
   * Sets the selected playlist.
   * @param {string} playlistId
   */
  selectPlaylist(playlistId) {
    const selectedPlaylist = this.state.playlists.find(
      (playlist) => playlist.playlistId === playlistId
    );

    const newMarkedPlaylist =
      selectedPlaylist !== this.state.prevSelectedPlaylist
        ? selectedPlaylist
        : null;
    const newPlaylistId =
      selectedPlaylist !== this.state.prevSelectedPlaylist
        ? playlistId
        : undefined;

    this.setState({
      selectedPlaylist: newMarkedPlaylist,
      prevSelectedPlaylist: newMarkedPlaylist,
    });

    this.props.setValue(newPlaylistId);
  }

  /**
   * Actually removes the given playlistId from the playlists array.
   * @param {Array<Playlist>} playlists
   * @param {Playlist} selectedPlaylist
   * @returns {Array<Playlist>} playlists
   */
  removePlaylist(playlists, selectedPlaylist) {
    const index = playlists.indexOf(selectedPlaylist);
    if (selectedPlaylist != null && selectedPlaylist.playlistId !== "") {
      playlists.splice(index, 1);
    }
    return playlists;
  }

  /**
   * Helps remove the given playlistId from the playlists array.
   * @param {string} playlistId
   * @returns if playlist not added
   */
  deletePlaylist(playlistId) {
    this.setState({
      editingPlaylist: PlaylistEditingType.NOT_EDITING,
    });

    // Playlist not added to params
    const isNewPlaylist = playlistId === PlaylistEditingType.NEW_PLAYLIST;
    if (isNewPlaylist) {
      return;
    }

    const playlists = this.getPlaylists();
    const playlistToRemove = playlists.find(playlist => {
      return playlist.playlistId === playlistId
    });
    const newPlaylists = this.removePlaylist(
      playlists,
      playlistToRemove
    );
    this.updatePlaylists(newPlaylists);
    this.removePlaylistFromGlobal(playlistId);
    this.triggerUpdatedEvent(newPlaylists);

    // Remove playlistId from scenes that are using this playlist
    this.getScenes().forEach((scene) => {
      if (scene.playlist === playlistId) {
        scene.playlist = undefined;
      }
    });

    this.setState({
      playlistUpdated: false,
      selectedPlaylist: null,
    });
  }

  /**
   * Sets the chosen playlist as editingPlaylist.
   * @param {string} playlistId
   */
  editPlaylist(playlistId = PlaylistEditingType.NEW_PLAYLIST) {
    this.setState({ editingPlaylist: playlistId });
  }

  /**
   * Updates the playlists array and states afte editing playlist.
   * @param {*} params
   * @param {string} thisEditingPlaylist
   */
  doneEditingPlaylist(params, thisEditingPlaylist = null) {
    const playlists = this.getPlaylists();
    thisEditingPlaylist = this.state.editingPlaylist;

    const newPlaylists = updatePlaylist(playlists, params, thisEditingPlaylist);
    this.updatePlaylists(newPlaylists);

    this.triggerUpdatedEvent(newPlaylists);

    this.setState({
      playlistUpdated: false,
      editingPlaylist: PlaylistEditingType.NOT_EDITING,
      selectedPlaylist: null,
    });
  }

  render() {
    return (
      <>
        {this.props.label && (
          <span className="h5peditor-label">{this.props.label}</span>
        )}
        {this.props.description && (
          <span className="h5peditor-field-description">
            {this.props.description}
          </span>
        )}
        <ChoosePlaylistWrapper
          playlists={this.state.playlists}
          params={this.getParams()}
          noPlaylistsTranslation={this.translate("noPlaylistsAdded")}
          markedPlaylist={
            this.state.selectedPlaylist
              ? this.state.selectedPlaylist.playlistId
              : null
          }
          selectedPlaylist={this.selectPlaylist.bind(this)}
          editPlaylist={this.editPlaylist.bind(this)}
          canEdit={this.props.canEdit}
          translate={this.translate}
          context={this.getContext()}
          editingPlaylist={this.state.editingPlaylist}
          doneAction={this.doneEditingPlaylist.bind(this)}
        />
        {this.props.canEdit && (
          <div className="buttons-wrapper">
            <button
              className="h5p-new-playlist-button"
              onClick={() =>
                this.editPlaylist(PlaylistEditingType.NEW_PLAYLIST)
              }
            >
              + {this.translate("newPlaylist")}
            </button>
          </div>
        )}
        {this.state.editingPlaylist !== PlaylistEditingType.NOT_EDITING &&
          this.props.canEdit && (
            <PlaylistEditor
              translate={this.translate}
              removeAction={() =>
                this.deletePlaylist(this.state.editingPlaylist)
              }
              doneAction={this.doneEditingPlaylist.bind(this)}
              editingPlaylist={this.state.editingPlaylist}
              context={this.getContext()}
              playlists={this.state.playlists}
            />
          )}
      </>
    );
  }
}

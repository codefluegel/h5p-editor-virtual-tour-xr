// @ts-check
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import './widget.scss';
import ChoosePlaylistWrapper from './widget-components/ChoosePlaylist/ChoosePlaylistWrapper';
import PlaylistEditor, {PlaylistEditingType} from "./widget-components/PlaylistEditor";
import {updatePlaylist} from "../h5phelpers/playlistParams";

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
      <PlaylistWidgetComponent2
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

class PlaylistWidgetComponent2 extends React.Component {
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
      selectedPlaylist: playlists.find((playlist) => playlist.playlistId === this.props.playlistId),
      prevSelectedPlaylist: playlists.find((playlist) => playlist.playlistId === this.props.playlistId),
      isPlaylistsUpdated: this.getPlaylistUpdated(),
      editingPlaylist: this.getEditingPlaylist(),
    }
  }

  componentDidMount() {
    window.addEventListener("updatedPlaylists", (/** @type {CustomEvent} */ event) => {
      this.setState({
        playlists: event.detail.updatedPlaylists,
      });
    })    
  }

  getPlaylistUpdated(newValue) {
    return newValue ? newValue : false;
  }


  getEditingPlaylist(newValue) {
    return newValue ? newValue : PlaylistEditingType.NOT_EDITING;
  }
  
  triggerUpdatedEvent(updatedPlaylists) {
    const event = new CustomEvent("updatedPlaylists", {detail: {updatedPlaylists}});
    window.dispatchEvent(event);
  }

  /**
     * Help fetch the correct translations.
     *
     * @param {string[]} args
     * @return {string}
     */
  translate(...args) {
    const translations = ['H5PEditor.ThreeImage', ...args];
    return H5PEditor.t.apply(window, translations);
  }

  getThreeImage() {
    if (this.props.form && this.props.form.children && this.props.form.children[0] && this.props.form.children[0].form && this.props.form.children[0].form.children && this.props.form.children[0].form.children.length > 0) {
      return this.props.form.children[0].form;
    }
    if (this.props.form && this.props.form.children && this.props.form.children[0] && this.props.form.children[0].children && this.props.form.children[0].children.length > 0) {
      return this.props.form.children[0];
    }
    return this.props.form;
  }
   
  /**
   * @returns {Array<Playlist>}
   */
  getPlaylists() {
    const threeImage = this.props.form.children[0];
    if (threeImage && threeImage.params && threeImage.params.playlists) {
      return threeImage.params.playlists;
    }
    else if (threeImage && threeImage.parent && threeImage.parent.params && threeImage.parent.params.threeImage && threeImage.parent.params.threeImage.playlists) {
      return threeImage.parent.params.threeImage.playlists;
    }
    else if (threeImage && threeImage.parent && threeImage.parent.parent && threeImage.parent.parent.params 
      && threeImage.parent.parent.params.threeImage && threeImage.parent.parent.params.threeImage.playlists) {
      return threeImage.parent.parent.params.threeImage.playlists;
    }
    else if (threeImage && threeImage.form && threeImage.form.parent && threeImage.form.parent.params && threeImage.form.parent.params.threeImage 
      && threeImage.form.parent.params.threeImage.playlists ) {
      return threeImage.form.parent.params.threeImage.playlists;
    }
    else if (this.props.form && this.props.form.parent && this.props.form.parent.params && this.props.form.parent.params.threeImage && this.props.form.parent.params.threeImage.playlists) {
      return this.props.form.parent.params.threeImage.playlists;
    }
    else if (this.props.form && this.props.form.params && this.props.form.params.threeImage && this.props.form.params.threeImage.playlists) {
      return this.props.form.params.threeImage.playlists;
    }
    return [];
  }

  /**
   * @returns {Array<Scene>}
   */
   getScenes() {
    const threeImage = this.props.form.children[0];

    if (threeImage && threeImage.params && threeImage.params.scenes) {
      return threeImage.params.scenes;
    }
    else if (threeImage && threeImage.parent && threeImage.parent.params && threeImage.parent.params.threeImage && threeImage.parent.params.threeImage.scenes) {
      return threeImage.parent.params.threeImage.scenes;
    }
    else if (threeImage && threeImage.parent && threeImage.parent.parent && threeImage.parent.parent.params 
      && threeImage.parent.parent.params.threeImage && threeImage.parent.parent.params.threeImage.scenes) {
      return threeImage.parent.parent.params.threeImage.scenes;
    }
    else if (threeImage && threeImage.form && threeImage.form.parent && threeImage.form.parent.params && threeImage.form.parent.params.threeImage 
      && threeImage.form.parent.params.threeImage.scenes ) {
      return threeImage.form.parent.params.threeImage.scenes;
    }
    else if (this.props.form && this.props.form.parent && this.props.form.parent.params && this.props.form.parent.params.threeImage && this.props.form.parent.params.threeImage.scenes) {
      return this.props.form.parent.params.threeImage.scenes;
    }
    else if (this.props.form && this.props.form.params && this.props.form.params.threeImage && this.props.form.params.threeImage.playlists) {
      return this.props.form.params.threeImage.scenes;
    }
    return [];
  }

  updatePlaylists(newPlaylists) {
    const threeImage = this.props.form.children[0];

    if (threeImage && threeImage.params && threeImage.params.playlists) {
      threeImage.params.playlists = newPlaylists;
    }
    else if (threeImage && threeImage.parent && threeImage.parent.params && threeImage.parent.params.threeImage && threeImage.parent.params.threeImage.playlists) {
      threeImage.parent.params.threeImage.playlists = newPlaylists;
    }
    else if (threeImage && threeImage.parent && threeImage.parent.parent && threeImage.parent.parent.params 
      && threeImage.parent.parent.params.threeImage && threeImage.parent.parent.params.threeImage.playlists) {
      threeImage.parent.parent.params.threeImage.playlists = newPlaylists;
    }
    else if (threeImage && threeImage.form && threeImage.form.parent && threeImage.form.parent.params && threeImage.form.parent.params.threeImage 
      && threeImage.form.parent.params.threeImage.playlists ) {
      threeImage.form.parent.params.threeImage.playlists = newPlaylists;
    }
    else if (this.props.form && this.props.form.parent && this.props.form.parent.params && this.props.form.parent.params.threeImage && this.props.form.parent.params.threeImage.playlists) {
      this.props.form.parent.params.threeImage.playlists = newPlaylists;
    }
    else if (this.props.form && this.props.form.params && this.props.form.params.threeImage && this.props.form.params.threeImage.playlists) {
      this.props.form.params.threeImage.playlists = newPlaylists;
    }
  }

  /**
   * @returns {Object} params
   */
   getParams() {
    const threeImage = this.props.form.children[0];
    if (threeImage && threeImage.params) {
      return threeImage.params;
    }
    if (threeImage && threeImage.parent && threeImage.parent.parent && threeImage.parent.parent.params && threeImage.parent.parent.params.threeImage) {
      return threeImage.parent.parent.params.threeImage;
    }
    if (threeImage && threeImage.form && threeImage.form.parent && threeImage.form.parent.params && threeImage.form.parent.params.threeImage 
      && threeImage.form.parent.params.threeImage ) {
      return threeImage.form.parent.params.threeImage;
    }
    return null;
  }

  /**
   * @returns {Object} l10n
   */
  getTranslation() {
    const noPlaylistsText = this.translate('noPlaylistsAdded');
    if (noPlaylistsText) {
      return noPlaylistsText;
    }
    return null;
  }

  /**
   * @param {number} playlistId
   */
  selectPlaylist(playlistId) {
    const selectedPlaylist = this.state.playlists.find(
      (playlist) => playlist.playlistId === playlistId
    );
    const newMarkedPlaylist = selectedPlaylist !== this.state.prevSelectedPlaylist ? selectedPlaylist : null;
    const newPlaylistId = selectedPlaylist !== this.state.prevSelectedPlaylist ? playlistId : undefined;

    this.setState({
      selectedPlaylist: newMarkedPlaylist,
      prevSelectedPlaylist: newMarkedPlaylist,
    })
    
    this.props.setValue(newPlaylistId);
  }

  deletePlaylist(playlistId) {
    const isNewPlaylist = playlistId === PlaylistEditingType.NEW_PLAYLIST;
    this.confirmedDeletePlaylist(playlistId);
  }

  removePlaylist(playlists, playlistId) {
    if (playlistId > -1) {
      playlists.splice(playlistId, 1);
    }
    return playlists;
  }

  confirmedDeletePlaylist(playlistId) {
    this.setState({
      editingPlaylist: PlaylistEditingType.NOT_EDITING
    })

    // Playlist not added to params
    const isNewPlaylist = playlistId === PlaylistEditingType.NEW_PLAYLIST;
    if (isNewPlaylist) {
      return;
    }

    const playlists = this.getPlaylists();
    const newPlaylists = this.removePlaylist(playlists, playlistId);
    this.updatePlaylists(newPlaylists);
    this.triggerUpdatedEvent(newPlaylists);

    // Remove playlistId from scenes that are using this playlist
    this.getScenes().forEach(scene => {
      if (scene.playlist === playlistId) {
        scene.playlist = undefined;
      }
    });

    this.setState({
      playlistUpdated: false,
      selectedPlaylist: null,
    });
  }

  editPlaylist(playlistId = PlaylistEditingType.NEW_PLAYLIST) {
    this.setState({editingPlaylist: playlistId});
  }

  doneEditingPlaylist(params, thisEditingPlaylist = null) {
    const playlists = this.getPlaylists();
    thisEditingPlaylist = this.state.editingPlaylist || this.getEditingPlaylist();
    if (thisEditingPlaylist === null && params.playlistId === playlists.length) {
      thisEditingPlaylist = -1;
    }

    const newPlaylists = updatePlaylist(playlists, params, thisEditingPlaylist);
    this.updatePlaylists(newPlaylists);

    this.triggerUpdatedEvent(newPlaylists);

    this.setState({
      playlistUpdated: false,
      editingPlaylist: PlaylistEditingType.NOT_EDITING,
      selectedPlaylist: null,
    })
  }

  render() {
    return (
      <>
        {this.props.label && <span className="h5peditor-label">{this.props.label}</span>}
        {this.props.description && (
          <span className="h5peditor-field-description">{this.props.description}</span>
        )}
        <ChoosePlaylistWrapper
          playlists={this.state.playlists}
          params={this.getParams()}
          noPlaylistsTranslation={this.getTranslation()}
          markedPlaylist={this.state.selectedPlaylist ? this.state.selectedPlaylist.playlistId : null}
          selectedPlaylist={this.selectPlaylist.bind(this)}
          editPlaylist={this.editPlaylist.bind(this)}
          isMainPage={this.props.canEdit}
          translate={this.translate}
          context={this.getThreeImage()}
          editingPlaylist={this.state.editingPlaylist}
          doneAction={this.doneEditingPlaylist.bind(this)}
        />
        {
          this.props.canEdit && 
          <div className='buttons-wrapper'>
            <button
              className='h5p-new-playlist-button'
              onClick={() => this.editPlaylist(PlaylistEditingType.NEW_PLAYLIST)}
            >+ {this.translate('newPlaylist')}</button>
          </div>
        }
        {
          (this.state.editingPlaylist !== PlaylistEditingType.NOT_EDITING) && this.props.canEdit &&
          <PlaylistEditor
            translate={this.translate}
            removeAction={() => this.deletePlaylist(this.state.editingPlaylist)}
            doneAction={this.doneEditingPlaylist.bind(this)}
            editingPlaylist={this.state.editingPlaylist}
            context={this.getThreeImage()}
            playlists={this.state.playlists}
          />
        }
      </>
    );
  }
}
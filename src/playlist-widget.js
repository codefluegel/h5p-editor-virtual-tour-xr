// @ts-check
import React from "react";
import ReactDOM from "react-dom";
import PlaylistList from "./components/ControlBar/PlaylistSelector/PlaylistList";
import ChoosePlaylistWrapper from './components/EditingDialog/ChoosePlaylist/ChoosePlaylistWrapper';
import ChoosePlaylistSelector from "./components/EditingDialog/ChoosePlaylist/Selector/ChoosePlaylistSelector";

/** @typedef {any} jQuery */

/**
 * @typedef {{
 *  children: [any, any, any];
 *  currentLibrary: string;
 * }} Form
 */

/**
 * @typedef {{
 *  label: string;
 *  description: string;
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
      />,
      $wrapper.get(0)
    );
  }

  validate() {
    return true;
  }

  remove() {}
};

/**
 * @param {{
 *   form: Form;
 *   setValue: (value: number) => void;
 *   playlistId: number;
 *   label: string;
 *   description: string;
 * }} props
 *
 * @returns {JSX.Element}
 */
function PlaylistWidgetComponent({
  form,
  setValue,
  playlistId,
  label,
  description,
}) {
  /** @type [Array<Playlist>, (playlist: Array<Playlist>) => void] */
  const [playlists, setPlaylists] = React.useState(getPlaylists());

  /** @type [Playlist, (playlist: Playlist) => void] */
  const [selectedPlaylist, setSelectedPlaylist] = React.useState(
    playlists.find((playlist) => playlist.playlistId === playlistId)
  );


  /**
   * @returns {Array<Playlist>}
   */
  function getPlaylists() {
    const threeImage = form.children[0];
    if (threeImage.params && threeImage.params.playlists) {
      return threeImage.params.playlists;
    }
    if (threeImage.parent && threeImage.parent.params && threeImage.parent.params.threeImage && threeImage.parent.params.threeImage.playlists) {
      return threeImage.parent.params.threeImage.playlists;
    }
    if (threeImage.form && threeImage.form.parent && threeImage.form.parent.params 
      && threeImage.form.parent.params.threeImage && threeImage.form.parent.params.threeImage.playlists) {
      return threeImage.form.parent.params.threeImage.playlists;
    }
    if (threeImage.parent && threeImage.parent.parent && threeImage.parent.parent.params 
      && threeImage.parent.parent.params.threeImage && threeImage.parent.parent.params.threeImage.playlists) {
      return threeImage.parent.parent.params.threeImage.playlists;
    }
    return [];
  }

  /**
   * @returns {Object} params
   */
  function getParams() {
    const threeImage = form.children[0];
    if (threeImage.params) {
      return threeImage.params;
    }
    if (threeImage.form && threeImage.form.parent && threeImage.form.parent.params && threeImage.form.parent.params && threeImage.form.parent.params.threeImage) {
      return threeImage.form.parent.params.threeImage;
    }
    if (threeImage.form && threeImage.form.parent && threeImage.form.parent.params && threeImage.form.parent.params) {
      return threeImage.form.parent.params;
    }
    if (threeImage.parent && threeImage.parent.parent && threeImage.parent.parent.params && threeImage.parent.parent.params.threeImage) {
      return threeImage.parent.parent.params.threeImage;
    }
    return null;
  }

  /**
   * @param {number} playlistId
   */
  function selectPlaylist(playlistId) {
    const selectedPlaylist = playlists.find(
      (playlist) => playlist.playlistId === playlistId
    );
    setSelectedPlaylist(selectedPlaylist);

    setValue(playlistId);
  }

  return (
    <>
      {label && <span className="h5peditor-label">{label}</span>}
      {description && (
        <span className="h5peditor-field-description">{description}</span>
      )}
      <ChoosePlaylistWrapper
        playlists={playlists}
        params={getParams()}
        markedPlaylist={selectedPlaylist ? selectedPlaylist.playlistId : null}
        selectedPlaylist={selectPlaylist}
      />
    </>
  );
}

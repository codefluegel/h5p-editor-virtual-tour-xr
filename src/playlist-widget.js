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

  const [playlistPickerOpen, setPlaylistPickerOpen] = React.useState(false);

  /**
   * @returns {Array<Playlist>}
   */
  function getPlaylists() {
    const threeImage = form.children[0];

    return (threeImage.params && threeImage.params.playlists) || [];
  }

  function togglePlaylistPicker() {
    setPlaylistPickerOpen((isOpen) => !isOpen);
    setPlaylists(getPlaylists());
  }

  /**
   * @param {number} playlistId
   */
  function selectPlaylist(playlistId) {
    const selectedPlaylist = playlists.find(
      (playlist) => playlist.playlistId === playlistId
    );
    setSelectedPlaylist(selectedPlaylist);
    setPlaylistPickerOpen(false);

    setValue(playlistId);
  }

  return (
    <>
      {label && <span className="h5peditor-label">{label}</span>}
      {description && (
        <span className="h5peditor-field-description">{description}</span>
      )}
      <div
        className="h5p-playlist-widget"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {selectedPlaylist ? (
          <div>{selectedPlaylist.title}</div>
        ) : (
          <div>No playlist set</div>
        )}
        <button onClick={togglePlaylistPicker}>
          {playlistPickerOpen
            ? "Close playlist picker"
            : "Open playlist picker"}
        </button>
        {/* <ul hidden={!playlistPickerOpen} style={{ width: "100%" }}>
          {playlists.map((playlist) => (
            <li key={playlist.playlistId}>
              <button onClick={() => selectPlaylist(playlist)}>
                {playlist.title}
              </button>
            </li>
          ))}
        </ul> */}
        <ChoosePlaylistWrapper
          playlists={playlists}
          markedPlaylist={selectedPlaylist.playlistId}
          setNextPlaylistId={selectPlaylist}
        />
      </div>
    </>
  );
}

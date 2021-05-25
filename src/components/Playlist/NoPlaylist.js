import React from 'react';
import './NoPlaylist.scss';
import { H5PContext } from "../../context/H5PContext";

export default class NoPlaylist extends React.Component {
  render() {
    return (
      <div className='no-playlist-container'>
        <div className="no-playlist-wrapper">
          <div className="title">{ this.context.t('noPlaylistsTitle') }</div>
          <div className="description">{ this.context.t('noPlaylistsDescription') }</div>
        </div>
      </div>
    );
  }
}

NoPlaylist.contextType = H5PContext;

import React from 'react';
import PropTypes from 'prop-types';
import './PlaylistSelectorSubmenu.scss';

const PlaylistSelectorSubmenu = (props) => {

  /**
   * TODO: Use separate <Button> component for mapping instead.
   */

  const handleClick = (type) => {
    return (e) => {
      e.stopPropagation();
      props[type]();
    }
  }

  return (
    <div className='playlist-selector-submenu'>
      <button
        className='jump'
        onClick={ handleClick('onJump') }
      >
        <div className='tooltip'>{props.goToPlaylistLabel}</div>
      </button>
      <button
        className='edit'
        onClick={ handleClick('onEdit') }
      >
        <div className='tooltip'>{props.editLabel}</div>
      </button>
      <button
        className='delete'
        onClick={ handleClick('onDelete') }
      >
        <div className='tooltip'>{props.deleteLabel}</div>
      </button>
    </div>
  );
};

PlaylistSelectorSubmenu.propTypes = {
  setStartPlaylist: PropTypes.func.isRequired,
  onJump: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  setStartingPlaylistLabel: PropTypes.string.isRequired,
  goToPlaylistLabel: PropTypes.string.isRequired,
  editLabel: PropTypes.string.isRequired,
  deleteLabel: PropTypes.string.isRequired
};

export default PlaylistSelectorSubmenu;
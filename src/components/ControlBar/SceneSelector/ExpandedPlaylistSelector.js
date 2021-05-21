import React from 'react';
import PropTypes from 'prop-types';
import './ExpandedPlaylistSelector.scss';

const ExpandedPlaylistSelector = (props) => (
  <div className='expanded-playlist-selector'>
    <div className='header'>
      <div className='title'>{props.choosePlaylistLabel}</div>
    </div>
    {props.children}
  </div>
);

ExpandedPlaylistSelector.propTypes = {
  children: PropTypes.node,
  choosePlaylistLabel: PropTypes.string.isRequired
};

export default ExpandedPlaylistSelector;
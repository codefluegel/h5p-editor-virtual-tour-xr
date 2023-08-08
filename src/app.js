import React from 'react';
import ReactDOM from 'react-dom';
import Main from './components/Main';
import { H5PContext } from './context/H5PContext';
import './playlist-widget/widget';

export default class NDLAThreeImage {
  constructor(parent, field, params, setValue) {
    this.params = params || {};
    this.params = Object.assign({
      scenes: [],
    }, this.params);
    this.parent = parent;
    this.field = field;
    this.setValue = setValue;
    this.wrapper = null;

    H5P.$window.on('resize', this.resize.bind(this));
    this.resize();
  }

  /**
   * Help fetch the correct translations.
   *
   * @param {string[]} args
   * @return {string}
   */
  t(...args) {
    const translations = ['H5PEditor.NDLAThreeImage', ...args];
    return H5PEditor.t.apply(window, translations);
  }

  appendTo($container) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('h5p-editor-three-image-wrapper');
    this.wrapper = wrapper;

    $container[0].appendChild(wrapper);

    this.setValue(this.field, this.params);

    let startScene = this.params.scenes.length ? 0 : null;
    if (this.params.scenes.length) {
      startScene = this.params.startSceneId;
    }

    ReactDOM.render(
      <H5PContext.Provider value={this}>
        <Main initialScene={startScene} />
      </H5PContext.Provider>,
      wrapper
    );
  }

  resize() {
    if (!this.wrapper) {
      return;
    }

    const mobileThreshold = 815;
    const wrapperSize = this.wrapper.getBoundingClientRect();
    if (wrapperSize.width < mobileThreshold) {
      this.wrapper.classList.add('mobile');
    }
    else {
      this.wrapper.classList.remove('mobile');
    }
  }

  ready(ready) {
    if (this.passReadies) {
      parent.ready(ready);
    }
    else {
      this.readies.push(ready);
    }
  }

  validate() {
    return true;
  }
}

H5PEditor.widgets.NDLAthreeImage = H5PEditor.NDLAThreeImage = NDLAThreeImage;

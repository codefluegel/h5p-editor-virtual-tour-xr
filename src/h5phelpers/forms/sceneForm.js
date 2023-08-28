import { getSceneField, areChildrenValid } from '../editorForms';

/** @typedef {{ playlistId: string, title: string, audioTracks: object }} Playlist */
/** @typedef {{ playlist: Playlist }} Scene */

const DefaultInteractionValues = {
  threeSixty: {
    spread: 20,
  },
  static: {
    spread: 30,
    center: [50, 50],
  }
};

/**
 * Creates scene form and appends it to wrapper
 * @param {object} field Field to display in form.
 * @param {object} params Parameters from form.
 * @param {HTMLElement} wrapper Element to attach to.
 * @param {object} parent Parent field.
 */
export const createSceneForm = (field, params, wrapper, parent) => {
  const sceneField = getSceneField(field);
  const hiddenSceneFields = [
    'sceneId',
    'cameraStartPosition',
    'interactions',
  ];

  const sceneFields = sceneField.field.fields.filter((sceneField) => {
    return !hiddenSceneFields.includes(sceneField.name);
  });

  H5PEditor.processSemanticsChunk(
    sceneFields,
    params,
    wrapper,
    parent,
  );
};

/**
 * Get random position within percentage spread around the center position.
 * @param {number} center Center position.
 * @param {number} spread Spread parameters.
 * @returns {number} Random position around center.
 */
const spreadByValue = (center, spread) => {
  return center - (spread / 2) + (Math.random() * spread);
};

/**
 * Check if scene form is valid and mark invalid fields.
 * @param {object} children Childrento check.
 * @returns {boolean} True if valid, else false.
 */
export const validateSceneForm = (children) => {
  H5PEditor.Html.removeWysiwyg();
  return areChildrenValid(children);
};

/**
 * Check if single interaction has valid position given scene type.
 * @param {object} interaction Interaction.
 * @param {boolean} isThreeSixty True for a three sixty scene.
 * @returns {boolean} True, if position is valid.
 */
const isInteractionPositionValid = (interaction, isThreeSixty) => {
  const position = interaction.interactionpos.split(',');
  return position.every((pos) => {
    const hasThreeSixtyPos = pos.substr(-1) !== '%';
    return hasThreeSixtyPos === isThreeSixty;
  });
};

/**
 * Get default interaction position given scene type.
 * @param {boolean} isThreeSixtyScene True for a three sixty scene.
 * @param {string} cameraPos Camera position.
 * @returns {string} Position for CSS.
 */
const getNewInteractionPos = (isThreeSixtyScene, cameraPos) => {
  // Place interactions spread randomly within a threshold in degrees
  const center = (isThreeSixtyScene) ?
    cameraPos.split(',').map(parseFloat) :
    DefaultInteractionValues.static.center;

  const spread = (isThreeSixtyScene) ?
    DefaultInteractionValues.threeSixty.spread * Math.PI / 180 :
    DefaultInteractionValues.static.spread;

  return center
    .map((pos) => {
      const newPos = spreadByValue(pos, spread);
      return isThreeSixtyScene ? newPos : `${newPos}%`;
    })
    .join(',');
};

/**
 * Set default position for interaction if it has invalid position for given
 * scene type.
 * @param {object} params Interaction.
 * @param {object} params.interaction Interaction.
 * @param {boolean} params.isThreeSixty True for a three sixty scene.
 * @param {string} params.cameraPos Camera position.
 * @param {string} [params.previewSize] Current width and height of preview size.
 * @param {string} [params.wasThreeSixty] True for a three sixty scene if changed.
 */
const sanitizeInteractionGeometry = ({
  interaction, isThreeSixty, cameraPos, previewSize = {}, wasThreeSixty
}) => {
  if (!isInteractionPositionValid(interaction, isThreeSixty)) {
    interaction.interactionpos = getNewInteractionPos(isThreeSixty, cameraPos);
  }

  // Default to 1:1
  previewSize.width = previewSize.width ?? 100;
  previewSize.height = previewSize.height ?? 100;

  /*
   * // TODO: Private constants from view
   * (HotspotNavButton: minimumSize, maximumSize),
   * should be retrieved from the scene preview, not duplicated here, but fix
   * the sizing overflow in static scenes first
   */
  let minWidth = 20, minHeight = 20;
  let maxWidth = 2000, maxHeight = 2000;

  let targetWidth, targetHeight;
  const [width, height] = (interaction.hotspotSettings.hotSpotSizeValues || '')
    .split(',');

  if (typeof wasThreeSixty !== 'boolean' || wasThreeSixty === isThreeSixty) {
    return; // Scene type did not change
  }

  if (isThreeSixty) {
    // Convert static into 360 (current percentage to pixels)
    targetWidth = width / 100 * previewSize.width;
    targetHeight = height / 100 * previewSize.height;
  }
  else {
    const [x, y] = interaction.interactionpos.split(',');

    // Percentage value of mininum size for current preview size
    minWidth = minWidth / previewSize.width * 100;
    minHeight = minHeight / previewSize.height * 100;

    // Max size as 100% - position percentage
    maxWidth = 100 - parseFloat(x);
    maxHeight = 100 - parseFloat(y);

    // Convert 360 into static (pixels into current percentage)
    targetWidth = width / previewSize.width * 100;
    targetHeight = height / previewSize.height * 100;
  }

  targetWidth = Math.max(minWidth, Math.min(targetWidth, maxWidth));
  targetHeight = Math.max(minHeight, Math.min(targetHeight, maxHeight));

  interaction.hotspotSettings.hotSpotSizeValues = `${targetWidth},${targetHeight}`;
};

/**
 * Set default values for scene parameters that are not initially set by user
 * when creating scene.
 * @param {object} params Parameters.
 * @param {boolean} isThreeSixty True for a three sixty scene.
 * @param {string} cameraPos Camera position.
 * @param {object} [previewSize] Current scene preview wrapper bounding client rect.
 * @param {boolean} wasThreeSixty True for a three sixty scene if changed.
 */
export const sanitizeSceneForm = (
  params, isThreeSixty, cameraPos, previewSize = {}, wasThreeSixty
) => {
  if (!params.cameraStartPosition) {
    params.cameraStartPosition = `${-(Math.PI * (2 / 3))},0`;
  }

  (params.interactions ?? []).forEach((interaction) => {
    sanitizeInteractionGeometry({
      interaction, isThreeSixty, cameraPos, previewSize, wasThreeSixty
    });
  });
};

/**
 * Check if all interactions have valid positions.
 * @param {object} params Parameters.
 * @param {boolean} isThreeSixty True for a three sixty scene.
 * @returns {boolean} True if all interactions have valid positions.
 */
export const isInteractionsValid = (params, isThreeSixty) => {
  if (!params.interactions) {
    return true;
  }

  return params.interactions.every((interaction) => {
    return isInteractionPositionValid(interaction, isThreeSixty);
  });
};

/**
 * Grab unique ID that is higher than the highest ID in our scenes collection.
 * @param {Scene[]} scenes Scenes.
 * @returns {number} New id.
 */
const getUniqueSceneId = (scenes) => {
  if (!scenes.length) {
    return 0;
  }

  const sceneIds = scenes.map((scene) => scene.sceneId);
  const maxSceneId = Math.max(...sceneIds);
  return maxSceneId + 1;
};

/**
 * Get initial parameters for empty scene.
 * @param {Scene[]} scenes Scenes.
 * @returns {object} Initial parameters.
 */
export const getDefaultSceneParams = (scenes) => {
  return {
    sceneId: getUniqueSceneId(scenes),
  };
};

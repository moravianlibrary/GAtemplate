goog.provide('cz.mzk.authorities.template.main');

goog.require('cz.mzk.authorities.template.dialogs.MapDialog');

goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.ui.Dialog.EventType');

/**
 * @param {{target: !(Element|string),
 *          heading: !(Element|string)}} options
 */
cz.mzk.authorities.template.main = function(options) {
  /** @type {cz.mzk.authorities.template.dialogs.MapDialog} */
  var mapDialog = new cz.mzk.authorities.template.dialogs.MapDialog();

  goog.events.listen(goog.dom.getElement(options.target), 'click', function(e) {
    /** @type {string} */
    var headingValue = goog.dom.getElement(options.heading).value;
    if (headingValue) {
      mapDialog.setSearchQuery(headingValue);
    }
    mapDialog.clear();
    mapDialog.setVisible(true);
  });

  goog.events.listen(mapDialog, goog.ui.Dialog.EventType.SELECT, function(e) {
    if (e.key == goog.ui.Dialog.DefaultButtonKeys.OK) {
      /** @type {?OpenLayers.Bounds} */
      var bbox = mapDialog.getBBox();
      if (bbox) {
        /** @type {Array.<number>} */
        var bboxArray = bbox.toArray();
        var marc034 = convertToGPS(bboxArray[3]) + 'N - '
          + convertToGPS(bboxArray[1]) + 'N, '
          + convertToGPS(bboxArray[0]) + 'E - '
          + convertToGPS(bboxArray[2]) + 'E'
        goog.dom.getElement('P2301GPS__a').value = marc034;
      }
    }
    return true;
  });
}
/**
 * @param {number} value
 * @return {string}
 */
function convertToGPS(value) {
  var degrees = value;
  var minutes = (degrees % 1) * 60;
  var seconds = (minutes % 1) * 60;
  return ''
    + degrees.toFixed(0) + "°"
    + minutes.toFixed(0) + "'"
    + seconds.toFixed(2) + "''"
};

goog.exportSymbol('main', cz.mzk.authorities.template.main);

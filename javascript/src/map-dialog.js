goog.provide('cz.mzk.authorities.template.dialogs.MapDialog');

goog.require('cz.mzk.authorities.template.Map');

goog.require('goog.ui.ac.AutoComplete.EventType');
goog.require('goog.ui.ac.Nominatim');

goog.require('goog.ui.Dialog');
goog.require('goog.ui.Dialog.ButtonSet');
goog.require('goog.ui.Dialog.DefaultButtonKeys');
goog.require('goog.ui.Menu');
goog.require('goog.ui.MenuItem');
goog.require('goog.ui.Component.EventType');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.events.KeyCodes');
goog.require('goog.net.Jsonp');
goog.require('goog.asserts');

goog.require('goog.debug.LogManager');
goog.require('goog.debug.Console');

/**
 * @constructor
 * @extends {goog.ui.Dialog}
 */
cz.mzk.authorities.template.dialogs.MapDialog = function() {
  var this_ = this;

  goog.ui.Dialog.call(this);
  this.setTitle('Vyhledat autoritu na mapě.');
  this.setContent(
      '<div id="mapdialog-content">' +
      '<div id="mapdialog-topmenu">' +
      '<form id="mapdialog-search-form">' +
      '<input type="text" id="mapdialog-search" autocomplete="off">' +
      '<input type="submit" id="mapdialog-search-submit" value="Hledat">' +
      '</form>' +
      '</div>' +
      '<div id="mapdialog-map"></div>' +
      '<div id="mapdialog-rightmenu"></div>' +
      '<div id="loading-overlay"></div>' +
      '<div/>'
  );
  /**
   * @type {goog.ui.Dialog.ButtonSet}
   */
  var buttonSet = goog.ui.Dialog.ButtonSet.createOkCancel();
  buttonSet.setDefault(null);
  this.setButtonSet(buttonSet);
  this.setModal(true);
  this.setDraggable(false);
  this.setVisible(true);
  /**
   * @type {goog.dom.DomHelper}
   */
  var domHelper = goog.dom.getDomHelper(this.getContentElement());
  /**
   * @private
   * @type {?goog.net.Jsonp}
   */
  this.jsonp_ = null;
  /**
   * @private
   * @type {?Object}
   */
  this.jsonpRequest_ = null;
  /**
   * @private
   * @type {cz.mzk.authorities.template.Map}
   */
  this.map_ = new cz.mzk.authorities.template.Map(domHelper.getElement('mapdialog-map'));
  /**
   * @private
   * @type {goog.ui.Menu}
   */
  this.menu_ = new goog.ui.Menu();
  this.menu_.render(domHelper.getElement('mapdialog-rightmenu'));
  /**
   * @private
   * @type {Element}
   */
  this.searchElement_ = domHelper.getElement('mapdialog-search');
  goog.asserts.assert(this.searchElement_ != null);
  /**
   * @private
   * @type {Element}
   */
  this.searchFormElement_ = domHelper.getElement('mapdialog-search-form');
  /**
   * @private
   * @type {Element}
   */
  this.searchSubmitElement_ = domHelper.getElement('mapdialog-search-submit');
  /**
   * @private
   * @type {Element}
   */
  this.loadingOverlayElement_ = domHelper.getElement('loading-overlay');
  /**
   * @private
   * @type {goog.ui.ac.Nominatim}
   */
  this.search_ = new goog.ui.ac.Nominatim(this.searchElement_, this.getContentElement());
  goog.events.listen(this.search_, goog.ui.ac.AutoComplete.EventType.UPDATE, function(e) {
    this_.searchSubmitElement_.click();
  });
  goog.events.listen(this.searchFormElement_, 'submit', function(e) {
    e.preventDefault();
    if (this_.jsonp_) {
      goog.asserts.assert(this_.jsonpRequest_ != null);
      this_.jsonp_.cancel(this_.jsonpRequest_);
      this_.jsonp_ = null;
    }
    this_.jsonp_ = new goog.net.Jsonp('http://nominatim.mzk.cz', 'json_callback');
    this_.jsonpRequest_ = this_.jsonp_.send(
      {
        'q' : this_.searchElement_.value,
        'polygon' : '1',
        'format' : 'json'
      },
      function(data) {
        this_.menu_.removeChildren(true);
        for (var i = 0; i < data.length; i++) {
          goog.asserts.assertString(data[i]['display_name']);
          var item = new goog.ui.MenuItem(data[i]['display_name']);
          item['authority'] = new cz.mzk.authorities.template.Authority({
              nominatimSouth: parseFloat(data[i]['boundingbox'][0]),
              nominatimNorth: parseFloat(data[i]['boundingbox'][1]),
              nominatimWest: parseFloat(data[i]['boundingbox'][2]),
              nominatimEast: parseFloat(data[i]['boundingbox'][3])
          });
          if (data[i]['polygonpoints']) {
            item['authority'].setNominatimPolygon(this_.retypePolygon_(data[i]['polygonpoints']));
          }
          goog.events.listen(item, goog.ui.Component.EventType.ACTION, function(e) {
            this_.map_.showAuthority(e.target['authority']);
          });
          this_.menu_.addChild(item, true);
        }
        /** type {?goog.ui.Control} */
        var firstItem = this_.menu_.getChildAt(0);
        if (firstItem) {
          this_.map_.showAuthority(firstItem['authority']);
        } else {
          this_.map_.clear();
        }
        this_.loadingOverlayElement_.style.display = 'none';
      },
      function(error) {
        this_.loadingOverlayElement_.style.display = 'none';
      }
    );
    this_.loadingOverlayElement_.style.display = 'block';
  });
  this.setVisible(false);
};

goog.inherits(cz.mzk.authorities.template.dialogs.MapDialog, goog.ui.Dialog);

/**
 * @inheritDoc
 */
cz.mzk.authorities.template.dialogs.MapDialog.prototype.setVisible = function(value) {
  goog.base(this, 'setVisible', value);
  var elem = this.getDialogElement();
  if (value && this.map_) {
    this.map_.updateSize();
    this.searchElement_.focus();
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
    if (this.jsonp_) {
      goog.asserts.assert(this.jsonpRequest_ != null);
      this.jsonp_.cancel(this.jsonpRequest_);
      this.jsonp_ = null;
    }
  }
};

/**
 * Set query programmatically.
 * @param {!string} query
 */
cz.mzk.authorities.template.dialogs.MapDialog.prototype.setSearchQuery = function(query) {
  this.searchElement_.value = query;
  this.searchSubmitElement_.click();
};

/**
 * Get resulted bounding box.
 * @return {?OpenLayers.Bounds}
 */
cz.mzk.authorities.template.dialogs.MapDialog.prototype.getBBox = function() {
  return this.map_.getBBox();
};

/**
 * Retypes string values into their number representation.
 * @private
 * @param {Array.<Array.<string>>} polygon
 * @return {Array.<Array.<number>>}
 */
cz.mzk.authorities.template.dialogs.MapDialog.prototype.retypePolygon_ = function(polygon) {
  var result = [];
  for (var i = 0; i < polygon.length; i++) {
    result.push([parseFloat(polygon[i][0]), parseFloat(polygon[i][1])]);
  }
  return result;
};

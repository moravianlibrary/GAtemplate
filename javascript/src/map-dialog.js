goog.provide('cz.mzk.authorities.template.dialogs.MapDialog');

goog.require('cz.mzk.authorities.template.Map');

goog.require('goog.ui.ac.AutoComplete.EventType');
goog.require('goog.ui.ac.Nominatim');

goog.require('goog.ui.Dialog');
goog.require('goog.ui.Dialog.ButtonSet');
goog.require('goog.ui.Dialog.DefaultButtonKeys');
goog.require('goog.ui.FlatButtonRenderer');
goog.require('goog.ui.ToggleButton');
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
      '</div>' +
      '<div id="mapdialog-leftmenu">' +
      '<form id="mapdialog-search-form">' +
      '<span class="icon-search"></span>' +
      '<input type="text" id="mapdialog-search" autocomplete="off">' +
      '<input type="submit" id="mapdialog-search-submit" value="Hledat">' +
      '</form>' +
      '<div class="heading">Výsledky hledání</div>' +
      '</div>' +
      '<div id="mapdialog-map"></div>' +
      '<div id="loading-overlay"></div>' +
      '<div/>'
  );
  /**
   * @private
   * @type {goog.ui.ToggleButton}
   */
  this.bboxButton_ = this.createCreateBBoxButton_();
  /**
   * @private
   * @type {goog.ui.Button}
   */
  this.fullscreenButton_ = this.createFullscreenButton_();
  /**
   * @type {goog.ui.Dialog.ButtonSet}
   */
  var buttonSet = new goog.ui.Dialog.ButtonSet();
  buttonSet.addButton({caption: 'Uložit výběr', key: goog.ui.Dialog.DefaultButtonKeys.OK}, true);
  buttonSet.addButton({caption: 'Zavřít bez uložení', key: goog.ui.Dialog.DefaultButtonKeys.CANCEL}, false, true);

  this.setButtonSet(buttonSet);
  this.setModal(true);
  this.setDraggable(false);
  this.setVisible(true);
  buttonSet.setButtonEnabled(goog.ui.Dialog.DefaultButtonKeys.OK, false);
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
   * @type {Object}
   */
  this.jsonpRequest_ = null;
  /**
   * @private
   * @type {goog.net.Jsonp}
   */
  this.loadMoreResultsAjax_ = null;
  /**
   * @private
   * @type {Array.<String>}
   */
  this.excludePlaceIDs_ = [];
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
  this.menu_.render(domHelper.getElement('mapdialog-leftmenu'));
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
        'polygon_geojson' : '1',
        'format' : 'json'
      },
      function(data) {
        this_.menu_.removeChildren(true);
        for (var i = 0; i < data.length; i++) {
          goog.asserts.assertString(data[i]['display_name']);
          goog.asserts.assertString(data[i]['place_id']);
          this_.excludePlaceIDs_.push(data[i]['place_id']);
          var item = new goog.ui.MenuItem(data[i]['display_name']);
          item['authority'] = new cz.mzk.authorities.template.Authority({
              nominatimSouth: parseFloat(data[i]['boundingbox'][0]),
              nominatimNorth: parseFloat(data[i]['boundingbox'][1]),
              nominatimWest: parseFloat(data[i]['boundingbox'][2]),
              nominatimEast: parseFloat(data[i]['boundingbox'][3])
          });
          if (data[i]['geojson']) {
            item['authority'].setNominatimPolygon(data[i]['geojson']);
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
  goog.events.listen(this.menu_.getContentElement(), 'scroll', function(e) {
    if (this.offsetHeight + this.scrollTop >= this.scrollHeight * 7 / 8) {
  		this_.loadMoreResults_();
    }
    return false;
  });
  goog.events.listen(this.bboxButton_, goog.ui.Component.EventType.ACTION, function(e) {
    this_.map_.setActivateCreateBBox(this.isChecked());
  });
  goog.events.listen(this.fullscreenButton_, goog.ui.Component.EventType.ACTION, function(e) {
    var elem = this_.getDialogElement();
    if (!document.fullscreenElement &&    // alternative standard method
        !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {
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
    }

  });
  goog.events.listen(this.map_, 'bboxadded', function(e) {
    buttonSet.setButtonEnabled(goog.ui.Dialog.DefaultButtonKeys.OK, true);
  });
  goog.events.listen(this.map_, 'sketchcomplete', function(e) {
    this_.bboxButton_.setChecked(false);
  })
  this.setVisible(false);
};

goog.inherits(cz.mzk.authorities.template.dialogs.MapDialog, goog.ui.Dialog);

/**
 * @override
 */
 cz.mzk.authorities.template.dialogs.MapDialog.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.bboxButton_.render(goog.dom.getElement('mapdialog-topmenu'));
  this.fullscreenButton_.render(this.getDialogElement());
};

/**
 * @override
 */
cz.mzk.authorities.template.dialogs.MapDialog.prototype.setVisible = function(value) {
  goog.base(this, 'setVisible', value);
  if (value && this.map_) {
    this.map_.updateSize();
    this.searchElement_.focus();
  } else {
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

cz.mzk.authorities.template.dialogs.MapDialog.prototype.clear = function() {
  this.searchElement_.value = '';
  this.menu_.removeChildren(true);
  this.map_.clear();
}

/**
 * Load more results
 */
cz.mzk.authorities.template.dialogs.MapDialog.prototype.loadMoreResults_ = function() {
  if (this.loadMoreResultsAjax_) {
    return;
  }
  var this_ = this;
  this.loadMoreResultsAjax_ = new goog.net.Jsonp('http://nominatim.mzk.cz', 'json_callback');
  this.loadMoreResultsAjax_.send(
    {
      'q' : this_.searchElement_.value,
      'polygon_geojson' : '1',
      'format' : 'json',
      'exclude_place_ids': this.excludePlaceIDs_.join()
    },
    function(data) {
      for (var i = 0; i < data.length; i++) {
        goog.asserts.assertString(data[i]['display_name']);
        goog.asserts.assertString(data[i]['place_id']);
        this_.excludePlaceIDs_.push(data[i]['place_id']);
        var item = new goog.ui.MenuItem(data[i]['display_name']);
        item['authority'] = new cz.mzk.authorities.template.Authority({
            nominatimSouth: parseFloat(data[i]['boundingbox'][0]),
            nominatimNorth: parseFloat(data[i]['boundingbox'][1]),
            nominatimWest: parseFloat(data[i]['boundingbox'][2]),
            nominatimEast: parseFloat(data[i]['boundingbox'][3])
        });
        if (data[i]['geojson']) {
          item['authority'].setNominatimPolygon(data[i]['geojson']);
        }
        goog.events.listen(item, goog.ui.Component.EventType.ACTION, function(e) {
          this_.map_.showAuthority(e.target['authority']);
        });
        this_.menu_.addChild(item, true);
      }
      this_.loadMoreResultsAjax_ = null;
    },
    function(error) {
      this_.loadMoreResultsAjax_ = null;
    }
  );

}

/**
 * Creates CreateBBoxButton
 * @return {goog.ui.ToggleButton}
 */
cz.mzk.authorities.template.dialogs.MapDialog.prototype.createCreateBBoxButton_ = function() {
  var content = goog.dom.createElement('div');
  var img = goog.dom.createDom('img', {'src': '/img/createbbox.png'});
  var span = goog.dom.createDom('span', {}, 'Označit oblast výběrem');
  goog.dom.appendChild(content, img);
  goog.dom.appendChild(content, span);
  /** @type {goog.ui.FlatButtonRenderer} */
  var renderer = /** @type {goog.ui.FlatButtonRenderer} */ (goog.ui.ControlRenderer.getCustomRenderer(
    goog.ui.FlatButtonRenderer, 'goog-image-button'));

  renderer.createDom = function(button) {
    var classNames = this.getClassNames(button);
	  var attributes = {
	    'class': goog.ui.INLINE_BLOCK_CLASSNAME + ' ' + classNames.join(' '),
      'id': 'dialog-createbbox-button'
	  };
	  var element = button.getDomHelper().createDom(
	      goog.dom.TagName.DIV, attributes, button.getContent());
	  this.setTooltip(element, button.getTooltip());
	  return element;
  }

  var button = new goog.ui.ToggleButton(content, renderer);
  return button;
}

/**
 * Creates FulscreenButton
 * @return {goog.ui.Button}
 */
cz.mzk.authorities.template.dialogs.MapDialog.prototype.createFullscreenButton_ = function() {
  var content = goog.dom.createElement('div');
  var img = goog.dom.createDom('span', {'class': 'icon-arrows-alt'});
  goog.dom.appendChild(content, img);
  /** @type {goog.ui.FlatButtonRenderer} */
  var renderer = /** @type {goog.ui.FlatButtonRenderer} */ (goog.ui.ControlRenderer.getCustomRenderer(
    goog.ui.FlatButtonRenderer, 'goog-image-button'));

  renderer.createDom = function(button) {
    var classNames = this.getClassNames(button);
	  var attributes = {
	    'class': goog.ui.INLINE_BLOCK_CLASSNAME + ' ' + classNames.join(' '),
      'id': 'dialog-fulscreen-button'
	  };
	  var element = button.getDomHelper().createDom(
	      goog.dom.TagName.DIV, attributes, button.getContent());
	  this.setTooltip(element, button.getTooltip());
	  return element;
  }

  var button = new goog.ui.Button(content, renderer);
  return button;
}

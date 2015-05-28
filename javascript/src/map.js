goog.provide('cz.mzk.authorities.template.Map');

goog.require('cz.mzk.authorities.template.Authority');
goog.require('goog.asserts');
goog.require('goog.events.EventTarget');

/**
 * Manages OpenLayers Map.
 * @param {Element} element The element under which the Map should be added.
 * @constructor
 * @extends {goog.events.EventTarget}
 */
cz.mzk.authorities.template.Map = function(element) {
  goog.events.EventTarget.call(this);
  /** @type {cz.mzk.authorities.template.Map} */
  var this_ = this;
  /**
   * @private
   * @type {!OpenLayers.Layer.Vector}
   */
  this.nominatimLayer_ = new OpenLayers.Layer.Vector(
      'nominatim-layer',
      {
        styleMap: new OpenLayers.StyleMap({
          fillColor: '#ffffff',
          fillOpacity: 0.3,
          strokeColor: '#002EB8',
          strokeWidth: 2,
          // Default options
          cursor: 'inherit',
          fontColor: '000000',
          hoverFillColor: 'white',
          hoverFillOpacity: 0.8,
          hoverPointRadius: 1,
          hoverPointUnit: '%',
          hoverStrokeColor: 'red',
          hoverStrokeOpacity: 1,
          hoverStrokeWidth: 0.2,
          labelAlign: 'cm',
          labelOutlineColor: 'white',
          labelOutlineWidth: 3,
          pointRadius: 6,
          pointerEvents: 'visiblePainted',
          strokeDashStyle: 'solid',
          strokeLinecap: 'round',
          strokeOpacity: 1
        }),
        eventListeners: {
          sketchcomplete: function(feature) {
            this_.nominatimLayer_.setVisibility(true);
            this_.nominatimLayerZoomOut_.setVisibility(false);
            this_.removeModifyInteraction_();
            this.removeAllFeatures();
            this_.addModifyInteraction_();
            this_.createBBoxControl_.deactivate();
            this_.dispatchEvent('sketchcomplete');
            return true;
          },
          featureadded: function(e) {
            var point = e.feature.geometry.getBounds().getCenterLonLat();
            var geom = new OpenLayers.Geometry.Point(point.lon, point.lat);
            var feature = new OpenLayers.Feature.Vector(geom);
            this_.nominatimLayerZoomOut_.removeAllFeatures();
            this_.nominatimLayerZoomOut_.addFeatures([feature]);
            this_.modifyControl_.selectFeature(e.feature);
            this_.dispatchEvent({
              type: "bboxadded"
            });
          }
        }
      }
  );
  /**
   * @private
   * @type {!OpenLayers.Layer.Vector}
   */
  this.nominatimLayerZoomOut_ = new OpenLayers.Layer.Vector(
    'nominatim-layer-zoomout',
    {
      displayInLayerSwitcher: false,
      styleMap: new OpenLayers.StyleMap({
        fillColor: '#002EB8',
        fillOpacity: 1.0,
        strokeColor: '#002EB8',
        strokeWidth: 2,
        // Default options
        cursor: 'inherit',
        fontColor: '000000',
        hoverFillColor: 'white',
        hoverFillOpacity: 0.8,
        hoverPointRadius: 1,
        hoverPointUnit: '%',
        hoverStrokeColor: 'red',
        hoverStrokeOpacity: 1,
        hoverStrokeWidth: 0.2,
        labelAlign: 'cm',
        labelOutlineColor: 'white',
        labelOutlineWidth: 3,
        pointRadius: 6,
        pointerEvents: 'visiblePainted',
        strokeDashStyle: 'solid',
        strokeLinecap: 'round',
        strokeOpacity: 1
      }),
      visibility: false
    }
  );
  this.nominatimLayerOld_ = new OpenLayers.Layer.Vector(
      'nominatim-layer-old',
      {
        styleMap: new OpenLayers.StyleMap({
          fillColor: '#ffffff',
          fillOpacity: 0.3,
          strokeColor: '#8C8C8C',
          strokeWidth: 2,
          // Default options
          cursor: 'inherit',
          fontColor: '000000',
          hoverFillColor: 'white',
          hoverFillOpacity: 0.8,
          hoverPointRadius: 1,
          hoverPointUnit: '%',
          hoverStrokeColor: 'red',
          hoverStrokeOpacity: 1,
          hoverStrokeWidth: 0.2,
          labelAlign: 'cm',
          labelOutlineColor: 'white',
          labelOutlineWidth: 3,
          pointRadius: 6,
          pointerEvents: 'visiblePainted',
          strokeDashStyle: 'solid',
          strokeLinecap: 'round',
          strokeOpacity: 1
        }),
        eventListeners: {
          sketchcomplete: function() {return true},
          featureadded: function(e) {
            var point = e.feature.geometry.getBounds().getCenterLonLat();
            var geom = new OpenLayers.Geometry.Point(point.lon, point.lat);
            var feature = new OpenLayers.Feature.Vector(geom);
            this_.nominatimLayerZoomOutOld_.removeAllFeatures();
            this_.nominatimLayerZoomOutOld_.addFeatures([feature]);
          }
        }
      }
  );
  /**
   * @private
   * @type {!OpenLayers.Layer.Vector}
   */
  this.nominatimLayerZoomOutOld_ = new OpenLayers.Layer.Vector(
    'nominatim-layer-zoomout-old',
    {
      displayInLayerSwitcher: false,
      styleMap: new OpenLayers.StyleMap({
        fillColor: '#8C8C8C',
        fillOpacity: 1.0,
        strokeColor: '#8C8C8C',
        strokeWidth: 2,
        // Default options
        cursor: 'inherit',
        fontColor: '000000',
        hoverFillColor: 'white',
        hoverFillOpacity: 0.8,
        hoverPointRadius: 1,
        hoverPointUnit: '%',
        hoverStrokeColor: 'red',
        hoverStrokeOpacity: 1,
        hoverStrokeWidth: 0.2,
        labelAlign: 'cm',
        labelOutlineColor: 'white',
        labelOutlineWidth: 3,
        pointRadius: 6,
        pointerEvents: 'visiblePainted',
        strokeDashStyle: 'solid',
        strokeLinecap: 'round',
        strokeOpacity: 1
      }),
      visibility: false
    }
  );
  /**
   * @private
   * @type {!OpenLayers.Layer.Vector}
   */
  this.polygonLayer_ = new OpenLayers.Layer.Vector(
      'polygon-layer',
      {
        styleMap: new OpenLayers.StyleMap({
          fillColor: '#FFCC33',
          fillOpacity: 0.3,
          strokeColor: '#FFCC33',
          strokeWidth: 2
        }),
        preFeatureInsert: function(feature) {
          window.console.log('preFeatureInsert');
          return feature.geometry.transform(
            this_.gpsProjection_,
            this_.mapProjection_
          );
        }
      }
  );
  /**
   * @private
   * @type {!OpenLayers.Map}
   */
  this.map_ = new OpenLayers.Map({
    div: element,
    projection: 'EPSG:900913',
    layers: [
      new OpenLayers.Layer.OSM('MapQuest',[
        'http://otile1.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.png',
        'http://otile2.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.png',
        'http://otile3.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.png',
        'http://otile4.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.png'
      ]),
      this.polygonLayer_,
      this.nominatimLayerOld_,
      this.nominatimLayer_,
      this.nominatimLayerZoomOut_,
      this.nominatimLayerZoomOutOld_
    ],
    eventListeners: {
      /** @type {function(this:OpenLayers.Map)}*/
      'zoomend': function() {
        this_.swapNominatimLayers_(this_.nominatimLayer_, this_.nominatimLayerZoomOut_);
        this_.swapNominatimLayers_(this_.nominatimLayerOld_, this_.nominatimLayerZoomOutOld_);
      }
    },
    center: [0, 0],
    zoom: 1
  });
  this.map_.zoomToMaxExtent();
  /**
   * @private
   * @type {!OpenLayers.Projection}
   */
  this.gpsProjection_ = new OpenLayers.Projection('EPSG:4326');
  /**
   * @private
   * @type {!OpenLayers.Projection}
   */
  this.mapProjection_ = new OpenLayers.Projection('EPSG:900913');
  /**
   * @private
   * @type {!OpenLayers.Control.ModifyRectangle}
   */
  this.modifyControl_ = new OpenLayers.Control.ModifyRectangle(
    this.nominatimLayer_,
    {
      standalone: true,
      clickout: false
    }
  );
  /**
   * @private
   * @type {!OpenLayers.Control.DrawFeature}
   */
  this.createBBoxControl_ = new OpenLayers.Control.DrawFeature(
      this.nominatimLayer_,
      OpenLayers.Handler.RegularPolygon,
      {
          handlerOptions: {
              sides: 4,
              irregular: true
          },
          type: OpenLayers.Control.TYPE_TOGGLE,
          buttonClass: 'create-bbox',
          buttonText: '&#x25a1;'
      }
  );
  /**
   * @private
   * @type {!OpenLayers.Control.Panel}
   */
  this.panelControl_ = new OpenLayers.Control.Panel({
    createControlMarkup: function(control) {
      var element = document.createElement('div');
      element.className = control.buttonClass;
      var content = document.createElement('div');
      content.innerHTML = control.buttonText;
      content.className = control.buttonClass + '-content';
      element.appendChild(content);
      return element;
    },
    autoActivate: true
  });
  this.panelControl_.addControls([this.createBBoxControl_]);
  this.map_.addControl(this.modifyControl_);
  this.map_.addControl(this.createBBoxControl_);
  this.map_.addControl(this.panelControl_);
};
goog.inherits(cz.mzk.authorities.template.Map, goog.events.EventTarget);

cz.mzk.authorities.template.Map.prototype.updateSize = function() {
  this.map_.updateSize();
};

/**
 * Shows Authority on the map.
 * @param {cz.mzk.authorities.template.Authority} authority
 */
cz.mzk.authorities.template.Map.prototype.showAuthority = function(authority) {
  this.nominatimLayerOld_.removeAllFeatures();
  var oldFeature = this.nominatimLayer_.getFeatureByFid('feature');
  if (oldFeature) {
    this.nominatimLayerOld_.addFeatures([oldFeature]);
  }
  this.clearInternal_();
  this.drawNominatim_(authority);
  this.drawNominatimPolygon_(authority);
  this.addModifyInteraction_();
  this.move_(authority);
  this.swapNominatimLayers_(this.nominatimLayer_, this.nominatimLayerZoomOut_);
  this.swapNominatimLayers_(this.nominatimLayerOld_, this.nominatimLayerZoomOutOld_);
};

/**
 * Returns bounding box from nominatim layer.
 * @return {?OpenLayers.Bounds}
 */
cz.mzk.authorities.template.Map.prototype.getBBox = function() {
  /** @type {?OpenLayers.Bounds} */
  var bbox = this.nominatimLayer_.getDataExtent();
  if (bbox) {
    bbox.transform(this.mapProjection_, this.gpsProjection_);
  }
  return bbox;
};

/**
 * Activates or deactivates CreateBBox control.
 * @param {boolean} activate
 */
cz.mzk.authorities.template.Map.prototype.setActivateCreateBBox =
    function(activate) {
  if (activate) {
    this.createBBoxControl_.activate();
  } else {
    this.createBBoxControl_.deactivate();
  }
}

/**
 * Clear the map.
 */
cz.mzk.authorities.template.Map.prototype.clear = function() {
  this.clearInternal_();
  this.nominatimLayerOld_.removeAllFeatures();
};

/**
 * Clear the map.
 */
cz.mzk.authorities.template.Map.prototype.clearInternal_ = function() {
  this.removeModifyInteraction_();
  this.nominatimLayer_.removeAllFeatures();
  this.nominatimLayerZoomOut_.removeAllFeatures();
  this.polygonLayer_.removeAllFeatures();
};


/**
 * Draw nominatim bounding box or point on the map.
 * @param {cz.mzk.authorities.template.Authority} authority
 */
cz.mzk.authorities.template.Map.prototype.drawNominatim_ = function(authority) {
  if (authority.hasNominatimCoors()) {
    if (authority.getNominatimWest() == authority.getNominatimEast() && authority.getNominatimNorth() == authority.getNominatimSouth()) {
      this.drawPoint_([authority.getNominatimWest(), authority.getNominatimNorth()], this.nominatimLayer_);
    } else {
      this.drawPolygon_(
        [
          [authority.getNominatimWest(), authority.getNominatimNorth()],
          [authority.getNominatimEast(), authority.getNominatimNorth()],
          [authority.getNominatimEast(), authority.getNominatimSouth()],
          [authority.getNominatimWest(), authority.getNominatimSouth()],
          [authority.getNominatimWest(), authority.getNominatimNorth()]
        ],
        this.nominatimLayer_
      );
    }
  }
};

/**
 * Draw polygon boundaries of authority found by Nominatim.
 * @param {cz.mzk.authorities.template.Authority} authority
 */
cz.mzk.authorities.template.Map.prototype.drawNominatimPolygon_ = function(authority) {
  if (authority.hasNominatimPolygon()) {
    this.drawGeoJSON_(
      authority.getNominatimPolygon(),
      this.polygonLayer_
    );
  }
};

/**
 * Move the map to the center of the bounding box of authority.
 * @param {cz.mzk.authorities.template.Authority} authority
 */
cz.mzk.authorities.template.Map.prototype.move_ = function(authority) {
  if (authority.hasNominatimCoors()) {
    var nominatimWest = authority.getNominatimWest();
    var nominatimEast = authority.getNominatimEast();
    var nominatimNorth = authority.getNominatimNorth();
    var nominatimSouth = authority.getNominatimSouth();
    goog.asserts.assert(nominatimWest != null);
    goog.asserts.assert(nominatimEast != null);
    goog.asserts.assert(nominatimNorth != null);
    goog.asserts.assert(nominatimSouth != null);
    var bounds = new OpenLayers.Bounds();
    var westNorth = new OpenLayers.LonLat(nominatimWest, nominatimNorth).transform(this.gpsProjection_, this.mapProjection_);
    var eastNorth = new OpenLayers.LonLat(nominatimEast, nominatimNorth).transform(this.gpsProjection_, this.mapProjection_);
    var eastSouth = new OpenLayers.LonLat(nominatimEast, nominatimSouth).transform(this.gpsProjection_, this.mapProjection_);
    var westSouth = new OpenLayers.LonLat(nominatimWest, nominatimSouth).transform(this.gpsProjection_, this.mapProjection_);

    bounds.extendXY(westNorth.lon, westNorth.lat);
    bounds.extendXY(eastNorth.lon, eastNorth.lat);
    bounds.extendXY(eastSouth.lon, eastSouth.lat);
    bounds.extendXY(westSouth.lon, westSouth.lat);

    goog.array.forEach(this.nominatimLayerOld_.features, function(feature, i, a) {
      bounds.extend(feature.geometry.getBounds());
    });

    this.map_.zoomToExtent(bounds, false);
  }
};

/**
 * Draw point.
 * @param {Array.<number>} coordinates Coordinates in EPSG:4326.
 * @param {OpenLayers.Layer.Vector} layer
 */
cz.mzk.authorities.template.Map.prototype.drawPoint_ = function(coordinates, layer) {
  var coors = new OpenLayers.LonLat(coordinates[0], coordinates[1]).transform(this.gpsProjection_, this.mapProjection_)
  var point = new OpenLayers.Geometry.Point(coors[0], coors[1]);
  var feature = new OpenLayers.Feature.Vector(point);
  feature['fid'] = 'feature';
  layer.addFeatures([feature]);
};

/**
 * Draw polygon.
 * @param {Array.<Array.<number>>} coordinates Coordinates in EPSG:4326.
 * @param {OpenLayers.Layer.Vector} layer
 * @param {boolean=} opt_transformCoors
 */
cz.mzk.authorities.template.Map.prototype.drawPolygon_ = function(coordinates, layer, opt_transformCoors) {
  var transformCoors = goog.isDef(opt_transformCoors) ? opt_transformCoors : true;
  /** @type {Array.<OpenLayers.LonLat>} */
  var coors = [];
  if (transformCoors) {
    for (var i = 0; i < coordinates.length; i++) {
      coors.push(new OpenLayers.LonLat(coordinates[i][0], coordinates[i][1]).transform(this.gpsProjection_, this.mapProjection_));
    }
  } else {
    for (var i = 0; i < coordinates.length; i++) {
      coors.push(new OpenLayers.LonLat(coordinates[i][0], coordinates[i][1]));
    }
  }
  var polygonPoints = [];
  for (var i = 0; i < coors.length; i++) {
    polygonPoints.push(new OpenLayers.Geometry.Point(coors[i].lon, coors[i].lat));
  }
  var polygon = new OpenLayers.Geometry.Polygon([new OpenLayers.Geometry.LinearRing(polygonPoints)]);
  var feature = new OpenLayers.Feature.Vector(polygon);
  feature['fid'] = 'feature';
  layer.addFeatures([feature]);
};

/**
 * Draw GeoJSON.
 * @param {Object} geojson
 * @param {OpenLayers.Layer.Vector} layer
 */
cz.mzk.authorities.template.Map.prototype.drawGeoJSON_ = function(geojson, layer) {
  window.console.log(geojson);
  var geojsonFormat = new OpenLayers.Format.GeoJSON();
  layer.addFeatures(geojsonFormat.read(geojson));
};

/**
 * Removes interaction, which modifies bounding box.
 */
cz.mzk.authorities.template.Map.prototype.removeModifyInteraction_ = function() {
  if (this.modifyControl_.feature) {
    this.modifyControl_.unselectFeature(this.modifyControl_.feature);
  }
  this.modifyControl_.deactivate();
};

/**
 * Add interaction, which modifies bounding box.
 */
cz.mzk.authorities.template.Map.prototype.addModifyInteraction_ = function() {
  this.modifyControl_.activate();
};

/**
 * Swaps nominatimLayerZoomOut and nominatimLayer if it is necessary.
 * @param {OpenLayers.Layer.Vector} layer
 * @param {OpenLayers.Layer.Vector} zoomout
 */
cz.mzk.authorities.template.Map.prototype.swapNominatimLayers_ = function(layer, zoomout) {
  if (!this.map_) {
    return;
  }
  var mapExtent = this.map_.getExtent();
  var bboxExtent = layer.getDataExtent();
  if (!bboxExtent) {
    return;
  }
  var bboxArea = bboxExtent.getWidth() * bboxExtent.getHeight();
  var mapArea = mapExtent.getWidth() * mapExtent.getHeight();
  var ratio = bboxArea / mapArea;
  if (ratio < 0.0009) {
    layer.setVisibility(false);
    zoomout.setVisibility(true);
  } else {
    layer.setVisibility(true);
    zoomout.setVisibility(false);
  }
};

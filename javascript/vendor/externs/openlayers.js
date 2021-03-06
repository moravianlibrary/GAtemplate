var OpenLayers = {}

/**
 * @constructor
 * @param {{div: (Element|string),
 *          projection: string,
 *          layers: Array.<OpenLayers.Layer>,
 *          center: Array.<number>,
 *          zoom: number}=} options
 */
OpenLayers.Map = function(options) {}

/**
 * @param {(OpenLayers.Bounds|Array.<number>)} bounds
 * @param {boolean=} closest
 */
OpenLayers.Map.prototype.zoomToExtent = function(bounds, closest) {}

/**
 * @param {Object=} options
 */
OpenLayers.Map.prototype.zoomToMaxExtent = function(options) {}

/**
 * @return {OpenLayers.Bounds}
 */
OpenLayers.Map.prototype.getExtent = function() {}

/**
 * @param {OpenLayers.Control} control
 */
OpenLayers.Map.prototype.addControl = function(control) {}

OpenLayers.Map.prototype.updateSize = function() {}

/**
 * @constructor
 * @param {string} name
 * @param {Object=} options
 */
OpenLayers.Layer = function(name, options) {}

/**
 * @param {boolean} visibility
 */
OpenLayers.Layer.prototype.setVisibility = function(visibility) {}

/**
 * @constructor
 * @param {string} name
 * @param {{displayInLayerSwitcher: (boolean|undefined),
 *          styleMap: OpenLayers.StyleMap,
 *          eventListeners: ({sketchcomplete: function(this:OpenLayers.Layer.Vector,OpenLayers.Feature.Vector):boolean,
 *                            featureadded: function(this:OpenLayers.Layer.Vector,{feature: OpenLayers.Feature.Vector})}|undefined),
 *          preFeatureInsert: (function(OpenLayers.Feature.Vector)|undefined)}=} options
 * @extends {OpenLayers.Layer}
 */
OpenLayers.Layer.Vector = function(name, options) {}

/**
 * @type {Array.<OpenLayers.Feature>}
 */
OpenLayers.Layer.Vector.prototype.features;

/**
 * @type {OpenLayers.Geometry}
 */
OpenLayers.Feature.Vector.prototype.geometry;

/**
 * @param {Array.<OpenLayers.Feature.Vector>} features
 * @param {Object=} options
 */
OpenLayers.Layer.Vector.prototype.addFeatures = function(features, options) {}

/**
 * @param {Object=} options
 */
OpenLayers.Layer.Vector.prototype.removeAllFeatures = function(options) {}

/**
 * @return {?OpenLayers.Bounds}
 */
OpenLayers.Layer.Vector.prototype.getDataExtent = function() {}

/**
 * @param {string} fid
 */
OpenLayers.Layer.Vector.prototype.getFeatureByFid = function(fid) {}

/**
 * @constructor
 * @param {string} name
 * @param {Array.<string>} url
 * @param {Object=} options
 * @extends {OpenLayers.Layer}
 */
OpenLayers.Layer.OSM = function(name, url, options) {}

/**
 * @constructor
 * @param {number=} left
 * @param {number=} bottom
 * @param {number=} right
 * @param {number=} top
 */
OpenLayers.Bounds = function(left, bottom, right, top) {}

/**
 * @param {number} x
 * @param {number} y
 */
OpenLayers.Bounds.prototype.extendXY = function(x, y) {}

/**
 * @param {OpenLayers.Bounds} bounds
 */
OpenLayers.Bounds.prototype.extend = function(bounds) {}

/**
 * @return {Array.<number>}
 */
OpenLayers.Bounds.prototype.toArray = function() {}

/**
 * @param {OpenLayers.Projection} source
 * @param {OpenLayers.Projection} dest
 * @return {OpenLayers.Bounds}
 */
OpenLayers.Bounds.prototype.transform = function(source, dest) {}

/**
 * @return {!number}
 */
OpenLayers.Bounds.prototype.getWidth = function() {}

/**
 * @return {!number}
 */
OpenLayers.Bounds.prototype.getHeight = function() {}

/**
 * @return {OpenLayers.LonLat}
 */
OpenLayers.Bounds.prototype.getCenterLonLat = function() {}

/**
 * @constructor
 * @param {Object=} style
 * @param {{fillColor: string,
 *          fillOpacity: number,
 *          strokeColor: string,
 *          strokeWidth: number,
 *          cursor: string,
 *          fontColor: string,
 *          hoverFillColor: string,
 *          hoverFillOpacity: number,
 *          hoverPointRadius: number,
 *          hoverPointUnit: string,
 *          hoverStrokeColor: string,
 *          hoverStrokeOpacity: number,
 *          hoverStrokeWidth: number,
 *          labelAlign: string,
 *          labelOutlineColor: string,
 *          labelOutlineWidth: number,
 *          pointRadius: number,
 *          pointerEvents: string,
 *          strokeDashStyle: string,
 *          strokeLinecap: string,
 *          strokeOpacity: number}=} options
 */
OpenLayers.StyleMap = function(style, options) {}

/**
 * @constructor
 * @param {string} projCode
 * @param {Object=} options
 */
OpenLayers.Projection = function(projCode, options) {}

/**
 * @constructor
 * @param {Object=} options
 */
OpenLayers.Control = function(options) {}

/**
 * @return {boolean}
 */
OpenLayers.Control.prototype.activate = function() {}

/**
 * @return {boolean}
 */
OpenLayers.Control.prototype.deactivate = function() {}

/**
 * @constructor
 * @param {OpenLayers.Layer.Vector} layer
 * @param {{clickout: boolean, standalone: boolean}=} options
 * @extends {OpenLayers.Control}
 */
OpenLayers.Control.ModifyRectangle = function(layer, options) {}

/**
 * @type {OpenLayers.Feature.Vector}
 */
OpenLayers.Control.ModifyRectangle.prototype.feature;

/**
 * @param {OpenLayers.Feature.Vector} feature
 */
OpenLayers.Control.ModifyRectangle.prototype.selectFeature = function(feature) {}

/**
 * @param {OpenLayers.Feature.Vector} feature
 */
OpenLayers.Control.ModifyRectangle.prototype.unselectFeature = function(feature) {}

/**
 * @constructor
 * @param {OpenLayers.Layer.Vector} layer
 * @param {(OpenLayers.Handler|Object)} handler
 * @param {{handlerOptions: {sides: number, irregular: boolean},
 *          type: number,
 *          buttonClass: string,
 *          buttonText: string}=} options
 * @extends {OpenLayers.Control}
 */
OpenLayers.Control.DrawFeature = function(layer, handler, options) {}

/**
 * @constructor
 * @param {{createControlMarkup: function(OpenLayers.Control):Element,
 *          autoActivate: boolean}=} options
 * @extends {OpenLayers.Control}
 */
OpenLayers.Control.Panel = function(options) {}

/**
 * @param {Array.<OpenLayers.Control>} controls
 */
OpenLayers.Control.Panel.prototype.addControls = function(controls) {}

/**
 * @const
 * @type {number}
 */
OpenLayers.Control.TYPE_BUTTON = 1;
/**
 * @const
 * @type {number}
 */
OpenLayers.Control.TYPE_TOGGLE = 2;
/**
 * @const
 * @type {number}
 */
OpenLayers.Control.TYPE_TOOL   = 3;

/**
 * @constructor
 * @param {OpenLayers.Layer} layer
 * @param {OpenLayers.LonLat} lonlat
 * @param {Object} data
 */
OpenLayers.Feature = function(layer, lonlat, data) {}

/**
 * @constructor
 * @param {OpenLayers.Geometry} geometry
 * @param {Object=} attributes
 * @param {Object=} style
 * @extends {OpenLayers.Feature}
 */
OpenLayers.Feature.Vector = function(geometry, attributes, style) {}

/**
 * @constructor
 * @param {number} lon
 * @param {number} lat
 */
OpenLayers.LonLat = function(lon, lat) {}

/**
 * @type {number}
 */
OpenLayers.LonLat.prototype.lon;

/**
 * @type {number}
 */
OpenLayers.LonLat.prototype.lat;

/**
 * @param {OpenLayers.Projection} source
 * @param {OpenLayers.Projection} dest
 * @return {OpenLayers.LonLat}
 */
OpenLayers.LonLat.prototype.transform = function(source, dest) {}

/**
 * @constructor
 */
OpenLayers.Geometry = function() {}

/**
 * @return {OpenLayers.Bounds}
 */
OpenLayers.Geometry.prototype.getBounds = function() {}

/**
 * @constructor
 * @param {number} x
 * @param {number} y
 * @extends {OpenLayers.Geometry}
 */
OpenLayers.Geometry.Point = function(x, y) {}

/**
 * @constructor
 * @param {Array.<OpenLayers.Geometry.Point>} points
 * @extends {OpenLayers.Geometry}
 */
OpenLayers.Geometry.LinearRing = function(points) {}

/**
 * @constructor
 * @param {Array.<OpenLayers.Geometry.LinearRing>} components
 * @extends {OpenLayers.Geometry}
 */
OpenLayers.Geometry.Polygon = function(components) {}

/**
 * @constructor
 * @param {OpenLayers.Control} control
 * @param {Object} callbacks
 * @param {Object=} options
 */
OpenLayers.Handler = function(control, callbacks, options) {}

/**
 * @constructor
 * @param {OpenLayers.Control} control
 * @param {Object} callbacks
 * @param {Object=} options
 * @extends {OpenLayers.Handler}
 */
OpenLayers.Handler.RegularPolygon = function(control, callbacks, options) {}

/**
 * @constructor
 */
OpenLayers.Format.GeoJSON = function() {}

/**
 * @param {Object} geojson
 * @return {Array.<OpenLayers.Feature.Vector>}
 */
OpenLayers.Format.GeoJSON.prototype.read = function(geojson) {}

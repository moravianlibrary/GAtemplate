goog.provide('cz.mzk.authorities.template.Authority');
goog.require('goog.debug.LogManager');

/**
 * @typedef {{nominatimWest: (number|undefined),
 *          nominatimEast: (number|undefined),
 *          nominatimNorth: (number|undefined),
 *          nominatimSouth: (number|undefined),
 *          nominatimPolygon: (Array.<Array.<number>>|undefined)}}
 */
cz.mzk.authorities.template.AuthorityOptions;

/**
 * Class representing geographic authority.
 * @constructor
 * @param {cz.mzk.authorities.template.AuthorityOptions=} opt_options
 */
cz.mzk.authorities.template.Authority = function(opt_options) {
  /** @type {cz.mzk.authorities.template.AuthorityOptions} */
  var options = goog.isDef(opt_options) ? opt_options : /** @type {cz.mzk.authorities.template.AuthorityOptions} */ ({});
  /**
   * @private
   * @type {?number}
   */
  this.nominatimWest_ = options.nominatimWest || null;
  /**
   * @private
   * @type {?number}
   */
  this.nominatimEast_ = options.nominatimEast || null;
  /**
   * @private
   * @type {?number}
   */
  this.nominatimNorth_ = options.nominatimNorth || null;
  /**
   * @private
   * @type {?number}
   */
  this.nominatimSouth_ = options.nominatimSouth || null;
  /**
   * @private
   * @type {?Object}
   */
  this.nominatimPolygon_ = options.nominatimPolygon || null;
}

/**
 * Getter method for nominatimWest.
 * @return {?number}
 */
cz.mzk.authorities.template.Authority.prototype.getNominatimWest = function() {
  return this.nominatimWest_;
}

/**
 * Setter method for nominatimWest.
 * @param {?number} value
 */
cz.mzk.authorities.template.Authority.prototype.setNominatimWest = function(value) {
  this.nominatimWest_ = value;
}

/**
 * Getter method for nominatimEast.
 * @return {?number}
 */
cz.mzk.authorities.template.Authority.prototype.getNominatimEast = function() {
  return this.nominatimEast_;
}

/**
 * Setter method for nominatimEast.
 * @param {?number} value
 */
cz.mzk.authorities.template.Authority.prototype.setNominatimEast = function(value) {
  this.nominatimEast_ = value;
}

/**
 * Getter method for nominatimNorth.
 * @return {?number}
 */
cz.mzk.authorities.template.Authority.prototype.getNominatimNorth = function() {
  return this.nominatimNorth_;
}

/**
 * Setter method for nominatimNorth.
 * @param {?number} value
 */
cz.mzk.authorities.template.Authority.prototype.setNominatimNorth = function(value) {
  this.nominatimNorth_ = value;
}

/**
 * Getter method for nominatimSouth.
 * @return {?number}
 */
cz.mzk.authorities.template.Authority.prototype.getNominatimSouth = function() {
  return this.nominatimSouth_;
}

/**
 * Setter method for nominatimSouth.
 * @param {?number} value
 */
cz.mzk.authorities.template.Authority.prototype.setNominatimSouth = function(value) {
  this.nominatimSouth_ = value;
}

/**
 * Getter method for nominatimPolygon.
 * @return {?Object}
 */
cz.mzk.authorities.template.Authority.prototype.getNominatimPolygon = function() {
  return this.nominatimPolygon_;
}

/**
 * Setter method for nominatimPolygon.
 * @param {?Object} value
 */
cz.mzk.authorities.template.Authority.prototype.setNominatimPolygon = function(value) {
  this.nominatimPolygon_ = value;
}

/**
 * Returns if authority has set nominatim coordinates.
 * @return {boolean}
 */
cz.mzk.authorities.template.Authority.prototype.hasNominatimCoors = function() {
  return this.nominatimWest_ != null && this.nominatimEast_ != null
      && this.nominatimNorth_ != null && this.nominatimSouth_ != null;
}

/**
 * Returns if authority has set nominatim polygon.
 * @return {boolean}
 */
cz.mzk.authorities.template.Authority.prototype.hasNominatimPolygon = function() {
  return this.nominatimPolygon_ != null;
}

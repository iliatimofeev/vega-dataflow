import Transform from '../Transform';
import {inherits} from '../util/Functions';

/**
 * Geo-code a longitude/latitude point to an x/y coordinate.
 * @constructor
 * @param {object} params - The parameters for this operator.
 * @param {function(number, number): *} params.projection - The cartographic
 *   projection to apply.
 * @param {Array<function(object): *>} params.fields - A two-element array of
 *   field accessors for the longitude and latitude values.
 * @param {Array<string>} [params.as] - A two-element array of field names
 *   under which to store the result. Defaults to ['x','y'].
 */
export default function GeoPoint(params) {
  Transform.call(this, null, params);
}

var prototype = inherits(GeoPoint, Transform);

prototype.transform = function(_, pulse) {
  var proj = _.projection,
      lon = _.fields[0],
      lat = _.fields[1],
      as = _.as || ['x', 'y'],
      x = as[0],
      y = as[1],
      mod;

  function set(t) {
    var xy = proj([lon(t), lat(t)]);
    t[x] = xy[0];
    t[y] = xy[1];
  }

  if (_.modified()) {
    // parameters updated, reflow
    pulse.materialize().reflow().visit(pulse.SOURCE, set);
  } else {
    mod = pulse.modified(lon.fields) || pulse.modified(lat.fields);
    pulse.visit(mod ? pulse.ADD_MOD : pulse.ADD, set);
  }

  return pulse.modifies(as);
};

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var keys = Object.keys,
    assign = Object.assign;
var isArray = Array.isArray;

// Inlined the `defaultsDeep` function since it's so small and to avoid direct
// dependencies.

var defaultsDeep = function defaultsDeep() {
  for (var _len = arguments.length, merge = Array(_len), _key = 0; _key < _len; _key++) {
    merge[_key] = arguments[_key];
  }

  return merge.slice(1).reduce(function (merged, props) {
    props = props && (typeof props === 'undefined' ? 'undefined' : _typeof(props)) === 'object' ? props : {};

    keys(props).forEach(function (propName) {
      if (isArray(merged[propName])) {
        merged[propName] = defaultsDeep([], merged[propName], props[propName]);
      } else if (_typeof(merged[propName]) === 'object') {
        merged[propName] = defaultsDeep({}, merged[propName], props[propName]);
      } else if (!(propName in merged)) {
        merged[propName] = props[propName];
      }
    });

    return merged;
  }, merge[0] || {});
};

// These props will never change since it's the name of the module.
var hardcoded = ['hooks', 'theme', 'refs'];

// Main HTR function that processes the keys to deep default.
var htr = function htr(instance) {
  var localKeys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var constructor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : instance.constructor;

  var propKeys = new Set([].concat(hardcoded, _toConsumableArray(htr.props), _toConsumableArray(localKeys)));
  var _constructor$defaultP = constructor.defaultProps,
      defaultProps = _constructor$defaultP === undefined ? {} : _constructor$defaultP;

  var props = assign({}, instance.props);

  propKeys.forEach(function (key) {
    var value = defaultProps[key];

    if (value) {
      props[key] = defaultsDeep({}, props[key], value);
    }
  });

  return props;
};

// Allow for: const { htr, defaultsDeep } = require('htr');
htr.htr = htr;
htr.defaultsDeep = defaultsDeep;

// This Set allows customizing the props that htr seeks for.
htr.props = new Set();

module.exports = htr;

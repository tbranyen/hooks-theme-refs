'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var defaultsDeep = function defaultsDeep() {
  for (var _len = arguments.length, merge = Array(_len), _key = 0; _key < _len; _key++) {
    merge[_key] = arguments[_key];
  }

  return merge.slice(1).reduce(function (merged, props) {
    props = props && (typeof props === 'undefined' ? 'undefined' : _typeof(props)) === 'object' ? props : {};

    Object.keys(props).forEach(function (propName) {
      if (Array.isArray(merged[propName])) {
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

module.exports = function (instance) {
  var constructor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : instance.constructor;
  var _constructor$defaultP = constructor.defaultProps,
      hooks = _constructor$defaultP.hooks,
      theme = _constructor$defaultP.theme,
      refs = _constructor$defaultP.refs;

  var props = Object.assign({}, instance.props);

  if (hooks) {
    props.hooks = defaultsDeep(props.hooks, hooks);
  }

  if (theme) {
    props.theme = defaultsDeep(props.theme, theme);
  }

  if (refs) {
    props.refs = defaultsDeep(props.refs, refs);
  }

  return props;
};

// Allow for: const { htr, defaultsDeep } = require('htr');
module.exports.htr = module.exports;
module.exports.defaultsDeep = defaultsDeep;

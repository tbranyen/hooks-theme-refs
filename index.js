const { keys, assign } = Object;
const { isArray } = Array;

// Inlined the `defaultsDeep` function since it's so small and to avoid direct
// dependencies.
const defaultsDeep = (...merge) => merge.slice(1).reduce((merged, props) => {
  props = (props && typeof props === 'object') ? props : {};

  keys(props).forEach(propName => {
    if (isArray(merged[propName])) {
      merged[propName] = defaultsDeep([], merged[propName], props[propName]);
    }
    else if (typeof merged[propName] === 'object') {
      merged[propName] = defaultsDeep({}, merged[propName], props[propName]);
    }
    else if (!(propName in merged)) {
      merged[propName] = props[propName];
    }
  });

  return merged;
}, merge[0] || {});

// These props will never change since it's the name of the module.
const hardcoded = ['hooks', 'theme', 'refs'];

// Main HTR function that processes the keys to deep default.
const htr = (instance, localKeys = [], constructor = instance.constructor) => {
  const propKeys = new Set([...hardcoded, ...htr.props, ...localKeys]);
  const { defaultProps = {} } = constructor;
  const props = assign({}, instance.props);

  propKeys.forEach(key => {
    const value = defaultProps[key];

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

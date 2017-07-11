const defaultsDeep = (...merge) => merge.slice(1).reduce((merged, props) => {
  props = (props && typeof props === 'object') ? props : {};

  Object.keys(props).forEach(propName => {
    if (Array.isArray(merged[propName])) {
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

module.exports = (instance, constructor=instance.constructor) => {
  const { hooks, theme, refs, options } = (constructor.defaultProps || {});
  const props = Object.assign({}, instance.props);

  if (hooks) {
    props.hooks = defaultsDeep({}, props.hooks, hooks);
  }

  if (theme) {
    props.theme = defaultsDeep({}, props.theme, theme);
  }

  if (refs) {
    props.refs = defaultsDeep({}, props.refs, refs);
  }

  if (options) {
    props.options = defaultsDeep({}, props.options, options);
  }

  return props;
}

// Allow for: const { htr, defaultsDeep } = require('htr');
module.exports.htr = module.exports;
module.exports.defaultsDeep = defaultsDeep;

const { deepEqual } = require('assert');
const htr = require('../index');
const Core = require('css-modules-loader-core');

describe('Hooks Theme Refs', function() {
  beforeEach(() => {
    htr.props.clear();
  });

  it('will return a props object', () => {
    const props = {};
    const actual = htr(props);

    deepEqual(actual, {});
  });

  it('will return a deeply merged object with default props', () => {
    const onClick = () => {};
    const onMouseOver = () => {};

    class Component {
      render() {
        return htr(this);
      }

      constructor() {
        this.props = { hooks: { onMouseOver } };
      }
    }

    Component.defaultProps = {
      hooks: { onClick },
    };

    const actual = new Component().render();

    deepEqual(actual, { hooks: { onClick, onMouseOver } });
  });

  it('can add additional props to deep merge locally', () => {
    const props = {};

    class Component {
      render() {
        return htr(this, ['options']);
      }

      constructor() {
        this.props = { options: { a: 1 } };
      }
    }

    Component.defaultProps = {
      options: { b: 2 },
    };

    const actual = new Component().render();

    deepEqual(actual, { options: { a: 1, b: 2 } });
  });

  it('can add additional props to deep merge globally', () => {
    const props = {};

    htr.props.add('options');

    class Component {
      render() {
        return htr(this);
      }

      constructor() {
        this.props = { options: { a: 1 } };
      }
    }

    Component.defaultProps = {
      options: { b: 2 },
    };

    const actual = new Component().render();

    deepEqual(actual, { options: { a: 1, b: 2 } });
  });

  it('can work with css modules', async () => {
    const core = new Core();

    // Simulate import a CSS Modules file.
    const { exportTokens } = await core.load(`
      .simple {}
      .simple-test {}
    `, 'test');

    const theme = exportTokens;

    class Component {
      render() {
        return htr(this);
      }

      constructor(props) {
        this.props = props;
      }
    }

    Component.defaultProps = { theme };

    const component = new Component({
      theme: {
        simple: 'override-simple',
      },
    });

    const actual = component.render();

    deepEqual(actual, {
      theme: {
        simple: 'override-simple',
        'simple-test': '_test__simple-test',
      },
    });
  });
});

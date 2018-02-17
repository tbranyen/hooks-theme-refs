# Hooks, Theme, and Refs

[![Build Status](https://travis-ci.org/tbranyen/hooks-theme-refs.svg?branch=master)](https://travis-ci.org/tbranyen/hooks-theme-refs)

This single function module is used in React components for deep merging
specific property keys. This creates a simple, choesive pattern for passing
props from "application code" to "shared library code".

## Quick Start

First install in your project:

```
npm install hooks-themes-refs
```

Example of traditional usage:

```jsx
import React, { Component } from 'react';
import htr from 'htr';

class SimpleComponent extends Component {
  render() {
    const { hooks, theme, status, label, ...rest } = htr(this);

    return (
      <div className={theme.simple} onClick={hooks.onClick} {...rest}>
        <i className={theme.icons[status]} />
        <span className={theme.label}>{label}</span>
      </div>
    );
  }

  static defaultProps = {
    hooks: {
      onClick() {},
    },

    theme: {
      simple: 'simple-component',
      label: 'simple-component-label,

      icons: {
        default: 'simple-component-icons-default',
        info: 'simple-component-icons-info',
      },
    },
  }
}
```

### When to use refs

You will notice that `refs` are omitted from this component. As a rule `refs`
are only added for required use cases. For instance, a video component should
expose a way to get access to the video element. Wrapping HTML Form elements
should expose a way to get access to the internals. Use good judgement, don't
add a `refs` section for the sake of it.

### Spread

A good rule of thumb with React components is to assume your consumer knows
what they are passing to the component and forward that prop into the
component. This allows any DOM event or property to be set easily.

## API

`htr(instance, extra, constructor)` 

- **Required** A React component instance
- **Optional** An array of extra property names to deep merge
- **Optional** The constructor (or plain object) to reference `defaultProps` from

`htr.props`

A global Set of whitelisted property keys. For instance you can whitelist
`options` to be deep merged: `htr.props.add('options')`.

## Props

Props are organized into whitelisted keys that are specific to React
components to reduce the amount of top level props. Each prop represents a
part of well structured component.

### Hooks

Are callback functions that are used by the component. They can be DOM events,
but are not limited to that. You can pass to other libraries, use in your
own logic, receive web socket events, etc.

If your component makes sense without the event, then do not set a default.
This will allow the end user to disable any internal bound events, by passing
a falsy value.

### Theme

This is used to allow customization of classes or styles for internals. This
helps prevent app developers from having to use CSS specificity to override
styles, as they can provide their own classNames or styles directly on to
sections of the component. They are compatible with CSS Modules and most
theming providers.

### Refs

This is useful when a parent may need an actual reference callback to the DOM
node, for example a `<video />` element so that it can perform additional
operations or manipulation if necessary.

## How this helps

Frequently, 3rd party components need to have input & customization tweaks from
applications using them. These are often defined in the props that any
component might accept, for example:

```jsx
<Button onClick={appCallback} iconClass="search" />
```

This can get a bit trickier when components have a lot of internal sub-elements
in their render methods. Imagine a `render()` method something like this:

```jsx
class DefaultComponent extends Component {
  render() {
    const { icon, wrapper, showFilter, listItems, listItem } = this.props;
    const { onFilterClick, handleListClick } = this.props;
    const { listRefFn } = this.props;

    return (
      <div className={wrapperClass}>
        <i className={iconClass}/>

        <button className={showFilterClass} onClick={onFilterClick}>
          Filter List
        </button>

        <div className={listItemsClass} onClick={handleListClick} ref={listRefFn}>
          <span className={listItemClass}>Item 1</span>
          <span className={listItemClass}>Item 2</span>
          <span className={listItemClass}>Item 3</span>
        </div>
      </div>
    );
  }

  static defaultProps = {
    wrapperClass: 'default-wrapper',
    iconClass: 'default-icon',
    listItemsClass: 'list-items-wrapper',
    listItemClass: 'list-item',
    showFilterClass: 'show-filter-button',
    onFilterClick() {},
    handleListClick() {},
    listRefFn() {},
  }
}
```

While contrived, you can see that in order to allow users to not have to
_override_ classes and customize click behavior, the surface area of the props
has started to increase. As the complexity or number of areas to control
increase, `hooks-themes-refs` aims to help organize and clean these props up
for both library authors _and_ library consumers. Here's what the above example
would look like after refactoring it to this pattern:

```jsx
class DefaultComponent extends Component {
  render() {
    const { hooks, theme, refs, ...rest } = htr(this);

    return (
      <div className={theme.wrapper} {...rest}>
        <i className={theme.icon} />

        <button className={theme.showFilter} onClick={hooks.onFilterClick}>
          Filter List
        </button>

        <div className={theme.listItems} onClick={hooks.handleListClick} ref={refs.list}>
          <span className={theme.listItem}>Item 1</span>
          <span className={theme.listItem}>Item 2</span>
          <span className={theme.listItem}>Item 3</span>
        </div>
      </div>
    );
  }

  static defaultProps = {
    hooks: {
      onFilterClick() {},
      handleListClick() {},
    },

    theme: {
      wrapper: 'default-wrapper',
      icon: 'default-icon',
      listItems: 'list-items-wrapper',
      listItem: 'list-item',
      showFilter: 'show-filter-button',
    },

    refs: {
      list() {},
    },
  }
}
```

## License

MIT 2018

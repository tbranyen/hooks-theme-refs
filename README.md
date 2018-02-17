# hooks-themes-refs

This library is designed to help provide a simple, cohesive pattern for passing properties from 'application code' to 'shared library code' in React components.

## Quick Start

You can use `hooks-themes-refs` to organize specific areas of your library props into
more cohesive sections, with automatically managed defaults merging. Here's how:

```
npm install hooks-themes-refs
```

```jsx
import React from 'react';

export default class LibComponent extends React.Component {
  render() {
    const {hooks, themes, refs} = props;

    return <div className={themes.wrapper} onClick={hooks.onClick}>
      <i className={themes.iconClass} ref={refs.iconRef} />
    </div>;
  }

  defaultProps = {
    hooks: {
      onClick() {},
    },
    themes: {
      wrapper: 'wrapper-default-class',
      iconClass: 'icon-default-class',
    },
    refs: {
      iconRef() {},
    }
  }
};
```

## Hooks, Themes, Refs

We organize props in to common major sections to help alleviate prop surface area and ease
of cohesion. Each section represents an area frequently used in the customization & usage
of a component and its internals:

### Hooks
This is used for callback functions that may have defaults, but are also useful to allow
a parent to pass a function in to capture events, or receive data from.

### Themes
This is used to allow customization of classes or styles for internals. This helps prevent
app developers from having to use CSS specificity to override styles, as they can provide
their own classNames or styles directly on to sections of the component.

### Refs
This is useful when a parent may need an actual reference callback to the DOM node, for
example a `<video/>` element so that it can perform additional operations or manipulation
on if necessary.


## What's this useful for?

Frequently, 3rd party components need to have input & customization tweaks from applications using them. These are often defined in the props that any component might accept, for example:

```jsx
<Button onClick={appCallback} iconClass="search" />
```

This can get a bit trickier when components have a lot of internal sub-elements in
their render methods. Imagine a `render()` method something like this:

```jsx
render() {
  const {iconClass, wrapperClass, showFilterClass, listItemsClass, listItemClass} = this.props;
  const {onFilterClick, handleListClick} = this.props;
  const {listRefFn} = this.props;

  return <div className={wrapperClass}>
    <i className={iconClass}/>

    <button className={showFilterClass} onClick={onFilterClick}>
      Filter List
    </button>

    <div className={listItemsClass} onClick={handleListClick} ref={listRefFn}>
      <span className={listItemClass}>Item 1</span>
      <span className={listItemClass}>Item 2</span>
      <span className={listItemClass}>Item 3</span>
    </div>
  </div>;
}

defaultProps = {
  wrapperClass: 'default-wrapper',
  iconClass: 'default-icon',
  listItemsClass: 'list-items-wrapper',
  listItemClass: 'list-item',
  showFilterClass: 'show-filter-button',
  onFilterClick() {},
  handleListClick() {},
  listRefFn() {},
}
```

While a bit contrived, you can see that in order to allow users to not have to
_override_ classes and customize click behavior, the surface area of the props
has started to increase. As the complexity or number of areas to control increase,
`hooks-themes-refs` aims to help organize and clean these props up for both
library authors _and_ library consumers. Here's what the above example would
look like after refactoring it to this pattern:

```jsx
render() {
  const {theme, hooks} = htr(this);

  return <div className={theme.wrapperClass}>
    <i className={theme.iconClass}/>

    <button className={theme.showFilterClass} onClick={hooks.onFilterClick}>
      Filter List
    </button>

    <div className={theme.listItemsClass} onClick={hooks.handleListClick} ref={refs.listRefFn}>
      <span className={theme.listItemClass}>Item 1</span>
      <span className={theme.listItemClass}>Item 2</span>
      <span className={theme.listItemClass}>Item 3</span>
    </div>
  </div>;
}

defaultProps = {
  theme: {
    wrapperClass: 'default-wrapper',
    iconClass: 'default-icon',
    listItemsClass: 'list-items-wrapper',
    listItemClass: 'list-item',
    showFilterClass: 'show-filter-button',
  },
  hooks: {
    onFilterClick() {},
    handleListClick() {},
  },
  refs: {
    listRefFn() {},
  }
}
```

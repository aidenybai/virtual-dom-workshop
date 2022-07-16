import htm from 'https://unpkg.com/htm?module';

/**
 * Creates a virtual node:
 *
 * let number = 0;
 * const vnode = html`<div>${number}</div>`;
 */
const html = htm.bind((tag, props = {}, ...children) => ({
  tag, // e.g. 'div'
  props, // e.g. { style: 'color: red' }
  children, // e.g. ['Hello World']
}));

/**
 * Converts a virtual node into a real DOM node:
 *
 * const vnode = html`<div>Hello World</div>`;
 * const el = createElement(vnode);
 */
const createElement = (vnode) => {
  // vnode can either be an element (object) or text (string)
  if (typeof vnode === 'string') {
    return document.createTextNode(vnode);
  }

  const el = document.createElement(vnode.tag);

  for (const prop in vnode.props) {
    el[prop] = vnode.props[prop];
  }

  for (const child of vnode.children) {
    // use recursion to create child nodes
    el.appendChild(createElement(child));
  }

  return el;
};

/**
 * Renders a virtual node into the DOM:
 *
 * const newVNode = html`<body>Hello World!</body>`;
 * const oldVNode = html`<body></body>`;
 * render(document.body, newVNode, oldVNode);
 */
const render = (el, newVNode, oldVNode) => {
  // newVNode can either be an element (object), text (string), or delete (falsy)
  // oldVNode can either be an element (object) or text (string)
  if (!newVNode) return el.remove();

  if (typeof oldVNode === 'string' || typeof newVNode === 'string') {
    // It doesn't matter if one is not a text (string), if they are different, replace the old one
    if (oldVNode !== newVNode) {
      return el.replaceWith(createElement(newVNode));
    }
  } else {
    // If they are different tag (e.g. <div> and <span>), replace the old one
    if (oldVNode.tag !== newVNode.tag) {
      return el.replaceWith(createElement(newVNode));
    }

    for (const propName in { ...oldVNode.props, ...newVNode.props }) {
      const newProp = newVNode.props[propName];
      const oldProp = oldVNode.props[propName];

      if (!newProp) {
        delete el[propName];
      } else if (!oldProp || oldProp !== newProp) {
        el[propName] = newProp;
      }
    }

    // We iterate backwards so when we remove a child from the DOM, we don't have to worry about the index changing
    for (let i = oldVNode.children.length - 1; i >= 0; --i) {
      patch(el.childNodes[i], newVNode.children[i], oldVNode.children[i]);
    }

    // If there are more new children, add them to the end
    for (let i = oldVNode.children.length; i < newVNode.children.length; i++) {
      el.appendChild(createElement(newVNode.children[i]));
    }
  }
};

// Example usage:
render(
  document.body,
  html`<body>
    Hello World!
  </body>`,
  html`<body></body>`
);

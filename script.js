import htm from 'https://unpkg.com/htm?module';

const html = htm.bind((tag, props = {}, ...children) => ({
  tag,
  props,
  children,
}));

// Cases to handle:
// 1. vnode is string
// 2. vnode is an element
const createElement = (vnode) => {};

// Cases to handle:
// 1. newVNode is falsy (delete node)
// 2. newVNode is a string, oldVNode is a string
// 3. newVNode is a string, oldVNode is an element
// 4. newVNode is an element, oldVNode is a string
// 5. newVNode and oldVNode have different tags
// 6. newVNode and oldVNode have different props
// 7. newVNode and oldVNode have different children
const render = (el, newVNode, oldVNode) => {};

// render(
//   document.body,
//   html`<body>
//     Hello World!
//   </body>`,
//   html`<body></body>`
// );

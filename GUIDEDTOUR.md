A Tour of the Source
====================

Core
----

Following the scheme of React, a component is a function which takes a `props` object (and possibly a ref), and returns a node. A node is anything which can be returned by the component function; `createElement` turns a node into elements. Elements are those things which can actually be rendered.

Internally there are component instances, which form the "virtual DOM". Instances are either text instances (representing text nodes), element instances (representing concrete elements with attributes and children), or component instances (representing components with their own state and lifecycle).

The type definitions for these are in [component.ts](src/component.ts). Nodes are collected into elements by `nodesToElements` in [nodesToElements.ts](src/nodesToElements.ts) and `createElement` itself is in [createElement.ts](src/createElement.ts).

The internal representation of a component instance is in [instance.ts](src/instance.ts), which is in many ways the "core" of the library. It also includes the code which actually renders instances to a DOM. It is not directly coupled to the browser DOM but rather to a generic "driver" interface (in [driver.ts](src/driver.ts)) which is implemented by the browser driver in [dom/domDriver.ts](src/dom/domDriver.ts). There is also a driver adapter which adds logging to another driver, implemented in [logDriver.ts](src/logDriver.ts).

The diffing algorithm for diffing between the previous state of the virtual DOM and the new state from component renders is implemented in [diff.ts](src/diff.ts).

Renders of components are scheduled in a task queue mechanism defined in [taskQueue.ts](src/taskQueue.ts). Queues may be scheduled as "non-urgent" or "urgent", with the former being processed after the latter; the render queue will periodically also yield to the browser when processing non-urgent tasks, to avoid blocking the browser. This is the core of the "React Concurrent Mode" implementation. Transitions (implementing `startTransition`) cause new tasks to be non-urgent by default where normally they are urgent by default - this is the basic mechanism of the transition. That is implemented in [transitions.ts](src/transitions.ts).

Props are processed before being given to actual elements which implements our custom handling of things like styles, classes, and event handlers. This is implemented in [src/unpackProps.ts](src/unpackProps.ts).

Hooks
-----

Hooks are implemented in their own files under [hooks](src/hooks). Ultimately these are implemented in terms of seven basic hooks, provided by a dispatcher which could vary for different renderers. The general dispatcher and its basic hooks and semihooks (see below) are implemented in [hookDispatcher.ts](src/hookDispatcher.ts).

Semihooks are a generalisation of the reducer requirements on React's new `use` hook. Like hooks they can only be called in components or custom hooks (or custom semihooks); unlike hooks they can be called in any order and multiple times. We denote semihooks with a `$use` prefix.

We also provide a couple of built-in components which use the mechanism, which are defined under [components](src/components).

Context - that is the objects created by `createContext` and the `useContext` hook - are exceptionally defined in [context.ts](src/context.ts).

Templates
---------

The library can be used with JSX or with `createElement` calls directly, but can also be used with a template literals. These are built using the excellent HTM library, which is a tagged template literal library as a substitute for JSX. We vendor it in directly in [htm.ts](src/htm.ts), with some minor modifications. We export the tagged template literal as `tpl`, which is defined in [tpl.ts](src/tpl.ts).

DOM Driver
----------

The browser-specific parts are under [dom](src/dom). The driver we have already mentioned, also to note are `createRoot` which is defined in [dom/root.ts](src/dom/root.ts) as well as the backwards-compatibility shim `render` emulating React 17, which is defined in [dom/compat.ts](src/dom/compat.ts).

Bundling
--------

All the public exports, finally, are in [index.ts](src/index.ts). This is the entry point for the library.

We use Rollup for bundling, which puts the entire output into `dist/minidom.js`, along with both a source map and a TypeScript declaration file.

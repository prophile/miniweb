import { tpl, createRoot, useEffect, useState, useCallback } from './dist/miniweb.js';

function Component() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("Component mounted");
    const interval = setInterval(() => {
      setCount(count => count + 1);
    }, 1000);
    return () => {
      clearInterval(interval);
      console.log("Component unmounted");
    };
  }, []);

  const increment = useCallback(() => {
    setCount((count) => count + 1);
  });

  return tpl`<div>
    ${count}
    <button on:click=${increment}>Increment</button>
  </div>`;
}

const root = createRoot(document.getElementById("app"));
root.render(tpl`<${Component} />`);

console.log("Hello, world!");
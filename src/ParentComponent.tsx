import React from "react";
import { useRef, useState } from "react";
import { createRoot } from "react-dom/client";

function ParentComponent() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const childRefs = useRef<Map<number, HTMLElement>>(new Map());
  const counter = useRef(0);
  const parentLastRendered = new Date();

  // Function to add a child without causing re-render
  const addChild = () => {
    if (!containerRef.current) return;

    const id = counter.current++;
    const childContainer = document.createElement("div");
    childContainer.setAttribute("id", `child-${id}`);
    containerRef.current.appendChild(childContainer);

    // Store child in ref map
    childRefs.current.set(id, childContainer);

    // Mount React component inside this div
    const root = createRoot(childContainer);
    root.render(<ChildComponent id={id} removeChild={removeChild} />);
  };

  // Function to remove a child
  const removeChild = (id: number) => {
    const childContainer = childRefs.current.get(id);
    if (childContainer) {
      childContainer.remove();
      childRefs.current.delete(id);
    }
  };

  return (
    <div>
      <p>
        This is a demonstration of how to dynamically add and remove children
        components inside a parent component without re-rendering.
      </p>
      <p>Last rendered: {parentLastRendered.toLocaleTimeString()}</p>
      <button onClick={addChild}>Add Child</button>
      <div
        ref={containerRef}
        style={{
          display: "flex",
          width: "800px",
          height: "200px",
          flexWrap: "wrap",
          margin: "20px",
        }}
      ></div>
    </div>
  );
}

function ChildComponent({
  id,
  removeChild,
}: {
  id: number;
  removeChild: (id: number) => void;
}) {
  return (
    <div style={{ padding: "10px", border: "1px solid black", margin: "5px" }}>
      <p>Child {id}</p>
      <button onClick={() => removeChild(id)}>Remove</button>
    </div>
  );
}

export default ParentComponent;

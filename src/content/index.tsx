import { MathJaxContext } from "better-react-mathjax";
import React from "react";
import { createRoot } from 'react-dom/client';
import MathInput from "./MathInput/MathInput.tsx";
const config = {
    loader: { load: ["input/asciimath"] }
};


// Create a container div for the React component
const container = document.createElement('div');
container.id = 'prairielearn-input-plus-root';
document.body.appendChild(container);

// Render the React component
const root = createRoot(container);
root.render(
  <React.StrictMode>
      <MathJaxContext config={config}>
          <MathInput />
      </MathJaxContext>
  </React.StrictMode>
);

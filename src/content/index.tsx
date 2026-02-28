import React from 'react';
import { createRoot } from 'react-dom/client';
import SampleComponent from './SampleComponent';

// Create a container div for the React component
const container = document.createElement('div');
container.id = 'prairielearn-input-plus-root';
document.body.appendChild(container);

// Render the React component
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <SampleComponent />
  </React.StrictMode>
);

console.log('PrairieLearn Input Plus extension loaded!');

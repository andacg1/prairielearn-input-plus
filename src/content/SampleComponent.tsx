import React, { useState } from 'react';

const SampleComponent: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '20px',
        backgroundColor: '#ffffff',
        border: '2px solid #4CAF50',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: 999999,
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
        PrairieLearn Input Plus
      </h3>
      <p style={{ margin: '0 0 10px 0', color: '#666' }}>
        Math Input
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={() => setCount(count - 1)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          -
        </button>
        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
          Count: {count}
        </span>
        <button
          onClick={() => setCount(count + 1)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default SampleComponent;

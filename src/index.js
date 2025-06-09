import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Clear the existing HTML content
document.body.innerHTML = '<div id="app"></div>';

// Render your React component instead
// const root = createRoot(document.getElementById('app'));
// root.render(<App />);
ReactDOM.render(<App />, document.getElementById('app'));

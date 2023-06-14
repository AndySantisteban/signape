import React from 'react';
import { createRoot } from 'react-dom/client';
import './css/app.scss';
import App from './js/App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';

const interFont = new FontFace(
  'Inter var',
  "url('https://rsms.me/inter/font-files/Inter-roman.var.woff2?v=3.19')"
);
document.fonts.add(interFont);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

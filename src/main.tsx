import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Toaster } from 'sonner';
import { SpeedInsights } from "@vercel/speed-insights/vue"

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
        <SpeedInsights />
        <Toaster richColors position="bottom-center" />
    </React.StrictMode>,
);

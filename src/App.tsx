import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Recommendations from './pages/Recommendations';
import Landing from "./pages/Landing.tsx";
import Fallback from "./pages/Fallback.tsx";
import { SpeedInsights } from '@vercel/speed-insights/react';

function App() {
    return (
        <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/home" element={<Home />} />
                <Route path="/recs" element={<Recommendations />} />
                <Route path="/fallback" element={<Fallback />} />
            </Routes>
        </BrowserRouter>
            <SpeedInsights />
        </>

    );
}

export default App;

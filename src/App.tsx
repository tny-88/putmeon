import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Recommendations from './pages/Recommendations';
import Fallback from "./pages/Fallback.tsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/recs" element={<Recommendations />} />
                <Route path="/fallback" element={<Fallback />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Lobby from './pages/Lobby';
import Game from './pages/Game'; // 👈 주석 해제 및 임포트

function App() {
  return (
    <BrowserRouter>
      <div className="max-w-md mx-auto min-h-screen bg-gray-900 text-white shadow-2xl relative font-sans">
        <Routes>
          <Route path="/" element={<Lobby />} />
          <Route path="/game" element={<Game />} /> {/* 👈 주석 해제 */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
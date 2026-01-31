import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Analytics } from "@vercel/analytics/react"
import { useEffect } from 'react';

import { LevelSelect } from './components/LevelSelect'
import { GamePage } from './components/GamePage'
import { LobbyPage } from './components/LobbyPage'
import { CharacterSelectionPage } from './components/CharacterSelectionPage'
import { RouteGuard } from './components/RouteGuard'
import { OrientationGuard } from './components/OrientationGuard'

import { Summary } from './components/Summary';
import { useGameStore } from './store/gameStore';

function App() {
  const { isGameCompleted, tickAnimation } = useGameStore();

  useEffect(() => {
    const interval = setInterval(() => {
      tickAnimation();
    }, 500); // Global 500ms Beat
    return () => clearInterval(interval);
  }, [tickAnimation]);

  return (
    <BrowserRouter>
      <div className="fixed inset-0 z-[-1] w-full h-dvh">
        <img
          src="/assets/main_bg.png"
          alt="Background"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/10" /> {/* Optional overlay if needed for contrast */}
      </div>

      <OrientationGuard>

        {isGameCompleted ? (
          <Summary />
        ) : (
          <Routes>
            <Route path="/" element={<LobbyPage />} />
            <Route path="/character-select" element={<CharacterSelectionPage />} />
            <Route path="/level-select" element={<LevelSelect />} />
            <Route path="/game/:levelId" element={
              <RouteGuard>
                <GamePage />
              </RouteGuard>
            } />
          </Routes>
        )}
      </OrientationGuard>
      <Analytics />
    </BrowserRouter>
  )
}

export default App
